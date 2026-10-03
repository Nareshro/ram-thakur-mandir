
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";

const collections = [
  { value: "homepage", label: "Website Information" },
  { value: "about", label: "About Us" },
  { value: "guru", label: "Sri Sri Thakur" },
  { value: "committee", label: "Executive Committee" },
  { value: "activities", label: "Activities" },
  { value: "timings", label: "Puja Calendar" },
  { value: "specialTimings", label: "Special Events" },
  { value: "events", label: "Upcoming Events" },
  { value: "announcements", label: "Announcements" },
  { value: "gallery", label: "Photo Gallery" },
  { value: "donation", label: "Donation Details" },
  { value: "footer", label: "Contact Details" },
  { value: "publications", label: "Publications" },
]

type RecordItem = {
  id: string;
  data: Record<string, unknown>;
};

export default function ContentManager() {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);
  const [selectedCollection, setSelectedCollection] =
    useState("about");

  const [records, setRecords] = useState<RecordItem[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [editor, setEditor] = useState("{}");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/admin/login");
        return;
      }

      setAuthorized(true);
    });

    return () => unsubscribe();
  }, [router]);

  async function loadRecords() {
    setLoading(true);
    setMessage("");
    setSelectedId("");
    setEditor("{}");

    try {
      const snapshot = await getDocs(
        collection(db, selectedCollection)
      );

      setRecords(
        snapshot.docs.map((item) => ({
          id: item.id,
          data: item.data() as Record<string, unknown>,
        }))
      );
    } catch (error) {
      console.error(error);
      setMessage("Unable to load records. Check Firestore rules.");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authorized) {
      loadRecords();
    }
  }, [authorized, selectedCollection]);

  function selectRecord(record: RecordItem) {
    setSelectedId(record.id);
    setEditor(JSON.stringify(record.data, null, 2));
    setMessage("");
  }

  function createRecord() {
  setSelectedId("__new__");
  setEditor(
    JSON.stringify(
      {
        title: "",
        description: "",
        imageUrl: ""
      },
      null,
      2
    )
  );
  setMessage("New record ready. Enter the details and click Save Changes.");
}

  async function saveRecord() {
    if (!selectedId) {
      setMessage("Select an existing record or click Add New Record.");
      return;
    }

    let parsed: Record<string, unknown>;

    try {
      parsed = JSON.parse(editor);

      if (
        !parsed ||
        typeof parsed !== "object" ||
        Array.isArray(parsed)
      ) {
        setMessage("Please enter a valid JSON object.");
        return;
      }
    } catch {
      setMessage("Invalid JSON. Please correct the format.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      if (selectedId === "__new__") {
        await addDoc(
          collection(db, selectedCollection),
          parsed
        );

        setMessage("New record created successfully.");
      } else {
        await setDoc(
          doc(db, selectedCollection, selectedId),
          parsed,
          { merge: true }
        );

        setMessage("Changes saved successfully.");
      }

      await loadRecords();
    } catch (error) {
      console.error(error);
      setMessage("Save failed. Check Firestore permissions.");
    } finally {
      setSaving(false);
    }
  }

  async function removeRecord() {
    if (!selectedId || selectedId === "__new__") return;

    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this record?"
    );

    if (!confirmed) return;

    try {
      await deleteDoc(
        doc(db, selectedCollection, selectedId)
      );

      setMessage("Record deleted successfully.");
      await loadRecords();
    } catch (error) {
      console.error(error);
      setMessage("Delete failed. Check Firestore permissions.");
    }
  }

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Checking administrator access...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff8ed] p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-orange-700">
              RAM THAKUR MANDIR
            </p>

            <h1 className="text-3xl font-bold text-red-950">
              Website Content Manager
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Manage your existing website content.
            </p>
          </div>

          <button
            onClick={() => router.push("/admin/dashboard")}
            className="rounded-lg border border-red-900 px-5 py-3 text-sm font-semibold text-red-900"
          >
            ← Dashboard
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <section className="rounded-2xl border bg-white p-5">
            <h2 className="mb-4 font-bold text-red-950">
              Website Sections
            </h2>

            <select
              value={selectedCollection}
              onChange={(e) =>
                setSelectedCollection(e.target.value)
              }
              className="w-full rounded-lg border p-3 text-gray-800"
            >
             {collections.map((item) => (
  <option key={item.value} value={item.value}>
    {item.label}
  </option>
))}
            </select>

            <button
              onClick={createRecord}
              className="mt-4 w-full rounded-lg bg-amber-500 px-4 py-3 font-semibold text-red-950 hover:bg-amber-400"
            >
              + Add New Record
            </button>

            <h3 className="mb-3 mt-7 text-sm font-semibold text-gray-700">
              Existing Records
            </h3>

            {loading ? (
              <p className="text-sm text-gray-500">
                Loading...
              </p>
            ) : records.length === 0 ? (
              <p className="text-sm text-gray-500">
                No records found.
              </p>
            ) : (
              <div className="space-y-2">
                {records.map((record) => (
                  <button
                    key={record.id}
                    onClick={() => selectRecord(record)}
                    className={`w-full break-all rounded-lg border p-3 text-left text-sm ${
                      selectedId === record.id
                        ? "border-amber-500 bg-amber-50 text-red-950"
                        : "border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {record.id}
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border bg-white p-5 md:p-7">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-red-950">
                  Edit Content
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Collection: {selectedCollection}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Selected record: {selectedId || "None"}
                </p>
              </div>

              {selectedId && selectedId !== "__new__" && (
                <button
                  onClick={removeRecord}
                  className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete Record
                </button>
              )}
            </div>

            <textarea
              value={editor}
              onChange={(e) => setEditor(e.target.value)}
              spellCheck={false}
              className="min-h-[400px] w-full rounded-xl border border-gray-300 bg-slate-950 p-4 font-mono text-sm leading-6 text-green-300 outline-none focus:border-amber-500"
              placeholder="Select a record or create a new one..."
            />

            <p className="mt-3 text-xs text-gray-500">
              Enter valid JSON. Existing fields are preserved when
              saving changes.
            </p>

            {message && (
              <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                {message}
              </p>
            )}

            <button
              type="button"
              onClick={saveRecord}
              disabled={saving || !selectedId}
              className="mt-5 w-full rounded-lg bg-red-900 px-6 py-3 font-semibold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}
