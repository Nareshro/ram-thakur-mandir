"use client";

import { useState } from "react";
import Image from "next/image";

import { uploadImage } from "@/app/lib/storageService";
import { saveGalleryImage } from "@/app/lib/galleryService";

interface UploadImageModalProps {
  open: boolean;
  onClose: () => void;
}

export default function UploadImageModal({
  open,
  onClose,
}: UploadImageModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    setSelectedFiles(files);

    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviewUrls(previews);
  };

  const handleUpload = async () => {
  if (selectedFiles.length === 0) {
    alert("Please select at least one image.");
    return;
  }

  try {
    setLoading(true);

    for (const file of selectedFiles) {
      console.log("1. Starting upload:", file.name);

      const imageUrl = await uploadImage(file);

      console.log("2. Uploaded to Storage:", imageUrl);

      const imageTitle =
        selectedFiles.length > 1
          ? file.name.replace(/\.[^/.]+$/, "")
          : title || file.name.replace(/\.[^/.]+$/, "");

      await saveGalleryImage(
        imageTitle,
        description,
        imageUrl
      );

      console.log("3. Saved to Firestore");
    }

    alert("Images uploaded successfully!");

    setTitle("");
    setDescription("");
    setSelectedFiles([]);
    setPreviewUrls([]);

    onClose();
    window.location.reload();

  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    alert("Upload failed. Check browser console.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">

      <div className="w-full max-w-3xl rounded-3xl bg-stone-900 border border-stone-700 shadow-2xl p-8 max-h-[90vh] overflow-y-auto">

        {/* Header */}

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-amber-400">
            Upload Gallery Images
          </h2>

          <p className="text-gray-400 mt-2">
            Upload one or multiple temple gallery images.
          </p>
        </div>

        {/* Title */}

        <div className="mb-5">

          <label className="block mb-2 text-sm font-medium text-gray-300">
            Title
          </label>

          <input
            type="text"
            placeholder="Temple Entrance"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-stone-700 bg-stone-800 px-4 py-3 text-white placeholder:text-gray-500 outline-none focus:border-amber-500"
          />

        </div>

        {/* Description */}

        <div className="mb-5">

          <label className="block mb-2 text-sm font-medium text-gray-300">
            Description
          </label>

          <textarea
            rows={4}
            placeholder="Write image description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-stone-700 bg-stone-800 px-4 py-3 text-white placeholder:text-gray-500 outline-none resize-none focus:border-amber-500"
          />

        </div>

        {/* Upload */}

        <div className="mb-6">

          <label className="block mb-2 text-sm font-medium text-gray-300">
            Gallery Images
          </label>

          <div className="border-2 border-dashed border-stone-600 rounded-2xl p-10 text-center bg-stone-800">

            <div className="text-5xl mb-4">
              📷
            </div>

            <h3 className="text-xl font-semibold text-white">
              Drag & Drop Images Here
            </h3>

            <p className="text-gray-400 mt-2 mb-5">
              or choose multiple images from your computer
            </p>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="
                block
                w-full
                text-gray-300
                file:mr-4
                file:rounded-lg
                file:border-0
                file:bg-amber-500
                file:px-5
                file:py-2
                file:text-white
                file:cursor-pointer
                hover:file:bg-amber-600
              "
            />

          </div>

        </div>

        {/* Preview */}

        <div className="mb-8">

          <h3 className="text-xl font-semibold text-white mb-4">
            Selected Images
          </h3>

          {previewUrls.length === 0 ? (

            <div className="border border-dashed border-stone-700 rounded-xl py-10 text-center text-gray-500">
              No images selected
            </div>

          ) : (

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              {previewUrls.map((url, index) => (

                <div
                  key={index}
                  className="relative h-40 rounded-xl overflow-hidden border border-stone-700"
                >

                  <Image
                    src={url}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover"
                  />

                </div>

              ))}

            </div>

          )}

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-4">

          <button
            onClick={onClose}
            className="rounded-xl border border-stone-600 px-6 py-3 text-gray-300 hover:bg-stone-800"
          >
            Cancel
          </button>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="rounded-xl bg-amber-500 px-8 py-3 font-semibold text-white hover:bg-amber-600 transition disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload Images"}
          </button>

        </div>

      </div>

    </div>
  );
}