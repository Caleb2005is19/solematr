
import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';

let adminApp: admin.App | undefined;

/**
 * Initializes the Firebase Admin app with a lazy-loading approach.
 * The app is only initialized on its first use, ensuring that environment
 * variables are available.
 * @returns {admin.App} The initialized Firebase Admin app.
 */
function initializeAdminApp(): admin.App {
  // If the app is already initialized, return it.
  if (adminApp) {
    return adminApp;
  }
  
  // If there's already an app initialized (e.g., in a different context), use it.
  if (admin.apps.length > 0) {
    adminApp = admin.app();
    if (adminApp) {
        return adminApp;
    }
  }

  const { FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64 } = process.env;

  if (!FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64) {
    throw new Error(
      'CRITICAL: Firebase Admin credentials are not set. The `FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64` environment variable is missing. Server-side features will not work. See README.md for setup instructions.'
    );
  }

  try {
    const serviceAccountJson = Buffer.from(FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf-8');
    const serviceAccount = JSON.parse(serviceAccountJson) as ServiceAccount;

    adminApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    return adminApp;

  } catch (e: unknown) {
    let reason = 'The service account JSON might be malformed or invalid.';
    if (e instanceof Error) {
      reason = e.message;
    }
    throw new Error(
      `CRITICAL: Failed to initialize Firebase Admin SDK. Reason: ${reason}. Please check your FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64 environment variable.`
    );
  }
}

/**
 * Gets the Firestore database instance from the lazily-initialized admin app.
 * @returns {FirebaseFirestore.Firestore} The Firestore database instance.
 */
export const getAdminDb = (): FirebaseFirestore.Firestore => {
  return initializeAdminApp().firestore();
};

/**
 * Gets the Auth instance from the lazily-initialized admin app.
 * @returns {admin.auth.Auth} The Firebase Auth instance.
 */
export const getAdminAuth = (): admin.auth.Auth => {
  return initializeAdminApp().auth();
};
