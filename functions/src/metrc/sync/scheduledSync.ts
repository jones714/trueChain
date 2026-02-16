/**
 * Metrc Scheduled Sync Jobs
 *
 * Automatic background syncing from Metrc to Firestore
 * - Hourly incremental syncs for packages, plants, transfers, sales
 * - Daily full sync for all data
 * - Configurable per-facility sync schedules
 */

import * as functions from 'firebase-functions';
import { firestore } from 'firebase-admin';
import { createMetrcClient } from '../api/client';
import { MetrcPackage, MetrcPlant, MetrcTransfer, MetrcSalesReceipt } from '../types';

const db = firestore();

// ==========================================
// HELPER FUNCTIONS
// ==========================================

interface MetrcCredentials {
  vendorKey: string;
  userKey: string;
  licenseNumber: string;
  sandbox: boolean;
}

/**
 * Get Metrc credentials from Firestore for a facility
 */
async function getMetrcCredentials(facilityId: string): Promise<MetrcCredentials> {
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

/**
 * Get all facilities that have Metrc sync enabled
 */
async function getSyncEnabledFacilities(): Promise<string[]> {
  const snapshot = await db
    .collection('facilities')
    .where('metrcSyncEnabled', '==', true)
    .get();

  return snapshot.docs.map((doc) => doc.id);
}

/**
 * Get the last sync timestamp for a facility and data type
 */
async function getLastSyncTime(facilityId: string, dataType: string): Promise<string | null> {
  const syncDoc = await db
    .collection('facilities')
    .doc(facilityId)
    .collection('syncStatus')
    .doc(dataType)
    .get();

  const data = syncDoc.data();
  if (!data?.lastSyncAt) {
    return null;
  }

  // Return timestamp in ISO format for Metrc API
  return data.lastSyncAt.toDate().toISOString();
}

/**
 * Sync packages for a single facility
 */
async function syncFacilityPackages(facilityId: string, incremental: boolean = true): Promise<number> {
  try {
    const credentials = await getMetrcCredentials(facilityId);
    const metrc = createMetrcClient(credentials);

    const endpoint = `/packages/${metrc.getVersion()}/active`;
    const params: any = {};

    // For incremental sync, only fetch packages modified since last sync
    if (incremental) {
      const lastSyncTime = await getLastSyncTime(facilityId, 'packages');
      if (lastSyncTime) {
        params.lastModifiedStart = lastSyncTime;
      }
    }

    const packages = await metrc.get<MetrcPackage[]>(endpoint, params);
    console.log(`[Sync] Facility ${facilityId}: Fetched ${packages.length} packages`);

    // Save to Firestore
    const batch = db.batch();
    let savedCount = 0;

    for (const pkg of packages) {
      const docRef = db
        .collection('facilities')
        .doc(facilityId)
        .collection('packages')
        .doc(pkg.Id.toString());

      batch.set(
        docRef,
        {
          metrcId: pkg.Id,
          label: pkg.Label,
          packageType: pkg.PackageType,
          quantity: pkg.Quantity,
          unitOfMeasure: pkg.UnitOfMeasureAbbreviation,
          productName: pkg.ProductName,
          itemName: pkg.Item?.Name || null,
          strainName: pkg.Item?.StrainName || null,
          lastModified: pkg.LastModified,
          syncedAt: firestore.FieldValue.serverTimestamp(),
          facilityId: facilityId,
          metrcData: pkg,
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
      .doc('packages')
      .set(
        {
          lastSyncAt: firestore.FieldValue.serverTimestamp(),
          packageCount: savedCount,
          status: 'success',
          syncType: incremental ? 'incremental' : 'full',
        },
        { merge: true }
      );

    return savedCount;
  } catch (error: any) {
    console.error(`[Sync] Error syncing packages for facility ${facilityId}:`, error);

    await db
      .collection('facilities')
      .doc(facilityId)
      .collection('syncStatus')
      .doc('packages')
      .set(
        {
          lastSyncAt: firestore.FieldValue.serverTimestamp(),
          status: 'error',
          error: error.message,
        },
        { merge: true }
      );

    return 0;
  }
}

/**
 * Sync plants for a single facility
 */
async function syncFacilityPlants(facilityId: string, incremental: boolean = true): Promise<number> {
  try {
    const credentials = await getMetrcCredentials(facilityId);
    const metrc = createMetrcClient(credentials);

    // Sync both vegetative and flowering plants
    const endpoints = [
      `/plants/${metrc.getVersion()}/vegetative`,
      `/plants/${metrc.getVersion()}/flowering`,
    ];

    let totalSaved = 0;

    for (const endpoint of endpoints) {
      const params: any = {};

      if (incremental) {
        const lastSyncTime = await getLastSyncTime(facilityId, 'plants');
        if (lastSyncTime) {
          params.lastModifiedStart = lastSyncTime;
        }
      }

      const plants = await metrc.get<MetrcPlant[]>(endpoint, params);
      console.log(`[Sync] Facility ${facilityId}: Fetched ${plants.length} plants from ${endpoint}`);

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
            strainName: plant.StrainName,
            locationName: plant.LocationName,
            plantedDate: plant.PlantedDate,
            lastModified: plant.LastModified,
            syncedAt: firestore.FieldValue.serverTimestamp(),
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

      totalSaved += savedCount;
    }

    await db
      .collection('facilities')
      .doc(facilityId)
      .collection('syncStatus')
      .doc('plants')
      .set(
        {
          lastSyncAt: firestore.FieldValue.serverTimestamp(),
          plantCount: totalSaved,
          status: 'success',
          syncType: incremental ? 'incremental' : 'full',
        },
        { merge: true }
      );

    return totalSaved;
  } catch (error: any) {
    console.error(`[Sync] Error syncing plants for facility ${facilityId}:`, error);
    return 0;
  }
}

/**
 * Sync transfers for a single facility
 */
async function syncFacilityTransfers(facilityId: string, incremental: boolean = true): Promise<number> {
  try {
    const credentials = await getMetrcCredentials(facilityId);
    const metrc = createMetrcClient(credentials);

    // Sync both incoming and outgoing transfers
    const endpoints = [
      `/transfers/${metrc.getVersion()}/incoming`,
      `/transfers/${metrc.getVersion()}/outgoing`,
    ];

    let totalSaved = 0;

    for (const endpoint of endpoints) {
      const params: any = {};

      if (incremental) {
        const lastSyncTime = await getLastSyncTime(facilityId, 'transfers');
        if (lastSyncTime) {
          params.lastModifiedStart = lastSyncTime;
        }
      }

      const transfers = await metrc.get<MetrcTransfer[]>(endpoint, params);
      console.log(`[Sync] Facility ${facilityId}: Fetched ${transfers.length} transfers from ${endpoint}`);

      const batch = db.batch();
      let savedCount = 0;

      for (const transfer of transfers) {
        const docRef = db
          .collection('facilities')
          .doc(facilityId)
          .collection('transfers')
          .doc(transfer.Id.toString());

        batch.set(
          docRef,
          {
            metrcId: transfer.Id,
            manifestNumber: transfer.ManifestNumber,
            shipperFacilityName: transfer.ShipperFacilityName,
            recipientFacilityName: transfer.RecipientFacilityName,
            packageCount: transfer.PackageCount,
            estimatedArrivalDateTime: transfer.EstimatedArrivalDateTime,
            lastModified: transfer.LastModified,
            syncedAt: firestore.FieldValue.serverTimestamp(),
            facilityId: facilityId,
            direction: endpoint.includes('incoming') ? 'incoming' : 'outgoing',
            metrcData: transfer,
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

      totalSaved += savedCount;
    }

    await db
      .collection('facilities')
      .doc(facilityId)
      .collection('syncStatus')
      .doc('transfers')
      .set(
        {
          lastSyncAt: firestore.FieldValue.serverTimestamp(),
          transferCount: totalSaved,
          status: 'success',
          syncType: incremental ? 'incremental' : 'full',
        },
        { merge: true }
      );

    return totalSaved;
  } catch (error: any) {
    console.error(`[Sync] Error syncing transfers for facility ${facilityId}:`, error);
    return 0;
  }
}

/**
 * Sync sales receipts for a single facility
 */
async function syncFacilitySalesReceipts(facilityId: string, incremental: boolean = true): Promise<number> {
  try {
    const credentials = await getMetrcCredentials(facilityId);
    const metrc = createMetrcClient(credentials);

    const endpoint = `/sales/${metrc.getVersion()}/receipts/active`;
    const params: any = {};

    if (incremental) {
      const lastSyncTime = await getLastSyncTime(facilityId, 'salesReceipts');
      if (lastSyncTime) {
        params.lastModifiedStart = lastSyncTime;
      }
    }

    const receipts = await metrc.get<MetrcSalesReceipt[]>(endpoint, params);
    console.log(`[Sync] Facility ${facilityId}: Fetched ${receipts.length} sales receipts`);

    const batch = db.batch();
    let savedCount = 0;

    for (const receipt of receipts) {
      const docRef = db
        .collection('facilities')
        .doc(facilityId)
        .collection('salesReceipts')
        .doc(receipt.Id.toString());

      batch.set(
        docRef,
        {
          metrcId: receipt.Id,
          receiptNumber: receipt.ReceiptNumber,
          salesDateTime: receipt.SalesDateTime,
          salesCustomerType: receipt.SalesCustomerType,
          totalPackages: receipt.TotalPackages,
          totalPrice: receipt.TotalPrice,
          isFinal: receipt.IsFinal,
          lastModified: receipt.LastModified,
          syncedAt: firestore.FieldValue.serverTimestamp(),
          facilityId: facilityId,
          metrcData: receipt,
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
      .doc('salesReceipts')
      .set(
        {
          lastSyncAt: firestore.FieldValue.serverTimestamp(),
          receiptCount: savedCount,
          status: 'success',
          syncType: incremental ? 'incremental' : 'full',
        },
        { merge: true }
      );

    return savedCount;
  } catch (error: any) {
    console.error(`[Sync] Error syncing sales receipts for facility ${facilityId}:`, error);
    return 0;
  }
}

// ==========================================
// SCHEDULED JOBS
// ==========================================

/**
 * Hourly incremental sync - Updates only modified data
 * Runs every hour for all sync-enabled facilities
 */
export const hourlyIncrementalSync = functions.pubsub
  .schedule('0 * * * *') // Every hour at minute 0
  .timeZone('America/Chicago') // Adjust to your timezone
  .onRun(async (context) => {
    console.log('[Scheduled Sync] Starting hourly incremental sync');

    try {
      const facilities = await getSyncEnabledFacilities();
      console.log(`[Scheduled Sync] Found ${facilities.length} facilities with sync enabled`);

      let totalPackages = 0;
      let totalPlants = 0;
      let totalTransfers = 0;
      let totalReceipts = 0;

      for (const facilityId of facilities) {
        console.log(`[Scheduled Sync] Syncing facility: ${facilityId}`);

        // Sync all data types incrementally
        totalPackages += await syncFacilityPackages(facilityId, true);
        totalPlants += await syncFacilityPlants(facilityId, true);
        totalTransfers += await syncFacilityTransfers(facilityId, true);
        totalReceipts += await syncFacilitySalesReceipts(facilityId, true);
      }

      console.log(`[Scheduled Sync] Hourly sync completed:
        - Facilities: ${facilities.length}
        - Packages: ${totalPackages}
        - Plants: ${totalPlants}
        - Transfers: ${totalTransfers}
        - Sales Receipts: ${totalReceipts}`);

      // Log sync summary
      await db.collection('syncLogs').add({
        type: 'hourly_incremental',
        timestamp: firestore.FieldValue.serverTimestamp(),
        facilitiesCount: facilities.length,
        packagesCount: totalPackages,
        plantsCount: totalPlants,
        transfersCount: totalTransfers,
        receiptsCount: totalReceipts,
        status: 'success',
      });

      return null;
    } catch (error: any) {
      console.error('[Scheduled Sync] Hourly sync failed:', error);

      await db.collection('syncLogs').add({
        type: 'hourly_incremental',
        timestamp: firestore.FieldValue.serverTimestamp(),
        status: 'error',
        error: error.message,
      });

      return null;
    }
  });

/**
 * Daily full sync - Syncs all data regardless of modification time
 * Runs every day at 2 AM
 */
export const dailyFullSync = functions.pubsub
  .schedule('0 2 * * *') // Every day at 2:00 AM
  .timeZone('America/Chicago')
  .onRun(async (context) => {
    console.log('[Scheduled Sync] Starting daily full sync');

    try {
      const facilities = await getSyncEnabledFacilities();
      console.log(`[Scheduled Sync] Found ${facilities.length} facilities with sync enabled`);

      let totalPackages = 0;
      let totalPlants = 0;
      let totalTransfers = 0;
      let totalReceipts = 0;

      for (const facilityId of facilities) {
        console.log(`[Scheduled Sync] Full sync for facility: ${facilityId}`);

        // Sync all data types without time filters
        totalPackages += await syncFacilityPackages(facilityId, false);
        totalPlants += await syncFacilityPlants(facilityId, false);
        totalTransfers += await syncFacilityTransfers(facilityId, false);
        totalReceipts += await syncFacilitySalesReceipts(facilityId, false);
      }

      console.log(`[Scheduled Sync] Daily full sync completed:
        - Facilities: ${facilities.length}
        - Packages: ${totalPackages}
        - Plants: ${totalPlants}
        - Transfers: ${totalTransfers}
        - Sales Receipts: ${totalReceipts}`);

      // Log sync summary
      await db.collection('syncLogs').add({
        type: 'daily_full',
        timestamp: firestore.FieldValue.serverTimestamp(),
        facilitiesCount: facilities.length,
        packagesCount: totalPackages,
        plantsCount: totalPlants,
        transfersCount: totalTransfers,
        receiptsCount: totalReceipts,
        status: 'success',
      });

      return null;
    } catch (error: any) {
      console.error('[Scheduled Sync] Daily full sync failed:', error);

      await db.collection('syncLogs').add({
        type: 'daily_full',
        timestamp: firestore.FieldValue.serverTimestamp(),
        status: 'error',
        error: error.message,
      });

      return null;
    }
  });

/**
 * Retry failed syncs - Attempts to re-sync facilities that had errors
 * Runs every 6 hours
 */
export const retryFailedSyncs = functions.pubsub
  .schedule('0 */6 * * *') // Every 6 hours
  .timeZone('America/Chicago')
  .onRun(async (context) => {
    console.log('[Scheduled Sync] Starting failed sync retry');

    try {
      // Find facilities with failed syncs in the last 24 hours
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const facilities = await getSyncEnabledFacilities();
      const facilitiesWithErrors: string[] = [];

      for (const facilityId of facilities) {
        const syncStatuses = await db
          .collection('facilities')
          .doc(facilityId)
          .collection('syncStatus')
          .where('status', '==', 'error')
          .where('lastSyncAt', '>=', oneDayAgo)
          .get();

        if (!syncStatuses.empty) {
          facilitiesWithErrors.push(facilityId);
        }
      }

      console.log(`[Scheduled Sync] Found ${facilitiesWithErrors.length} facilities with failed syncs`);

      let retriedCount = 0;

      for (const facilityId of facilitiesWithErrors) {
        console.log(`[Scheduled Sync] Retrying sync for facility: ${facilityId}`);

        // Retry all data types
        await syncFacilityPackages(facilityId, true);
        await syncFacilityPlants(facilityId, true);
        await syncFacilityTransfers(facilityId, true);
        await syncFacilitySalesReceipts(facilityId, true);

        retriedCount++;
      }

      console.log(`[Scheduled Sync] Retry completed for ${retriedCount} facilities`);

      await db.collection('syncLogs').add({
        type: 'retry_failed',
        timestamp: firestore.FieldValue.serverTimestamp(),
        retriedCount: retriedCount,
        status: 'success',
      });

      return null;
    } catch (error: any) {
      console.error('[Scheduled Sync] Retry failed:', error);

      await db.collection('syncLogs').add({
        type: 'retry_failed',
        timestamp: firestore.FieldValue.serverTimestamp(),
        status: 'error',
        error: error.message,
      });

      return null;
    }
  });
