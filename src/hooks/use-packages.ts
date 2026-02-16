"use client";

import { useState, useEffect } from "react";
import { collection, query, onSnapshot, orderBy, limit, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Package {
  id: string;
  metrcId: number;
  label: string;
  packageType: string;
  productName: string;
  productCategoryName: string;
  quantity: number;
  unitOfMeasure: string;
  itemName: string | null;
  strainName: string | null;
  isOnHold: boolean;
  isTesting: boolean;
  labTestingState: string | null;
  packagedDate: string | null;
  lastModified: string;
  syncedAt: Date;
  facilityId: string;
}

export function usePackages(facilityId: string, limitCount: number = 100) {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!facilityId) {
      setLoading(false);
      return;
    }

    const packagesRef = collection(db, `facilities/${facilityId}/packages`);
    const q = query(
      packagesRef,
      orderBy('lastModified', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const packagesData: Package[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          syncedAt: doc.data().syncedAt?.toDate() || new Date(),
        })) as Package[];

        setPackages(packagesData);
        setLoading(false);
      },
      (err) => {
        console.error('Error listening to packages:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [facilityId, limitCount]);

  return { packages, loading, error };
}
