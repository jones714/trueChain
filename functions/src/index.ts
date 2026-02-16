/**
 * Cloud Functions for TruChain
 *
 * Main entry point for all Firebase Cloud Functions
 */

import * as admin from "firebase-admin";

// Initialize Firebase Admin
admin.initializeApp();

// Export all Metrc functions
export * from "./metrc/endpoints/packages";
export * from "./metrc/endpoints/plants";
export * from "./metrc/endpoints/transfers";
export * from "./metrc/endpoints/sales";
