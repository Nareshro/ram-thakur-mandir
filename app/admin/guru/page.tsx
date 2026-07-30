"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

interface GuruForm {
  name: string;
  subtitle: string;
  description1: string;
  description2: string;
  description3: string;
  image: string;
}

export default function GuruPage() {
  const [loading, setLoading] = useState(false);

  const inputClass =
    "mt-2 w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500";

  const [form, setForm] = useState<GuruForm>({
    name: "",
    subtitle: "",
    description1: "",
    description2: "",
    description3: "",
    image: "",
  });

  useEffect(() => {
    loadGuru();
  }, []);

  async function loadGuru() {
    try {
      const snap = await getDoc(doc(db, "guru", "main"));

      if (snap.exists()) {
        setForm((prev) => ({
          ...prev,
          ...(snap.data() as GuruForm),
        }));
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function saveGuru() {
    try {
      setLoading(true);

      await setDoc(doc(db, "guru", "main"), form);

      alert("Guru information updated successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to save guru information.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">

  {/* Header */}

  <div>
    <h1 className="text-3xl font-bold text-gray-800">
      Guru Management
    </h1>

    <p className="mt-2 text-gray-600">
      Manage Guru information displayed on the website.
    </p>
  </div>

  {/* Guru Details */}

  <div className="rounded-2xl border bg-white shadow-lg p-8 space-y-6">

    <h2 className="text-2xl font-bold text-amber-600 border-b pb-3">
      Guru Details
    </h2>

    {/* Guru Name */}

    <div>
      <label className="block font-medium text-gray-700">
        Guru Name
      </label>

      <input
        className={inputClass}
        value={form.name}
        onChange={(e) =>
          setForm({
            ...form,
            name: e.target.value,
          })
        }
      />
    </div>

    {/* Subtitle */}

    <div>
      <label className="block font-medium text-gray-700">
        Subtitle
      </label>

      <input
        className={inputClass}
        value={form.subtitle}
        onChange={(e) =>
          setForm({
            ...form,
            subtitle: e.target.value,
          })
        }
      />
    </div>

    {/* Description 1 */}

    <div>
      <label className="block font-medium text-gray-700">
        Description 1
      </label>

      <textarea
        rows={4}
        className={inputClass}
        value={form.description1}
        onChange={(e) =>
          setForm({
            ...form,
            description1: e.target.value,
          })
        }
      />
    </div>

    {/* Description 2 */}

    <div>
      <label className="block font-medium text-gray-700">
        Description 2
      </label>

      <textarea
        rows={4}
        className={inputClass}
        value={form.description2}
        onChange={(e) =>
          setForm({
            ...form,
            description2: e.target.value,
          })
        }
      />
    </div>

    {/* Description 3 */}

    <div>
      <label className="block font-medium text-gray-700">
        Description 3
      </label>

      <textarea
        rows={4}
        className={inputClass}
        value={form.description3}
        onChange={(e) =>
          setForm({
            ...form,
            description3: e.target.value,
          })
        }
      />
    </div>

    {/* Image */}

    <div>
      <label className="block font-medium text-gray-700">
        Image Path
      </label>

      <input
        className={inputClass}
        placeholder="/images/gallery/guruji.jpg.jpeg"
        value={form.image}
        onChange={(e) =>
          setForm({
            ...form,
            image: e.target.value,
          })
        }
      />

      <p className="mt-2 text-sm text-gray-500">
        Example: /images/gallery/guruji.jpg.jpeg
      </p>
    </div>

  </div>

  {/* Save Button */}

  <div className="flex justify-end">

    <button
      onClick={saveGuru}
      disabled={loading}
      className="rounded-xl bg-amber-500 px-8 py-3 font-semibold text-white hover:bg-amber-600 disabled:bg-gray-400"
    >
      {loading ? "Saving..." : "Save Guru"}
    </button>

  </div>

</div>
  );
}