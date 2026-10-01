"use client";

import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";

interface TimingsForm {
  morningOpen: string;
  morningClose: string;
  eveningOpen: string;
  eveningClose: string;
  aartiTime: string;
  specialNote: string;
}

interface SpecialTiming {
  id?: string;
  title: string;
  date: string;
  openingTime: string;
  closingTime: string;
  aartiTime: string;
  note: string;
  active: boolean;
}

export default function TimingsPage() {
  /* =========================
     REGULAR TIMINGS
  ========================= */

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<TimingsForm>({
    morningOpen: "",
    morningClose: "",
    eveningOpen: "",
    eveningClose: "",
    aartiTime: "",
    specialNote: "",
  });

  /* =========================
     SPECIAL TIMINGS
  ========================= */

  const [specialTimings, setSpecialTimings] = useState<
    SpecialTiming[]
  >([]);

  const [specialLoading, setSpecialLoading] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [specialForm, setSpecialForm] =
    useState<SpecialTiming>({
      title: "",
      date: "",
      openingTime: "",
      closingTime: "",
      aartiTime: "",
      note: "",
      active: true,
    });

  const inputClass =
    "mt-2 w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500";

  /* =========================
     LOAD DATA
  ========================= */

  useEffect(() => {
    loadTimings();
    loadSpecialTimings();
  }, []);

  async function loadTimings() {
    try {
      const snap = await getDocSafe();

      if (snap) {
        setForm((prev) => ({
          ...prev,
          ...(snap as TimingsForm),
        }));
      }
    } catch (error) {
      console.error("Failed to load timings:", error);
    }
  }

  async function loadSpecialTimings() {
    try {
      setSpecialLoading(true);

      const snapshot = await getDocs(
        collection(db, "specialTimings")
      );

      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...(item.data() as Omit<SpecialTiming, "id">),
      }));

      data.sort((a, b) => a.date.localeCompare(b.date));

      setSpecialTimings(data);
    } catch (error) {
      console.error(
        "Failed to load special timings:",
        error
      );
    } finally {
      setSpecialLoading(false);
    }
  }

  /* =========================
     SAVE REGULAR TIMINGS
  ========================= */

  async function saveTimings() {
    try {
      setLoading(true);

      await setDoc(
        doc(db, "timings", "main"),
        form,
        { merge: true }
      );

      alert("Temple timings updated successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to save timings.");
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     SAVE SPECIAL TIMING
  ========================= */

  async function saveSpecialTiming() {
    if (!specialForm.title.trim()) {
      alert("Please enter the festival/event name.");
      return;
    }

    if (!specialForm.date) {
      alert("Please select a date.");
      return;
    }

    try {
      setSpecialLoading(true);

      if (editingId) {
        await setDoc(
          doc(db, "specialTimings", editingId),
          specialForm,
          { merge: true }
        );

        alert(
          "Special timing updated successfully."
        );
      } else {
        const newDocRef = doc(
          collection(db, "specialTimings")
        );

        await setDoc(newDocRef, specialForm);

        alert(
          "Special timing added successfully."
        );
      }

      resetSpecialForm();

      await loadSpecialTimings();
    } catch (error) {
      console.error(error);
      alert("Failed to save special timing.");
    } finally {
      setSpecialLoading(false);
    }
  }

  /* =========================
     EDIT SPECIAL TIMING
  ========================= */

  function editSpecialTiming(item: SpecialTiming) {
    setEditingId(item.id || null);

    setSpecialForm({
      title: item.title || "",
      date: item.date || "",
      openingTime: item.openingTime || "",
      closingTime: item.closingTime || "",
      aartiTime: item.aartiTime || "",
      note: item.note || "",
      active: item.active ?? true,
    });

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }

  /* =========================
     DELETE SPECIAL TIMING
  ========================= */

  async function deleteSpecialTiming(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this special timing?"
    );

    if (!confirmed) return;

    try {
      await deleteDoc(
        doc(db, "specialTimings", id)
      );

      alert(
        "Special timing deleted successfully."
      );

      await loadSpecialTimings();
    } catch (error) {
      console.error(error);
      alert("Failed to delete special timing.");
    }
  }

  /* =========================
     RESET FORM
  ========================= */

  function resetSpecialForm() {
    setEditingId(null);

    setSpecialForm({
      title: "",
      date: "",
      openingTime: "",
      closingTime: "",
      aartiTime: "",
      note: "",
      active: true,
    });
  }

  return (
    <div className="space-y-10">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div>
        <h1 className="text-3xl font-bold text-stone-800">
          Timings Management
        </h1>

        <p className="mt-2 text-gray-600">
          Manage regular temple timings and special
          festival timings.
        </p>
      </div>

      {/* =========================
          REGULAR TIMINGS
      ========================= */}

      <div className="rounded-2xl bg-white p-8 shadow">

        <h2 className="border-b pb-3 text-2xl font-bold text-amber-600">
          Temple Timings
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-2">

          <div>
            <label className="font-medium text-gray-700">
              Morning Opening
            </label>

            <input
              className={inputClass}
              placeholder="6:00 AM"
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
            <label className="font-medium text-gray-700">
              Morning Closing
            </label>

            <input
              className={inputClass}
              placeholder="12:30 PM"
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
            <label className="font-medium text-gray-700">
              Evening Opening
            </label>

            <input
              className={inputClass}
              placeholder="3:30 PM"
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
            <label className="font-medium text-gray-700">
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

        <div className="mt-6">

          <label className="font-medium text-gray-700">
            Daily Aarti Time
          </label>

          <input
            className={inputClass}
            placeholder="5:30 PM"
            value={form.aartiTime}
            onChange={(e) =>
              setForm({
                ...form,
                aartiTime: e.target.value,
              })
            }
          />

        </div>

        <div className="mt-6">

          <label className="font-medium text-gray-700">
            General Special Note
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

        <button
          onClick={saveTimings}
          disabled={loading}
          className="mt-6 rounded-xl bg-amber-500 px-8 py-3 font-semibold text-white hover:bg-amber-600 disabled:bg-gray-400"
        >
          {loading
            ? "Saving..."
            : "Save Timings"}
        </button>

      </div>

      {/* =========================
          SPECIAL TIMINGS
      ========================= */}

      <div className="rounded-2xl bg-white p-8 shadow">

        <div className="flex flex-col gap-4 border-b pb-4 md:flex-row md:items-center md:justify-between">

          <div>
            <h2 className="text-2xl font-bold text-amber-600">
              Special Timings
            </h2>

            <p className="mt-1 text-gray-500">
              Add special timings for festivals,
              poojas and important occasions.
            </p>
          </div>

        </div>

        {/* =========================
            ADD / EDIT FORM
        ========================= */}

        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6">

          <h3 className="text-xl font-bold text-stone-800">
            {editingId
              ? "Edit Special Timing"
              : "Add Special Timing"}
          </h3>

          <div className="mt-5 grid gap-6 md:grid-cols-2">

            {/* TITLE */}

            <div>
              <label className="font-medium text-gray-700">
                Festival / Event Name
              </label>

              <input
                className={inputClass}
                placeholder="Guru Purnima"
                value={specialForm.title}
                onChange={(e) =>
                  setSpecialForm({
                    ...specialForm,
                    title: e.target.value,
                  })
                }
              />
            </div>

            {/* DATE */}

            <div>
              <label className="font-medium text-gray-700">
                Date
              </label>

              <input
                type="date"
                className={inputClass}
                value={specialForm.date}
                onChange={(e) =>
                  setSpecialForm({
                    ...specialForm,
                    date: e.target.value,
                  })
                }
              />
            </div>

            {/* OPENING */}

            <div>
              <label className="font-medium text-gray-700">
                Opening Time
              </label>

              <input
                className={inputClass}
                placeholder="5:00 AM"
                value={specialForm.openingTime}
                onChange={(e) =>
                  setSpecialForm({
                    ...specialForm,
                    openingTime: e.target.value,
                  })
                }
              />
            </div>

            {/* CLOSING */}

            <div>
              <label className="font-medium text-gray-700">
                Closing Time
              </label>

              <input
                className={inputClass}
                placeholder="10:00 PM"
                value={specialForm.closingTime}
                onChange={(e) =>
                  setSpecialForm({
                    ...specialForm,
                    closingTime: e.target.value,
                  })
                }
              />
            </div>

            {/* AARTI */}

            <div>
              <label className="font-medium text-gray-700">
                Special Aarti Time
              </label>

              <input
                className={inputClass}
                placeholder="8:00 PM"
                value={specialForm.aartiTime}
                onChange={(e) =>
                  setSpecialForm({
                    ...specialForm,
                    aartiTime: e.target.value,
                  })
                }
              />
            </div>

            {/* ACTIVE */}

            <div className="flex items-end">

              <label className="flex cursor-pointer items-center gap-3">

                <input
                  type="checkbox"
                  checked={specialForm.active}
                  onChange={(e) =>
                    setSpecialForm({
                      ...specialForm,
                      active: e.target.checked,
                    })
                  }
                  className="h-5 w-5"
                />

                <span className="font-medium text-gray-700">
                  Active
                </span>

              </label>

            </div>

          </div>

          {/* NOTE */}

          <div className="mt-6">

            <label className="font-medium text-gray-700">
              Special Note
            </label>

            <textarea
              rows={3}
              className={inputClass}
              placeholder="Special prayers and bhajans will be conducted."
              value={specialForm.note}
              onChange={(e) =>
                setSpecialForm({
                  ...specialForm,
                  note: e.target.value,
                })
              }
            />

          </div>

          {/* BUTTONS */}

          <div className="mt-6 flex gap-3">

            <button
              onClick={saveSpecialTiming}
              disabled={specialLoading}
              className="rounded-xl bg-amber-500 px-7 py-3 font-semibold text-white hover:bg-amber-600 disabled:bg-gray-400"
            >
              {specialLoading
                ? "Saving..."
                : editingId
                ? "Update Special Timing"
                : "Add Special Timing"}
            </button>

            {editingId && (
              <button
                onClick={resetSpecialForm}
                className="rounded-xl border border-gray-300 bg-white px-7 py-3 font-semibold text-gray-700 hover:bg-gray-100"
              >
                Cancel Edit
              </button>
            )}

          </div>

        </div>

        {/* =========================
            SPECIAL TIMINGS TABLE
        ========================= */}

        <div className="mt-8 overflow-x-auto">

          <table className="w-full min-w-[900px]">

            <thead className="bg-stone-100 text-stone-700">

              <tr>
                <th className="p-4 text-left">
                  Festival / Event
                </th>

                <th className="p-4 text-left">
                  Date
                </th>

                <th className="p-4 text-left">
                  Opening
                </th>

                <th className="p-4 text-left">
                  Closing
                </th>

                <th className="p-4 text-left">
                  Aarti
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

              {specialTimings.length === 0 ? (

                <tr>
                  <td
                    colSpan={7}
                    className="p-10 text-center text-gray-500"
                  >
                    No special timings added yet.
                  </td>
                </tr>

              ) : (

                specialTimings.map((item) => (

                  <tr
                    key={item.id}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="p-4 font-semibold text-stone-800">
                      {item.title}
                    </td>

                    <td className="p-4 text-gray-700">
                      {item.date}
                    </td>

                    <td className="p-4 text-gray-700">
                      {item.openingTime || "--"}
                    </td>

                    <td className="p-4 text-gray-700">
                      {item.closingTime || "--"}
                    </td>

                    <td className="p-4 text-gray-700">
                      {item.aartiTime || "--"}
                    </td>

                    <td className="p-4">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
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
                            editSpecialTiming(item)
                          }
                          className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            deleteSpecialTiming(
                              item.id!
                            )
                          }
                          className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
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

/*
  Small helper to keep the regular timings loader clean.
*/
async function getDocSafe(): Promise<TimingsForm | null> {
  const { getDoc, doc } = await import(
    "firebase/firestore"
  );

  const snapshot = await getDoc(
    doc(db, "timings", "main")
  );

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as TimingsForm;
}