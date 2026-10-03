
"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";

type Item = {
  id: string;
  title: string;
  date: string;
  description: string;
  location: string;
  imageUrl: string;
  status: string;
};

const emptyForm = {
  title: "",
  date: "",
  description: "",
  location: "",
  imageUrl: "",
  status: "Published",
};

const tabs = [
  { label: "Special Events", collection: "specialEvents" },
  { label: "Announcements", collection: "announcements" },
];

export default function SpecialEventsManager() {
  const [activeTab, setActiveTab] = useState(0);
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const activeCollection = tabs[activeTab].collection;

  const loadItems = async () => {
    setLoading(true);

    try {
      const snapshot = await getDocs(
        collection(db, activeCollection)
      );

      const data = snapshot.docs.map((item) => {
        const value = item.data();

        return {
          id: item.id,
          title: value.title ?? value.name ?? "",
          date: value.date ?? "",
          description: value.description ?? value.content ?? "",
          location: value.location ?? "",
          imageUrl: value.imageUrl ?? value.image ?? "",
          status: value.status ?? "Published",
        };
      });

      data.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
      setItems(data);
    } catch (error) {
      console.error(error);
      setMessage("Unable to load records. Check Firestore permissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
    loadItems();
  }, [activeTab]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setMessage("Please enter a title.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const data = {
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
        imageUrl: form.imageUrl.trim(),
        updatedAt: new Date().toISOString(),
      };

      if (editingId) {
        await updateDoc(
          doc(db, activeCollection, editingId),
          data
        );
        setMessage("Record updated successfully.");
      } else {
        await addDoc(collection(db, activeCollection), {
          ...data,
          createdAt: new Date().toISOString(),
        });
        setMessage("Record added successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadItems();
    } catch (error) {
      console.error(error);
      setMessage("Unable to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: Item) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      date: item.date,
      description: item.description,
      location: item.location,
      imageUrl: item.imageUrl,
      status: item.status,
    });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this record?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, activeCollection, id));
      setMessage("Record deleted.");
      await loadItems();
    } catch (error) {
      console.error(error);
      setMessage("Unable to delete record.");
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
            Events & Announcements
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Publish special events, temple notices, and important updates.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {tabs.map((tab, index) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(index)}
              className={`rounded-lg px-5 py-3 text-sm font-medium ${
                activeTab === index
                  ? "bg-[#50190f] text-white"
                  : "border bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-xl border bg-white p-5 shadow-sm md:p-7"
        >
          <h3 className="mb-5 text-lg font-semibold text-gray-800">
            {editingId ? "Edit Record" : `Add ${tabs[activeTab].label}`}
          </h3>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Title *
              </label>
              <input
                required
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                placeholder="Enter title"
                className="w-full rounded-lg border px-3 py-3 outline-none focus:border-[#8b3a25]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })
                }
                className="w-full rounded-lg border px-3 py-3 outline-none focus:border-[#8b3a25]"
              />
            </div>

            {activeTab === 0 && (
              <>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    placeholder="Event venue"
                    className="w-full rounded-lg border px-3 py-3 outline-none focus:border-[#8b3a25]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={form.imageUrl}
                    onChange={(e) =>
                      setForm({ ...form, imageUrl: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full rounded-lg border px-3 py-3 outline-none focus:border-[#8b3a25]"
                  />
                </div>
              </>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Publication Status
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value })
                }
                className="w-full rounded-lg border px-3 py-3 outline-none focus:border-[#8b3a25]"
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description / Notice
              </label>
              <textarea
                rows={5}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Enter details..."
                className="w-full rounded-lg border px-3 py-3 outline-none focus:border-[#8b3a25]"
              />
            </div>
          </div>

          {form.imageUrl && activeTab === 0 && (
            <div className="mt-4">
              <p className="mb-2 text-sm text-gray-500">Image Preview</p>
              <img
                src={form.imageUrl}
                alt="Event preview"
                className="h-40 w-56 rounded-lg border object-cover"
              />
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#50190f] px-6 py-3 font-medium text-white hover:bg-[#6b281b] disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update"
                : "Save"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-lg border px-6 py-3 text-gray-700 hover:bg-gray-50"
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

        <div className="rounded-xl border bg-white p-5 shadow-sm md:p-7">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Existing Records
            </h3>
            <span className="rounded-full bg-[#f8f0e8] px-3 py-1 text-sm text-[#50190f]">
              {items.length} Records
            </span>
          </div>

          {loading ? (
            <p className="py-8 text-center text-gray-500">
              Loading...
            </p>
          ) : items.length === 0 ? (
            <p className="py-8 text-center text-gray-500">
              No records found.
            </p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col justify-between gap-4 rounded-lg border p-4 md:flex-row md:items-center"
                >
                  <div className="flex min-w-0 gap-4">
                    {item.imageUrl && activeTab === 0 && (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-20 w-24 shrink-0 rounded-lg object-cover"
                      />
                    )}

                    <div className="min-w-0">
                      <h4 className="font-semibold text-gray-800">
                        {item.title}
                      </h4>
                      {item.date && (
                        <p className="mt-1 text-sm text-gray-500">
                          {item.date}
                        </p>
                      )}
                      {item.location && (
                        <p className="text-sm text-gray-500">
                          {item.location}
                        </p>
                      )}
                      <p className="mt-2 line-clamp-2 whitespace-pre-wrap text-sm text-gray-600">
                        {item.description}
                      </p>
                      <span
                        className={`mt-2 inline-block rounded-full px-3 py-1 text-xs ${
                          item.status === "Published"
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="rounded-lg border px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
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
