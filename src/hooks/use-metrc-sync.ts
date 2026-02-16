"use client";

import { useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";

export interface SyncOptions {
  facilityId: string;
  lastModifiedStart?: string;
  lastModifiedEnd?: string;
}

export interface SyncResult {
  success: boolean;
  packagesSynced?: number;
  plantsSynced?: number;
  transfersSynced?: number;
  receiptsSynced?: number;
  batchesSynced?: number;
  timestamp: string;
}

export function useMetrcSync() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Packages
  const syncPackages = async (options: SyncOptions): Promise<SyncResult | null> => {
    setLoading(true);
    setError(null);
    try {
      const fn = httpsCallable<SyncOptions, SyncResult>(functions, 'syncActivePackages');
      const result = await fn(options);
      return result.data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Plants
  const syncVegetativePlants = async (options: SyncOptions): Promise<SyncResult | null> => {
    setLoading(true);
    setError(null);
    try {
      const fn = httpsCallable<SyncOptions, SyncResult>(functions, 'syncVegetativePlants');
      const result = await fn(options);
      return result.data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const syncFloweringPlants = async (options: SyncOptions): Promise<SyncResult | null> => {
    setLoading(true);
    setError(null);
    try {
      const fn = httpsCallable<SyncOptions, SyncResult>(functions, 'syncFloweringPlants');
      const result = await fn(options);
      return result.data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const syncPlantBatches = async (options: SyncOptions & { active?: boolean }): Promise<SyncResult | null> => {
    setLoading(true);
    setError(null);
    try {
      const fn = httpsCallable<SyncOptions, SyncResult>(functions, 'syncPlantBatches');
      const result = await fn(options);
      return result.data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Transfers
  const syncIncomingTransfers = async (options: SyncOptions): Promise<SyncResult | null> => {
    setLoading(true);
    setError(null);
    try {
      const fn = httpsCallable<SyncOptions, SyncResult>(functions, 'syncIncomingTransfers');
      const result = await fn(options);
      return result.data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const syncOutgoingTransfers = async (options: SyncOptions): Promise<SyncResult | null> => {
    setLoading(true);
    setError(null);
    try {
      const fn = httpsCallable<SyncOptions, SyncResult>(functions, 'syncOutgoingTransfers');
      const result = await fn(options);
      return result.data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sales
  const syncSalesReceipts = async (options: SyncOptions & { active?: boolean }): Promise<SyncResult | null> => {
    setLoading(true);
    setError(null);
    try {
      const fn = httpsCallable<SyncOptions, SyncResult>(functions, 'syncSalesReceipts');
      const result = await fn(options);
      return result.data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const syncSalesDeliveries = async (options: SyncOptions & { active?: boolean }): Promise<SyncResult | null> => {
    setLoading(true);
    setError(null);
    try {
      const fn = httpsCallable<SyncOptions, SyncResult>(functions, 'syncSalesDeliveries');
      const result = await fn(options);
      return result.data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    syncPackages,
    syncVegetativePlants,
    syncFloweringPlants,
    syncPlantBatches,
    syncIncomingTransfers,
    syncOutgoingTransfers,
    syncSalesReceipts,
    syncSalesDeliveries,
  };
}
