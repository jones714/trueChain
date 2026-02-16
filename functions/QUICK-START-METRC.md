# Metrc Integration - Quick Start Guide

Get up and running with Metrc API integration in 15 minutes.

---

## ✅ What You Have

I've created:
1. ✅ **Complete Metrc API Client** - Handles auth, rate limiting, errors
2. ✅ **TypeScript Types** - All Metrc entities fully typed
3. ✅ **Packages Module** - Full CRUD operations for packages
4. ✅ **Auto-sync Triggers** - Automatic Firestore ↔ Metrc sync
5. ✅ **Error Handling** - Comprehensive error logging and retry logic

---

## 🚀 5-Minute Setup

### Step 1: Install Dependencies

```bash
cd functions
npm install axios firebase-functions firebase-admin
```

### Step 2: Set Environment Variables

Create `functions/.env`:

```bash
METRC_API_KEY=your_metrc_api_key_here
METRC_LICENSE_NUMBER=your_license_number
METRC_SANDBOX=true
```

**Where to get these:**
- API Key: From your Metrc account settings
- License Number: Your state-issued cannabis license number
- Sandbox: `true` for testing, `false` for production

### Step 3: Deploy to Firebase

```bash
firebase deploy --only functions
```

That's it! Your functions are live! 🎉

---

## 🎯 Try It Out

### From Your Web App

```typescript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const syncPackages = httpsCallable(functions, 'syncActivePackages');

// Sync packages from Metrc
const result = await syncPackages({
  facilityId: 'your-facility-id'
});

console.log(`Synced ${result.data.packagesSynced} packages!`);
```

### From Your React Native App

```typescript
import { getFunctions, httpsCallable } from '@react-native-firebase/functions';

const functions = getFunctions();
const syncPackages = httpsCallable(functions, 'syncActivePackages');

// Same code as web!
const result = await syncPackages({
  facilityId: 'your-facility-id'
});
```

---

## 📦 What You Can Do Right Now

### 1. Sync Packages from Metrc

```typescript
// Get all active packages
await syncPackages({ facilityId: 'facility-123' });

// Get packages modified in last 24 hours
await syncPackages({
  facilityId: 'facility-123',
  lastModifiedStart: '2025-10-23T00:00:00Z',
  lastModifiedEnd: '2025-10-24T00:00:00Z',
});
```

### 2. Create Package in Metrc

```typescript
const createPackages = httpsCallable(functions, 'createPackages');

await createPackages({
  facilityId: 'facility-123',
  packages: [{
    tag: 'ABCDEF012345670000010041',
    location: 'Flower Room A',
    itemName: 'Blue Dream Flower',
    quantity: 100,
    unitOfMeasure: 'Grams',
  }]
});
```

### 3. Auto-Sync (No Code Required!)

Just create a package in Firestore:

```typescript
await addDoc(collection(db, 'facilities/facility-123/packages'), {
  label: 'ABCDEF012345670000010041',
  itemName: 'Blue Dream Flower',
  quantity: 100,
  unitOfMeasure: 'Grams',
  location: 'Flower Room A',
});

// It automatically syncs to Metrc! ✨
```

---

## 🎨 Add to Your UI

### Simple Sync Button (React/React Native)

```typescript
function SyncButton() {
  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    setLoading(true);
    try {
      const functions = getFunctions();
      const sync = httpsCallable(functions, 'syncActivePackages');
      const result = await sync({ facilityId: 'facility-123' });

      alert(`Synced ${result.data.packagesSynced} packages!`);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <button onClick={handleSync} disabled={loading}>
      {loading ? 'Syncing...' : 'Sync from Metrc'}
    </button>
  );
}
```

---

## 📊 Check Sync Status

View sync status in Firestore:

```
facilities/{facilityId}/syncStatus/packages
```

```typescript
{
  lastSyncAt: Timestamp(2025-10-24 12:00:00),
  packageCount: 150,
  status: 'success'
}
```

---

## 🐛 Troubleshooting

### "Authentication failed"
- ✅ Check your `METRC_API_KEY` in `.env`
- ✅ Make sure key is for Minnesota (`api-mn.metrc.com`)
- ✅ Verify key has correct permissions

### "Forbidden - check license number"
- ✅ Check `METRC_LICENSE_NUMBER` matches your facility
- ✅ Make sure format is correct (e.g., `ABC-000001`)

### "No response received"
- ✅ Check if Metrc API is down: https://status.metrc.com
- ✅ Verify sandbox vs production URL

### "Rate limit exceeded"
- ✅ Slow down your requests
- ✅ Implement delays between syncs
- ✅ Use the scheduled sync jobs instead

---

## 🎉 What Else Is Available?

All major Metrc modules are now fully implemented and ready to use!

### ✅ Plants Module (Ready!)
- Sync vegetative/flowering plants
- Create plant batches
- Move plants between growth phases
- Record harvests
- Track plant waste/destruction

**Try it:**
```typescript
const syncPlants = httpsCallable(functions, 'syncVegetativePlants');
await syncPlants({ facilityId: 'facility-123' });
```

### ✅ Transfers Module (Ready!)
- Create manifests
- Track incoming/outgoing transfers
- Receive transfers
- Update transfer status

**Try it:**
```typescript
const syncTransfers = httpsCallable(functions, 'syncIncomingTransfers');
await syncTransfers({ facilityId: 'facility-123' });
```

### ✅ Sales Module (Ready!)
- Create sales receipts
- Track transactions
- Finalize/unfinalize receipts
- Manage deliveries

**Try it:**
```typescript
const syncSales = httpsCallable(functions, 'syncSalesReceipts');
await syncSales({ facilityId: 'facility-123', active: true });
```

### ✅ Scheduled Syncs (Ready!)
- Hourly incremental sync
- Daily full sync at 2 AM
- Retry failed syncs every 6 hours

**Enable it:**
```typescript
await updateDoc(doc(db, 'facilities', 'facility-123'), {
  metrcSyncEnabled: true,
});
```

---

## 💬 Need Help?

All modules are complete! Common next steps:

- **"Help me test the integration"** - I can help you test with Metrc sandbox
- **"I'm getting an error: [paste error]"** - Share any errors you encounter
- **"How do I [specific task]?"** - Ask about any specific Metrc operation
- **"Help me build the UI"** - I can create React/React Native components
- **"Show me security best practices"** - Learn about securing your Metrc integration

I'm here to help! 🚀

---

## 📚 Full Documentation

See `README-METRC.md` for complete documentation including:
- All available functions
- Firestore data structures
- Advanced usage examples
- Security best practices
- Testing guides
