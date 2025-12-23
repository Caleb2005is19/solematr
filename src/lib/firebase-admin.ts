
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

  const { FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64 } = process.env;

  try {
    if (!FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64) {
      console.warn(
        'WARNING: Firebase Admin credentials are not set in the `FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64` environment variable. ' +
        'Server-side data fetching will be disabled. ' +
        'See README.md for setup instructions.'
      );
      return undefined;
    }

    // Decode the base64 string to get the JSON service account object
    const serviceAccountJson = Buffer.from(FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf-8');
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
