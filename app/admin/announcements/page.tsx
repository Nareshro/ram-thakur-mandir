"use client";

import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import toast from "react-hot-toast";

interface Announcement {
  id?: string;
  title: string;
  description: string;
  date: string;
  active: boolean;
}

export default function AnnouncementsPage() {
  const [loading, setLoading] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    active: true,
  });

  const inputClass =
    "mt-2 w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500";

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function loadAnnouncements() {
    try {
      const snapshot = await getDocs(
        collection(db, "announcements")
      );

      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...(item.data() as Omit<Announcement, "id">),
      }));

      data.sort((a, b) => b.date.localeCompare(a.date));

      setAnnouncements(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load announcements");
    }
  }

  function resetForm() {
    setForm({
      title: "",
      description: "",
      date: "",
      active: true,
    });

    setEditingId(null);
  }

  async function saveAnnouncement() {
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.date
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      if (editingId) {
        await updateDoc(
          doc(db, "announcements", editingId),
          {
            title: form.title.trim(),
            description: form.description.trim(),
            date: form.date,
            active: form.active,
          }
        );

        toast.success("Announcement updated successfully");
      } else {
        await addDoc(
          collection(db, "announcements"),
          {
            title: form.title.trim(),
            description: form.description.trim(),
            date: form.date,
            active: form.active,
          }
        );

        toast.success("Announcement added successfully");
      }

      resetForm();
      await loadAnnouncements();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save announcement");
    } finally {
      setLoading(false);
    }
  }

  async function deleteAnnouncement(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this announcement?"
    );

    if (!confirmed) return;

    try {
      await deleteDoc(
        doc(db, "announcements", id)
      );

      toast.success("Announcement deleted");

      await loadAnnouncements();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete announcement");
    }
  }

  function editAnnouncement(item: Announcement) {
    setForm({
      title: item.title,
      description: item.description,
      date: item.date,
      active: item.active,
    });

    setEditingId(item.id || null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  const filteredAnnouncements = announcements.filter(
    (item) =>
      item.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.description
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">

      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Announcement Management
        </h1>

        <p className="mt-2 text-gray-600">
          Create and manage temple announcements.
        </p>
      </div>

      {/* Add / Edit Form */}

      <div className="rounded-2xl border bg-white shadow-lg p-8 space-y-6">

        <div className="flex items-center justify-between border-b pb-3">

          <h2 className="text-2xl font-bold text-amber-600">
            {editingId
              ? "Edit Announcement"
              : "New Announcement"}
          </h2>

          {editingId && (
            <button
              onClick={resetForm}
              className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
            >
              Cancel Edit
            </button>
          )}

        </div>

        {/* Title */}

        <div>
          <label className="block font-medium text-gray-700">
            Title *
          </label>

          <input
            type="text"
            className={inputClass}
            placeholder="Enter announcement title"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
          />
        </div>

        {/* Description */}

        <div>
          <label className="block font-medium text-gray-700">
            Description *
          </label>

          <textarea
            rows={5}
            className={inputClass}
            placeholder="Enter announcement description"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />
        </div>

        {/* Date + Active */}

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <label className="block font-medium text-gray-700">
              Date *
            </label>

            <input
              type="date"
              className={inputClass}
              value={form.date}
              onChange={(e) =>
                setForm({
                  ...form,
                  date: e.target.value,
                })
              }
            />
          </div>

          <div className="flex items-end">

            <label className="flex items-center gap-3 cursor-pointer">

              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) =>
                  setForm({
                    ...form,
                    active: e.target.checked,
                  })
                }
                className="w-5 h-5"
              />

              <span className="font-medium text-gray-700">
                Active
              </span>

            </label>

          </div>

        </div>

        {/* Save */}

        <button
          onClick={saveAnnouncement}
          disabled={loading}
          className="rounded-xl bg-amber-500 px-8 py-3 text-white font-semibold hover:bg-amber-600 disabled:bg-gray-400"
        >
          {loading
            ? "Saving..."
            : editingId
            ? "Update Announcement"
            : "Save Announcement"}
        </button>

      </div>

      {/* Search + Count */}

      <div className="bg-white rounded-2xl shadow p-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <input
            type="text"
            placeholder="Search announcements..."
            className="border border-gray-300 rounded-xl p-3 text-black w-full md:w-96"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <div className="bg-amber-500 text-white px-6 py-3 rounded-xl font-semibold">
            Total Announcements: {announcements.length}
          </div>

        </div>

      </div>

      {/* Table */}

      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-amber-500 text-white">

              <tr>

                <th className="p-4 text-left">
                  Title
                </th>

                <th className="p-4 text-left">
                  Description
                </th>

                <th className="p-4 text-left">
                  Date
                </th>

                <th className="p-4 text-center">
                  Status
                </th>

                <th className="p-4 text-center">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredAnnouncements.length === 0 ? (

                <tr>

                  <td
                    colSpan={5}
                    className="text-center p-10 text-gray-500"
                  >
                    No announcements found.
                  </td>

                </tr>

              ) : (

                filteredAnnouncements.map((item) => (

                  <tr
                    key={item.id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="p-4 font-semibold text-gray-800">
                      {item.title}
                    </td>

                    <td className="p-4 text-gray-600 max-w-md">
                      <div className="line-clamp-2">
                        {item.description}
                      </div>
                    </td>

                    <td className="p-4 text-gray-700 whitespace-nowrap">
                      {item.date}
                    </td>

                    <td className="p-4 text-center">

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          item.active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.active
                          ? "Active"
                          : "Inactive"}
                      </span>

                    </td>

                    <td className="p-4">

                      <div className="flex justify-center gap-2">

                        <button
                          onClick={() =>
                            editAnnouncement(item)
                          }
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            deleteAnnouncement(item.id!)
                          }
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}