'use server';

// This server action now acts as a secure proxy to Cloudinary.
export async function uploadImageAction(formData: FormData) {
  const file = formData.get('file') as File | null;
  
  if (!file) {
    return { success: false, error: 'No file provided.' };
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    return { 
      success: false, 
      error: 'Cloudinary environment variables are not configured. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in your environment variables. Refer to the README.md for details.' 
    };
  }

  const cloudinaryFormData = new FormData();
  cloudinaryFormData.append("file", file);
  cloudinaryFormData.append("upload_preset", uploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: cloudinaryFormData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // Cloudinary sends error details in a nested 'error' object.
      throw new Error(data.error?.message || 'Cloudinary upload failed.');
    }

    // Return the secure URL and the public_id for future management.
    return { 
      success: true, 
      url: data.secure_url,
      public_id: data.public_id,
    };

  } catch (error: any) {
    console.error('Server-side Cloudinary upload failed:', error);
    return { success: false, error: error.message || 'An unknown server error occurred during the upload.' };
  }
}
