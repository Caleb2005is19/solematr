'use client';
import React, { createContext, useContext, useMemo } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { initializeFirebase } from '.';
import { useUser } from './auth/use-user';


type FirebaseContextValue = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

const FirebaseContext = createContext<FirebaseContextValue | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const firebase = useMemo(() => initializeFirebase(), []);
  return <FirebaseContext.Provider value={firebase}>{children}</FirebaseContext.Provider>;
};

// Hook to access the full Firebase context
export const useFirebase = (): FirebaseContextValue => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

// Hooks for specific Firebase services
export const useFirebaseApp = (): FirebaseApp => useFirebase().app;
export const useFirestore = (): Firestore => useFirebase().firestore;
export const useAuth = (): Auth & { user: import('firebase/auth').User | null } => {
    const { user } = useUser();
    const auth = useFirebase().auth;
    return Object.assign(auth, { user });
};

// Re-export from index for convenience
export { useCollection, useDoc } from '.';
