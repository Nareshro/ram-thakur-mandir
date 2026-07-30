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

interface Announcement {
  id?: string;
  title: string;
  description: string;
  date: string;
  active: boolean;
}

export default function AnnouncementsPage() {
  const [loading, setLoading] = useState(false);

  const inputClass =
    "mt-2 w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500";

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const [editingId, setEditingId] = useState("");

  const [search, setSearch] = useState("");

  const [form, setForm] = useState<Announcement>({
    title: "",
    description: "",
    date: "",
    active: true,
  });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function loadAnnouncements() {
    const snap = await getDocs(collection(db, "announcements"));

    const data = snap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Announcement),
    }));

    setAnnouncements(data);
  }

  async function saveAnnouncement() {
    try {
      setLoading(true);

      if (editingId) {
        await updateDoc(doc(db, "announcements", editingId), {
          ...form,
        });

        alert("Announcement updated successfully.");
      } else {
        await addDoc(collection(db, "announcements"), form);

        alert("Announcement added successfully.");
      }

      setForm({
        title: "",
        description: "",
        date: "",
        active: true,
      });

      setEditingId("");

      loadAnnouncements();
    } catch (error) {
      console.error(error);
      alert("Failed to save announcement.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteAnnouncement(id: string) {
    if (!confirm("Delete this announcement?")) return;

    await deleteDoc(doc(db, "announcements", id));

    loadAnnouncements();
  }

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">

  {/* Header */}

  <div>
    <h1 className="text-3xl font-bold text-gray-800">
      Announcements Management
    </h1>

    <p className="mt-2 text-gray-600">
      Create and manage temple announcements.
    </p>
  </div>

  {/* Form */}

  <div className="rounded-2xl border bg-white shadow-lg p-8 space-y-6">

    <h2 className="text-2xl font-bold text-amber-600 border-b pb-3">
      {editingId ? "Edit Announcement" : "New Announcement"}
    </h2>

    <div>
      <label className="block font-medium text-gray-700">
        Title
      </label>

      <input
        className={inputClass}
        value={form.title}
        onChange={(e) =>
          setForm({
            ...form,
            title: e.target.value,
          })
        }
      />
    </div>

    <div>
      <label className="block font-medium text-gray-700">
        Description
      </label>

      <textarea
        rows={4}
        className={inputClass}
        value={form.description}
        onChange={(e) =>
          setForm({
            ...form,
            description: e.target.value,
          })
        }
      />
    </div>

    <div className="grid md:grid-cols-2 gap-6">

      <div>
        <label className="block font-medium text-gray-700">
          Date
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

        <label className="flex items-center gap-3">

          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) =>
              setForm({
                ...form,
                active: e.target.checked,
              })
            }
          />

          <span className="font-medium">
            Active
          </span>

        </label>

      </div>

    </div>

    <button
      onClick={saveAnnouncement}
      disabled={loading}
      className="rounded-xl bg-amber-500 px-8 py-3 text-white font-semibold hover:bg-amber-600"
    >
      {loading
        ? "Saving..."
        : editingId
        ? "Update Announcement"
        : "Save Announcement"}
    </button>

  </div>

  {/* Search */}

  <div className="rounded-2xl border bg-white shadow-lg p-6">

    <input
      placeholder="Search announcements..."
      className={inputClass}
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

  </div>

  {/* Table */}

  <div className="rounded-2xl border bg-white shadow-lg overflow-hidden">

    <table className="w-full">

      <thead className="bg-gray-100 text-gray-800">

        <tr>

         <th className="w-2/5 p-4 text-left">Title</th>

          <th className="p-4 text-left">
            Date
          </th>

          <th className="p-4 text-left">
            Status
          </th>

          <th className="p-4 text-center">
            Actions
          </th>

        </tr>

      </thead>

      <tbody>

        {announcements
          .filter((item) =>
            item.title
              .toLowerCase()
              .includes(search.toLowerCase())
          )
          .map((item) => (

            <tr
              key={item.id}
              className="border-t bg-white hover:bg-gray-50"
            >

              <td className="p-4 text-gray-800 font-medium">
                {item.title}
              </td>

              <td className="p-4 text-gray-700 whitespace-nowrap">
                {item.date}
              </td>

              <td className="p-4 text-gray-800 font-medium">

                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                    item.active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.active ? "Active" : "Inactive"}
                </span>

              </td>

              <td className="p-4 text-gray-800 font-medium">

                <div className="flex justify-center gap-3">

                  <button
                    onClick={() => {
                      setForm({
                        title: item.title,
                        description: item.description,
                        date: item.date,
                        active: item.active,
                      });

                      setEditingId(item.id!);
                    }}
                    className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteAnnouncement(item.id!)
                    }
                    className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>

                </div>

              </td>

            </tr>

          ))}

      </tbody>

    </table>

  </div>

</div>
  );
}