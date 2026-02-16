"use client";

import { useState, useEffect } from "react";
import { collection, doc, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface SyncStatus {
  dataType: string;
  lastSyncAt: Date | null;
  status: 'success' | 'error' | 'pending' | 'running';
  count: number;
  syncType?: 'incremental' | 'full';
  error?: string;
}

export interface SyncLog {
  id: string;
  type: string;
  timestamp: Date;
  status: 'success' | 'error';
  facilitiesCount?: number;
  packagesCount?: number;
  plantsCount?: number;
  transfersCount?: number;
  receiptsCount?: number;
  error?: string;
}

/**
 * Hook to monitor sync status for a specific facility
 */
export function useMetrcSyncStatus(facilityId: string) {
  const [syncStatuses, setSyncStatuses] = useState<SyncStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!facilityId) {
      setLoading(false);
      return;
    }

    const syncStatusRef = collection(db, 'facilities', facilityId, 'syncStatus');

    const unsubscribe = onSnapshot(
      syncStatusRef,
      (snapshot) => {
        const statuses: SyncStatus[] = [];

        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          statuses.push({
            dataType: doc.id,
            lastSyncAt: data.lastSyncAt?.toDate() || null,
            status: data.status || 'pending',
            count: data.packageCount || data.plantCount || data.transferCount || data.receiptCount || 0,
            syncType: data.syncType,
            error: data.error,
          });
        });

        setSyncStatuses(statuses);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching sync status:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [facilityId]);

  return { syncStatuses, loading, error };
}

/**
 * Hook to monitor global sync logs
 */
export function useMetrcSyncLogs(limitCount: number = 10) {
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const logsRef = collection(db, 'syncLogs');
    const logsQuery = query(logsRef, orderBy('timestamp', 'desc'), limit(limitCount));

    const unsubscribe = onSnapshot(
      logsQuery,
      (snapshot) => {
        const logs: SyncLog[] = [];

        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          logs.push({
            id: doc.id,
            type: data.type,
            timestamp: data.timestamp?.toDate() || new Date(),
            status: data.status,
            facilitiesCount: data.facilitiesCount,
            packagesCount: data.packagesCount,
            plantsCount: data.plantsCount,
            transfersCount: data.transfersCount,
            receiptsCount: data.receiptsCount,
            error: data.error,
          });
        });

        setSyncLogs(logs);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching sync logs:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [limitCount]);

  return { syncLogs, loading, error };
}

/**
 * Hook to get overall sync health
 */
export function useMetrcSyncHealth(facilityId: string) {
  const { syncStatuses, loading } = useMetrcSyncStatus(facilityId);

  const health = {
    isHealthy: syncStatuses.every(s => s.status === 'success'),
    hasErrors: syncStatuses.some(s => s.status === 'error'),
    isRunning: syncStatuses.some(s => s.status === 'running'),
    lastSyncTime: syncStatuses.reduce((latest, current) => {
      if (!current.lastSyncAt) return latest;
      if (!latest) return current.lastSyncAt;
      return current.lastSyncAt > latest ? current.lastSyncAt : latest;
    }, null as Date | null),
    errorCount: syncStatuses.filter(s => s.status === 'error').length,
    totalItems: syncStatuses.reduce((sum, s) => sum + s.count, 0),
  };

  return { ...health, loading };
}
