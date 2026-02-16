/**
 * Metrc Packages Cloud Functions
 *
 * Handles all package-related operations with Metrc API
 * - Sync packages from Metrc to Firestore
 * - Create packages in Metrc from Firestore
 * - Update package data
 * - Query package information
 */

import * as functions from 'firebase-functions';
import { firestore } from 'firebase-admin';
import { createMetrcClient } from '../api/client';
import {
  MetrcPackage,
  CreatePackageRequest,
} from '../types';

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
 * Sync active packages from Metrc to Firestore
 * Callable function
 */
export const syncActivePackages = functions.https.onCall(async (data, context) => {
  // Authenticate
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be authenticated to sync packages'
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
    // Get credentials
    const credentials = await getMetrcCredentials(facilityId);

    // Initialize Metrc client
    const metrc = createMetrcClient(credentials);

    // Fetch active packages
    const endpoint = `/packages/${metrc.getVersion()}/active`;
    const params: any = {};

    if (lastModifiedStart) {
      params.lastModifiedStart = lastModifiedStart;
    }
    if (lastModifiedEnd) {
      params.lastModifiedEnd = lastModifiedEnd;
    }

    const packages = await metrc.get<MetrcPackage[]>(endpoint, params);

    console.log(`[Metrc] Fetched ${packages.length} active packages`);

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
          // Metrc data
          metrcId: pkg.Id,
          label: pkg.Label,
          packageType: pkg.PackageType,
          productId: pkg.ProductId,
          productName: pkg.ProductName,
          productCategoryName: pkg.ProductCategoryName,
          quantity: pkg.Quantity,
          unitOfMeasure: pkg.UnitOfMeasureAbbreviation,

          // Item info
          itemId: pkg.ItemId,
          itemName: pkg.Item?.Name || null,
          strainId: pkg.Item?.StrainId || null,
          strainName: pkg.Item?.StrainName || null,

          // Status flags
          isProductionBatch: pkg.IsProductionBatch,
          productionBatchNumber: pkg.ProductionBatchNumber,
          isTradeSample: pkg.IsTradeSample,
          isTesting: pkg.IsTesting,
          isOnHold: pkg.IsOnHold,

          // Testing
          labTestingState: pkg.LabTestingState,
          labTestingStateDate: pkg.LabTestingStateDate,

          // Dates
          packagedDate: pkg.PackagedDate,
          receivedDateTime: pkg.ReceivedDateTime,
          finishedDate: pkg.FinishedDate,
          archivedDate: pkg.ArchivedDate,
          lastModified: pkg.LastModified,

          // Transfer info
          receivedFromManifestNumber: pkg.ReceivedFromManifestNumber,
          receivedFromFacilityLicenseNumber: pkg.ReceivedFromFacilityLicenseNumber,
          receivedFromFacilityName: pkg.ReceivedFromFacilityName,

          // Sync metadata
          syncedAt: firestore.FieldValue.serverTimestamp(),
          syncedBy: context.auth.uid,
          facilityId: facilityId,

          // Full Metrc object for reference
          metrcData: pkg,
        },
        { merge: true }
      );

      savedCount++;

      // Firestore batch limit is 500 operations
      if (savedCount % 500 === 0) {
        await batch.commit();
        console.log(`[Firestore] Committed batch of ${savedCount} packages`);
      }
    }

    // Commit remaining
    if (savedCount % 500 !== 0) {
      await batch.commit();
    }

    console.log(`[Sync] Successfully synced ${savedCount} packages`);

    // Update sync status
    await db
      .collection('facilities')
      .doc(facilityId)
      .collection('syncStatus')
      .doc('packages')
      .set(
        {
          lastSyncAt: firestore.FieldValue.serverTimestamp(),
          lastSyncBy: context.auth.uid,
          packageCount: savedCount,
          status: 'success',
        },
        { merge: true }
      );

    return {
      success: true,
      packagesSynced: savedCount,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('[Metrc Sync] Error syncing packages:', error);

    // Update sync status with error
    await db
      .collection('facilities')
      .doc(facilityId)
      .collection('syncStatus')
      .doc('packages')
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
      `Failed to sync packages: ${error.message}`
    );
  }
});

/**
 * Get package details from Metrc by ID
 * Callable function
 */
export const getPackageById = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be authenticated'
    );
  }

  const { facilityId, packageId } = data;

  if (!facilityId || !packageId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'facilityId and packageId are required'
    );
  }

  try {
    const credentials = await getMetrcCredentials(facilityId);
    const metrc = createMetrcClient(credentials);

    const endpoint = `/packages/${metrc.getVersion()}/${packageId}`;
    const pkg = await metrc.get<MetrcPackage>(endpoint);

    // Update in Firestore
    await db
      .collection('facilities')
      .doc(facilityId)
      .collection('packages')
      .doc(packageId.toString())
      .set(
        {
          metrcId: pkg.Id,
          label: pkg.Label,
          // ... (same fields as syncActivePackages)
          lastFetchedAt: firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

    return {
      success: true,
      package: pkg,
    };
  } catch (error: any) {
    console.error('[Metrc] Error fetching package:', error);
    throw new functions.https.HttpsError(
      'internal',
      `Failed to fetch package: ${error.message}`
    );
  }
});

// ==========================================
// CREATE FUNCTIONS
// ==========================================

/**
 * Create packages in Metrc
 * Callable function
 */
export const createPackages = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be authenticated'
    );
  }

  const { facilityId, packages } = data;

  if (!facilityId || !packages || !Array.isArray(packages)) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'facilityId and packages array are required'
    );
  }

  try {
    const credentials = await getMetrcCredentials(facilityId);
    const metrc = createMetrcClient(credentials);

    // Validate and transform packages
    const metrcPackages: CreatePackageRequest[] = packages.map((pkg: any) => ({
      Tag: pkg.tag || pkg.label,
      Location: pkg.location,
      Item: pkg.itemName,
      Quantity: pkg.quantity,
      UnitOfMeasure: pkg.unitOfMeasure,
      PatientLicenseNumber: pkg.patientLicenseNumber || null,
      Note: pkg.note || null,
      IsProductionBatch: pkg.isProductionBatch || false,
      ProductionBatchNumber: pkg.productionBatchNumber || null,
      IsDonation: pkg.isDonation || false,
      ProductRequiresRemediation: pkg.productRequiresRemediation || false,
      UseSameItem: pkg.useSameItem || false,
      ActualDate: pkg.actualDate || new Date().toISOString(),
    }));

    // Create in Metrc
    const endpoint = `/packages/${metrc.getVersion()}/create`;
    await metrc.post(endpoint, metrcPackages);

    console.log(`[Metrc] Created ${metrcPackages.length} packages`);

    // Log the creation in Firestore
    const batch = db.batch();
    for (const pkg of metrcPackages) {
      const logRef = db
        .collection('facilities')
        .doc(facilityId)
        .collection('metrcLogs')
        .doc();

      batch.set(logRef, {
        action: 'createPackage',
        packageTag: pkg.Tag,
        timestamp: firestore.FieldValue.serverTimestamp(),
        userId: context.auth.uid,
        status: 'success',
      });
    }
    await batch.commit();

    return {
      success: true,
      packagesCreated: metrcPackages.length,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('[Metrc] Error creating packages:', error);
    throw new functions.https.HttpsError(
      'internal',
      `Failed to create packages: ${error.message}`
    );
  }
});

// ==========================================
// UPDATE FUNCTIONS
// ==========================================

/**
 * Adjust package quantity in Metrc
 * Callable function
 */
export const adjustPackageQuantity = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be authenticated'
    );
  }

  const { facilityId, adjustments } = data;

  if (!facilityId || !adjustments || !Array.isArray(adjustments)) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'facilityId and adjustments array are required'
    );
  }

  try {
    const credentials = await getMetrcCredentials(facilityId);
    const metrc = createMetrcClient(credentials);

    const endpoint = `/packages/${metrc.getVersion()}/adjust`;
    await metrc.post(endpoint, adjustments);

    console.log(`[Metrc] Adjusted ${adjustments.length} packages`);

    // Log adjustments
    const batch = db.batch();
    for (const adjustment of adjustments) {
      const logRef = db
        .collection('facilities')
        .doc(facilityId)
        .collection('metrcLogs')
        .doc();

      batch.set(logRef, {
        action: 'adjustPackage',
        packageLabel: adjustment.Label,
        quantity: adjustment.Quantity,
        unitOfMeasure: adjustment.UnitOfMeasure,
        adjustmentReason: adjustment.AdjustmentReason,
        timestamp: firestore.FieldValue.serverTimestamp(),
        userId: context.auth.uid,
      });
    }
    await batch.commit();

    return {
      success: true,
      adjustmentsMade: adjustments.length,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('[Metrc] Error adjusting packages:', error);
    throw new functions.https.HttpsError(
      'internal',
      `Failed to adjust packages: ${error.message}`
    );
  }
});

// ==========================================
// FIRESTORE TRIGGERS
// ==========================================

/**
 * Auto-sync package to Metrc when created in Firestore
 * Firestore trigger
 */
export const onPackageCreated = functions.firestore
  .document('facilities/{facilityId}/packages/{packageId}')
  .onCreate(async (snap, context) => {
    const packageData = snap.data();
    const { facilityId, packageId } = context.params;

    // Skip if already synced from Metrc
    if (packageData.metrcId) {
      console.log(`[Trigger] Package ${packageId} already has metrcId, skipping`);
      return;
    }

    // Skip if marked as local-only
    if (packageData.localOnly) {
      console.log(`[Trigger] Package ${packageId} is local-only, skipping Metrc sync`);
      return;
    }

    try {
      const credentials = await getMetrcCredentials(facilityId);
      const metrc = createMetrcClient(credentials);

      // Transform to Metrc format
      const metrcPackage: CreatePackageRequest = {
        Tag: packageData.label || packageData.tag,
        Location: packageData.location,
        Item: packageData.itemName,
        Quantity: packageData.quantity,
        UnitOfMeasure: packageData.unitOfMeasure,
        PatientLicenseNumber: packageData.patientLicenseNumber || null,
        Note: packageData.note || null,
        IsProductionBatch: packageData.isProductionBatch || false,
        ProductionBatchNumber: packageData.productionBatchNumber || null,
        IsDonation: packageData.isDonation || false,
        ProductRequiresRemediation: packageData.productRequiresRemediation || false,
        UseSameItem: false,
        ActualDate: packageData.packagedDate || new Date().toISOString(),
      };

      // Create in Metrc
      const endpoint = `/packages/${metrc.getVersion()}/create`;
      await metrc.post(endpoint, [metrcPackage]);

      // Update Firestore with success
      await snap.ref.update({
        metrcSyncStatus: 'synced',
        metrcSyncedAt: firestore.FieldValue.serverTimestamp(),
      });

      console.log(`[Trigger] Successfully created package ${packageId} in Metrc`);
    } catch (error: any) {
      console.error(`[Trigger] Failed to create package in Metrc:`, error);

      // Update with error status
      await snap.ref.update({
        metrcSyncStatus: 'error',
        metrcSyncError: error.message,
        metrcSyncErrorAt: firestore.FieldValue.serverTimestamp(),
      });
    }
  });
