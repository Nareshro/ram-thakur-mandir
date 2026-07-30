"use client";

import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";


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
  const [imageName, setImageName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
      setEventDate(event.eventDate);
      setStatus(event.status);
      setImageName(
        event.imageUrl.replace("/images/events/", "")
      );
    }
  }, [event]);

  const handleUpdate = async () => {
    if (!event) return;

    try {
      setLoading(true);

      await updateDoc(doc(db, "events", event.id), {
        title,
        description,
        eventDate,
        status,
        imageUrl: `/images/events/${imageName}`,
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to update event.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl">

        <h2 className="mb-6 text-2xl font-bold">
          Edit Event
        </h2>

        <div className="space-y-5">

          <input
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            placeholder="Title"
            className="w-full rounded-xl border p-3"
          />

          <textarea
            rows={4}
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
            className="w-full rounded-xl border p-3"
          />

          <input
            type="datetime-local"
            value={eventDate}
            onChange={(e)=>setEventDate(e.target.value)}
            className="w-full rounded-xl border p-3"
          />

          <select
            value={status}
            onChange={(e)=>setStatus(e.target.value)}
            className="w-full rounded-xl border p-3"
          >
            <option>Upcoming</option>
            <option>Ongoing</option>
            <option>Completed</option>
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={(e)=>{
              if(e.target.files?.length){
                setImageName(e.target.files[0].name);
              }
            }}
            className="w-full rounded-xl border p-3"
          />

        </div>

        <div className="mt-8 flex justify-end gap-4">

          <button
            onClick={onClose}
            className="rounded-xl border px-5 py-2"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            disabled={loading}
            className="rounded-xl bg-amber-500 px-6 py-2 text-white"
          >
            {loading ? "Updating..." : "Update Event"}
          </button>

        </div>

      </div>
    </div>
  );
}