
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { auth, db } from "../../lib/firebase";

type EventItem = {
  id: string;
  title: string;
  date: string;
  description: string;
  location: string;
  image: string;
};

const emptyEvent: Omit<EventItem, "id"> = {
  title: "",
  date: "",
  description: "",
  location: "",
  image: "",
};

export default function EventsManagement() {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [form, setForm] = useState(emptyEvent);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/admin/login");
        return;
      }

      setAuthorized(true);
    });

    return () => unsubscribe();
  }, [router]);

  async function loadEvents() {
    setLoading(true);

    try {
      const snapshot = await getDocs(collection(db, "events"));

      const data = snapshot.docs.map((item) => {
        const value = item.data();

        return {
          id: item.id,
          title: String(value.title ?? value.name ?? ""),
          date: String(value.date ?? ""),
          description: String(value.description ?? ""),
          location: String(value.location ?? ""),
          image: String(value.image ?? value.imageUrl ?? ""),
        };
      });

      setEvents(data);
    } catch (error) {
      console.error(error);
      setMessage("Unable to load events. Check Firestore permissions.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authorized) {
      loadEvents();
    }
  }, [authorized]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  }

  function editEvent(event: EventItem) {
    setEditingId(event.id);

    setForm({
      title: event.title,
      date: event.date,
      description: event.description,
      location: event.location,
      image: event.image,
    });

    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setForm(emptyEvent);
    setEditingId(null);
    setMessage("");
  }

  async function saveEvent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.title.trim() || !form.date) {
      setMessage("Event title and date are required.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const eventData = {
        title: form.title.trim(),
        date: form.date,
        description: form.description.trim(),
        location: form.location.trim(),
        image: form.image.trim(),
        updatedAt: new Date().toISOString(),
      };

      if (editingId) {
        await updateDoc(doc(db, "events", editingId), eventData);
        setMessage("Event updated successfully.");
      } else {
        await addDoc(collection(db, "events"), {
          ...eventData,
          createdAt: new Date().toISOString(),
        });

        setMessage("Event added successfully.");
      }

      resetForm();
      await loadEvents();
    } catch (error) {
      console.error(error);
      setMessage("Unable to save event. Check Firestore permissions.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteEvent(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this event?"
    );

    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "events", id));
      setEvents((previous) => previous.filter((event) => event.id !== id));

      if (editingId === id) {
        resetForm();
      }

      setMessage("Event deleted successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Unable to delete event. Check Firestore permissions.");
    }
  }

  if (!authorized) {
    return (
      <div className="p-8 text-gray-600">
        Checking administrator access...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Events Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Add, update, and manage temple events.
            </p>
          </div>

          <button
            onClick={() => router.push("/admin/dashboard")}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">

          <section className="rounded-xl bg-white p-5 shadow-sm lg:col-span-2">
            <h2 className="mb-5 text-lg font-semibold text-gray-800">
              {editingId ? "Edit Event" : "Add New Event"}
            </h2>

            <form onSubmit={saveEvent} className="space-y-4">

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Event Title *
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter event title"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-rose-700"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Event Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-rose-700"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Event location"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-rose-700"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Image URL
                </label>
                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="Paste image URL"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-rose-700"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Enter event details"
                  className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-rose-700"
                />
              </div>

              {message && (
                <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                  {message}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-lg bg-rose-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-900 disabled:opacity-60"
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
                    className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="rounded-xl bg-white p-5 shadow-sm lg:col-span-3">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                Existing Events
              </h2>

              <span className="rounded-full bg-rose-50 px-3 py-1 text-sm font-medium text-rose-800">
                {events.length} Events
              </span>
            </div>

            {loading ? (
              <p className="py-8 text-center text-sm text-gray-500">
                Loading events...
              </p>
            ) : events.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 py-10 text-center text-sm text-gray-500">
                No events found. Add your first event.
              </div>
            ) : (
              <div className="space-y-3">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex flex-col justify-between gap-3 sm:flex-row">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-800">
                          {event.title || "Untitled Event"}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {event.date || "Date not set"}
                        </p>

                        {event.location && (
                          <p className="mt-1 text-sm text-gray-500">
                            {event.location}
                          </p>
                        )}

                        {event.description && (
                          <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                            {event.description}
                          </p>
                        )}
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <button
                          onClick={() => editEvent(event)}
                          className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteEvent(event.id)}
                          className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </div>
    </main>
  );
}
