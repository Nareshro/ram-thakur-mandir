
"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

type EventItem = {
  id: string;
  title: string;
  date: string;
  description: string;
  location: string;
  image: string;
};

const emptyEvent = {
  title: "",
  date: "",
  description: "",
  location: "",
  image: "",
};

export default function EventsManager() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [form, setForm] = useState(emptyEvent);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadEvents() {
    setLoading(true);

    try {
      const snapshot = await getDocs(collection(db, "events"));

      setEvents(
        snapshot.docs.map((item) => {
          const data = item.data();

          return {
            id: item.id,
            title: String(data.title ?? data.name ?? ""),
            date: String(data.date ?? ""),
            description: String(data.description ?? ""),
            location: String(data.location ?? ""),
            image: String(data.image ?? data.imageUrl ?? ""),
          };
        })
      );
    } catch (error) {
      console.error(error);
      setMessage("Unable to load events. Check Firestore permissions.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  function resetForm() {
    setForm(emptyEvent);
    setEditingId(null);
  }

  async function saveEvent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.title.trim() || !form.date) {
      setMessage("Title and date are required.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const payload = {
        ...form,
        title: form.title.trim(),
        updatedAt: new Date().toISOString(),
      };

      if (editingId) {
        await updateDoc(doc(db, "events", editingId), payload);
        setMessage("Event updated successfully.");
      } else {
        await addDoc(collection(db, "events"), {
          ...payload,
          createdAt: new Date().toISOString(),
        });
        setMessage("Event added successfully.");
      }

      resetForm();
      await loadEvents();
    } catch (error) {
      console.error(error);
      setMessage("Save failed. Check Firestore permissions.");
    } finally {
      setSaving(false);
    }
  }

  async function removeEvent(id: string) {
    if (!window.confirm("Permanently delete this event?")) return;

    try {
      await deleteDoc(doc(db, "events", id));
      setMessage("Event deleted successfully.");
      await loadEvents();
    } catch (error) {
      console.error(error);
      setMessage("Delete failed.");
    }
  }

  return (
    <div className="grid gap-6 p-5 md:p-8 xl:grid-cols-5">

      <section className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm xl:col-span-2">
        <h3 className="mb-5 text-lg font-bold text-red-950">
          {editingId ? "Edit Event" : "Add New Event"}
        </h3>

        <form onSubmit={saveEvent} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Event Title *
            </label>
            <input
              required
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              placeholder="Enter event title"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Event Date *
            </label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              value={form.location}
              onChange={(e) =>
                setForm({ ...form, location: e.target.value })
              }
              placeholder="Event location"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <input
              type="url"
              value={form.image}
              onChange={(e) =>
                setForm({ ...form, image: e.target.value })
              }
              placeholder="Paste image URL"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Enter event details"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          {message && (
            <p className="rounded-lg bg-orange-50 p-3 text-sm text-red-900">
              {message}
            </p>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-[#50190f] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Event"
                : "Save Event"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border px-4 py-3 text-sm"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm xl:col-span-3">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-red-950">
            Existing Events
          </h3>
          <span className="rounded-full bg-orange-100 px-3 py-1 text-sm text-red-900">
            {events.length} Events
          </span>
        </div>

        {loading ? (
          <p className="py-8 text-center text-gray-500">
            Loading events...
          </p>
        ) : events.length === 0 ? (
          <p className="py-8 text-center text-gray-500">
            No events available.
          </p>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex flex-col justify-between gap-3 rounded-xl border border-gray-200 p-4 sm:flex-row"
              >
                <div className="min-w-0">
                  <h4 className="font-semibold text-gray-800">
                    {event.title || "Untitled Event"}
                  </h4>

                  <p className="mt-1 text-sm text-gray-500">
                    {event.date || "Date not set"}
                  </p>

                  {event.location && (
                    <p className="text-sm text-gray-500">
                      {event.location}
                    </p>
                  )}

                  <p className="mt-2 text-sm text-gray-600">
                    {event.description}
                  </p>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => {
                      setEditingId(event.id);
                      setForm({
                        title: event.title,
                        date: event.date,
                        description: event.description,
                        location: event.location,
                        image: event.image,
                      });
                      setMessage("");
                    }}
                    className="rounded-lg bg-blue-50 px-4 py-2 text-sm text-blue-700"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => removeEvent(event.id)}
                    className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
