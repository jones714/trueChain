/**
 * Metrc Sales Cloud Functions
 *
 * Handles all sales-related operations with Metrc API
 * - Sync sales receipts from Metrc to Firestore
 * - Create sales receipts
 * - Finalize/void sales receipts
 * - Manage sales deliveries
 * - Track transactions
 */

import * as functions from 'firebase-functions';
import { firestore } from 'firebase-admin';
import { createMetrcClient } from '../api/client';
import { MetrcSalesReceipt, MetrcSalesDelivery, CreateSalesReceiptRequest } from '../types';

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
 * Sync active sales receipts from Metrc to Firestore
 * Callable function
 */
export const syncSalesReceipts = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be authenticated to sync sales receipts'
    );
  }

  const { facilityId, lastModifiedStart, lastModifiedEnd, active = true } = data;

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
      ? `/sales/${metrc.getVersion()}/receipts/active`
      : `/sales/${metrc.getVersion()}/receipts/inactive`;

    const params: any = {};

    if (lastModifiedStart) {
      params.lastModifiedStart = lastModifiedStart;
    }
    if (lastModifiedEnd) {
      params.lastModifiedEnd = lastModifiedEnd;
    }

    const receipts = await metrc.get<MetrcSalesReceipt[]>(endpoint, params);

    console.log(`[Metrc] Fetched ${receipts.length} sales receipts`);

    // Save to Firestore
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
          // Metrc data
          metrcId: receipt.Id,
          receiptNumber: receipt.ReceiptNumber,
          salesDateTime: receipt.SalesDateTime,
          salesCustomerType: receipt.SalesCustomerType,

          // Customer info
          patientLicenseNumber: receipt.PatientLicenseNumber,
          caregiverLicenseNumber: receipt.CaregiverLicenseNumber,
          identificationMethod: receipt.IdentificationMethod,

          // Receipt details
          totalPackages: receipt.TotalPackages,
          totalPrice: receipt.TotalPrice,
          isFinal: receipt.IsFinal,

          // Transactions
          transactions: receipt.Transactions.map((tx) => ({
            packageId: tx.PackageId,
            packageLabel: tx.PackageLabel,
            productName: tx.ProductName,
            productCategoryName: tx.ProductCategoryName,
            itemUnitWeight: tx.ItemUnitWeight,
            itemUnitWeightUnitOfMeasureAbbreviation: tx.ItemUnitWeightUnitOfMeasureAbbreviation,
            quantitySold: tx.QuantitySold,
            unitOfMeasureAbbreviation: tx.UnitOfMeasureAbbreviation,
            totalPrice: tx.TotalPrice,
          })),

          // Dates
          archivedDate: receipt.ArchivedDate,
          recordedDateTime: receipt.RecordedDateTime,
          lastModified: receipt.LastModified,

          // Metadata
          recordedByUserName: receipt.RecordedByUserName,

          // Sync metadata
          syncedAt: firestore.FieldValue.serverTimestamp(),
          syncedBy: context.auth.uid,
          facilityId: facilityId,

          // Full Metrc object for reference
          metrcData: receipt,
        },
        { merge: true }
      );

      savedCount++;

      if (savedCount % 500 === 0) {
        await batch.commit();
        console.log(`[Firestore] Committed batch of ${savedCount} receipts`);
      }
    }

    if (savedCount % 500 !== 0) {
      await batch.commit();
    }

    console.log(`[Sync] Successfully synced ${savedCount} sales receipts`);

    // Update sync status
    await db
      .collection('facilities')
      .doc(facilityId)
      .collection('syncStatus')
      .doc('salesReceipts')
      .set(
        {
          lastSyncAt: firestore.FieldValue.serverTimestamp(),
          lastSyncBy: context.auth.uid,
          receiptCount: savedCount,
          status: 'success',
        },
        { merge: true }
      );

    return {
      success: true,
      receiptsSynced: savedCount,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('[Metrc Sync] Error syncing sales receipts:', error);

    await db
      .collection('facilities')
      .doc(facilityId)
      .collection('syncStatus')
      .doc('salesReceipts')
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
      `Failed to sync sales receipts: ${error.message}`
    );
  }
});

/**
 * Sync sales deliveries from Metrc to Firestore
 * Callable function
 */
export const syncSalesDeliveries = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be authenticated to sync deliveries'
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
      ? `/sales/${metrc.getVersion()}/deliveries/active`
      : `/sales/${metrc.getVersion()}/deliveries/inactive`;

    const deliveries = await metrc.get<MetrcSalesDelivery[]>(endpoint);

    console.log(`[Metrc] Fetched ${deliveries.length} sales deliveries`);

    // Save to Firestore
    const batch = db.batch();
    let savedCount = 0;

    for (const delivery of deliveries) {
      const docRef = db
        .collection('facilities')
        .doc(facilityId)
        .collection('salesDeliveries')
        .doc(delivery.Id.toString());

      batch.set(
        docRef,
        {
          metrcId: delivery.Id,
          deliveryNumber: delivery.DeliveryNumber,

          // Recipient info
          recipientName: delivery.RecipientName,
          recipientAddressStreet1: delivery.RecipientAddressStreet1,
          recipientAddressStreet2: delivery.RecipientAddressStreet2,
          recipientAddressCity: delivery.RecipientAddressCity,
          recipientAddressCounty: delivery.RecipientAddressCounty,
          recipientAddressState: delivery.RecipientAddressState,
          recipientAddressPostalCode: delivery.RecipientAddressPostalCode,

          // Route and timing
          plannedRoute: delivery.PlannedRoute,
          estimatedDepartureDateTime: delivery.EstimatedDepartureDateTime,
          actualDepartureDateTime: delivery.ActualDepartureDateTime,
          estimatedArrivalDateTime: delivery.EstimatedArrivalDateTime,
          actualArrivalDateTime: delivery.ActualArrivalDateTime,
          receivedDateTime: delivery.ReceivedDateTime,

          // Package counts
          deliveryPackageCount: delivery.DeliveryPackageCount,
          deliveryReceivedPackageCount: delivery.DeliveryReceivedPackageCount,

          // Driver/vehicle info
          driverName: delivery.DriverName,
          driverLicenseNumber: delivery.DriverLicenseNumber,
          driverVehicleLicenseNumber: delivery.DriverVehicleLicenseNumber,
          vehicleMake: delivery.VehicleMake,
          vehicleModel: delivery.VehicleModel,
          vehicleLicensePlateNumber: delivery.VehicleLicensePlateNumber,

          // Transactions
          transactions: delivery.Transactions.map((tx) => ({
            packageId: tx.PackageId,
            packageLabel: tx.PackageLabel,
            productName: tx.ProductName,
            productCategoryName: tx.ProductCategoryName,
            quantitySold: tx.QuantitySold,
            unitOfMeasureAbbreviation: tx.UnitOfMeasureAbbreviation,
            totalPrice: tx.TotalPrice,
          })),

          // Sync metadata
          syncedAt: firestore.FieldValue.serverTimestamp(),
          syncedBy: context.auth.uid,
          facilityId: facilityId,
          metrcData: delivery,
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
      .doc('salesDeliveries')
      .set(
        {
          lastSyncAt: firestore.FieldValue.serverTimestamp(),
          lastSyncBy: context.auth.uid,
          deliveryCount: savedCount,
          status: 'success',
        },
        { merge: true }
      );

    return {
      success: true,
      deliveriesSynced: savedCount,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('[Metrc Sync] Error syncing sales deliveries:', error);
    throw new functions.https.HttpsError(
      'internal',
      `Failed to sync sales deliveries: ${error.message}`
    );
  }
});

// ==========================================
// CREATE FUNCTIONS
// ==========================================

/**
 * Create sales receipt in Metrc
 * Callable function
 */
export const createSalesReceipt = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be authenticated'
    );
  }

  const { facilityId, receipt } = data;

  if (!facilityId || !receipt) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'facilityId and receipt data are required'
    );
  }

  try {
    const credentials = await getMetrcCredentials(facilityId);
    const metrc = createMetrcClient(credentials);

    // Transform to Metrc format
    const metrcReceipt: CreateSalesReceiptRequest = {
      SalesDateTime: receipt.salesDateTime || new Date().toISOString(),
      SalesCustomerType: receipt.salesCustomerType,
      PatientLicenseNumber: receipt.patientLicenseNumber || null,
      CaregiverLicenseNumber: receipt.caregiverLicenseNumber || null,
      IdentificationMethod: receipt.identificationMethod || null,
      Transactions: receipt.transactions.map((tx: any) => ({
        PackageLabel: tx.packageLabel,
        Quantity: tx.quantity,
        UnitOfMeasure: tx.unitOfMeasure,
        TotalAmount: tx.totalAmount,
      })),
    };

    const endpoint = `/sales/${metrc.getVersion()}/receipts`;
    await metrc.post(endpoint, [metrcReceipt]);

    console.log('[Metrc] Created sales receipt');

    // Log the creation
    await db
      .collection('facilities')
      .doc(facilityId)
      .collection('metrcLogs')
      .add({
        action: 'createSalesReceipt',
        salesDateTime: metrcReceipt.SalesDateTime,
        customerType: metrcReceipt.SalesCustomerType,
        transactionCount: metrcReceipt.Transactions.length,
        timestamp: firestore.FieldValue.serverTimestamp(),
        userId: context.auth.uid,
        status: 'success',
      });

    return {
      success: true,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('[Metrc] Error creating sales receipt:', error);
    throw new functions.https.HttpsError(
      'internal',
      `Failed to create sales receipt: ${error.message}`
    );
  }
});

/**
 * Create sales delivery in Metrc
 * Callable function
 */
export const createSalesDelivery = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be authenticated'
    );
  }

  const { facilityId, delivery } = data;

  if (!facilityId || !delivery) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'facilityId and delivery data are required'
    );
  }

  try {
    const credentials = await getMetrcCredentials(facilityId);
    const metrc = createMetrcClient(credentials);

    // Transform to Metrc format
    const metrcDelivery = {
      RecipientName: delivery.recipientName,
      RecipientAddressStreet1: delivery.recipientAddressStreet1,
      RecipientAddressStreet2: delivery.recipientAddressStreet2 || null,
      RecipientAddressCity: delivery.recipientAddressCity,
      RecipientAddressCounty: delivery.recipientAddressCounty || null,
      RecipientAddressState: delivery.recipientAddressState,
      RecipientAddressPostalCode: delivery.recipientAddressPostalCode,
      PlannedRoute: delivery.plannedRoute || null,
      EstimatedDepartureDateTime: delivery.estimatedDepartureDateTime,
      EstimatedArrivalDateTime: delivery.estimatedArrivalDateTime,
      SalesDateTime: delivery.salesDateTime || new Date().toISOString(),
      SalesCustomerType: delivery.salesCustomerType,
      PatientLicenseNumber: delivery.patientLicenseNumber || null,
      CaregiverLicenseNumber: delivery.caregiverLicenseNumber || null,
      IdentificationMethod: delivery.identificationMethod || null,
      DriverName: delivery.driverName,
      DriverLicenseNumber: delivery.driverLicenseNumber,
      DriverVehicleLicenseNumber: delivery.driverVehicleLicenseNumber,
      VehicleMake: delivery.vehicleMake,
      VehicleModel: delivery.vehicleModel,
      VehicleLicensePlateNumber: delivery.vehicleLicensePlateNumber,
      Transactions: delivery.transactions.map((tx: any) => ({
        PackageLabel: tx.packageLabel,
        Quantity: tx.quantity,
        UnitOfMeasure: tx.unitOfMeasure,
        TotalAmount: tx.totalAmount,
      })),
    };

    const endpoint = `/sales/${metrc.getVersion()}/deliveries`;
    await metrc.post(endpoint, [metrcDelivery]);

    console.log('[Metrc] Created sales delivery');

    // Log the creation
    await db
      .collection('facilities')
      .doc(facilityId)
      .collection('metrcLogs')
      .add({
        action: 'createSalesDelivery',
        recipientName: delivery.recipientName,
        estimatedArrivalDateTime: delivery.estimatedArrivalDateTime,
        transactionCount: delivery.transactions.length,
        timestamp: firestore.FieldValue.serverTimestamp(),
        userId: context.auth.uid,
        status: 'success',
      });

    return {
      success: true,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('[Metrc] Error creating sales delivery:', error);
    throw new functions.https.HttpsError(
      'internal',
      `Failed to create sales delivery: ${error.message}`
    );
  }
});

// ==========================================
// UPDATE FUNCTIONS
// ==========================================

/**
 * Finalize sales receipt in Metrc
 * Callable function
 */
export const finalizeSalesReceipt = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be authenticated'
    );
  }

  const { facilityId, receiptId } = data;

  if (!facilityId || !receiptId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'facilityId and receiptId are required'
    );
  }

  try {
    const credentials = await getMetrcCredentials(facilityId);
    const metrc = createMetrcClient(credentials);

    const payload = {
      Id: receiptId,
    };

    const endpoint = `/sales/${metrc.getVersion()}/receipts/finalize`;
    await metrc.put(endpoint, [payload]);

    console.log(`[Metrc] Finalized sales receipt ${receiptId}`);

    // Update Firestore
    await db
      .collection('facilities')
      .doc(facilityId)
      .collection('salesReceipts')
      .doc(receiptId.toString())
      .update({
        isFinal: true,
        finalizedAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

    // Log the finalization
    await db
      .collection('facilities')
      .doc(facilityId)
      .collection('metrcLogs')
      .add({
        action: 'finalizeSalesReceipt',
        receiptId: receiptId,
        timestamp: firestore.FieldValue.serverTimestamp(),
        userId: context.auth.uid,
        status: 'success',
      });

    return {
      success: true,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('[Metrc] Error finalizing sales receipt:', error);
    throw new functions.https.HttpsError(
      'internal',
      `Failed to finalize sales receipt: ${error.message}`
    );
  }
});

/**
 * Unfinalize sales receipt in Metrc
 * Callable function
 */
export const unfinalizeSalesReceipt = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be authenticated'
    );
  }

  const { facilityId, receiptId } = data;

  if (!facilityId || !receiptId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'facilityId and receiptId are required'
    );
  }

  try {
    const credentials = await getMetrcCredentials(facilityId);
    const metrc = createMetrcClient(credentials);

    const payload = {
      Id: receiptId,
    };

    const endpoint = `/sales/${metrc.getVersion()}/receipts/unfinalize`;
    await metrc.put(endpoint, [payload]);

    console.log(`[Metrc] Unfinalized sales receipt ${receiptId}`);

    // Update Firestore
    await db
      .collection('facilities')
      .doc(facilityId)
      .collection('salesReceipts')
      .doc(receiptId.toString())
      .update({
        isFinal: false,
        unfinalizedAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

    // Log the unfinalization
    await db
      .collection('facilities')
      .doc(facilityId)
      .collection('metrcLogs')
      .add({
        action: 'unfinalizeSalesReceipt',
        receiptId: receiptId,
        timestamp: firestore.FieldValue.serverTimestamp(),
        userId: context.auth.uid,
        status: 'success',
      });

    return {
      success: true,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('[Metrc] Error unfinalizing sales receipt:', error);
    throw new functions.https.HttpsError(
      'internal',
      `Failed to unfinalize sales receipt: ${error.message}`
    );
  }
});

/**
 * Complete sales delivery in Metrc
 * Callable function
 */
export const completeSalesDelivery = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be authenticated'
    );
  }

  const { facilityId, deliveryId, actualArrivalDateTime } = data;

  if (!facilityId || !deliveryId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'facilityId and deliveryId are required'
    );
  }

  try {
    const credentials = await getMetrcCredentials(facilityId);
    const metrc = createMetrcClient(credentials);

    const payload = {
      Id: deliveryId,
      ActualArrivalDateTime: actualArrivalDateTime || new Date().toISOString(),
    };

    const endpoint = `/sales/${metrc.getVersion()}/deliveries/complete`;
    await metrc.put(endpoint, [payload]);

    console.log(`[Metrc] Completed sales delivery ${deliveryId}`);

    // Update Firestore
    await db
      .collection('facilities')
      .doc(facilityId)
      .collection('salesDeliveries')
      .doc(deliveryId.toString())
      .update({
        actualArrivalDateTime: payload.ActualArrivalDateTime,
        receivedDateTime: firestore.FieldValue.serverTimestamp(),
        status: 'completed',
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

    // Log the completion
    await db
      .collection('facilities')
      .doc(facilityId)
      .collection('metrcLogs')
      .add({
        action: 'completeSalesDelivery',
        deliveryId: deliveryId,
        arrivalDateTime: payload.ActualArrivalDateTime,
        timestamp: firestore.FieldValue.serverTimestamp(),
        userId: context.auth.uid,
        status: 'success',
      });

    return {
      success: true,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('[Metrc] Error completing sales delivery:', error);
    throw new functions.https.HttpsError(
      'internal',
      `Failed to complete sales delivery: ${error.message}`
    );
  }
});
