
import admin from 'firebase-admin';

// This is a singleton to prevent re-initializing the app on every server-side render in development.
if (!admin.apps.length) {
  try {
      const serviceAccount = require('../../adminiii/key.json');
      admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
      });
  } catch (e) {
      console.error('Failed to initialize Firebase Admin SDK with service account.', e);
      console.error('Please ensure the service account key exists at `adminiii/key.json`.');
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
