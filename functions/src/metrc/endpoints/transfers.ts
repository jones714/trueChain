/**
 * Metrc Transfers Cloud Functions
 *
 * Handles all transfer-related operations with Metrc API
 * - Sync transfers from Metrc to Firestore
 * - Create transfer manifests
 * - Update transfer status
 * - Receive transfers
 * - Track deliveries
 */

import * as functions from 'firebase-functions';
import { firestore } from 'firebase-admin';
import { createMetrcClient } from '../api/client';
import { MetrcTransfer, CreateTransferRequest } from '../types';

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
 * Sync incoming transfers from Metrc to Firestore
 * Callable function
 */
export const syncIncomingTransfers = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be authenticated to sync transfers'
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

    const endpoint = `/transfers/${metrc.getVersion()}/incoming`;
    const params: any = {};

    if (lastModifiedStart) {
      params.lastModifiedStart = lastModifiedStart;
    }
    if (lastModifiedEnd) {
      params.lastModifiedEnd = lastModifiedEnd;
    }

    const transfers = await metrc.get<MetrcTransfer[]>(endpoint, params);

    console.log(`[Metrc] Fetched ${transfers.length} incoming transfers`);

    // Save to Firestore
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
          // Metrc data
          metrcId: transfer.Id,
          manifestNumber: transfer.ManifestNumber,
          shipmentLicenseType: transfer.ShipmentLicenseType,

          // Shipper info
          shipperFacilityLicenseNumber: transfer.ShipperFacilityLicenseNumber,
          shipperFacilityName: transfer.ShipperFacilityName,

          // Transporter info
          transporterFacilityLicenseNumber: transfer.TransporterFacilityLicenseNumber,
          transporterFacilityName: transfer.TransporterFacilityName,

          // Driver/vehicle info
          driverName: transfer.DriverName,
          driverLicenseNumber: transfer.DriverLicenseNumber,
          driverVehicleLicenseNumber: transfer.DriverVehicleLicenseNumber,
          vehicleMake: transfer.VehicleMake,
          vehicleModel: transfer.VehicleModel,
          vehicleLicensePlateNumber: transfer.VehicleLicensePlateNumber,

          // Delivery counts
          deliveryCount: transfer.DeliveryCount,
          receivedDeliveryCount: transfer.ReceivedDeliveryCount,
          packageCount: transfer.PackageCount,
          receivedPackageCount: transfer.ReceivedPackageCount,

          // Recipient info
          recipientFacilityLicenseNumber: transfer.RecipientFacilityLicenseNumber,
          recipientFacilityName: transfer.RecipientFacilityName,

          // Shipment info
          shipmentTypeName: transfer.ShipmentTypeName,
          shipmentTransactionType: transfer.ShipmentTransactionType,

          // Dates
          estimatedDepartureDateTime: transfer.EstimatedDepartureDateTime,
          actualDepartureDateTime: transfer.ActualDepartureDateTime,
          estimatedArrivalDateTime: transfer.EstimatedArrivalDateTime,
          actualArrivalDateTime: transfer.ActualArrivalDateTime,
          receivedDateTime: transfer.ReceivedDateTime,
          createdDateTime: transfer.CreatedDateTime,
          lastModified: transfer.LastModified,

          // Metadata
          createdByUserName: transfer.CreatedByUserName,

          // Delivery-specific data
          deliveryId: transfer.DeliveryId,
          deliveryPackageCount: transfer.DeliveryPackageCount,
          deliveryReceivedPackageCount: transfer.DeliveryReceivedPackageCount,

          // Sync metadata
          syncedAt: firestore.FieldValue.serverTimestamp(),
          syncedBy: context.auth.uid,
          facilityId: facilityId,
          direction: 'incoming',

          // Full Metrc object for reference
          metrcData: transfer,
        },
        { merge: true }
      );

      savedCount++;

      if (savedCount % 500 === 0) {
        await batch.commit();
        console.log(`[Firestore] Committed batch of ${savedCount} transfers`);
      }
    }

    if (savedCount % 500 !== 0) {
      await batch.commit();
    }

    console.log(`[Sync] Successfully synced ${savedCount} incoming transfers`);

    // Update sync status
    await db
      .collection('facilities')
      .doc(facilityId)
      .collection('syncStatus')
      .doc('transfers_incoming')
      .set(
        {
          lastSyncAt: firestore.FieldValue.serverTimestamp(),
          lastSyncBy: context.auth.uid,
          transferCount: savedCount,
          status: 'success',
        },
        { merge: true }
      );

    return {
      success: true,
      transfersSynced: savedCount,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('[Metrc Sync] Error syncing incoming transfers:', error);

    await db
      .collection('facilities')
      .doc(facilityId)
      .collection('syncStatus')
      .doc('transfers_incoming')
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
      `Failed to sync incoming transfers: ${error.message}`
    );
  }
});

/**
 * Sync outgoing transfers from Metrc to Firestore
 * Callable function
 */
export const syncOutgoingTransfers = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be authenticated to sync transfers'
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

    const endpoint = `/transfers/${metrc.getVersion()}/outgoing`;
    const params: any = {};

    if (lastModifiedStart) {
      params.lastModifiedStart = lastModifiedStart;
    }
    if (lastModifiedEnd) {
      params.lastModifiedEnd = lastModifiedEnd;
    }

    const transfers = await metrc.get<MetrcTransfer[]>(endpoint, params);

    console.log(`[Metrc] Fetched ${transfers.length} outgoing transfers`);

    // Save to Firestore (similar to incoming)
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
          shipmentLicenseType: transfer.ShipmentLicenseType,
          shipperFacilityLicenseNumber: transfer.ShipperFacilityLicenseNumber,
          shipperFacilityName: transfer.ShipperFacilityName,
          transporterFacilityLicenseNumber: transfer.TransporterFacilityLicenseNumber,
          transporterFacilityName: transfer.TransporterFacilityName,
          driverName: transfer.DriverName,
          driverLicenseNumber: transfer.DriverLicenseNumber,
          vehicleMake: transfer.VehicleMake,
          vehicleModel: transfer.VehicleModel,
          vehicleLicensePlateNumber: transfer.VehicleLicensePlateNumber,
          deliveryCount: transfer.DeliveryCount,
          receivedDeliveryCount: transfer.ReceivedDeliveryCount,
          packageCount: transfer.PackageCount,
          receivedPackageCount: transfer.ReceivedPackageCount,
          recipientFacilityLicenseNumber: transfer.RecipientFacilityLicenseNumber,
          recipientFacilityName: transfer.RecipientFacilityName,
          shipmentTypeName: transfer.ShipmentTypeName,
          estimatedDepartureDateTime: transfer.EstimatedDepartureDateTime,
          actualDepartureDateTime: transfer.ActualDepartureDateTime,
          estimatedArrivalDateTime: transfer.EstimatedArrivalDateTime,
          actualArrivalDateTime: transfer.ActualArrivalDateTime,
          receivedDateTime: transfer.ReceivedDateTime,
          createdDateTime: transfer.CreatedDateTime,
          lastModified: transfer.LastModified,
          syncedAt: firestore.FieldValue.serverTimestamp(),
          syncedBy: context.auth.uid,
          facilityId: facilityId,
          direction: 'outgoing',
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

    await db
      .collection('facilities')
      .doc(facilityId)
      .collection('syncStatus')
      .doc('transfers_outgoing')
      .set(
        {
          lastSyncAt: firestore.FieldValue.serverTimestamp(),
          lastSyncBy: context.auth.uid,
          transferCount: savedCount,
          status: 'success',
        },
        { merge: true }
      );

    return {
      success: true,
      transfersSynced: savedCount,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('[Metrc Sync] Error syncing outgoing transfers:', error);
    throw new functions.https.HttpsError(
      'internal',
      `Failed to sync outgoing transfers: ${error.message}`
    );
  }
});

/**
 * Get transfer deliveries with package details
 * Callable function
 */
export const getTransferDeliveries = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be authenticated'
    );
  }

  const { facilityId, transferId } = data;

  if (!facilityId || !transferId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'facilityId and transferId are required'
    );
  }

  try {
    const credentials = await getMetrcCredentials(facilityId);
    const metrc = createMetrcClient(credentials);

    const endpoint = `/transfers/${metrc.getVersion()}/${transferId}/deliveries`;
    const deliveries = await metrc.get(endpoint);

    console.log(`[Metrc] Fetched deliveries for transfer ${transferId}`);

    // Save delivery details to Firestore
    await db
      .collection('facilities')
      .doc(facilityId)
      .collection('transfers')
      .doc(transferId.toString())
      .set(
        {
          deliveries: deliveries,
          deliveriesFetchedAt: firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

    return {
      success: true,
      deliveries: deliveries,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('[Metrc] Error fetching transfer deliveries:', error);
    throw new functions.https.HttpsError(
      'internal',
      `Failed to fetch transfer deliveries: ${error.message}`
    );
  }
});

// ==========================================
// CREATE FUNCTIONS
// ==========================================

/**
 * Create outgoing transfer manifest in Metrc
 * Callable function
 */
export const createTransferManifest = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be authenticated'
    );
  }

  const { facilityId, transfer } = data;

  if (!facilityId || !transfer) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'facilityId and transfer data are required'
    );
  }

  try {
    const credentials = await getMetrcCredentials(facilityId);
    const metrc = createMetrcClient(credentials);

    // Transform to Metrc format
    const metrcTransfer: CreateTransferRequest = {
      ShipperFacilityLicenseNumber: transfer.shipperFacilityLicenseNumber,
      ShipmentLicenseType: transfer.shipmentLicenseType,
      ShipmentTransactionType: transfer.shipmentTransactionType,
      ShipperFacilityName: transfer.shipperFacilityName,
      DriverName: transfer.driverName,
      DriverLicenseNumber: transfer.driverLicenseNumber,
      VehicleMake: transfer.vehicleMake,
      VehicleModel: transfer.vehicleModel,
      VehicleLicensePlateNumber: transfer.vehicleLicensePlateNumber,
      Destination: transfer.destinations.map((dest: any) => ({
        RecipientFacilityLicenseNumber: dest.recipientFacilityLicenseNumber,
        TransferTypeName: dest.transferTypeName,
        EstimatedArrivalDateTime: dest.estimatedArrivalDateTime,
        PlannedRoute: dest.plannedRoute || null,
        Transporters: dest.transporters || [],
        Packages: dest.packages.map((pkg: any) => ({
          PackageLabel: pkg.packageLabel,
          WholesalePrice: pkg.wholesalePrice || null,
        })),
      })),
    };

    const endpoint = `/transfers/${metrc.getVersion()}/external/incoming`;
    await metrc.post(endpoint, [metrcTransfer]);

    console.log('[Metrc] Created transfer manifest');

    // Log the creation
    await db
      .collection('facilities')
      .doc(facilityId)
      .collection('metrcLogs')
      .add({
        action: 'createTransferManifest',
        recipientFacility: transfer.destinations[0]?.recipientFacilityLicenseNumber,
        packageCount: transfer.destinations[0]?.packages.length || 0,
        timestamp: firestore.FieldValue.serverTimestamp(),
        userId: context.auth.uid,
        status: 'success',
      });

    return {
      success: true,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('[Metrc] Error creating transfer manifest:', error);
    throw new functions.https.HttpsError(
      'internal',
      `Failed to create transfer manifest: ${error.message}`
    );
  }
});

// ==========================================
// UPDATE FUNCTIONS
// ==========================================

/**
 * Update transfer departure time in Metrc
 * Callable function
 */
export const updateTransferDeparture = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be authenticated'
    );
  }

  const { facilityId, transferId, actualDepartureDateTime } = data;

  if (!facilityId || !transferId || !actualDepartureDateTime) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'facilityId, transferId, and actualDepartureDateTime are required'
    );
  }

  try {
    const credentials = await getMetrcCredentials(facilityId);
    const metrc = createMetrcClient(credentials);

    const payload = {
      ActualDepartureDateTime: actualDepartureDateTime,
    };

    const endpoint = `/transfers/${metrc.getVersion()}/${transferId}/depart`;
    await metrc.put(endpoint, payload);

    console.log(`[Metrc] Updated departure time for transfer ${transferId}`);

    // Update Firestore
    await db
      .collection('facilities')
      .doc(facilityId)
      .collection('transfers')
      .doc(transferId.toString())
      .update({
        actualDepartureDateTime: actualDepartureDateTime,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

    // Log the update
    await db
      .collection('facilities')
      .doc(facilityId)
      .collection('metrcLogs')
      .add({
        action: 'updateTransferDeparture',
        transferId: transferId,
        departureDateTime: actualDepartureDateTime,
        timestamp: firestore.FieldValue.serverTimestamp(),
        userId: context.auth.uid,
        status: 'success',
      });

    return {
      success: true,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('[Metrc] Error updating transfer departure:', error);
    throw new functions.https.HttpsError(
      'internal',
      `Failed to update transfer departure: ${error.message}`
    );
  }
});

/**
 * Receive/accept transfer packages in Metrc
 * Callable function
 */
export const receiveTransfer = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be authenticated'
    );
  }

  const { facilityId, transferId, packages } = data;

  if (!facilityId || !transferId || !packages || !Array.isArray(packages)) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'facilityId, transferId, and packages array are required'
    );
  }

  try {
    const credentials = await getMetrcCredentials(facilityId);
    const metrc = createMetrcClient(credentials);

    // Transform to Metrc format
    const metrcPackages = packages.map((pkg: any) => ({
      PackageLabel: pkg.packageLabel,
      ShipmentPackageState: pkg.shipmentPackageState || 'Accepted',
      ShipmentTransactionType: pkg.shipmentTransactionType,
      ReceivedQuantity: pkg.receivedQuantity,
      ReceivedUnitOfMeasure: pkg.receivedUnitOfMeasure,
    }));

    const endpoint = `/transfers/${metrc.getVersion()}/delivery/package/states`;
    await metrc.post(endpoint, metrcPackages);

    console.log(`[Metrc] Received ${metrcPackages.length} packages from transfer ${transferId}`);

    // Update Firestore transfer status
    await db
      .collection('facilities')
      .doc(facilityId)
      .collection('transfers')
      .doc(transferId.toString())
      .update({
        receivedDateTime: firestore.FieldValue.serverTimestamp(),
        receivedPackageCount: metrcPackages.length,
        status: 'received',
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

    // Log the receipt
    await db
      .collection('facilities')
      .doc(facilityId)
      .collection('metrcLogs')
      .add({
        action: 'receiveTransfer',
        transferId: transferId,
        packageCount: metrcPackages.length,
        timestamp: firestore.FieldValue.serverTimestamp(),
        userId: context.auth.uid,
        status: 'success',
      });

    return {
      success: true,
      packagesReceived: metrcPackages.length,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('[Metrc] Error receiving transfer:', error);
    throw new functions.https.HttpsError(
      'internal',
      `Failed to receive transfer: ${error.message}`
    );
  }
});

/**
 * Reject transfer packages in Metrc
 * Callable function
 */
export const rejectTransferPackages = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be authenticated'
    );
  }

  const { facilityId, transferId, packages } = data;

  if (!facilityId || !transferId || !packages || !Array.isArray(packages)) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'facilityId, transferId, and packages array are required'
    );
  }

  try {
    const credentials = await getMetrcCredentials(facilityId);
    const metrc = createMetrcClient(credentials);

    // Transform to Metrc format
    const metrcPackages = packages.map((pkg: any) => ({
      PackageLabel: pkg.packageLabel,
      ShipmentPackageState: 'Rejected',
      RejectionReasonName: pkg.rejectionReason,
      RejectionReasonNote: pkg.rejectionNote || null,
    }));

    const endpoint = `/transfers/${metrc.getVersion()}/delivery/package/states`;
    await metrc.post(endpoint, metrcPackages);

    console.log(`[Metrc] Rejected ${metrcPackages.length} packages from transfer ${transferId}`);

    // Log the rejection
    await db
      .collection('facilities')
      .doc(facilityId)
      .collection('metrcLogs')
      .add({
        action: 'rejectTransferPackages',
        transferId: transferId,
        packageCount: metrcPackages.length,
        timestamp: firestore.FieldValue.serverTimestamp(),
        userId: context.auth.uid,
        status: 'success',
      });

    return {
      success: true,
      packagesRejected: metrcPackages.length,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('[Metrc] Error rejecting transfer packages:', error);
    throw new functions.https.HttpsError(
      'internal',
      `Failed to reject transfer packages: ${error.message}`
    );
  }
});
