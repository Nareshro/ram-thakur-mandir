"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

interface TimingsForm {
  morningOpen: string;
  morningClose: string;
  eveningOpen: string;
  eveningClose: string;
  aartiTime: string;
  specialNote: string;
}

export default function TimingsPage() {
  const [loading, setLoading] = useState(false);

  const inputClass =
    "mt-2 w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500";

  const [form, setForm] = useState<TimingsForm>({
    morningOpen: "",
    morningClose: "",
    eveningOpen: "",
    eveningClose: "",
    aartiTime: "",
    specialNote: "",
  });

  useEffect(() => {
    loadTimings();
  }, []);

  async function loadTimings() {
    try {
      const snap = await getDoc(doc(db, "timings", "main"));

      if (snap.exists()) {
        setForm((prev) => ({
          ...prev,
          ...(snap.data() as TimingsForm),
        }));
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function saveTimings() {
    try {
      setLoading(true);

      await setDoc(doc(db, "timings", "main"), form);

      alert("Temple timings updated successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to save timings.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">

  {/* Header */}

  <div>
    <h1 className="text-3xl font-bold text-gray-800">
      Temple Timings Management
    </h1>

    <p className="mt-2 text-gray-600">
      Manage temple opening hours and special notes.
    </p>
  </div>

  {/* Timings */}

  <div className="rounded-2xl border bg-white shadow-lg p-8 space-y-6">

    <h2 className="text-2xl font-bold text-amber-600 border-b pb-3">
      Temple Timings
    </h2>

    <div className="grid md:grid-cols-2 gap-6">

      <div>
        <label className="block font-medium text-gray-700">
          Morning Opening
        </label>

        <input
          className={inputClass}
          placeholder="5:30 AM"
          value={form.morningOpen}
          onChange={(e) =>
            setForm({
              ...form,
              morningOpen: e.target.value,
            })
          }
        />
      </div>

      <div>
        <label className="block font-medium text-gray-700">
          Morning Closing
        </label>

        <input
          className={inputClass}
          placeholder="12:00 PM"
          value={form.morningClose}
          onChange={(e) =>
            setForm({
              ...form,
              morningClose: e.target.value,
            })
          }
        />
      </div>

      <div>
        <label className="block font-medium text-gray-700">
          Evening Opening
        </label>

        <input
          className={inputClass}
          placeholder="4:30 PM"
          value={form.eveningOpen}
          onChange={(e) =>
            setForm({
              ...form,
              eveningOpen: e.target.value,
            })
          }
        />
      </div>

      <div>
        <label className="block font-medium text-gray-700">
          Evening Closing
        </label>

        <input
          className={inputClass}
          placeholder="8:30 PM"
          value={form.eveningClose}
          onChange={(e) =>
            setForm({
              ...form,
              eveningClose: e.target.value,
            })
          }
        />
      </div>

    </div>

    <div>
      <label className="block font-medium text-gray-700">
        Aarti Time
      </label>

      <input
        className={inputClass}
        placeholder="6:00 PM"
        value={form.aartiTime}
        onChange={(e) =>
          setForm({
            ...form,
            aartiTime: e.target.value,
          })
        }
      />
    </div>

    <div>
      <label className="block font-medium text-gray-700">
        Special Note
      </label>

      <textarea
        rows={4}
        className={inputClass}
        placeholder="Temple remains open on all festivals."
        value={form.specialNote}
        onChange={(e) =>
          setForm({
            ...form,
            specialNote: e.target.value,
          })
        }
      />
    </div>

  </div>

  {/* Save Button */}

  <div className="flex justify-end">

    <button
      onClick={saveTimings}
      disabled={loading}
      className="rounded-xl bg-amber-500 px-8 py-3 font-semibold text-white hover:bg-amber-600 disabled:bg-gray-400"
    >
      {loading ? "Saving..." : "Save Timings"}
    </button>

  </div>

</div>
  );
}