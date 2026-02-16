"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// User profile stored in Firestore
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  role: 'admin' | 'manager' | 'cultivator' | 'retail_clerk' | 'medical_provider';
  facilityIds: string[]; // Facilities user has access to
  primaryFacilityId: string | null;
  createdAt: Date;
  updatedAt: Date;
  onboardingCompleted: boolean;

  // Metrc configuration
  metrcVendorKey?: string;
  metrcUserKey?: string;
  metrcLicenseNumber?: string;
  metrcSandbox?: boolean;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load user profile from Firestore
  const loadUserProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));

      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          uid,
          email: data.email,
          displayName: data.displayName,
          role: data.role || 'retail_clerk',
          facilityIds: data.facilityIds || [],
          primaryFacilityId: data.primaryFacilityId || null,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          onboardingCompleted: data.onboardingCompleted || false,
          metrcVendorKey: data.metrcVendorKey,
          metrcUserKey: data.metrcUserKey,
          metrcLicenseNumber: data.metrcLicenseNumber,
          metrcSandbox: data.metrcSandbox,
        };
      }

      return null;
    } catch (err) {
      console.error('Error loading user profile:', err);
      return null;
    }
  };

  // Create initial user profile in Firestore
  const createUserProfile = async (user: User, displayName: string) => {
    const userRef = doc(db, 'users', user.uid);

    const profile: Partial<UserProfile> = {
      uid: user.uid,
      email: user.email!,
      displayName: displayName,
      role: 'retail_clerk', // Default role
      facilityIds: [],
      primaryFacilityId: null,
      onboardingCompleted: false,
    };

    await setDoc(userRef, {
      ...profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return profile as UserProfile;
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        const profile = await loadUserProfile(firebaseUser.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign in
  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  // Sign up
  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Update display name
      await updateProfile(userCredential.user, { displayName });

      // Create user profile in Firestore
      const profile = await createUserProfile(userCredential.user, displayName);
      setUserProfile(profile);
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
      setUserProfile(null);
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  // Update user profile
  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');

    try {
      setError(null);
      const userRef = doc(db, 'users', user.uid);

      await setDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      // Refresh profile
      await refreshUserProfile();
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  // Refresh user profile
  const refreshUserProfile = async () => {
    if (!user) return;

    const profile = await loadUserProfile(user.uid);
    setUserProfile(profile);
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateUserProfile,
    refreshUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
