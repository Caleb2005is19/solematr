'use server';

// This server action now acts as a secure proxy to Cloudinary.
export async function uploadImageAction(formData: FormData) {
  const file = formData.get('file') as File | null;
  
  if (!file) {
    return { success: false, error: 'No file provided.' };
  }

  const cloudName = "dwph3txc8"; 
  // Using the human-readable preset NAME, not the ID.
  const uploadPreset = "Carlbtw"; 

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
