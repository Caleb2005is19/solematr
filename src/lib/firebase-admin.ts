
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

  const {
    FIREBASE_ADMIN_PROJECT_ID: projectId,
    FIREBASE_ADMIN_CLIENT_EMAIL: clientEmail,
    FIREBASE_ADMIN_PRIVATE_KEY: privateKey,
  } = process.env;

  try {
    if (!projectId || !clientEmail || !privateKey) {
      console.warn(
        'WARNING: Firebase Admin credentials are not fully set in environment variables. ' +
        'Server-side data fetching will be disabled. ' +
        'Required variables: FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY. ' +
        'See README.md for setup instructions.'
      );
      return undefined;
    }

    const serviceAccount: ServiceAccount = {
      projectId,
      clientEmail,
      // The private key from the environment variable needs its newlines restored.
      privateKey: privateKey.replace(/\\n/g, '\n'),
    };

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
