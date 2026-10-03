
"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";

type RecordItem = {
  id: string;
  data: Record<string, any>;
};

const formatLabel = (key: string) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/^./, (letter) => letter.toUpperCase());

export default function ContactManager() {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadRecords = async () => {
    setLoading(true);
    setMessage("");

    try {
      const snapshot = await getDocs(collection(db, "footer"));

      const items = snapshot.docs.map((item) => ({
        id: item.id,
        data: item.data(),
      }));

      setRecords(items);

      if (items.length > 0) {
        const selected = items.find((item) => item.id === selectedId) || items[0];
        setSelectedId(selected.id);
        setFormData({ ...selected.data });
      } else {
        setSelectedId("");
        setFormData({});
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to load contact information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const selectRecord = (id: string) => {
    const selected = records.find((item) => item.id === id);
    if (!selected) return;

    setSelectedId(id);
    setFormData({ ...selected.data });
    setMessage("");
  };

  const handleChange = (key: string, value: any) => {
    setFormData((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    if (!selectedId) {
      setMessage("No existing contact record found.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      await updateDoc(
        doc(db, "footer", selectedId),
        formData
      );

      setMessage("Contact information updated successfully.");
      await loadRecords();
    } catch (error) {
      console.error(error);
      setMessage("Unable to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const fields = Object.entries(formData).filter(
    ([key, value]) =>
      key !== "createdAt" &&
      key !== "updatedAt" &&
      (typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean" ||
        value === null)
  );

  const structuredFields = Object.entries(formData).filter(
    ([key, value]) =>
      key !== "createdAt" &&
      key !== "updatedAt" &&
      value !== null &&
      typeof value === "object"
  );

  return (
    <div className="min-h-full bg-[#f8f5f0] p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#50190f]">
            Contact Details Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Update temple contact information and website details.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:p-7">
          {loading ? (
            <p className="py-10 text-center text-gray-500">
              Loading contact information...
            </p>
          ) : records.length === 0 ? (
            <div className="py-10 text-center">
              <p className="font-medium text-gray-700">
                No existing document found in the footer collection.
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Existing data has not been changed. Please create the
                contact document in Firestore before editing.
              </p>
            </div>
          ) : (
            <>
              {records.length > 1 && (
                <div className="mb-6 max-w-md">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Select Contact Record
                  </label>
                  <select
                    value={selectedId}
                    onChange={(e) => selectRecord(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-[#8b3a25]"
                  >
                    {records.map((record) => (
                      <option key={record.id} value={record.id}>
                        {record.data.name ||
                          record.data.title ||
                          record.id}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Temple Contact Information
                  </h3>
                  <p className="text-xs text-gray-400">
                    Document: {selectedId}
                  </p>
                </div>

                <button
                  onClick={loadRecords}
                  className="rounded-lg border px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  Refresh
                </button>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {fields.map(([key, value]) => {
                  const lowerKey = key.toLowerCase();

                  const isLong =
                    typeof value === "string" &&
                    (value.length > 100 ||
                      lowerKey.includes("address") ||
                      lowerKey.includes("description") ||
                      lowerKey.includes("location"));

                  return (
                    <div
                      key={key}
                      className={isLong ? "md:col-span-2" : ""}
                    >
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        {formatLabel(key)}
                      </label>

                      {typeof value === "boolean" ? (
                        <label className="flex items-center gap-3 rounded-lg border p-3">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) =>
                              handleChange(key, e.target.checked)
                            }
                            className="h-4 w-4 accent-[#50190f]"
                          />
                          <span className="text-sm text-gray-700">
                            {value ? "Enabled" : "Disabled"}
                          </span>
                        </label>
                      ) : typeof value === "number" ? (
                        <input
                          type="number"
                          value={value}
                          onChange={(e) =>
                            handleChange(
                              key,
                              e.target.value === ""
                                ? 0
                                : Number(e.target.value)
                            )
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-[#8b3a25]"
                        />
                      ) : (
                        <textarea
                          rows={isLong ? 4 : 2}
                          value={value ?? ""}
                          onChange={(e) =>
                            handleChange(key, e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-[#8b3a25]"
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {structuredFields.length > 0 && (
                <div className="mt-6 rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
                  <p className="font-semibold">
                    Structured information preserved
                  </p>
                  <p className="mt-1">
                    {structuredFields
                      .map(([key]) => formatLabel(key))
                      .join(", ")}
                  </p>
                  <p className="mt-1 text-xs">
                    These fields are retained when saving but are not
                    editable in this form.
                  </p>
                </div>
              )}

              {message && (
                <p className="mt-5 text-sm font-medium text-gray-700">
                  {message}
                </p>
              )}

              <div className="mt-7 flex justify-end border-t pt-5">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-lg bg-[#50190f] px-6 py-3 font-medium text-white hover:bg-[#6b281b] disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
