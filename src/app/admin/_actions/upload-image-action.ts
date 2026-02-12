
'use server';

import { getAdminStorage } from '@/lib/firebase-admin';

export async function uploadImageAction(formData: FormData) {
  const file = formData.get('file') as File | null;
  
  if (!file) {
    return { success: false, error: 'No file provided.' };
  }

  try {
    const bucket = getAdminStorage().bucket();

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
    return { success: false, error: 'Failed to upload image on the server. Check server logs for details.' };
  }
}
