/**
 * Metrc Plants Cloud Functions
 *
 * Handles all plant-related operations with Metrc API
 * - Sync plants from Metrc to Firestore
 * - Create plant batches
 * - Change growth phases
 * - Harvest plants
 * - Record plant waste/destruction
 * - Move plants between locations
 */

import * as functions from 'firebase-functions';
import { firestore } from 'firebase-admin';
import { createMetrcClient } from '../api/client';
import { MetrcPlant, MetrcPlantBatch } from '../types';

const db = firestore();

// ==========================================
// CONFIGURATION
// ==========================================

interface MetrcCredentials {
  vendorKey: string;
  userKey: string;
  licenseNumber: string;
  sandbox: boolean;
}

/**
 * Get Metrc credentials from environment or Firestore
 */
async function getMetrcCredentials(facilityId: string): Promise<MetrcCredentials> {
  // Option 1: From environment variables (for single facility)
  if (process.env.METRC_VENDOR_KEY && process.env.METRC_USER_KEY && process.env.METRC_LICENSE_NUMBER) {
    return {
      vendorKey: process.env.METRC_VENDOR_KEY,
      userKey: process.env.METRC_USER_KEY,
      licenseNumber: process.env.METRC_LICENSE_NUMBER,
      sandbox: process.env.METRC_SANDBOX === 'true',
    };
  }

  // Option 2: From Firestore (for multi-facility)
  const facilityDoc = await db.collection('facilities').doc(facilityId).get();
  const facility = facilityDoc.data();

  if (!facility?.metrcVendorKey || !facility?.metrcUserKey || !facility?.metrcLicenseNumber) {
    throw new Error(`Metrc credentials not configured for facility: ${facilityId}`);
  }

  return {
    vendorKey: facility.metrcVendorKey,
    userKey: facility.metrcUserKey,
    licenseNumber: facility.metrcLicenseNumber,
    sandbox: facility.metrcSandbox || false,
  };
}

// ==========================================
// SYNC FUNCTIONS
// ==========================================

/**
 * Sync vegetative plants from Metrc to Firestore
 * Callable function
 */
export const syncVegetativePlants = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be authenticated to sync plants'
    );
  }

  const { facilityId, lastModifiedStart, lastModifiedEnd } = data;

  if (!facilityId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'facilityId is required'
    );
  }

  try {
    const credentials = await getMetrcCredentials(facilityId);
    const metrc = createMetrcClient(credentials);

    const endpoint = `/plants/${metrc.getVersion()}/vegetative`;
    const params: any = {};

    if (lastModifiedStart) {
      params.lastModifiedStart = lastModifiedStart;
    }
    if (lastModifiedEnd) {
      params.lastModifiedEnd = lastModifiedEnd;
    }

    const plants = await metrc.get<MetrcPlant[]>(endpoint, params);

    console.log(`[Metrc] Fetched ${plants.length} vegetative plants`);

    // Save to Firestore
    const batch = db.batch();
    let savedCount = 0;

    for (const plant of plants) {
      const docRef = db
        .collection('facilities')
        .doc(facilityId)
        .collection('plants')
        .doc(plant.Id.toString());

      batch.set(
        docRef,
        {
          // Metrc data
          metrcId: plant.Id,
          label: plant.Label,
          state: plant.State,
          growthPhase: plant.GrowthPhase,

          // Batch info
          plantBatchId: plant.PlantBatchId,
          plantBatchName: plant.PlantBatchName,
          plantBatchTypeName: plant.PlantBatchTypeName,

          // Strain info
          strainId: plant.StrainId,
          strainName: plant.StrainName,

          // Location
          locationId: plant.LocationId,
          locationName: plant.LocationName,
          locationTypeName: plant.LocationTypeName,

          // Status
          patientLicenseNumber: plant.PatientLicenseNumber,
          harvestId: plant.HarvestId,

          // Dates
          plantedDate: plant.PlantedDate,
          vegetativeDate: plant.VegetativeDate,
          floweringDate: plant.FloweringDate,
          harvestedDate: plant.HarvestedDate,
          destroyedDate: plant.DestroyedDate,
          destroyedNote: plant.DestroyedNote,
          destroyedByUserName: plant.DestroyedByUserName,
          lastModified: plant.LastModified,

          // Sync metadata
          syncedAt: firestore.FieldValue.serverTimestamp(),
          syncedBy: context.auth.uid,
          facilityId: facilityId,

          // Full Metrc object for reference
          metrcData: plant,
        },
        { merge: true }
      );

      savedCount++;

      if (savedCount % 500 === 0) {
        await batch.commit();
        console.log(`[Firestore] Committed batch of ${savedCount} plants`);
      }
    }

    if (savedCount % 500 !== 0) {
      await batch.commit();
    }

    console.log(`[Sync] Successfully synced ${savedCount} vegetative plants`);

    // Update sync status
    await db
      .collection('facilities')
      .doc(facilityId)
      .collection('syncStatus')
      .doc('plants_vegetative')
      .set(
        {
          lastSyncAt: firestore.FieldValue.serverTimestamp(),
          lastSyncBy: context.auth.uid,
          plantCount: savedCount,
          status: 'success',
        },
        { merge: true }
      );

    return {
      success: true,
      plantsSynced: savedCount,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('[Metrc Sync] Error syncing vegetative plants:', error);

    await db
      .collection('facilities')
      .doc(facilityId)
      .collection('syncStatus')
      .doc('plants_vegetative')
      .set(
        {
          lastSyncAt: firestore.FieldValue.serverTimestamp(),
          lastSyncBy: context.auth.uid,
          status: 'error',
          error: error.message,
        },
        { merge: true }
      );

    throw new functions.https.HttpsError(
      'internal',
      `Failed to sync vegetative plants: ${error.message}`
    );
  }
});

/**
 * Sync flowering plants from Metrc to Firestore
 * Callable function
 */
export const syncFloweringPlants = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be authenticated to sync plants'
    );
  }

  const { facilityId, lastModifiedStart, lastModifiedEnd } = data;

  if (!facilityId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'facilityId is required'
    );
  }

  try {
    const credentials = await getMetrcCredentials(facilityId);
    const metrc = createMetrcClient(credentials);

    const endpoint = `/plants/${metrc.getVersion()}/flowering`;
    const params: any = {};

    if (lastModifiedStart) {
      params.lastModifiedStart = lastModifiedStart;
    }
    if (lastModifiedEnd) {
      params.lastModifiedEnd = lastModifiedEnd;
    }

    const plants = await metrc.get<MetrcPlant[]>(endpoint, params);

    console.log(`[Metrc] Fetched ${plants.length} flowering plants`);

    // Save to Firestore (same logic as vegetative)
    const batch = db.batch();
    let savedCount = 0;

    for (const plant of plants) {
      const docRef = db
        .collection('facilities')
        .doc(facilityId)
        .collection('plants')
        .doc(plant.Id.toString());

      batch.set(
        docRef,
        {
          metrcId: plant.Id,
          label: plant.Label,
          state: plant.State,
          growthPhase: plant.GrowthPhase,
          plantBatchId: plant.PlantBatchId,
          plantBatchName: plant.PlantBatchName,
          strainId: plant.StrainId,
          strainName: plant.StrainName,
          locationId: plant.LocationId,
          locationName: plant.LocationName,
          plantedDate: plant.PlantedDate,
          vegetativeDate: plant.VegetativeDate,
          floweringDate: plant.FloweringDate,
          harvestedDate: plant.HarvestedDate,
          lastModified: plant.LastModified,
          syncedAt: firestore.FieldValue.serverTimestamp(),
          syncedBy: context.auth.uid,
          facilityId: facilityId,
          metrcData: plant,
        },
        { merge: true }
      );

      savedCount++;

      if (savedCount % 500 === 0) {
        await batch.commit();
      }
    }

    if (savedCount % 500 !== 0) {
      await batch.commit();
    }

    // Update sync status
    await db
      .collection('facilities')
      .doc(facilityId)
      .collection('syncStatus')
      .doc('plants_flowering')
      .set(
        {
          lastSyncAt: firestore.FieldValue.serverTimestamp(),
          lastSyncBy: context.auth.uid,
          plantCount: savedCount,
          status: 'success',
        },
        { merge: true }
      );

    return {
      success: true,
      plantsSynced: savedCount,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('[Metrc Sync] Error syncing flowering plants:', error);
    throw new functions.https.HttpsError(
      'internal',
      `Failed to sync flowering plants: ${error.message}`
    );
  }
});

/**
 * Sync plant batches from Metrc to Firestore
 * Callable function
 */
export const syncPlantBatches = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be authenticated'
    );
  }

  const { facilityId, active = true } = data;

  if (!facilityId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'facilityId is required'
    );
  }

  try {
    const credentials = await getMetrcCredentials(facilityId);
    const metrc = createMetrcClient(credentials);

    const endpoint = active
      ? `/plantbatches/${metrc.getVersion()}/active`
      : `/plantbatches/${metrc.getVersion()}/inactive`;

    const batches = await metrc.get<MetrcPlantBatch[]>(endpoint);

    console.log(`[Metrc] Fetched ${batches.length} plant batches`);

    const batch = db.batch();
    let savedCount = 0;

    for (const plantBatch of batches) {
      const docRef = db
        .collection('facilities')
        .doc(facilityId)
        .collection('plantBatches')
        .doc(plantBatch.Id.toString());

      batch.set(
        docRef,
        {
          metrcId: plantBatch.Id,
          name: plantBatch.Name,
          type: plantBatch.Type,
          locationId: plantBatch.LocationId,
          locationName: plantBatch.LocationName,
          strainId: plantBatch.StrainId,
          strainName: plantBatch.StrainName,
          patientLicenseNumber: plantBatch.PatientLicenseNumber,

          // Counts
          untrackedCount: plantBatch.UntrackedCount,
          trackedCount: plantBatch.TrackedCount,
          packagedCount: plantBatch.PackagedCount,
          harvestedCount: plantBatch.HarvestedCount,
          destroyedCount: plantBatch.DestroyedCount,

          // Source tracking
          sourcePackageId: plantBatch.SourcePackageId,
          sourcePackageLabel: plantBatch.SourcePackageLabel,
          sourcePlantId: plantBatch.SourcePlantId,
          sourcePlantLabel: plantBatch.SourcePlantLabel,
          sourcePlantBatchId: plantBatch.SourcePlantBatchId,
          sourcePlantBatchName: plantBatch.SourcePlantBatchName,

          // Dates
          plantedDate: plantBatch.PlantedDate,
          lastModified: plantBatch.LastModified,

          // Sync metadata
          syncedAt: firestore.FieldValue.serverTimestamp(),
          syncedBy: context.auth.uid,
          facilityId: facilityId,
          metrcData: plantBatch,
        },
        { merge: true }
      );

      savedCount++;

      if (savedCount % 500 === 0) {
        await batch.commit();
      }
    }

    if (savedCount % 500 !== 0) {
      await batch.commit();
    }

    await db
      .collection('facilities')
      .doc(facilityId)
      .collection('syncStatus')
      .doc('plantBatches')
      .set(
        {
          lastSyncAt: firestore.FieldValue.serverTimestamp(),
          lastSyncBy: context.auth.uid,
          batchCount: savedCount,
          status: 'success',
        },
        { merge: true }
      );

    return {
      success: true,
      batchesSynced: savedCount,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('[Metrc Sync] Error syncing plant batches:', error);
    throw new functions.https.HttpsError(
      'internal',
      `Failed to sync plant batches: ${error.message}`
    );
  }
});

// ==========================================
// CREATE FUNCTIONS
// ==========================================

/**
 * Create a new plant batch in Metrc
 * Callable function
 */
export const createPlantBatch = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be authenticated'
    );
  }

  const { facilityId, batches } = data;

  if (!facilityId || !batches || !Array.isArray(batches)) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'facilityId and batches array are required'
    );
  }

  try {
    const credentials = await getMetrcCredentials(facilityId);
    const metrc = createMetrcClient(credentials);

    // Transform to Metrc format
    const metrcBatches = batches.map((batch: any) => ({
      Name: batch.name,
      Type: batch.type,
      Count: batch.count,
      Strain: batch.strainName,
      Location: batch.location || null,
      PatientLicenseNumber: batch.patientLicenseNumber || null,
      ActualDate: batch.actualDate || new Date().toISOString(),
    }));

    const endpoint = `/plantbatches/${metrc.getVersion()}/plantings`;
    await metrc.post(endpoint, metrcBatches);

    console.log(`[Metrc] Created ${metrcBatches.length} plant batches`);

    // Log the creation
    const logBatch = db.batch();
    for (const batch of metrcBatches) {
      const logRef = db
        .collection('facilities')
        .doc(facilityId)
        .collection('metrcLogs')
        .doc();

      logBatch.set(logRef, {
        action: 'createPlantBatch',
        batchName: batch.Name,
        timestamp: firestore.FieldValue.serverTimestamp(),
        userId: context.auth.uid,
        status: 'success',
      });
    }
    await logBatch.commit();

    return {
      success: true,
      batchesCreated: metrcBatches.length,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('[Metrc] Error creating plant batches:', error);
    throw new functions.https.HttpsError(
      'internal',
      `Failed to create plant batches: ${error.message}`
    );
  }
});

// ==========================================
// UPDATE FUNCTIONS
// ==========================================

/**
 * Change plant growth phase in Metrc
 * Callable function
 */
export const changePlantGrowthPhase = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be authenticated'
    );
  }

  const { facilityId, plantLabels, newGrowthPhase, changeDate } = data;

  if (!facilityId || !plantLabels || !newGrowthPhase) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'facilityId, plantLabels, and newGrowthPhase are required'
    );
  }

  try {
    const credentials = await getMetrcCredentials(facilityId);
    const metrc = createMetrcClient(credentials);

    const payload = [{
      Id: null,
      Label: plantLabels,
      NewLabel: null,
      GrowthPhase: newGrowthPhase,
      NewLocation: null,
      GrowthDate: changeDate || new Date().toISOString(),
    }];

    const endpoint = `/plants/${metrc.getVersion()}/growthphase`;
    await metrc.put(endpoint, payload);

    console.log(`[Metrc] Changed growth phase for ${plantLabels.length} plants to ${newGrowthPhase}`);

    // Log the change
    await db
      .collection('facilities')
      .doc(facilityId)
      .collection('metrcLogs')
      .add({
        action: 'changePlantGrowthPhase',
        plantLabels: plantLabels,
        newGrowthPhase: newGrowthPhase,
        timestamp: firestore.FieldValue.serverTimestamp(),
        userId: context.auth.uid,
        status: 'success',
      });

    return {
      success: true,
      plantsUpdated: plantLabels.length,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('[Metrc] Error changing plant growth phase:', error);
    throw new functions.https.HttpsError(
      'internal',
      `Failed to change plant growth phase: ${error.message}`
    );
  }
});

/**
 * Harvest plants in Metrc
 * Callable function
 */
export const harvestPlants = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be authenticated'
    );
  }

  const { facilityId, harvests } = data;

  if (!facilityId || !harvests || !Array.isArray(harvests)) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'facilityId and harvests array are required'
    );
  }

  try {
    const credentials = await getMetrcCredentials(facilityId);
    const metrc = createMetrcClient(credentials);

    // Transform to Metrc format
    const metrcHarvests = harvests.map((harvest: any) => ({
      Plant: harvest.plantLabel,
      Weight: harvest.weight,
      UnitOfWeight: harvest.unitOfWeight,
      DryingLocation: harvest.dryingLocation,
      HarvestName: harvest.harvestName,
      PatientLicenseNumber: harvest.patientLicenseNumber || null,
      ActualDate: harvest.actualDate || new Date().toISOString(),
    }));

    const endpoint = `/plants/${metrc.getVersion()}/harvest`;
    await metrc.post(endpoint, metrcHarvests);

    console.log(`[Metrc] Harvested ${metrcHarvests.length} plants`);

    // Log the harvests
    const batch = db.batch();
    for (const harvest of metrcHarvests) {
      const logRef = db
        .collection('facilities')
        .doc(facilityId)
        .collection('metrcLogs')
        .doc();

      batch.set(logRef, {
        action: 'harvestPlant',
        plantLabel: harvest.Plant,
        harvestName: harvest.HarvestName,
        weight: harvest.Weight,
        timestamp: firestore.FieldValue.serverTimestamp(),
        userId: context.auth.uid,
        status: 'success',
      });
    }
    await batch.commit();

    return {
      success: true,
      plantsHarvested: metrcHarvests.length,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('[Metrc] Error harvesting plants:', error);
    throw new functions.https.HttpsError(
      'internal',
      `Failed to harvest plants: ${error.message}`
    );
  }
});

/**
 * Move plants to new location in Metrc
 * Callable function
 */
export const movePlants = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be authenticated'
    );
  }

  const { facilityId, plantLabels, newLocation, moveDate } = data;

  if (!facilityId || !plantLabels || !newLocation) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'facilityId, plantLabels, and newLocation are required'
    );
  }

  try {
    const credentials = await getMetrcCredentials(facilityId);
    const metrc = createMetrcClient(credentials);

    const payload = [{
      Id: null,
      Label: plantLabels,
      Location: newLocation,
      MoveDate: moveDate || new Date().toISOString(),
    }];

    const endpoint = `/plants/${metrc.getVersion()}/location`;
    await metrc.put(endpoint, payload);

    console.log(`[Metrc] Moved ${plantLabels.length} plants to ${newLocation}`);

    // Log the move
    await db
      .collection('facilities')
      .doc(facilityId)
      .collection('metrcLogs')
      .add({
        action: 'movePlants',
        plantLabels: plantLabels,
        newLocation: newLocation,
        timestamp: firestore.FieldValue.serverTimestamp(),
        userId: context.auth.uid,
        status: 'success',
      });

    return {
      success: true,
      plantsMoved: plantLabels.length,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('[Metrc] Error moving plants:', error);
    throw new functions.https.HttpsError(
      'internal',
      `Failed to move plants: ${error.message}`
    );
  }
});

/**
 * Record plant waste/destruction in Metrc
 * Callable function
 */
export const destroyPlants = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be authenticated'
    );
  }

  const { facilityId, destructions } = data;

  if (!facilityId || !destructions || !Array.isArray(destructions)) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'facilityId and destructions array are required'
    );
  }

  try {
    const credentials = await getMetrcCredentials(facilityId);
    const metrc = createMetrcClient(credentials);

    // Transform to Metrc format
    const metrcDestructions = destructions.map((destruction: any) => ({
      Id: null,
      Label: destruction.plantLabel,
      WasteMethodName: destruction.wasteMethod,
      WasteMaterialMixed: destruction.materialMixed || null,
      WasteWeight: destruction.wasteWeight,
      WasteUnitOfMeasure: destruction.wasteUnitOfMeasure,
      WasteReasonName: destruction.wasteReason || null,
      ReasonNote: destruction.reasonNote || null,
      ActualDate: destruction.actualDate || new Date().toISOString(),
    }));

    const endpoint = `/plants/${metrc.getVersion()}/waste`;
    await metrc.post(endpoint, metrcDestructions);

    console.log(`[Metrc] Destroyed ${metrcDestructions.length} plants`);

    // Log the destructions
    const batch = db.batch();
    for (const destruction of metrcDestructions) {
      const logRef = db
        .collection('facilities')
        .doc(facilityId)
        .collection('metrcLogs')
        .doc();

      batch.set(logRef, {
        action: 'destroyPlant',
        plantLabel: destruction.Label,
        wasteMethod: destruction.WasteMethodName,
        wasteWeight: destruction.WasteWeight,
        timestamp: firestore.FieldValue.serverTimestamp(),
        userId: context.auth.uid,
        status: 'success',
      });
    }
    await batch.commit();

    return {
      success: true,
      plantsDestroyed: metrcDestructions.length,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('[Metrc] Error destroying plants:', error);
    throw new functions.https.HttpsError(
      'internal',
      `Failed to destroy plants: ${error.message}`
    );
  }
});
