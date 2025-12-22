
import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';

// This function is memoized, so it only runs once.
let adminApp: admin.App | undefined;

function initializeAdminApp(): admin.App | undefined {
  if (adminApp) {
    return adminApp;
  }
  
  // Return if already initialized
  if (admin.apps.length > 0) {
    adminApp = admin.app();
    return adminApp;
  }

  try {
    const serviceAccountBase64 = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64;
    if (!serviceAccountBase64) {
      // This is not a fatal error for local development or client-side rendering.
      // Server-side functions will gracefully fail.
      console.warn(
        'WARNING: FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64 is not set. ' +
        'Server-side data fetching will be disabled. ' +
        'See README.md for setup instructions.'
      );
      return undefined;
    }
    const serviceAccountJson = Buffer.from(serviceAccountBase64, 'base64').toString('utf-8');
    const serviceAccount = JSON.parse(serviceAccountJson) as ServiceAccount;

    adminApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    return adminApp;

  } catch (e: unknown) {
    let errorMessage = 'Failed to initialize Firebase Admin SDK.';
    if (e instanceof Error) {
      errorMessage = `${errorMessage} Reason: ${e.message}`;
    }
    console.error(errorMessage);
    // Don't throw here, as it can crash the server during build/dev
    return undefined;
  }
}

// Initialize on module load
initializeAdminApp();

// Export functions that return the initialized services
export const getAdminDb = (): FirebaseFirestore.Firestore | null => {
  const app = initializeAdminApp();
  return app ? admin.firestore(app) : null;
};

export const getAdminAuth = (): admin.auth.Auth | null => {
  const app = initializeAdminApp();
  return app ? admin.auth(app) : null;
};

// For convenience, export the instances directly.
// They will be null if the app isn't initialized.
export const adminDb = getAdminDb();
export const adminAuth = getAdminAuth();
