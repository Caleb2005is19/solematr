'use server';

import { getAdminStorage } from '@/lib/firebase-admin';

export async function uploadImageAction(formData: FormData) {
  const file = formData.get('file') as File | null;
  
  if (!file) {
    return { success: false, error: 'No file provided.' };
  }

  const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  if (!bucketName) {
    return { success: false, error: 'Configuration Error: The `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` environment variable is not set on the server. Please add it to your Vercel project settings.' };
  }

  try {
    const storage = getAdminStorage();
    // Pass the bucket name explicitly to be safe
    const bucket = storage.bucket(bucketName);

    // The file path is generated on the client and passed via FormData
    const filePath = formData.get('filePath') as string;
    if (!filePath) {
      return { success: false, error: 'File path not provided.' };
    }

    const fileUpload = bucket.file(filePath);
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload the file and make it public in one step
    await fileUpload.save(buffer, {
      contentType: file.type,
      public: true, 
    });

    // The public URL can be constructed deterministically, which is more reliable
    const downloadURL = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
    
    return { success: true, url: downloadURL, path: filePath };

  } catch (error: any) {
    console.error('Server-side upload failed:', error);
    // Propagate the actual error message from the Firebase Admin SDK to the client.
    return { success: false, error: error.message || 'An unknown server error occurred during the upload.' };
  }
}
