"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

interface FooterForm {
  templeName: string;
  address: string;
  phone: string;
  email: string;
  facebook: string;
  instagram: string;
  youtube: string;
  copyright: string;
}

export default function FooterPage() {
  const [loading, setLoading] = useState(false);

  const inputClass =
    "mt-2 w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500";

  const [form, setForm] = useState<FooterForm>({
    templeName: "",
    address: "",
    phone: "",
    email: "",
    facebook: "",
    instagram: "",
    youtube: "",
    copyright: "",
  });

  useEffect(() => {
    loadFooter();
  }, []);

  async function loadFooter() {
    try {
      const snap = await getDoc(doc(db, "footer", "main"));

      if (snap.exists()) {
        setForm((prev) => ({
          ...prev,
          ...(snap.data() as FooterForm),
        }));
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function saveFooter() {
    try {
      setLoading(true);

      await setDoc(doc(db, "footer", "main"), form);

      alert("Footer updated successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to save footer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">

  {/* Header */}

  <div>
    <h1 className="text-3xl font-bold text-gray-800">
      Footer Management
    </h1>

    <p className="mt-2 text-gray-600">
      Manage footer information displayed on the website.
    </p>
  </div>

  {/* Footer Form */}

  <div className="rounded-2xl border bg-white shadow-lg p-8 space-y-6">

    <h2 className="text-2xl font-bold text-amber-600 border-b pb-3">
      Footer Information
    </h2>

    <div>
      <label className="block font-medium text-gray-700">
        Temple Name
      </label>

      <input
        className={inputClass}
        value={form.templeName}
        onChange={(e) =>
          setForm({
            ...form,
            templeName: e.target.value,
          })
        }
      />
    </div>

    <div>
      <label className="block font-medium text-gray-700">
        Address
      </label>

      <textarea
        rows={3}
        className={inputClass}
        value={form.address}
        onChange={(e) =>
          setForm({
            ...form,
            address: e.target.value,
          })
        }
      />
    </div>

    <div className="grid md:grid-cols-2 gap-6">

      <div>
        <label className="block font-medium text-gray-700">
          Phone
        </label>

        <input
          className={inputClass}
          value={form.phone}
          onChange={(e) =>
            setForm({
              ...form,
              phone: e.target.value,
            })
          }
        />
      </div>

      <div>
        <label className="block font-medium text-gray-700">
          Email
        </label>

        <input
          type="email"
          className={inputClass}
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
        />
      </div>

    </div>

    <div>
      <label className="block font-medium text-gray-700">
        Facebook URL
      </label>

      <input
        className={inputClass}
        value={form.facebook}
        onChange={(e) =>
          setForm({
            ...form,
            facebook: e.target.value,
          })
        }
      />
    </div>

    <div>
      <label className="block font-medium text-gray-700">
        Instagram URL
      </label>

      <input
        className={inputClass}
        value={form.instagram}
        onChange={(e) =>
          setForm({
            ...form,
            instagram: e.target.value,
          })
        }
      />
    </div>

    <div>
      <label className="block font-medium text-gray-700">
        YouTube URL
      </label>

      <input
        className={inputClass}
        value={form.youtube}
        onChange={(e) =>
          setForm({
            ...form,
            youtube: e.target.value,
          })
        }
      />
    </div>

    <div>
      <label className="block font-medium text-gray-700">
        Copyright
      </label>

      <textarea
        rows={2}
        className={inputClass}
        value={form.copyright}
        onChange={(e) =>
          setForm({
            ...form,
            copyright: e.target.value,
          })
        }
      />
    </div>

  </div>

  {/* Save Button */}

  <div className="flex justify-end">

    <button
      onClick={saveFooter}
      disabled={loading}
      className="rounded-xl bg-amber-500 px-8 py-3 font-semibold text-white hover:bg-amber-600 disabled:bg-gray-400"
    >
      {loading ? "Saving..." : "Save Footer"}
    </button>

  </div>

</div>
  );
}