"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";

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
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [status, setStatus] = useState("Upcoming");
  const [imageName, setImageName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title || !description || !eventDate) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "events"), {
        title,
        description,
        eventDate,
        status,
        imageUrl: imageName
          ? `/images/events/${imageName}`
          : "",
        createdAt: serverTimestamp(),
      });

      setTitle("");
      setDescription("");
      setEventDate("");
      setStatus("Upcoming");
      setImageName("");


      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to add event.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl">

        <h2 className="mb-6 text-2xl font-bold text-stone-800">
          Add New Event
        </h2>

        <div className="space-y-5">

          <div>
            <label className="mb-2 block font-medium text-gray-800">
              Event Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
              className="w-full rounded-xl border border-gray-300 p-3 text-gray-900 outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-800">
              Description
            </label>

            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              className="w-full rounded-xl border border-gray-300 p-3 text-gray-900 outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-800">
              Event Date
            </label>

            <input
            type="datetime-local"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full rounded-xl border border-gray-300 p-3 text-gray-900 outline-none focus:border-amber-500"
/>
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-800">
              Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-gray-300 p-3 text-gray-900 outline-none focus:border-amber-500"
            >
              <option value="Upcoming">Upcoming</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-800">
              Event Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.length) {
                  setImageName(e.target.files[0].name);
                }
              }}
              className="w-full rounded-xl border border-gray-300 p-3"
            />

            {imageName && (
              <p className="mt-2 text-sm text-green-600">
                Selected: {imageName}
              </p>
            )}
          </div>

        </div>

        <div className="mt-8 flex justify-end gap-4">

          <button
            onClick={onClose}
            className="rounded-xl border border-gray-300 px-5 py-2 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="rounded-xl bg-amber-500 px-6 py-2 text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading ? "Saving..." : "Save Event"}
          </button>

        </div>

      </div>
    </div>
  );
}