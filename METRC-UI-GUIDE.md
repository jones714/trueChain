# Metrc UI Integration Guide

Complete guide for using the Metrc sync UI components in TruChain.

---

## 🎨 UI Components Created

### 1. **Metrc Sync Dashboard** (`/admin/metrc-sync`)

Complete management dashboard for Metrc synchronization.

**Features:**
- Real-time sync status for all data types
- Manual sync triggers with one-click buttons
- Sync history logs with detailed statistics
- Schedule configuration and monitoring
- Overall health metrics

**Access:**
```
http://localhost:3000/admin/metrc-sync
```

---

### 2. **Metrc Configuration Form** (`components/metrc-config-form.tsx`)

Reusable component for configuring Metrc credentials per facility.

**Usage:**
```typescript
import { MetrcConfigForm } from "@/components/metrc-config-form";

function FacilitySettings({ facilityId }: { facilityId: string }) {
  return (
    <MetrcConfigForm
      facilityId={facilityId}
      initialConfig={{
        metrcApiKey: "sk_live_...",
        metrcLicenseNumber: "ABC-000001",
        metrcSandbox: true,
        metrcSyncEnabled: false,
      }}
    />
  );
}
```

**Features:**
- Environment selection (Sandbox/Production)
- API key and license number inputs
- Connection testing
- Auto-sync toggle
- Save to Firestore

---

### 3. **Metrc Sync Button** (`components/metrc-sync-button.tsx`)

Reusable sync button for any page.

**Usage:**
```typescript
import { MetrcSyncButton } from "@/components/metrc-sync-button";

function InventoryPage() {
  return (
    <div>
      <PageHeader title="Inventory">
        <MetrcSyncButton
          dataType="packages"
          facilityId="facility-123"
          variant="outline"
          size="sm"
          showLabel={true}
        />
      </PageHeader>
      {/* ... rest of page */}
    </div>
  );
}
```

**Props:**
- `dataType`: 'packages' | 'plants' | 'transfers' | 'sales'
- `facilityId`: string (defaults to 'facility-123')
- `variant`: 'default' | 'outline' | 'ghost'
- `size`: 'default' | 'sm' | 'lg' | 'icon'
- `showLabel`: boolean (default: true)
- `className`: string (optional)

---

## 🪝 React Hooks

### 1. **useMetrcSync** (`hooks/use-metrc-sync.ts`)

Hook for calling Metrc sync Cloud Functions.

**Usage:**
```typescript
import { useMetrcSync } from "@/hooks/use-metrc-sync";

function SyncComponent() {
  const {
    loading,
    error,
    syncPackages,
    syncVegetativePlants,
    syncIncomingTransfers,
    syncSalesReceipts,
  } = useMetrcSync();

  const handleSync = async () => {
    try {
      const result = await syncPackages({
        facilityId: 'facility-123',
        lastModifiedStart: '2025-10-23T00:00:00Z',
        lastModifiedEnd: '2025-10-24T00:00:00Z',
      });

      console.log('Synced:', result?.packagesSynced, 'packages');
    } catch (err) {
      console.error('Sync failed:', err);
    }
  };

  return (
    <Button onClick={handleSync} disabled={loading}>
      {loading ? 'Syncing...' : 'Sync Packages'}
    </Button>
  );
}
```

**Available Functions:**
- `syncPackages(options)` - Sync packages
- `syncVegetativePlants(options)` - Sync vegetative plants
- `syncFloweringPlants(options)` - Sync flowering plants
- `syncPlantBatches(options)` - Sync plant batches
- `syncIncomingTransfers(options)` - Sync incoming transfers
- `syncOutgoingTransfers(options)` - Sync outgoing transfers
- `syncSalesReceipts(options)` - Sync sales receipts
- `syncSalesDeliveries(options)` - Sync sales deliveries

---

### 2. **useMetrcSyncStatus** (`hooks/use-metrc-status.ts`)

Hook for monitoring real-time sync status.

**Usage:**
```typescript
import { useMetrcSyncStatus } from "@/hooks/use-metrc-status";

function SyncStatusWidget({ facilityId }: { facilityId: string }) {
  const { syncStatuses, loading, error } = useMetrcSyncStatus(facilityId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {syncStatuses.map((status) => (
        <div key={status.dataType}>
          <h4>{status.dataType}</h4>
          <p>Status: {status.status}</p>
          <p>Count: {status.count}</p>
          <p>Last sync: {status.lastSyncAt?.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
```

---

### 3. **useMetrcSyncLogs** (`hooks/use-metrc-status.ts`)

Hook for monitoring global sync logs.

**Usage:**
```typescript
import { useMetrcSyncLogs } from "@/hooks/use-metrc-status";

function SyncLogsTable() {
  const { syncLogs, loading } = useMetrcSyncLogs(10); // Last 10 logs

  return (
    <Table>
      {syncLogs.map((log) => (
        <TableRow key={log.id}>
          <TableCell>{log.type}</TableCell>
          <TableCell>{log.timestamp.toLocaleString()}</TableCell>
          <TableCell>{log.packagesCount}</TableCell>
          <TableCell>{log.plantsCount}</TableCell>
        </TableRow>
      ))}
    </Table>
  );
}
```

---

### 4. **useMetrcSyncHealth** (`hooks/use-metrc-status.ts`)

Hook for overall sync health metrics.

**Usage:**
```typescript
import { useMetrcSyncHealth } from "@/hooks/use-metrc-status";

function SyncHealthBadge({ facilityId }: { facilityId: string }) {
  const { isHealthy, hasErrors, errorCount, totalItems, loading } =
    useMetrcSyncHealth(facilityId);

  if (loading) return <Skeleton />;

  return (
    <Badge variant={isHealthy ? "default" : "destructive"}>
      {isHealthy ? "Healthy" : `${errorCount} Errors`}
    </Badge>
  );
}
```

---

## 🚀 Integration Examples

### Add Sync to Inventory Page

```typescript
// src/app/(app)/inventory/page.tsx

import { MetrcSyncButton } from "@/components/metrc-sync-button";

export default function InventoryPage() {
  return (
    <PageContainer>
      <PageHeader title="Inventory">
        <MetrcSyncButton dataType="packages" />
      </PageHeader>
      {/* ... rest of page */}
    </PageContainer>
  );
}
```

---

### Add Sync to Plants Page

```typescript
// src/app/(app)/plants/page.tsx

import { MetrcSyncButton } from "@/components/metrc-sync-button";

export default function PlantsPage() {
  return (
    <PageContainer>
      <PageHeader title="Plants">
        <MetrcSyncButton dataType="plants" />
      </PageHeader>
      {/* ... rest of page */}
    </PageContainer>
  );
}
```

---

### Add Sync to Transfers Page

```typescript
// src/app/(app)/transfers/page.tsx

import { MetrcSyncButton } from "@/components/metrc-sync-button";

export default function TransfersPage() {
  return (
    <PageContainer>
      <PageHeader title="Transfers">
        <MetrcSyncButton dataType="transfers" />
      </PageHeader>
      {/* ... rest of page */}
    </PageContainer>
  );
}
```

---

### Add Sync to Sales Page

```typescript
// src/app/(app)/sales/page.tsx

import { MetrcSyncButton } from "@/components/metrc-sync-button";

export default function SalesPage() {
  return (
    <PageContainer>
      <PageHeader title="Sales">
        <MetrcSyncButton dataType="sales" />
      </PageHeader>
      {/* ... rest of page */}
    </PageContainer>
  );
}
```

---

### Add Configuration to Facility Settings

```typescript
// src/app/(app)/admin/facilities/[id]/page.tsx

import { MetrcConfigForm } from "@/components/metrc-config-form";

export default function FacilitySettingsPage({ params }: { params: { id: string } }) {
  return (
    <PageContainer>
      <PageHeader title="Facility Settings" />

      <div className="space-y-6">
        {/* Other facility settings */}

        <MetrcConfigForm facilityId={params.id} />
      </div>
    </PageContainer>
  );
}
```

---

## 📊 Real-Time Monitoring

### Dashboard Widget with Live Status

```typescript
import { useMetrcSyncHealth } from "@/hooks/use-metrc-status";
import { CheckCircle2, XCircle, RefreshCw } from "lucide-react";

function MetrcStatusWidget({ facilityId }: { facilityId: string }) {
  const { isHealthy, hasErrors, lastSyncTime, totalItems, errorCount } =
    useMetrcSyncHealth(facilityId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isHealthy ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-destructive" />
          )}
          Metrc Sync Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Health:</span>
            <Badge variant={isHealthy ? "default" : "destructive"}>
              {isHealthy ? "Operational" : `${errorCount} Errors`}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span>Items Synced:</span>
            <span className="font-medium">{totalItems}</span>
          </div>
          <div className="flex justify-between">
            <span>Last Sync:</span>
            <span className="font-medium">
              {lastSyncTime ? lastSyncTime.toLocaleTimeString() : 'Never'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## 🎨 Styling Guide

All components use Shadcn UI and Tailwind CSS, matching your existing design system.

### Color Scheme

- **Success**: `text-green-500`, `bg-green-500/10`
- **Error**: `text-destructive`, `bg-destructive/10`
- **Running**: `text-blue-500`, `bg-blue-500/10`
- **Pending**: `text-yellow-500`, `bg-yellow-500/10`

### Icons

- **Sync**: `RefreshCw`
- **Success**: `CheckCircle2`
- **Error**: `XCircle`
- **Warning**: `AlertTriangle`
- **Running**: `RefreshCw` with `animate-spin`

---

## 🔒 Security Considerations

### API Key Storage

Metrc API keys are stored securely in Firestore:

```typescript
facilities/{facilityId}/
  - metrcApiKey: string (encrypted in production)
  - metrcLicenseNumber: string
  - metrcSandbox: boolean
  - metrcSyncEnabled: boolean
```

**Best Practices:**
1. Never expose API keys in client code
2. Use Firebase Security Rules to restrict access
3. Only authenticated admins should view/edit credentials
4. Rotate API keys regularly

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only admins can read/write Metrc credentials
    match /facilities/{facilityId} {
      allow read: if request.auth != null &&
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow write: if request.auth != null &&
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // All authenticated users can read sync status
    match /facilities/{facilityId}/syncStatus/{statusId} {
      allow read: if request.auth != null;
      allow write: if false; // Only Cloud Functions can write
    }

    // Sync logs are read-only for admins
    match /syncLogs/{logId} {
      allow read: if request.auth != null &&
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow write: if false; // Only Cloud Functions can write
    }
  }
}
```

---

## 🚀 Deployment Checklist

### 1. Deploy Cloud Functions

```bash
cd functions
firebase deploy --only functions
```

### 2. Configure Firestore Indexes

The app will prompt you to create indexes. Alternatively:

```bash
firebase deploy --only firestore:indexes
```

### 3. Set Up Facility Credentials

For each facility:
1. Navigate to `/admin/facilities/{facilityId}`
2. Add Metrc API key and license number
3. Test connection
4. Enable auto-sync

### 4. Verify Scheduled Jobs

Check Firebase Console → Functions → Scheduled:
- `hourlyIncrementalSync` - Every hour
- `dailyFullSync` - Daily at 2 AM
- `retryFailedSyncs` - Every 6 hours

---

## 📈 Monitoring & Alerts

### View Sync Logs

```
/admin/metrc-sync → Logs Tab
```

### Check Sync Health

```
/dashboard → Metrc Status Widget (click to view details)
```

### Error Notifications

Errors appear in:
1. Dashboard alerts feed
2. Notification center
3. `/admin/metrc-sync` error badges

---

## 🎯 Next Steps

1. **Add to Navigation**: Link to `/admin/metrc-sync` from admin menu
2. **Customize Schedules**: Modify cron schedules in Cloud Functions
3. **Add Webhooks**: Implement Metrc webhooks if available
4. **Build Reports**: Create compliance reports from synced data
5. **Mobile UI**: Adapt components for React Native (future)

---

## 💬 Support

For questions or issues:
- Check `/functions/README-METRC.md` for Cloud Functions docs
- Review `/functions/QUICK-START-METRC.md` for setup guide
- See `/functions/METRC-FUNCTIONS-REFERENCE.md` for API reference

Happy syncing! 🚀
