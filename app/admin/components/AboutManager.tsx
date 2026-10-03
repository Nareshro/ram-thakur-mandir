
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

const sections = [
  { label: "History", collection: "about", preferredId: "history" },
  { label: "At a Glance", collection: "about", preferredId: "glance" },
  { label: "Executive Committee", collection: "committee", preferredId: "" },
];

const formatLabel = (key: string) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/^./, (letter) => letter.toUpperCase());

export default function AboutManager() {
  const [activeSection, setActiveSection] = useState(0);
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const section = sections[activeSection];

  const loadRecords = async () => {
    setLoading(true);
    setMessage("");

    try {
      const snapshot = await getDocs(
        collection(db, section.collection)
      );

      const items = snapshot.docs.map((item) => ({
        id: item.id,
        data: item.data(),
      }));

      setRecords(items);

      const preferred = items.find(
        (item) => item.id === section.preferredId
      );

      const selected = preferred || items[0];

      if (selected) {
        setSelectedId(selected.id);
        setFormData({ ...selected.data });
      } else {
        setSelectedId("");
        setFormData({});
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to load records. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [activeSection]);

  const selectRecord = (id: string) => {
    const record = records.find((item) => item.id === id);
    if (!record) return;

    setSelectedId(id);
    setFormData({ ...record.data });
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
      setMessage("No existing record selected.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      await updateDoc(
        doc(db, section.collection, selectedId),
        formData
      );

      setRecords((previous) =>
        previous.map((item) =>
          item.id === selectedId
            ? { ...item, data: { ...formData } }
            : item
        )
      );

      setMessage("Changes saved successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const editableFields = Object.entries(formData).filter(
    ([key, value]) =>
      key !== "createdAt" &&
      key !== "updatedAt" &&
      (typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean" ||
        value === null)
  );

  const preservedFields = Object.entries(formData).filter(
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
            About Us Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage temple information and committee details.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {sections.map((item, index) => (
            <button
              key={item.label}
              onClick={() => setActiveSection(index)}
              className={`rounded-lg px-4 py-3 text-sm font-medium transition ${
                activeSection === index
                  ? "bg-[#50190f] text-white"
                  : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:p-7">
          {loading ? (
            <p className="py-10 text-center text-gray-500">
              Loading information...
            </p>
          ) : records.length === 0 ? (
            <div className="py-10 text-center">
              <p className="font-medium text-gray-700">
                No existing records found in "{section.collection}".
              </p>
              <p className="mt-2 text-sm text-gray-500">
                No data has been changed. Create the required Firestore
                document before editing this section.
              </p>
            </div>
          ) : (
            <>
              {records.length > 1 && (
                <div className="mb-6 max-w-md">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Select Record
                  </label>
                  <select
                    value={selectedId}
                    onChange={(event) => selectRecord(event.target.value)}
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

              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {section.label}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Firestore document: {selectedId}
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
                {editableFields.map(([key, value]) => (
                  <div
                    key={key}
                    className={
                      typeof value === "string" &&
                      (value.length > 120 || key.toLowerCase().includes("description") ||
                        key.toLowerCase().includes("content") ||
                        key.toLowerCase().includes("history"))
                        ? "md:col-span-2"
                        : ""
                    }
                  >
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      {formatLabel(key)}
                    </label>

                    {typeof value === "boolean" ? (
                      <label className="flex items-center gap-3 rounded-lg border p-3">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(event) =>
                            handleChange(key, event.target.checked)
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
                        onChange={(event) =>
                          handleChange(
                            key,
                            event.target.value === ""
                              ? 0
                              : Number(event.target.value)
                          )
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-[#8b3a25]"
                      />
                    ) : (
                      <textarea
                        rows={
                          value.length > 120 ||
                          key.toLowerCase().includes("description") ||
                          key.toLowerCase().includes("content") ||
                          key.toLowerCase().includes("history")
                            ? 6
                            : 3
                        }
                        value={value ?? ""}
                        onChange={(event) =>
                          handleChange(key, event.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-[#8b3a25]"
                      />
                    )}
                  </div>
                ))}
              </div>

              {preservedFields.length > 0 && (
                <div className="mt-6 rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
                  <p className="font-semibold">
                    Additional structured fields preserved
                  </p>
                  <p className="mt-1">
                    {preservedFields.map(([key]) => formatLabel(key)).join(", ")}
                  </p>
                  <p className="mt-1 text-xs">
                    These fields are retained when you save. They are not
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
                  disabled={saving || !selectedId}
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
