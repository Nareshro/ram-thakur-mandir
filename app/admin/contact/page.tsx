"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import toast from "react-hot-toast";

interface ContactForm {
  address: string;
  phone: string;
  email: string;
  mapUrl: string;
}

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<ContactForm>({
    address: "",
    phone: "",
    email: "",
    mapUrl:
      "https://www.google.com/maps?q=Banamalipur%20Agartala&output=embed",
  });

  useEffect(() => {
    loadContact();
  }, []);

  async function loadContact() {
    try {
      const snap = await getDoc(doc(db, "homepage", "main"));

      if (snap.exists()) {
        const data = snap.data();

        setForm({
          address: data.address || "",
          phone: data.phone || "",
          email: data.email || "",
          mapUrl:
            data.mapUrl ||
            "https://www.google.com/maps?q=Banamalipur%20Agartala&output=embed",
        });
      }
    } catch (error) {
      console.error("Failed to load contact:", error);
      toast.error("Failed to load contact details");
    }
  }

  async function saveContact() {
    try {
      setLoading(true);

      await setDoc(
        doc(db, "homepage", "main"),
        {
          address: form.address,
          phone: form.phone,
          email: form.email,
          mapUrl: form.mapUrl,
        },
        { merge: true }
      );

      toast.success("Contact details updated successfully");
    } catch (error) {
      console.error("Failed to save contact:", error);
      toast.error("Failed to update contact details");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500";

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-stone-800">
          Contact Management
        </h1>

        <p className="mt-2 text-gray-600">
          Manage temple address, phone, email and Google Map location.
        </p>
      </div>

      {/* Contact Card */}
      <div className="bg-white rounded-xl shadow p-8 space-y-6">

        <h2 className="text-2xl font-bold text-amber-600 border-b pb-3">
          Contact Information
        </h2>

        {/* Address */}
        <div>
          <label className="block font-medium text-gray-700">
            Temple Address
          </label>

          <textarea
            rows={5}
            className={inputClass}
            placeholder="Shri Shri Ram Thakur Seva Mandir&#10;Banamalipur&#10;Agartala&#10;Tripura - 799001"
            value={form.address}
            onChange={(e) =>
              setForm({
                ...form,
                address: e.target.value,
              })
            }
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block font-medium text-gray-700">
            Phone Number
          </label>

          <input
            type="text"
            className={inputClass}
            placeholder="+91 97740 50010"
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value,
              })
            }
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium text-gray-700">
            Email
          </label>

          <input
            type="email"
            className={inputClass}
            placeholder="info@ramthakurmandir.org"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />
        </div>

        {/* Map URL */}
        <div>
          <label className="block font-medium text-gray-700">
            Google Map Embed URL
          </label>

          <input
            type="text"
            className={inputClass}
            placeholder="Google Maps embed URL"
            value={form.mapUrl}
            onChange={(e) =>
              setForm({
                ...form,
                mapUrl: e.target.value,
              })
            }
          />

          <p className="mt-2 text-sm text-gray-500">
            Paste your Google Maps embed URL here.
          </p>
        </div>

        {/* Map Preview */}
        {form.mapUrl && (
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Map Preview
            </label>

            <div className="overflow-hidden rounded-xl border border-gray-200">
              <iframe
                title="Temple Location"
                src={form.mapUrl}
                width="100%"
                height="350"
                loading="lazy"
                className="border-0"
              />
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={saveContact}
            disabled={loading}
            className="rounded-xl bg-amber-500 px-8 py-3 font-semibold text-white hover:bg-amber-600 disabled:bg-gray-400"
          >
            {loading ? "Saving..." : "Save Contact Details"}
          </button>
        </div>

      </div>
    </div>
  );
}