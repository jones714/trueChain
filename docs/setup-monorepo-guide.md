# TruChain Monorepo Setup Guide

This guide will help you set up a monorepo to share code between web (Next.js) and mobile (React Native/Expo).

---

## Step 1: Install Turborepo

Turborepo makes managing monorepos easy with fast builds and caching.

```bash
cd /Users/qjones/Dev
npx create-turbo@latest truechain-monorepo
# Choose: npm
# Choose: No (for Remote Caching for now)
```

---

## Step 2: Project Structure

We'll create this structure:

```
truechain-monorepo/
├── apps/
│   ├── web/          # Your existing Next.js app
│   └── mobile/       # New Expo app
├── packages/
│   ├── shared/       # Shared code
│   └── ui/           # Shared UI (optional)
├── package.json
├── turbo.json
└── pnpm-workspace.yaml (or package.json workspaces)
```

---

## Step 3: Move Your Existing App

```bash
# Navigate to the new monorepo
cd truechain-monorepo

# Create apps directory if it doesn't exist
mkdir -p apps

# Copy your existing trueChain app to apps/web
cp -r /Users/qjones/Dev/trueChain apps/web

# Clean up
cd apps/web
rm -rf node_modules
rm -rf .next
rm package-lock.json
```

---

## Step 4: Create Mobile App with Expo

```bash
cd apps
npx create-expo-app mobile --template blank-typescript

# This creates:
# apps/mobile/
#   ├── app/           # Expo Router (like Next.js routing!)
#   ├── components/
#   ├── app.json
#   └── package.json
```

---

## Step 5: Create Shared Package

```bash
cd ../packages
mkdir -p shared/src
cd shared

# Create package.json
cat > package.json << 'EOF'
{
  "name": "@truechain/shared",
  "version": "0.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "firebase": "^11.7.3",
    "@tanstack/react-query": "^5.66.0",
    "zod": "^3.24.2",
    "date-fns": "^3.6.0"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20"
  }
}
EOF
```

---

## Step 6: Configure Root package.json

```bash
cd ../..  # Back to root

# If using npm workspaces, update root package.json:
```

```json
{
  "name": "truechain-monorepo",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "typecheck": "turbo run typecheck",
    "clean": "turbo run clean"
  },
  "devDependencies": {
    "turbo": "latest"
  },
  "packageManager": "npm@10.0.0"
}
```

---

## Step 7: Configure Turborepo

Create/update `turbo.json`:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "typecheck": {
      "dependsOn": ["^typecheck"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

---

## Step 8: Update Web App to Use Shared Package

In `apps/web/package.json`, add:

```json
{
  "dependencies": {
    "@truechain/shared": "*",
    // ... other dependencies
  }
}
```

In `apps/web/tsconfig.json`, update:

```json
{
  "compilerOptions": {
    // ... existing options
    "paths": {
      "@/*": ["./src/*"],
      "@truechain/shared": ["../../packages/shared/src"]
    }
  }
}
```

---

## Step 9: Update Mobile App to Use Shared Package

In `apps/mobile/package.json`, add:

```json
{
  "dependencies": {
    "@truechain/shared": "*",
    // ... other dependencies
  }
}
```

In `apps/mobile/tsconfig.json`, add:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@truechain/shared": ["../../packages/shared/src"]
    }
  }
}
```

---

## Step 10: Install Dependencies

```bash
# From root
npm install

# This installs all dependencies for all workspaces
```

---

## Step 11: Test the Setup

```bash
# Run web app
npm run dev --workspace=apps/web
# Should open on http://localhost:9002

# Run mobile app (in a new terminal)
npm run dev --workspace=apps/mobile
# Should open Expo dev tools
```

---

## Next Steps After Setup

Once the monorepo is working, we'll:

1. **Extract shared code** from web app to `packages/shared`
2. **Set up Firebase** in shared package
3. **Create mobile UI** components
4. **Build features** incrementally

---

## Troubleshooting

### Issue: "Cannot find module '@truechain/shared'"

**Solution**: Make sure you've run `npm install` from the root directory.

### Issue: TypeScript errors in shared package

**Solution**: Make sure `packages/shared/tsconfig.json` exists:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "jsx": "react-native",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### Issue: Metro bundler can't resolve shared package

**Solution**: Add to `apps/mobile/metro.config.js`:

```javascript
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add shared package to watchFolders
config.watchFolders = [
  path.resolve(__dirname, '../../packages/shared'),
];

// Add node_modules resolution
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(__dirname, '../../node_modules'),
];

module.exports = config;
```

---

## Commands Reference

```bash
# Run web app
npm run dev --workspace=apps/web

# Run mobile app
npm run dev --workspace=apps/mobile

# Build all apps
npm run build

# Type check all apps
npm run typecheck

# Install a package in web app
npm install <package> --workspace=apps/web

# Install a package in mobile app
npm install <package> --workspace=apps/mobile

# Install a package in shared
npm install <package> --workspace=packages/shared
```

---

## Ready to Go!

Once this is set up, we can start extracting shared code and building the mobile app. Let me know when you're ready for the next step!
