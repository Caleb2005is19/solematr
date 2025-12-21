
import admin from 'firebase-admin';

// This is a singleton to prevent re-initializing the app on every server-side render in development.
// In production, the serverless function environment will handle this.
if (!admin.apps.length) {
  try {
    // The FIREBASE_CONFIG env var is set automatically by Firebase App Hosting.
    // This is the recommended way to initialize in a server environment.
    admin.initializeApp();
  } catch (error) {
    // If the above fails (e.g., when running locally without the emulator),
    // we fall back to using a service account key.
    console.warn('Admin SDK initialization failed with default credentials, falling back to service account. Error:', error);
    try {
        const serviceAccount = require('../../adminiii/key.json');
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    } catch (e) {
        console.error('Failed to initialize Firebase Admin SDK with service account.', e);
        console.error('Please ensure the service account key exists at `adminiii/key.json` or that Firebase default credentials are set up.');
    }
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();

    