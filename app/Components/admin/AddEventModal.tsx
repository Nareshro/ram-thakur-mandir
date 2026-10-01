"use client";

import { useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/app/lib/firebase";
import { uploadImage } from "@/app/lib/storageService";

interface AddEventModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddEventModal({
  open,
  onClose,
  onSuccess,
}: AddEventModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [eventDate, setEventDate] =
    useState("");
  const [status, setStatus] =
    useState("Upcoming");

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [previewUrl, setPreviewUrl] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5 MB.");
      return;
    }

    setSelectedFile(file);

    const objectUrl =
      URL.createObjectURL(file);

    setPreviewUrl(objectUrl);
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setEventDate("");
    setStatus("Upcoming");
    setSelectedFile(null);
    setPreviewUrl("");
  }

  async function handleSave() {
    if (
      !title.trim() ||
      !description.trim() ||
      !eventDate
    ) {
      alert(
        "Please fill all required fields."
      );
      return;
    }

    try {
      setLoading(true);

      let imageUrl = "";

      /*
       * Upload event image to Firebase Storage
       * only when an image is selected.
       */
      if (selectedFile) {
        console.log(
          "Starting event image upload:",
          selectedFile.name
        );

        imageUrl = await uploadImage(
          selectedFile,
          "events"
        );

        console.log(
          "Event image uploaded:",
          imageUrl
        );
      }

      /*
       * Save event information to Firestore
       */
      await addDoc(
        collection(db, "events"),
        {
          title: title.trim(),
          description: description.trim(),
          eventDate,
          status,
          imageUrl,
          createdAt: serverTimestamp(),
        }
      );

      alert(
        "Event added successfully!"
      );

      resetForm();

      onSuccess?.();
      onClose();

    } catch (error) {
      console.error(
        "Failed to add event:",
        error
      );

      alert(
        "Failed to add event. Please check the console."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl">

        {/* Header */}

        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-2xl font-bold text-stone-800">
            Add New Event
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-2xl text-gray-500 hover:text-black disabled:opacity-50"
          >
            ×
          </button>

        </div>

        <div className="space-y-5">

          {/* Event Title */}

          <div>
            <label className="mb-2 block font-medium text-gray-800">
              Event Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Enter event title"
              disabled={loading}
              className="w-full rounded-xl border border-gray-300 p-3 text-gray-900 outline-none focus:border-amber-500 disabled:bg-gray-100"
            />
          </div>

          {/* Description */}

          <div>
            <label className="mb-2 block font-medium text-gray-800">
              Description
            </label>

            <textarea
              rows={4}
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Enter description"
              disabled={loading}
              className="w-full rounded-xl border border-gray-300 p-3 text-gray-900 outline-none focus:border-amber-500 disabled:bg-gray-100"
            />
          </div>

          {/* Event Date */}

          <div>
            <label className="mb-2 block font-medium text-gray-800">
              Event Date
            </label>

            <input
              type="datetime-local"
              value={eventDate}
              onChange={(e) =>
                setEventDate(e.target.value)
              }
              disabled={loading}
              className="w-full rounded-xl border border-gray-300 p-3 text-gray-900 outline-none focus:border-amber-500 disabled:bg-gray-100"
            />
          </div>

          {/* Status */}

          <div>
            <label className="mb-2 block font-medium text-gray-800">
              Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              disabled={loading}
              className="w-full rounded-xl border border-gray-300 p-3 text-gray-900 outline-none focus:border-amber-500 disabled:bg-gray-100"
            >
              <option value="Upcoming">
                Upcoming
              </option>

              <option value="Ongoing">
                Ongoing
              </option>

              <option value="Completed">
                Completed
              </option>
            </select>
          </div>

          {/* Event Image */}

          <div>

            <label className="mb-2 block font-medium text-gray-800">
              Event Image
            </label>

            <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-5">

              <input
                type="file"
                accept="image/*"
                onChange={
                  handleFileChange
                }
                disabled={loading}
                className="w-full text-gray-700 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-amber-500 file:px-5 file:py-2 file:text-white hover:file:bg-amber-600 disabled:opacity-50"
              />

              <p className="mt-2 text-sm text-gray-500">
                JPG, PNG or WEBP. Maximum
                size: 5 MB.
              </p>

            </div>

          </div>

          {/* Preview */}

          {previewUrl && (
            <div>

              <p className="mb-2 font-medium text-gray-800">
                Image Preview
              </p>

              <img
                src={previewUrl}
                alt="Event preview"
                className="h-48 w-full rounded-xl border object-cover"
              />

              {selectedFile && (
                <p className="mt-2 text-sm text-green-600">
                  Selected:{" "}
                  {selectedFile.name}
                </p>
              )}

            </div>
          )}

        </div>

        {/* Buttons */}

        <div className="mt-8 flex justify-end gap-4">

          <button
            type="button"
            onClick={() => {
              resetForm();
              onClose();
            }}
            disabled={loading}
            className="rounded-xl border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="rounded-xl bg-amber-500 px-6 py-2 text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading
              ? "Uploading..."
              : "Save Event"}
          </button>

        </div>

      </div>

    </div>
  );
}