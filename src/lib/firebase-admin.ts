
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
    // Simplified credential setup using individual environment variables
    const serviceAccount: ServiceAccount = {
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      // Replace newline characters from the environment variable
      privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    };
    
    // Check if the required environment variables are set
    if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
      console.warn(
        'WARNING: Firebase Admin credentials are not fully set in .env.local. ' +
        'Server-side data fetching will be disabled. ' +
        'See README.md for setup instructions.'
      );
      return undefined;
    }

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
