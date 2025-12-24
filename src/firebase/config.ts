
import type { FirebaseOptions } from 'firebase/app';

// This configuration is now loaded from environment variables
// to keep your project credentials secure.
// See the `.env.example` file for instructions on how to set them up.

export const firebaseConfig: FirebaseOptions = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
};

// A simple check to guide the user if the environment variables are not set.
if (
  !firebaseConfig.projectId ||
  !firebaseConfig.apiKey ||
  !firebaseConfig.authDomain ||
  !firebaseConfig.storageBucket
) {
  // In a real app, you might want to show a more user-friendly error page.
  // For this context, we log a warning to guide the developer.
  console.warn(
    'Firebase configuration is missing. Please check your .env.local file and compare it with .env.example'
  );
}
