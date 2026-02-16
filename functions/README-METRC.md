# Metrc API Integration - Cloud Functions

Complete Firebase Cloud Functions integration with Metrc Minnesota Cannabis Tracking System API.

---

## 🎯 What's Been Created

### ✅ Core Infrastructure
1. **`src/metrc/api/client.ts`** - Metrc API client with authentication
2. **`src/metrc/types/index.ts`** - Complete TypeScript types for all Metrc entities
3. **`src/metrc/endpoints/packages.ts`** - Full package management functions
4. **`src/metrc/endpoints/plants.ts`** - Complete plant tracking and lifecycle management
5. **`src/metrc/endpoints/transfers.ts`** - Transfer manifest and delivery management
6. **`src/metrc/endpoints/sales.ts`** - Sales receipts and delivery tracking
7. **`src/metrc/sync/scheduledSync.ts`** - Automatic background sync jobs

### 🔧 Features Implemented

#### Packages Module
- ✅ Sync active packages from Metrc → Firestore
- ✅ Get package details by ID
- ✅ Create new packages in Metrc
- ✅ Adjust package quantities
- ✅ Auto-sync on Firestore package creation (trigger)
- ✅ Error handling and retry logic
- ✅ Audit logging

#### Plants Module
- ✅ Sync vegetative and flowering plants
- ✅ Sync plant batches (active/inactive)
- ✅ Create plant batches
- ✅ Change plant growth phases
- ✅ Harvest plants
- ✅ Move plants between locations
- ✅ Record plant waste/destruction

#### Transfers Module
- ✅ Sync incoming and outgoing transfers
- ✅ Get transfer deliveries with package details
- ✅ Create transfer manifests
- ✅ Update transfer departure times
- ✅ Receive/accept transfer packages
- ✅ Reject transfer packages

#### Sales Module
- ✅ Sync sales receipts (active/inactive)
- ✅ Sync sales deliveries
- ✅ Create sales receipts
- ✅ Create sales deliveries
- ✅ Finalize/unfinalize receipts
- ✅ Complete deliveries

#### Scheduled Sync Jobs
- ✅ Hourly incremental sync (modified data only)
- ✅ Daily full sync (all data)
- ✅ Retry failed syncs every 6 hours
- ✅ Configurable per-facility sync schedules

---

## 📁 Project Structure

```
functions/
└── src/
    └── metrc/
        ├── api/
        │   └── client.ts              # ✅ Metrc API client
        ├── types/
        │   └── index.ts               # ✅ TypeScript definitions
        ├── endpoints/
        │   ├── packages.ts            # ✅ Package management
        │   ├── plants.ts              # ✅ Plant tracking
        │   ├── transfers.ts           # ✅ Transfer manifests
        │   └── sales.ts               # ✅ Sales receipts
        ├── sync/
        │   └── scheduledSync.ts       # ✅ Scheduled jobs
        └── utils/
            └── validation.ts          # Optional: Data validation
```

---

## 🚀 How to Use

### Setup

#### 1. Install Dependencies

```bash
cd functions
npm install axios firebase-functions firebase-admin
```

#### 2. Configure Environment Variables

Create `functions/.env`:

```bash
# Metrc API Credentials
METRC_API_KEY=your_api_key_here
METRC_LICENSE_NUMBER=your_license_number_here
METRC_SANDBOX=true  # Set to false for production

# Or leave empty to use per-facility credentials from Firestore
```

#### 3. Deploy Functions

```bash
# Deploy all functions
firebase deploy --only functions

# Deploy specific function
firebase deploy --only functions:syncActivePackages
```

---

## 📖 Usage Examples

### From Your App (Web or Mobile)

#### Sync Packages from Metrc

```typescript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const syncPackages = httpsCallable(functions, 'syncActivePackages');

// Sync all active packages
const result = await syncPackages({
  facilityId: 'facility-123',
});

console.log(`Synced ${result.data.packagesSynced} packages`);

// Sync packages modified in last 24 hours
const result = await syncPackages({
  facilityId: 'facility-123',
  lastModifiedStart: '2025-10-23T00:00:00Z',
  lastModifiedEnd: '2025-10-24T00:00:00Z',
});
```

#### Get Specific Package

```typescript
const getPackage = httpsCallable(functions, 'getPackageById');

const result = await getPackage({
  facilityId: 'facility-123',
  packageId: 12345,
});

console.log('Package:', result.data.package);
```

#### Create Packages in Metrc

```typescript
const createPackages = httpsCallable(functions, 'createPackages');

const result = await createPackages({
  facilityId: 'facility-123',
  packages: [
    {
      tag: 'ABCDEF012345670000010041',
      location: 'Flower Room A',
      itemName: 'Blue Dream Flower',
      quantity: 100,
      unitOfMeasure: 'Grams',
      note: 'Harvested from Batch 001',
      packagedDate: '2025-10-24',
    },
    // ... more packages
  ],
});

console.log(`Created ${result.data.packagesCreated} packages`);
```

#### Adjust Package Quantity

```typescript
const adjustQuantity = httpsCallable(functions, 'adjustPackageQuantity');

const result = await adjustQuantity({
  facilityId: 'facility-123',
  adjustments: [
    {
      Label: 'ABCDEF012345670000010041',
      Quantity: -5.5,
      UnitOfMeasure: 'Grams',
      AdjustmentReason: 'Drying Loss',
      AdjustmentDate: '2025-10-24',
      ReasonNote: 'Weight loss during curing process',
    },
  ],
});
```

#### Move Plants Between Locations

```typescript
const movePlants = httpsCallable(functions, 'movePlants');

const result = await movePlants({
  facilityId: 'facility-123',
  plantLabels: ['1A4FF01000000220000010', '1A4FF01000000220000011'],
  newLocation: 'Flower Room B',
  moveDate: '2025-10-24',
});
```

### 3. Transfers Module

#### Sync Incoming Transfers

```typescript
const syncIncoming = httpsCallable(functions, 'syncIncomingTransfers');

const result = await syncIncoming({
  facilityId: 'facility-123',
  lastModifiedStart: '2025-10-23T00:00:00Z',
  lastModifiedEnd: '2025-10-24T00:00:00Z',
});

console.log(`Synced ${result.data.transfersSynced} incoming transfers`);
```

#### Create Transfer Manifest

```typescript
const createManifest = httpsCallable(functions, 'createTransferManifest');

await createManifest({
  facilityId: 'facility-123',
  transfer: {
    shipperFacilityLicenseNumber: 'ABC-000001',
    shipmentLicenseType: 'Medical',
    shipmentTransactionType: 'Standard',
    shipperFacilityName: 'Main Cultivation',
    driverName: 'John Doe',
    driverLicenseNumber: 'D1234567',
    vehicleMake: 'Toyota',
    vehicleModel: 'Tacoma',
    vehicleLicensePlateNumber: 'ABC123',
    destinations: [{
      recipientFacilityLicenseNumber: 'DEF-000002',
      transferTypeName: 'Wholesale',
      estimatedArrivalDateTime: '2025-10-25T14:00:00Z',
      plannedRoute: 'I-94 to US-52',
      transporters: [],
      packages: [
        { packageLabel: 'ABCDEF012345670000010041', wholesalePrice: 500 },
        { packageLabel: 'ABCDEF012345670000010042', wholesalePrice: 750 },
      ],
    }],
  },
});
```

#### Receive Transfer

```typescript
const receiveTransfer = httpsCallable(functions, 'receiveTransfer');

await receiveTransfer({
  facilityId: 'facility-123',
  transferId: 12345,
  packages: [
    {
      packageLabel: 'ABCDEF012345670000010041',
      shipmentPackageState: 'Accepted',
      shipmentTransactionType: 'Standard',
      receivedQuantity: 100,
      receivedUnitOfMeasure: 'Grams',
    },
  ],
});
```

### 4. Sales Module

#### Sync Sales Receipts

```typescript
const syncSales = httpsCallable(functions, 'syncSalesReceipts');

const result = await syncSales({
  facilityId: 'facility-123',
  active: true,
  lastModifiedStart: '2025-10-23T00:00:00Z',
});

console.log(`Synced ${result.data.receiptsSynced} sales receipts`);
```

#### Create Sales Receipt

```typescript
const createReceipt = httpsCallable(functions, 'createSalesReceipt');

await createReceipt({
  facilityId: 'facility-123',
  receipt: {
    salesDateTime: '2025-10-24T15:30:00Z',
    salesCustomerType: 'Consumer',
    patientLicenseNumber: null,
    identificationMethod: 'DriversLicense',
    transactions: [
      {
        packageLabel: 'ABCDEF012345670000010041',
        quantity: 3.5,
        unitOfMeasure: 'Grams',
        totalAmount: 45.00,
      },
      {
        packageLabel: 'ABCDEF012345670000010042',
        quantity: 1,
        unitOfMeasure: 'Each',
        totalAmount: 15.00,
      },
    ],
  },
});
```

#### Create Sales Delivery

```typescript
const createDelivery = httpsCallable(functions, 'createSalesDelivery');

await createDelivery({
  facilityId: 'facility-123',
  delivery: {
    recipientName: 'Jane Smith',
    recipientAddressStreet1: '123 Main St',
    recipientAddressCity: 'Minneapolis',
    recipientAddressState: 'MN',
    recipientAddressPostalCode: '55401',
    plannedRoute: 'Highway 35W',
    estimatedDepartureDateTime: '2025-10-24T10:00:00Z',
    estimatedArrivalDateTime: '2025-10-24T11:00:00Z',
    salesDateTime: '2025-10-24T09:00:00Z',
    salesCustomerType: 'Consumer',
    driverName: 'Bob Johnson',
    driverLicenseNumber: 'D7654321',
    driverVehicleLicenseNumber: 'VIN123456',
    vehicleMake: 'Ford',
    vehicleModel: 'Transit',
    vehicleLicensePlateNumber: 'XYZ789',
    transactions: [
      {
        packageLabel: 'ABCDEF012345670000010041',
        quantity: 3.5,
        unitOfMeasure: 'Grams',
        totalAmount: 45.00,
      },
    ],
  },
});
```

#### Finalize Sales Receipt

```typescript
const finalizeReceipt = httpsCallable(functions, 'finalizeSalesReceipt');

await finalizeReceipt({
  facilityId: 'facility-123',
  receiptId: 67890,
});
```

---

## 🔄 Automatic Sync (Firestore Triggers)

Packages are automatically synced to Metrc when created in Firestore:

```typescript
// In your app, create a package in Firestore
await addDoc(collection(db, 'facilities/facility-123/packages'), {
  label: 'ABCDEF012345670000010041',
  itemName: 'Blue Dream Flower',
  quantity: 100,
  unitOfMeasure: 'Grams',
  location: 'Flower Room A',
  packagedDate: new Date().toISOString(),
  // localOnly: false,  // Set to true to skip Metrc sync
});

// The onPackageCreated trigger will automatically:
// 1. Create the package in Metrc
// 2. Update the Firestore document with metrcSyncStatus: 'synced'
// 3. Handle errors and update metrcSyncStatus: 'error' if it fails
```

---

## 🔐 Authentication Strategies

### Option 1: Single Facility (Environment Variables)

Best for single-facility operations:

```bash
# functions/.env
METRC_API_KEY=sk_test_1234567890abcdef
METRC_LICENSE_NUMBER=ABC-000001
METRC_SANDBOX=true
```

### Option 2: Multi-Facility (Firestore)

Best for multi-facility operations:

```typescript
// Store credentials in Firestore per facility
await setDoc(doc(db, 'facilities', 'facility-123'), {
  name: 'Main Cultivation Facility',
  metrcApiKey: 'sk_live_facility1_key',
  metrcLicenseNumber: 'ABC-000001',
  metrcSandbox: false,
  // ... other facility data
});
```

The Cloud Functions will automatically use the correct credentials based on `facilityId`.

---

## 📊 Firestore Data Structure

### Packages Collection

```
facilities/{facilityId}/packages/{packageId}
```

**Document Structure:**
```typescript
{
  // Metrc data
  metrcId: 12345,
  label: 'ABCDEF012345670000010041',
  packageType: 'Product',
  productName: 'Blue Dream Flower',
  productCategoryName: 'Buds',
  quantity: 100,
  unitOfMeasure: 'Grams',

  // Item details
  itemId: 789,
  itemName: 'Blue Dream Flower',
  strainId: 456,
  strainName: 'Blue Dream',

  // Status
  isProductionBatch: false,
  isTesting: false,
  isOnHold: false,
  labTestingState: 'NotSubmitted',

  // Dates
  packagedDate: '2025-10-24T12:00:00Z',
  receivedDateTime: null,
  finishedDate: null,
  lastModified: '2025-10-24T12:00:00Z',

  // Sync metadata
  syncedAt: Timestamp,
  syncedBy: 'user-uid-123',
  facilityId: 'facility-123',
  metrcSyncStatus: 'synced', // 'pending', 'synced', 'error'
  metrcSyncError: null,

  // Full Metrc object for reference
  metrcData: { /* complete Metrc response */ }
}
```

### Sync Status Collection

```
facilities/{facilityId}/syncStatus/packages
```

**Document Structure:**
```typescript
{
  lastSyncAt: Timestamp,
  lastSyncBy: 'user-uid-123',
  packageCount: 150,
  status: 'success', // 'success', 'error'
  error: null,
}
```

### Metrc Logs Collection

```
facilities/{facilityId}/metrcLogs/{logId}
```

**Document Structure:**
```typescript
{
  action: 'createPackage', // 'createPackage', 'adjustPackage', etc.
  packageTag: 'ABCDEF012345670000010041',
  timestamp: Timestamp,
  userId: 'user-uid-123',
  status: 'success',
  details: { /* operation-specific data */ }
}
```

---

## 🎨 UI Integration Examples

### React/React Native Component

```typescript
import { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';

function PackageSyncButton({ facilityId }: { facilityId: string }) {
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const functions = getFunctions();
      const syncPackages = httpsCallable(functions, 'syncActivePackages');

      const response = await syncPackages({ facilityId });
      setResult(response.data);

      alert(`Successfully synced ${response.data.packagesSynced} packages!`);
    } catch (error: any) {
      console.error('Sync failed:', error);
      alert(`Sync failed: ${error.message}`);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div>
      <button onClick={handleSync} disabled={syncing}>
        {syncing ? 'Syncing...' : 'Sync from Metrc'}
      </button>

      {result && (
        <div>
          <p>Last sync: {result.timestamp}</p>
          <p>Packages synced: {result.packagesSynced}</p>
        </div>
      )}
    </div>
  );
}
```

### Real-time Sync Status

```typescript
import { doc, onSnapshot } from 'firebase/firestore';

function useSyncStatus(facilityId: string) {
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'facilities', facilityId, 'syncStatus', 'packages'),
      (doc) => {
        setStatus(doc.data());
      }
    );

    return () => unsubscribe();
  }, [facilityId]);

  return status;
}

// In your component
function SyncStatusDisplay({ facilityId }: { facilityId: string }) {
  const status = useSyncStatus(facilityId);

  if (!status) return <div>No sync history</div>;

  return (
    <div>
      <p>Status: {status.status}</p>
      <p>Last sync: {status.lastSyncAt?.toDate().toLocaleString()}</p>
      <p>Package count: {status.packageCount}</p>
      {status.error && <p style={{ color: 'red' }}>Error: {status.error}</p>}
    </div>
  );
}
```

---

## 🤖 Scheduled Sync Jobs

Automatic background syncing keeps your Firestore database in sync with Metrc without manual intervention.

### Hourly Incremental Sync

Runs every hour and syncs only data that has been modified since the last sync. This is efficient and keeps your data up-to-date throughout the day.

```typescript
// Automatically runs at minute 0 of every hour
// Syncs: Packages, Plants, Transfers, Sales Receipts
// For all facilities with metrcSyncEnabled: true
```

**Enable for a facility:**
```typescript
await updateDoc(doc(db, 'facilities', 'facility-123'), {
  metrcSyncEnabled: true,
  metrcSandbox: false,
  metrcApiKey: 'your-api-key',
  metrcLicenseNumber: 'ABC-000001',
});
```

### Daily Full Sync

Runs once per day at 2 AM and syncs all data regardless of modification time. This ensures complete data integrity.

```typescript
// Automatically runs at 2:00 AM every day
// Full sync of all data types for all enabled facilities
```

### Retry Failed Syncs

Runs every 6 hours and retries any facilities that had sync errors in the past 24 hours.

```typescript
// Automatically runs every 6 hours
// Finds facilities with failed syncs and retries them
```

### View Sync Logs

```typescript
// Query sync logs
const logsRef = collection(db, 'syncLogs');
const q = query(logsRef, orderBy('timestamp', 'desc'), limit(10));
const snapshot = await getDocs(q);

snapshot.forEach((doc) => {
  console.log(doc.data());
  // {
  //   type: 'hourly_incremental',
  //   timestamp: Timestamp,
  //   facilitiesCount: 5,
  //   packagesCount: 150,
  //   plantsCount: 300,
  //   transfersCount: 12,
  //   receiptsCount: 45,
  //   status: 'success'
  // }
});
```

### View Per-Facility Sync Status

```typescript
// Check sync status for a specific facility
const statusRef = collection(db, 'facilities/facility-123/syncStatus');
const statusSnapshot = await getDocs(statusRef);

statusSnapshot.forEach((doc) => {
  console.log(doc.id, doc.data());
  // packages: { lastSyncAt: Timestamp, packageCount: 150, status: 'success' }
  // plants: { lastSyncAt: Timestamp, plantCount: 300, status: 'success' }
  // transfers: { lastSyncAt: Timestamp, transferCount: 12, status: 'success' }
  // salesReceipts: { lastSyncAt: Timestamp, receiptCount: 45, status: 'success' }
});
```

---

## 🎉 What's Included - Complete Feature List

All major Metrc modules are now implemented and ready to use:

### ✅ Packages
- Sync active packages
- Get package by ID
- Create packages
- Adjust quantities
- Auto-sync trigger

### ✅ Plants
- Sync vegetative/flowering plants
- Sync plant batches
- Create plant batches
- Change growth phases
- Harvest plants
- Move plants
- Destroy plants

### ✅ Transfers
- Sync incoming/outgoing transfers
- Get transfer deliveries
- Create transfer manifests
- Update departure times
- Receive packages
- Reject packages

### ✅ Sales
- Sync sales receipts
- Sync sales deliveries
- Create receipts
- Create deliveries
- Finalize/unfinalize receipts
- Complete deliveries

### ✅ Scheduled Sync
- Hourly incremental sync
- Daily full sync
- Retry failed syncs
- Per-facility configuration

---

## 🔍 Testing

### Test in Firebase Emulator

```bash
# Start emulators
firebase emulators:start

# Test functions locally
curl -X POST http://localhost:5001/your-project/us-central1/syncActivePackages \
  -H "Content-Type: application/json" \
  -d '{"data":{"facilityId":"facility-123"}}'
```

### Test in Production (carefully!)

```typescript
// In your app's dev/test environment
const functions = getFunctions();

// Point to emulator if testing locally
if (process.env.NODE_ENV === 'development') {
  connectFunctionsEmulator(functions, 'localhost', 5001);
}

const syncPackages = httpsCallable(functions, 'syncActivePackages');
```

---

## ⚠️ Important Considerations

### Rate Limiting
- Metrc has rate limits (not specified in docs)
- Implement exponential backoff for retries
- Use batching for large operations
- Consider queuing system for high-volume operations

### Error Handling
- ✅ Already implemented in packages module
- All functions catch and log errors
- Firestore documents updated with error status
- Failed syncs can be retried manually

### Compliance
- All Metrc operations are logged in `metrcLogs` collection
- Maintain audit trail for compliance
- Never delete Metrc logs (compliance requirement)
- Store full Metrc responses for reference

### Security
- ✅ All functions require authentication
- Store API keys securely (never in code)
- Use Firebase Security Rules to restrict access
- Implement role-based access control

---

## 📚 Resources

- [Metrc Minnesota API Docs](https://api-mn.metrc.com/Documentation)
- [Firebase Cloud Functions](https://firebase.google.com/docs/functions)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

---

## 🤝 Need Help?

I can help you with:
- Building additional Metrc endpoints (Plants, Transfers, Sales, etc.)
- Creating scheduled sync jobs
- Adding validation and error handling
- Setting up webhooks (if Metrc supports them)
- Building UI components for your app
- Optimizing performance and costs

Just let me know what you want to tackle next! 🚀
