"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  Guru,
  getGurus,
  addGuru,
  updateGuru,
  deleteGuru,
} from "@/app/lib/guruService";

import { uploadImage } from "@/app/lib/storageService";

export default function GuruForm() {
  const [gurus, setGurus] = useState<Guru[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const emptyForm: Guru = {
    name: "",
    subtitle: "",
    description1: "",
    description2: "",
    description3: "",
    image: "",
    displayOrder: 1,
  };

  const [form, setForm] =
    useState<Guru>(emptyForm);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [showForm, setShowForm] =
    useState(false);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [previewUrl, setPreviewUrl] =
    useState("");

  useEffect(() => {
    loadGurus();
  }, []);

  async function loadGurus() {
    try {
      setLoading(true);

      const data = await getGurus();

      setGurus(data);
    } catch (error) {
      console.error(
        "Failed to load Gurus:",
        error
      );

      toast.error(
        "Failed to load Gurus"
      );
    } finally {
      setLoading(false);
    }
  }

  function openAddForm() {
    setForm({
      ...emptyForm,
      displayOrder:
        gurus.length + 1,
    });

    setEditingId(null);

    setSelectedFile(null);
    setPreviewUrl("");

    setShowForm(true);
  }

  function openEditForm(guru: Guru) {
    setForm({
      ...guru,
      displayOrder:
        Number(guru.displayOrder) || 1,
    });

    setEditingId(
      guru.id || null
    );

    setSelectedFile(null);

    setPreviewUrl(
      guru.image || ""
    );

    setShowForm(true);
  }

  function closeForm() {
    if (saving) {
      return;
    }

    setShowForm(false);
    setEditingId(null);

    setForm(emptyForm);

    setSelectedFile(null);
    setPreviewUrl("");
  }

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error(
        "Please select a valid image file."
      );

      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      toast.error(
        "Image size must be less than 5 MB."
      );

      return;
    }

    setSelectedFile(file);

    const objectUrl =
      URL.createObjectURL(file);

    setPreviewUrl(objectUrl);
  }

  async function handleSave() {
    if (!form.name.trim()) {
      toast.error(
        "Please enter the Guru name."
      );

      return;
    }

    if (!form.subtitle.trim()) {
      toast.error(
        "Please enter the subtitle."
      );

      return;
    }

    if (!form.description1.trim()) {
      toast.error(
        "Please enter Description 1."
      );

      return;
    }

    // New Guru requires an image.
    if (
      !editingId &&
      !selectedFile
    ) {
      toast.error(
        "Please select a Guru image."
      );

      return;
    }

    // Existing Guru must have either
    // the existing image or a new image.
    if (
      editingId &&
      !selectedFile &&
      !form.image
    ) {
      toast.error(
        "Please select a Guru image."
      );

      return;
    }

    try {
      setSaving(true);

      let imageUrl =
        form.image;

      /*
       * Upload only if a new image
       * has been selected.
       */
      if (selectedFile) {
        console.log(
          "Starting Guru image upload:",
          selectedFile.name
        );

        imageUrl =
          await uploadImage(
            selectedFile,
            "guru"
          );

        console.log(
          "Guru image uploaded:",
          imageUrl
        );
      }

      const data = {
        name: form.name.trim(),
        subtitle:
          form.subtitle.trim(),
        description1:
          form.description1.trim(),
        description2:
          form.description2.trim(),
        description3:
          form.description3.trim(),
        image: imageUrl,
        displayOrder:
          Number(form.displayOrder) || 1,
      };

      console.log(
        "Saving Guru:",
        data
      );

      if (editingId) {
        await updateGuru(
          editingId,
          data
        );

        toast.success(
          "Guru updated successfully"
        );
      } else {
        await addGuru(data);

        toast.success(
          "Guru added successfully"
        );
      }

      closeForm();

      await loadGurus();

    } catch (error) {
      console.error(
        "Failed to save Guru:",
        error
      );

      toast.error(
        "Failed to save Guru"
      );

    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(
    id: string
  ) {
    const confirmed =
      confirm(
        "Are you sure you want to delete this Guru?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteGuru(id);

      toast.success(
        "Guru deleted successfully"
      );

      await loadGurus();

    } catch (error) {
      console.error(
        "Failed to delete Guru:",
        error
      );

      toast.error(
        "Failed to delete Guru"
      );
    }
  }

  return (
    <div className="p-8">

      {/* Header */}

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Guru Management
          </h1>

          <p className="mt-2 text-gray-600">
            Manage multiple Gurus
            displayed on the website.
          </p>

        </div>

        <button
          onClick={openAddForm}
          disabled={saving}
          className="rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 disabled:bg-gray-400"
        >
          + Add Guru
        </button>

      </div>

      {/* Add / Edit Form */}

      {showForm && (
        <div className="mb-8 rounded-2xl bg-white p-8 shadow-lg">

          <h2 className="mb-6 text-2xl font-bold text-gray-800">
            {editingId
              ? "Edit Guru"
              : "Add Guru"}
          </h2>

          <div className="grid gap-5">

            {/* Name */}

            <div>

              <label className="block font-medium text-gray-700">
                Guru Name *
              </label>

              <input
                value={form.name}
                disabled={saving}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name:
                      e.target.value,
                  })
                }
                placeholder="Sri Sri Ram Thakur"
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 text-gray-900 disabled:bg-gray-100"
              />

            </div>

            {/* Subtitle */}

            <div>

              <label className="block font-medium text-gray-700">
                Subtitle *
              </label>

              <input
                value={form.subtitle}
                disabled={saving}
                onChange={(e) =>
                  setForm({
                    ...form,
                    subtitle:
                      e.target.value,
                  })
                }
                placeholder="Love All • Serve All"
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 text-gray-900 disabled:bg-gray-100"
              />

            </div>

            {/* Image Upload */}

            <div>

              <label className="block font-medium text-gray-700">
                Guru Image
              </label>

              <div className="mt-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-5">

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handleFileChange
                  }
                  disabled={saving}
                  className="w-full text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-orange-500 file:px-5 file:py-2 file:text-white file:cursor-pointer hover:file:bg-orange-600 disabled:opacity-50"
                />

                <p className="mt-2 text-sm text-gray-500">
                  JPG, PNG or WEBP.
                  Maximum size: 5 MB.
                </p>

                {selectedFile && (
                  <p className="mt-3 text-sm font-medium text-green-600">
                    Selected:{" "}
                    {selectedFile.name}
                  </p>
                )}

              </div>

            </div>

            {/* Image Preview */}

            {previewUrl && (
              <div>

                <p className="mb-2 text-sm font-medium text-gray-700">
                  Image Preview
                </p>

                <img
                  src={previewUrl}
                  alt="Guru preview"
                  className="h-48 w-48 rounded-xl border object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display =
                      "none";
                  }}
                />

              </div>
            )}

            {/* Description 1 */}

            <div>

              <label className="block font-medium text-gray-700">
                Description 1 *
              </label>

              <textarea
                rows={5}
                value={
                  form.description1
                }
                disabled={saving}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description1:
                      e.target.value,
                  })
                }
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 text-gray-900 disabled:bg-gray-100"
              />

            </div>

            {/* Description 2 */}

            <div>

              <label className="block font-medium text-gray-700">
                Description 2
              </label>

              <textarea
                rows={5}
                value={
                  form.description2
                }
                disabled={saving}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description2:
                      e.target.value,
                  })
                }
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 text-gray-900 disabled:bg-gray-100"
              />

            </div>

            {/* Description 3 */}

            <div>

              <label className="block font-medium text-gray-700">
                Description 3
              </label>

              <textarea
                rows={5}
                value={
                  form.description3
                }
                disabled={saving}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description3:
                      e.target.value,
                  })
                }
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 text-gray-900 disabled:bg-gray-100"
              />

            </div>

            {/* Display Order */}

            <div>

              <label className="block font-medium text-gray-700">
                Display Order
              </label>

              <input
                type="number"
                min="1"
                value={
                  form.displayOrder
                }
                disabled={saving}
                onChange={(e) =>
                  setForm({
                    ...form,
                    displayOrder:
                      Number(
                        e.target.value
                      ) || 1,
                  })
                }
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 text-gray-900 disabled:bg-gray-100"
              />

            </div>

          </div>

          {/* Buttons */}

          <div className="mt-8 flex justify-end gap-3">

            <button
              onClick={closeForm}
              disabled={saving}
              className="rounded-lg border border-gray-300 px-5 py-3 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 disabled:bg-gray-400"
            >
              {saving
                ? "Uploading..."
                : editingId
                ? "Update Guru"
                : "Add Guru"}
            </button>

          </div>

        </div>
      )}

      {/* Guru List */}

      <div className="overflow-hidden rounded-2xl bg-white shadow-lg">

        <div className="border-b bg-gray-50 p-5">

          <h2 className="text-2xl font-bold text-gray-800">
            Gurus
          </h2>

          <p className="mt-1 text-gray-500">
            All Gurus currently
            displayed on the website.
          </p>

        </div>

        {loading ? (

          <div className="p-10 text-center text-gray-500">
            Loading Gurus...
          </div>

        ) : gurus.length === 0 ? (

          <div className="p-10 text-center text-gray-500">
            No Gurus found.
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-orange-500 text-white">

                <tr>

                  <th className="p-4 text-left">
                    Image
                  </th>

                  <th className="p-4 text-left">
                    Name
                  </th>

                  <th className="p-4 text-left">
                    Subtitle
                  </th>

                  <th className="p-4 text-center">
                    Order
                  </th>

                  <th className="p-4 text-center">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {gurus.map((guru) => (

                  <tr
                    key={guru.id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="p-4">

                      {guru.image ? (

                        <img
                          src={guru.image}
                          alt={guru.name}
                          className="h-16 w-16 rounded-lg object-cover"
                        />

                      ) : (

                        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-200 text-xs text-gray-500">
                          No Image
                        </div>

                      )}

                    </td>

                    <td className="p-4 font-semibold text-gray-800">
                      {guru.name}
                    </td>

                    <td className="p-4 text-gray-600">
                      {guru.subtitle}
                    </td>

                    <td className="p-4 text-center text-gray-800">
                      {guru.displayOrder}
                    </td>

                    <td className="p-4">

                      <div className="flex justify-center gap-2">

                        <button
                          onClick={() =>
                            openEditForm(guru)
                          }
                          disabled={saving}
                          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => {
                            if (guru.id) {
                              handleDelete(
                                guru.id
                              );
                            }
                          }}
                          disabled={saving}
                          className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:opacity-50"
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

        )}

      </div>

    </div>
  );
}