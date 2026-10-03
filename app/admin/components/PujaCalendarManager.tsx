
"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";

type CalendarItem = {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
};

const emptyForm = {
  title: "",
  date: "",
  time: "",
  description: "",
};

export default function PujaCalendarManager() {
  const [items, setItems] = useState<CalendarItem[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadItems = async () => {
    setLoading(true);

    try {
      const snapshot = await getDocs(
        query(collection(db, "pujaCalendar"), orderBy("date", "asc"))
      );

      setItems(
        snapshot.docs.map((item) => {
          const data = item.data();

          return {
            id: item.id,
            title: data.title ?? "",
            date: data.date ?? "",
            time: data.time ?? "",
            description: data.description ?? "",
          };
        })
      );
    } catch (error) {
      console.error(error);
      setMessage("Unable to load calendar. Check Firestore permissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.title.trim() || !form.date) {
      setMessage("Please enter the puja name and date.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const data = {
        title: form.title.trim(),
        date: form.date,
        time: form.time.trim(),
        description: form.description.trim(),
      };

      if (editingId) {
        await updateDoc(doc(db, "pujaCalendar", editingId), data);
        setMessage("Calendar entry updated successfully.");
      } else {
        await addDoc(collection(db, "pujaCalendar"), data);
        setMessage("Calendar entry added successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadItems();
    } catch (error) {
      console.error(error);
      setMessage("Unable to save entry. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: CalendarItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      date: item.date,
      time: item.time,
      description: item.description,
    });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this calendar entry?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "pujaCalendar", id));
      setMessage("Calendar entry deleted.");
      await loadItems();
    } catch (error) {
      console.error(error);
      setMessage("Unable to delete entry.");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
  };

  return (
    <div className="min-h-full bg-[#f8f5f0] p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#50190f]">
            Puja Calendar Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage annual pujas, festivals, and temple calendar events.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:p-7"
        >
          <h3 className="mb-5 text-lg font-semibold text-gray-800">
            {editingId ? "Edit Calendar Entry" : "Add New Calendar Entry"}
          </h3>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Puja / Festival Name *
              </label>
              <input
                required
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                placeholder="e.g. Sri Sri Ram Thakur Jayanti"
                className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-[#8b3a25]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Date *
              </label>
              <input
                required
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-[#8b3a25]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Time
              </label>
              <input
                value={form.time}
                onChange={(e) =>
                  setForm({ ...form, time: e.target.value })
                }
                placeholder="e.g. 6:00 AM onwards"
                className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-[#8b3a25]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Enter puja details..."
                className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-[#8b3a25]"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#50190f] px-6 py-3 font-medium text-white hover:bg-[#6b281b] disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Entry"
                : "Add to Calendar"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>

          {message && (
            <p className="mt-4 text-sm font-medium text-gray-700">
              {message}
            </p>
          )}
        </form>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:p-7">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Calendar Entries
            </h3>
            <span className="rounded-full bg-[#f8f5f0] px-3 py-1 text-sm text-[#50190f]">
              {items.length} Entries
            </span>
          </div>

          {loading ? (
            <p className="py-8 text-center text-gray-500">
              Loading calendar...
            </p>
          ) : items.length === 0 ? (
            <p className="py-8 text-center text-gray-500">
              No calendar entries added yet.
            </p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col justify-between gap-4 rounded-lg border border-gray-200 p-4 md:flex-row md:items-center"
                >
                  <div className="flex gap-4">
                    <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-lg bg-[#f8f0e8] text-[#50190f]">
                      <span className="text-xs font-medium">
                        {new Date(
                          `${item.date}T00:00:00`
                        ).toLocaleString("en-IN", { month: "short" })}
                      </span>
                      <span className="text-xl font-bold">
                        {new Date(
                          `${item.date}T00:00:00`
                        ).getDate()}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-sm text-gray-500">
                        {item.date}
                        {item.time ? ` • ${item.time}` : ""}
                      </p>
                      {item.description && (
                        <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
