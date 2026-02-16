# Metrc Cloud Functions - Complete Reference

Quick reference guide for all available Metrc Cloud Functions.

---

## 📦 Packages Functions

### `syncActivePackages`
Sync active packages from Metrc to Firestore.

**Parameters:**
```typescript
{
  facilityId: string;
  lastModifiedStart?: string; // ISO date
  lastModifiedEnd?: string;   // ISO date
}
```

**Returns:**
```typescript
{
  success: boolean;
  packagesSynced: number;
  timestamp: string;
}
```

### `getPackageById`
Get specific package details from Metrc.

**Parameters:**
```typescript
{
  facilityId: string;
  packageId: number;
}
```

**Returns:**
```typescript
{
  success: boolean;
  package: MetrcPackage;
}
```

### `createPackages`
Create new packages in Metrc.

**Parameters:**
```typescript
{
  facilityId: string;
  packages: [{
    tag: string;
    location: string;
    itemName: string;
    quantity: number;
    unitOfMeasure: string;
    note?: string;
    packagedDate?: string;
  }];
}
```

**Returns:**
```typescript
{
  success: boolean;
  packagesCreated: number;
  timestamp: string;
}
```

### `adjustPackageQuantity`
Adjust package quantities in Metrc.

**Parameters:**
```typescript
{
  facilityId: string;
  adjustments: [{
    Label: string;
    Quantity: number;
    UnitOfMeasure: string;
    AdjustmentReason: string;
    AdjustmentDate: string;
    ReasonNote?: string;
  }];
}
```

---

## 🌱 Plants Functions

### `syncVegetativePlants`
Sync vegetative plants from Metrc to Firestore.

**Parameters:**
```typescript
{
  facilityId: string;
  lastModifiedStart?: string;
  lastModifiedEnd?: string;
}
```

**Returns:**
```typescript
{
  success: boolean;
  plantsSynced: number;
  timestamp: string;
}
```

### `syncFloweringPlants`
Sync flowering plants from Metrc to Firestore.

**Parameters:** Same as `syncVegetativePlants`

### `syncPlantBatches`
Sync plant batches from Metrc to Firestore.

**Parameters:**
```typescript
{
  facilityId: string;
  active?: boolean; // default: true
}
```

**Returns:**
```typescript
{
  success: boolean;
  batchesSynced: number;
  timestamp: string;
}
```

### `createPlantBatch`
Create new plant batch in Metrc.

**Parameters:**
```typescript
{
  facilityId: string;
  batches: [{
    name: string;
    type: string;
    count: number;
    strainName: string;
    location?: string;
    actualDate?: string;
  }];
}
```

**Returns:**
```typescript
{
  success: boolean;
  batchesCreated: number;
  timestamp: string;
}
```

### `changePlantGrowthPhase`
Change growth phase for plants.

**Parameters:**
```typescript
{
  facilityId: string;
  plantLabels: string[];
  newGrowthPhase: 'Vegetative' | 'Flowering';
  changeDate?: string;
}
```

**Returns:**
```typescript
{
  success: boolean;
  plantsUpdated: number;
  timestamp: string;
}
```

### `harvestPlants`
Harvest plants in Metrc.

**Parameters:**
```typescript
{
  facilityId: string;
  harvests: [{
    plantLabel: string;
    weight: number;
    unitOfWeight: string;
    dryingLocation: string;
    harvestName: string;
    actualDate?: string;
  }];
}
```

**Returns:**
```typescript
{
  success: boolean;
  plantsHarvested: number;
  timestamp: string;
}
```

### `movePlants`
Move plants to new location.

**Parameters:**
```typescript
{
  facilityId: string;
  plantLabels: string[];
  newLocation: string;
  moveDate?: string;
}
```

**Returns:**
```typescript
{
  success: boolean;
  plantsMoved: number;
  timestamp: string;
}
```

### `destroyPlants`
Record plant waste/destruction.

**Parameters:**
```typescript
{
  facilityId: string;
  destructions: [{
    plantLabel: string;
    wasteMethod: string;
    wasteWeight: number;
    wasteUnitOfMeasure: string;
    wasteReason?: string;
    reasonNote?: string;
    actualDate?: string;
  }];
}
```

**Returns:**
```typescript
{
  success: boolean;
  plantsDestroyed: number;
  timestamp: string;
}
```

---

## 🚚 Transfers Functions

### `syncIncomingTransfers`
Sync incoming transfers from Metrc to Firestore.

**Parameters:**
```typescript
{
  facilityId: string;
  lastModifiedStart?: string;
  lastModifiedEnd?: string;
}
```

**Returns:**
```typescript
{
  success: boolean;
  transfersSynced: number;
  timestamp: string;
}
```

### `syncOutgoingTransfers`
Sync outgoing transfers from Metrc to Firestore.

**Parameters:** Same as `syncIncomingTransfers`

### `getTransferDeliveries`
Get deliveries for a specific transfer.

**Parameters:**
```typescript
{
  facilityId: string;
  transferId: number;
}
```

**Returns:**
```typescript
{
  success: boolean;
  deliveries: any[];
  timestamp: string;
}
```

### `createTransferManifest`
Create outgoing transfer manifest.

**Parameters:**
```typescript
{
  facilityId: string;
  transfer: {
    shipperFacilityLicenseNumber: string;
    shipmentLicenseType: string;
    shipmentTransactionType: string;
    shipperFacilityName: string;
    driverName: string;
    driverLicenseNumber: string;
    vehicleMake: string;
    vehicleModel: string;
    vehicleLicensePlateNumber: string;
    destinations: [{
      recipientFacilityLicenseNumber: string;
      transferTypeName: string;
      estimatedArrivalDateTime: string;
      plannedRoute?: string;
      transporters?: any[];
      packages: [{
        packageLabel: string;
        wholesalePrice?: number;
      }];
    }];
  };
}
```

**Returns:**
```typescript
{
  success: boolean;
  timestamp: string;
}
```

### `updateTransferDeparture`
Update transfer departure time.

**Parameters:**
```typescript
{
  facilityId: string;
  transferId: number;
  actualDepartureDateTime: string;
}
```

**Returns:**
```typescript
{
  success: boolean;
  timestamp: string;
}
```

### `receiveTransfer`
Receive/accept transfer packages.

**Parameters:**
```typescript
{
  facilityId: string;
  transferId: number;
  packages: [{
    packageLabel: string;
    shipmentPackageState?: 'Accepted' | 'Rejected';
    shipmentTransactionType: string;
    receivedQuantity: number;
    receivedUnitOfMeasure: string;
  }];
}
```

**Returns:**
```typescript
{
  success: boolean;
  packagesReceived: number;
  timestamp: string;
}
```

### `rejectTransferPackages`
Reject transfer packages.

**Parameters:**
```typescript
{
  facilityId: string;
  transferId: number;
  packages: [{
    packageLabel: string;
    rejectionReason: string;
    rejectionNote?: string;
  }];
}
```

**Returns:**
```typescript
{
  success: boolean;
  packagesRejected: number;
  timestamp: string;
}
```

---

## 💰 Sales Functions

### `syncSalesReceipts`
Sync sales receipts from Metrc to Firestore.

**Parameters:**
```typescript
{
  facilityId: string;
  active?: boolean; // default: true
  lastModifiedStart?: string;
  lastModifiedEnd?: string;
}
```

**Returns:**
```typescript
{
  success: boolean;
  receiptsSynced: number;
  timestamp: string;
}
```

### `syncSalesDeliveries`
Sync sales deliveries from Metrc to Firestore.

**Parameters:**
```typescript
{
  facilityId: string;
  active?: boolean; // default: true
}
```

**Returns:**
```typescript
{
  success: boolean;
  deliveriesSynced: number;
  timestamp: string;
}
```

### `createSalesReceipt`
Create new sales receipt.

**Parameters:**
```typescript
{
  facilityId: string;
  receipt: {
    salesDateTime?: string;
    salesCustomerType: string;
    patientLicenseNumber?: string;
    caregiverLicenseNumber?: string;
    identificationMethod?: string;
    transactions: [{
      packageLabel: string;
      quantity: number;
      unitOfMeasure: string;
      totalAmount: number;
    }];
  };
}
```

**Returns:**
```typescript
{
  success: boolean;
  timestamp: string;
}
```

### `createSalesDelivery`
Create new sales delivery.

**Parameters:**
```typescript
{
  facilityId: string;
  delivery: {
    recipientName: string;
    recipientAddressStreet1: string;
    recipientAddressStreet2?: string;
    recipientAddressCity: string;
    recipientAddressState: string;
    recipientAddressPostalCode: string;
    plannedRoute?: string;
    estimatedDepartureDateTime: string;
    estimatedArrivalDateTime: string;
    salesDateTime?: string;
    salesCustomerType: string;
    driverName: string;
    driverLicenseNumber: string;
    driverVehicleLicenseNumber: string;
    vehicleMake: string;
    vehicleModel: string;
    vehicleLicensePlateNumber: string;
    transactions: [{
      packageLabel: string;
      quantity: number;
      unitOfMeasure: string;
      totalAmount: number;
    }];
  };
}
```

**Returns:**
```typescript
{
  success: boolean;
  timestamp: string;
}
```

### `finalizeSalesReceipt`
Finalize a sales receipt.

**Parameters:**
```typescript
{
  facilityId: string;
  receiptId: number;
}
```

**Returns:**
```typescript
{
  success: boolean;
  timestamp: string;
}
```

### `unfinalizeSalesReceipt`
Unfinalize a sales receipt.

**Parameters:** Same as `finalizeSalesReceipt`

### `completeSalesDelivery`
Complete a sales delivery.

**Parameters:**
```typescript
{
  facilityId: string;
  deliveryId: number;
  actualArrivalDateTime?: string;
}
```

**Returns:**
```typescript
{
  success: boolean;
  timestamp: string;
}
```

---

## 🤖 Scheduled Sync Functions

These functions run automatically in the background. You don't call them directly.

### `hourlyIncrementalSync`
- **Schedule:** Every hour at minute 0
- **Action:** Syncs modified data for all enabled facilities
- **Data:** Packages, Plants, Transfers, Sales Receipts

### `dailyFullSync`
- **Schedule:** Every day at 2:00 AM
- **Action:** Full sync of all data for all enabled facilities
- **Data:** All data types, regardless of modification time

### `retryFailedSyncs`
- **Schedule:** Every 6 hours
- **Action:** Retries facilities with failed syncs in past 24 hours
- **Data:** All data types for failed facilities

**Enable scheduled sync for a facility:**
```typescript
await updateDoc(doc(db, 'facilities', 'facility-123'), {
  metrcSyncEnabled: true,
});
```

---

## 📊 Firestore Collections Created

All functions write to these Firestore collections:

```
facilities/{facilityId}/
├── packages/{packageId}           # Package data
├── plants/{plantId}                # Plant data
├── plantBatches/{batchId}          # Plant batch data
├── transfers/{transferId}          # Transfer data
├── salesReceipts/{receiptId}       # Sales receipt data
├── salesDeliveries/{deliveryId}    # Sales delivery data
├── metrcLogs/{logId}               # Audit logs
└── syncStatus/
    ├── packages                    # Package sync status
    ├── plants_vegetative           # Veg plants sync status
    ├── plants_flowering            # Flowering plants sync status
    ├── plantBatches                # Plant batches sync status
    ├── transfers_incoming          # Incoming transfers sync status
    ├── transfers_outgoing          # Outgoing transfers sync status
    ├── salesReceipts               # Sales receipts sync status
    └── salesDeliveries             # Sales deliveries sync status

syncLogs/{logId}                    # Scheduled sync logs
```

---

## 🔒 Authentication

All callable functions require Firebase Authentication. Scheduled functions run automatically.

**Example usage with auth:**
```typescript
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getAuth } from 'firebase/auth';

// Ensure user is authenticated
const auth = getAuth();
if (!auth.currentUser) {
  throw new Error('Must be logged in');
}

const functions = getFunctions();
const syncPackages = httpsCallable(functions, 'syncActivePackages');

const result = await syncPackages({ facilityId: 'facility-123' });
```

---

## 🚨 Error Handling

All functions throw `HttpsError` on failure:

```typescript
try {
  const result = await syncPackages({ facilityId: 'facility-123' });
  console.log('Success:', result.data);
} catch (error: any) {
  console.error('Error code:', error.code);
  console.error('Error message:', error.message);

  // Common error codes:
  // 'unauthenticated' - User not logged in
  // 'invalid-argument' - Missing required parameters
  // 'internal' - Metrc API error or server error
}
```

---

## 📚 Additional Resources

- [Full Documentation](./README-METRC.md)
- [Quick Start Guide](./QUICK-START-METRC.md)
- [Metrc Minnesota API Docs](https://api-mn.metrc.com/Documentation)
