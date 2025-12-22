
import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';

function initializeAdminApp() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  try {
    const serviceAccountBase64 = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64;
    if (!serviceAccountBase64) {
      throw new Error('FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64 env variable is not set.');
    }
    const serviceAccountJson = Buffer.from(serviceAccountBase64, 'base64').toString('utf-8');
    const serviceAccount = JSON.parse(serviceAccountJson) as ServiceAccount;

    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (e: unknown) {
    let errorMessage = 'Failed to initialize Firebase Admin SDK.';
    if (e instanceof Error) {
      errorMessage = `${errorMessage} Reason: ${e.message}`;
    }
    console.error(errorMessage);
    // Throw the error to halt server startup if the Admin SDK is critical.
    throw new Error(errorMessage);
  }
}

// Initialize the app right away
const adminApp = initializeAdminApp();

// Export functions that return the initialized services
export const getAdminDb = () => admin.firestore(adminApp);
export const getAdminAuth = () => admin.auth(adminApp);

// For convenience, you can also export the initialized instances directly
// if the import order is carefully managed, but functions are safer.
export const adminDb = getAdminDb();
export const adminAuth = getAdminAuth();
