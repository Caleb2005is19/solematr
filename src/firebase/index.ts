'use client';
import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

// Re-export hooks and providers
export * from './provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';

// Initializes and returns a Firebase object with app, auth, and firestore instances.
// It ensures that Firebase is initialized only once.
export function initializeFirebase(): {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
} {
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  // NOTE: In a real environment, you might want to conditionally connect to emulators,
  // for example, only in development mode.
  // Example: if (process.env.NODE_ENV === 'development') { ... }
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    // Set up emulators
    console.log('Connecting to Firebase emulators');
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
  }

  return { app, auth, firestore };
}
