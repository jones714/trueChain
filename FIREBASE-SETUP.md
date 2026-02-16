# Firebase Setup Guide for TruChain

Complete guide to set up Firebase for your TruChain application.

---

## 🔥 Firebase Project Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `truechain` (or your preferred name)
4. Enable Google Analytics (optional but recommended)
5. Click "Create project"

### Step 2: Register Web App

1. In Firebase Console, click the web icon `</>`
2. Enter app nickname: "TruChain Web"
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. **Copy the Firebase configuration** - you'll need this!

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
  measurementId: "G-XXXXXXXXXX"
};
```

### Step 3: Update Environment Variables

Edit `.env.local` with your Firebase config:

```bash
# Firebase Configuration (from Firebase Console > Project Settings > General)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Use Firebase Emulators for local development (optional)
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=false

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:9002
```

---

## 🔐 Enable Firebase Authentication

### Step 1: Enable Email/Password Auth

1. In Firebase Console, go to **Build > Authentication**
2. Click "Get started"
3. Click "Sign-in method" tab
4. Click "Email/Password"
5. Toggle "Enable"
6. Click "Save"

### Step 2: (Optional) Enable Google Sign-In

1. Click "Google" provider
2. Toggle "Enable"
3. Enter project support email
4. Click "Save"

---

## 📊 Set Up Firestore Database

### Step 1: Create Database

1. In Firebase Console, go to **Build > Firestore Database**
2. Click "Create database"
3. Choose "Start in **production mode**" (we'll add rules next)
4. Select a location (choose closest to your users)
5. Click "Enable"

### Step 2: Create Firestore Collections

Run these commands in the Firestore console to create initial structure:

**Users Collection:**
```javascript
// Collection: users
// Document ID: {userId}
{
  uid: string,
  email: string,
  displayName: string,
  role: "admin" | "manager" | "cultivator" | "retail_clerk" | "medical_provider",
  facilityIds: [],
  primaryFacilityId: null,
  onboardingCompleted: false,
  metrcApiKey: string (optional),
  metrcLicenseNumber: string (optional),
  metrcSandbox: boolean (optional),
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**Facilities Collection:**
```javascript
// Collection: facilities
// Document ID: auto-generated
{
  name: string,
  address: string,
  metrcApiKey: string,
  metrcLicenseNumber: string,
  metrcSandbox: boolean,
  metrcSyncEnabled: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Step 3: Set Up Security Rules

Go to **Firestore > Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }

    // Helper function to check if user is admin
    function isAdmin() {
      return isAuthenticated() &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Users collection
    match /users/{userId} {
      // Users can read their own profile
      allow read: if isAuthenticated() && request.auth.uid == userId;
      // Users can update their own profile
      allow update: if isAuthenticated() && request.auth.uid == userId;
      // Only system can create (via Cloud Functions or during signup)
      allow create: if isAuthenticated() && request.auth.uid == userId;
      // Admins can read all users
      allow read: if isAdmin();
    }

    // Facilities collection
    match /facilities/{facilityId} {
      // Users can read facilities they have access to
      allow read: if isAuthenticated();
      // Only admins can create/update/delete facilities
      allow create, update, delete: if isAdmin();

      // Sync status subcollection (read-only for users, write-only for Cloud Functions)
      match /syncStatus/{statusId} {
        allow read: if isAuthenticated();
        allow write: if false; // Only Cloud Functions can write
      }

      // Packages subcollection
      match /packages/{packageId} {
        allow read: if isAuthenticated();
        allow write: if isAuthenticated();
      }

      // Plants subcollection
      match /plants/{plantId} {
        allow read: if isAuthenticated();
        allow write: if isAuthenticated();
      }

      // Transfers subcollection
      match /transfers/{transferId} {
        allow read: if isAuthenticated();
        allow write: if isAuthenticated();
      }

      // Sales Receipts subcollection
      match /salesReceipts/{receiptId} {
        allow read: if isAuthenticated();
        allow write: if isAuthenticated();
      }

      // Metrc Logs subcollection
      match /metrcLogs/{logId} {
        allow read: if isAuthenticated();
        allow write: if false; // Only Cloud Functions can write
      }
    }

    // Sync Logs collection (read-only for admins)
    match /syncLogs/{logId} {
      allow read: if isAdmin();
      allow write: if false; // Only Cloud Functions can write
    }
  }
}
```

Click "Publish" to deploy the rules.

---

## ☁️ Deploy Cloud Functions

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

### Step 3: Initialize Firebase Functions

If not already done:

```bash
cd functions
npm install
```

### Step 4: Set Environment Variables for Functions

```bash
cd functions
firebase functions:config:set metrc.api_key="your-sandbox-api-key"
firebase functions:config:set metrc.license_number="ABC-000001"
firebase functions:config:set metrc.sandbox="true"
```

Or create `functions/.env`:

```bash
METRC_API_KEY=your-sandbox-api-key
METRC_LICENSE_NUMBER=ABC-000001
METRC_SANDBOX=true
```

### Step 5: Deploy Functions

```bash
firebase deploy --only functions
```

This will deploy all 22 Metrc Cloud Functions.

---

## 🚀 Running the App

### Option 1: Production Mode

```bash
# Build the app
npm run build

# Start production server
npm start
```

### Option 2: Development Mode (Current)

```bash
# Start dev server on port 9002
npm run dev
```

App will be available at: **http://localhost:9002**

---

## 🎯 Testing Firebase Connection

### Step 1: Create a Test User

1. Navigate to http://localhost:9002/login
2. Click "Sign Up"
3. Enter:
   - Email: test@example.com
   - Password: password123
   - Name: Test User
4. Click "Create Account"

### Step 2: Complete Onboarding

You'll be redirected to `/onboarding`:

1. **Step 1 - Profile**: Enter your name and select role
2. **Step 2 - Facility**: Enter facility details (optional)
3. **Step 3 - Metrc**: Enter your Metrc Sandbox credentials
   - API Key: Your Metrc sandbox API key
   - License Number: Your Metrc test license number
   - Keep "Use Sandbox" toggled ON
4. Click "Complete Setup"

### Step 3: Test Metrc Sync

1. Navigate to http://localhost:9002/admin/metrc-sync
2. Click "Sync Now" on any data type
3. Check the console for success/error messages

---

## 🔧 Using Firebase Emulators (Optional)

For local development without using production Firebase:

### Step 1: Install Emulators

```bash
firebase init emulators
```

Select:
- Authentication Emulator
- Firestore Emulator
- Functions Emulator
- Storage Emulator

### Step 2: Start Emulators

```bash
firebase emulators:start
```

### Step 3: Update Environment

```bash
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true
```

### Step 4: Restart Dev Server

```bash
npm run dev
```

Emulator UI will be at: http://localhost:4000

---

## 📝 Next Steps

### 1. Add Your Metrc Sandbox API Key

1. Go to https://sandbox-mn.metrc.com
2. Login to your account
3. Navigate to Settings > API Keys
4. Create a new API key
5. Copy the key and add it during onboarding

### 2. Test All Features

- ✅ User sign up/sign in
- ✅ Onboarding flow
- ✅ Dashboard view
- ✅ Metrc sync management
- ✅ Manual sync triggers
- ✅ Facility configuration

### 3. Deploy to Production

When ready for production:

1. Update `.env.local` with production Firebase config
2. Set `METRC_SANDBOX=false` for production Metrc
3. Deploy Cloud Functions: `firebase deploy --only functions`
4. Deploy hosting: `firebase deploy --only hosting`

---

## 🐛 Troubleshooting

### Firebase Auth Errors

**Error: "Firebase: Error (auth/configuration-not-found)"**
- **Solution**: Make sure you've added Firebase config to `.env.local`
- Restart dev server after updating `.env.local`

### Firestore Permission Denied

**Error: "Missing or insufficient permissions"**
- **Solution**: Check Firestore security rules are published
- Make sure user is authenticated
- Verify user role for admin-only operations

### Cloud Functions Not Working

**Error: "Function not found"**
- **Solution**: Deploy functions: `firebase deploy --only functions`
- Check function names match exactly (case-sensitive)
- Verify Firebase project is correct

### Metrc Sync Fails

**Error: "Authentication failed"**
- **Solution**: Check Metrc API key is correct
- Verify license number matches facility
- Make sure using correct environment (sandbox vs production)

---

## 📚 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Firebase Guide](https://firebase.google.com/docs/web/setup)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Cloud Functions Documentation](https://firebase.google.com/docs/functions)
- [Metrc Minnesota API](https://api-mn.metrc.com/Documentation)

---

## ✅ Setup Checklist

- [ ] Created Firebase project
- [ ] Registered web app
- [ ] Updated `.env.local` with Firebase config
- [ ] Enabled Email/Password authentication
- [ ] Created Firestore database
- [ ] Published Firestore security rules
- [ ] Deployed Cloud Functions
- [ ] Tested user signup/signin
- [ ] Completed onboarding flow
- [ ] Added Metrc API credentials
- [ ] Tested Metrc sync functionality

---

Your Firebase setup is complete! 🎉

The app is now fully connected and ready to use at **http://localhost:9002**
