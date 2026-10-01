export async function uploadImage(
  file: File,
  folder: string = "gallery"
): Promise<string> {
  try {
    console.log(
      "Starting Cloudinary upload:",
      file.name
    );

    const cloudName =
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    const uploadPreset =
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error(
        "Cloudinary environment variables are missing."
      );
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append(
      "upload_preset",
      uploadPreset
    );

    formData.append(
      "folder",
      folder
    );

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    console.log(
      "Cloudinary response:",
      data
    );

    if (!response.ok) {
      throw new Error(
        data.error?.message ||
          "Cloudinary upload failed."
      );
    }

    console.log(
      "Image uploaded successfully:",
      data.secure_url
    );

    return data.secure_url;

  } catch (error) {
    console.error(
      "Cloudinary upload failed:",
      error
    );

    throw error;
  }
}