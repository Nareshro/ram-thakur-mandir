"use client";

import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";

import { db } from "../../lib/firebase";
import { uploadImage } from "@/app/lib/storageService";

interface EventItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  eventDate: string;
  status: string;
}

interface EditEventModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  event: EventItem | null;
}

export default function EditEventModal({
  open,
  onClose,
  onSuccess,
  event,
}: EditEventModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [status, setStatus] = useState("Upcoming");

  const [currentImageUrl, setCurrentImageUrl] =
    useState("");

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [previewUrl, setPreviewUrl] =
    useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (event) {
      setTitle(event.title || "");
      setDescription(event.description || "");
      setEventDate(event.eventDate || "");
      setStatus(event.status || "Upcoming");

      setCurrentImageUrl(
        event.imageUrl || ""
      );

      setSelectedFile(null);
      setPreviewUrl("");
    }
  }, [event]);

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setSelectedFile(file);

    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  }

  const handleUpdate = async () => {
    if (!event) {
      return;
    }

    if (
      !title.trim() ||
      !description.trim() ||
      !eventDate
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = currentImageUrl;

      // Upload new image only if user selected one
      if (selectedFile) {
        imageUrl = await uploadImage(
          selectedFile,
          "events"
        );
      }

      await updateDoc(
        doc(db, "events", event.id),
        {
          title: title.trim(),
          description: description.trim(),
          eventDate,
          status,
          imageUrl,
        }
      );

      alert("Event updated successfully!");

      onSuccess();
      onClose();
    } catch (error) {
      console.error(
        "Failed to update event:",
        error
      );

      alert(
        "Failed to update event. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl">

        <h2 className="mb-6 text-2xl font-bold text-stone-800">
          Edit Event
        </h2>

        <div className="space-y-5">

          {/* Title */}

          <div>
            <label className="mb-2 block font-medium text-gray-800">
              Event Title *
            </label>

            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Event title"
              className="w-full rounded-xl border border-gray-300 p-3 text-gray-900 outline-none focus:border-amber-500"
            />
          </div>

          {/* Description */}

          <div>
            <label className="mb-2 block font-medium text-gray-800">
              Description *
            </label>

            <textarea
              rows={4}
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Event description"
              className="w-full rounded-xl border border-gray-300 p-3 text-gray-900 outline-none focus:border-amber-500"
            />
          </div>

          {/* Date */}

          <div>
            <label className="mb-2 block font-medium text-gray-800">
              Event Date *
            </label>

            <input
              type="datetime-local"
              value={eventDate}
              onChange={(e) =>
                setEventDate(e.target.value)
              }
              className="w-full rounded-xl border border-gray-300 p-3 text-gray-900 outline-none focus:border-amber-500"
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
              className="w-full rounded-xl border border-gray-300 p-3 text-gray-900 outline-none focus:border-amber-500"
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

          {/* Current Image */}

          {currentImageUrl && !previewUrl && (
            <div>
              <label className="mb-2 block font-medium text-gray-800">
                Current Image
              </label>

              <img
                src={currentImageUrl}
                alt="Current event"
                className="h-48 w-full rounded-xl border object-cover"
              />
            </div>
          )}

          {/* New Image */}

          <div>
            <label className="mb-2 block font-medium text-gray-800">
              Replace Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full rounded-xl border border-gray-300 p-3 text-gray-900"
            />

            {selectedFile && (
              <p className="mt-2 text-sm text-green-600">
                Selected: {selectedFile.name}
              </p>
            )}

            {previewUrl && (
              <div className="mt-4">
                <img
                  src={previewUrl}
                  alt="New event preview"
                  className="h-48 w-full rounded-xl border object-cover"
                />
              </div>
            )}
          </div>

        </div>

        {/* Buttons */}

        <div className="mt-8 flex justify-end gap-4">

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            disabled={loading}
            className="rounded-xl bg-amber-500 px-6 py-2 text-white hover:bg-amber-600 disabled:bg-gray-400"
          >
            {loading
              ? "Uploading & Updating..."
              : "Update Event"}
          </button>

        </div>

      </div>
    </div>
  );
}