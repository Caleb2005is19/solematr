
import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';

// Use a unique name for the admin app instance to avoid conflicts.
const ADMIN_APP_NAME = 'solemate-admin-sdk';

/**
 * Initializes the Firebase Admin app with a lazy-loading, named-instance approach.
 * This is the most robust method for serverless environments like Vercel.
 * It ensures that the app is initialized only once and with the correct credentials.
 * @returns {admin.App} The initialized Firebase Admin app.
 */
function initializeAdminApp(): admin.App {
  // Check if the named app is already initialized. If so, return it.
  const existingApp = admin.apps.find(app => app?.name === ADMIN_APP_NAME);
  if (existingApp) {
    return existingApp;
  }

  const { FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64, NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET } = process.env;

  if (!FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64) {
    throw new Error(
      'CRITICAL: Firebase Admin credentials are not set. The `FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64` environment variable is missing. Server-side features will not work. See README.md for setup instructions.'
    );
  }

  try {
    const serviceAccountJson = Buffer.from(FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf-8');
    const serviceAccount = JSON.parse(serviceAccountJson) as ServiceAccount;

    // Initialize the app with a unique name.
    const newApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    }, ADMIN_APP_NAME);

    return newApp;

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

/**
 * Gets the Storage instance from the lazily-initialized admin app.
 * This is used for server-side file operations.
 * @returns {admin.storage.Storage} The Firebase Storage instance.
 */
export const getAdminStorage = (): admin.storage.Storage => {
  return initializeAdminApp().storage();
};
