
import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';

// This singleton ensures that the Firebase Admin SDK is initialized only once.
if (!admin.apps.length) {
  try {
    // In a deployed environment (like Vercel or Firebase Hosting),
    // you would use environment variables.
    const serviceAccountBase64 = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64;

    if (!serviceAccountBase64) {
      throw new Error(
        'FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64 env variable is not set.'
      );
    }

    // Decode the base64 service account key
    const serviceAccountJson = Buffer.from(
      serviceAccountBase64,
      'base64'
    ).toString('utf-8');
    const serviceAccount = JSON.parse(serviceAccountJson) as ServiceAccount;

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin SDK initialized successfully.');
    
  } catch (e: unknown) {
    let errorMessage = 'Failed to initialize Firebase Admin SDK.';
    if (e instanceof Error) {
      errorMessage = `${errorMessage} Reason: ${e.message}`;
    }
    console.error(errorMessage);
    // In a real app, you might want to throw the error to halt server startup
    // if the Admin SDK is critical for the application's function.
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
