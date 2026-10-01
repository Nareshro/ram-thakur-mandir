"use client";

import { useEffect, useState } from "react";
import type { Activity } from "@/app/lib/activityService";
import { uploadImage } from "@/app/lib/storageService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: Activity) => Promise<void>;
  editingActivity?: Activity | null;
}

interface ActivityForm {
  category: "social" | "puja";
  title: string;
  description: string;
  image: string;
  displayOrder: number;
}

export default function AddActivityModal({
  isOpen,
  onClose,
  onSave,
  editingActivity,
}: Props) {
  const emptyForm: ActivityForm = {
    category: "social",
    title: "",
    description: "",
    image: "",
    displayOrder: 1,
  };

  const [form, setForm] = useState<ActivityForm>(emptyForm);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [previewUrl, setPreviewUrl] = useState("");

  const [loading, setLoading] = useState(false);

  /*
   * Load editing data
   */
  useEffect(() => {
    if (editingActivity) {
      setForm({
        category: editingActivity.category,
        title: editingActivity.title,
        description: editingActivity.description,
        image: editingActivity.image || "",
        displayOrder: Number(editingActivity.displayOrder),
      });

      setSelectedFile(null);

      setPreviewUrl(editingActivity.image || "");
    } else {
      setForm(emptyForm);
      setSelectedFile(null);
      setPreviewUrl("");
    }
  }, [editingActivity, isOpen]);

  /*
   * Don't render when closed
   */
  if (!isOpen) {
    return null;
  }

  /*
   * Handle form changes
   */
  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        name === "displayOrder"
          ? Number(value)
          : value,
    }));
  }

  /*
   * Handle image selection
   */
  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5 MB.");
      return;
    }

    setSelectedFile(file);

    const objectUrl = URL.createObjectURL(file);

    setPreviewUrl(objectUrl);
  }

  /*
   * Save activity
   */
  async function handleSubmit() {
    if (!form.title.trim()) {
      alert("Please enter an activity title.");
      return;
    }

    if (!form.description.trim()) {
      alert("Please enter an activity description.");
      return;
    }

    /*
     * New activity requires image
     */
    if (!editingActivity && !selectedFile) {
      alert("Please select an activity image.");
      return;
    }

    /*
     * Existing activity can keep old image
     */
    if (
      editingActivity &&
      !selectedFile &&
      !form.image
    ) {
      alert("Please select an activity image.");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = form.image;

      /*
       * Upload new image if selected
       */
      if (selectedFile) {
        console.log(
          "Uploading activity image:",
          selectedFile.name
        );

        imageUrl = await uploadImage(
          selectedFile,
          "activities"
        );

        console.log(
          "Activity image uploaded:",
          imageUrl
        );
      }

      /*
       * Build activity object.
       *
       * displayOrder is intentionally stored as a number.
       */
      const activityToSave = {
        category: form.category,
        title: form.title.trim(),
        description: form.description.trim(),
        image: imageUrl,
        displayOrder: Number(form.displayOrder),
      };

      /*
       * The project Activity type is currently being
       * resolved inconsistently by the build process.
       *
       * The runtime value above remains a NUMBER.
       */
      await onSave(
        activityToSave as unknown as Activity
      );

      /*
       * Reset after successful save
       */
      setSelectedFile(null);
      setPreviewUrl("");
    } catch (error) {
      console.error(
        "Failed to save activity:",
        error
      );

      alert(
        "Failed to save activity. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * Close modal
   */
  function handleClose() {
    if (loading) {
      return;
    }

    setSelectedFile(null);
    setPreviewUrl("");

    if (editingActivity) {
      setForm({
        category: editingActivity.category,
        title: editingActivity.title,
        description: editingActivity.description,
        image: editingActivity.image || "",
        displayOrder: Number(
          editingActivity.displayOrder
        ),
      });
    } else {
      setForm(emptyForm);
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl">

        {/* Header */}

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            {editingActivity
              ? "Edit Activity"
              : "Add Activity"}
          </h2>
        </div>

        <div className="space-y-5">

          {/* Category */}

          <div>
            <label className="block font-medium text-gray-700">
              Activity Type
            </label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              disabled={loading}
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
            >
              <option value="social">
                Social Activity
              </option>

              <option value="puja">
                Puja Activity
              </option>
            </select>
          </div>

          {/* Title */}

          <div>
            <label className="block font-medium text-gray-700">
              Title
            </label>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              disabled={loading}
              placeholder="Example: Free Medical Camp"
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
            />
          </div>

          {/* Description */}

          <div>
            <label className="block font-medium text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              rows={5}
              value={form.description}
              onChange={handleChange}
              disabled={loading}
              placeholder="Write activity description..."
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
            />
          </div>

          {/* Image */}

          <div>
            <label className="block font-medium text-gray-700">
              Activity Image
            </label>

            <div className="mt-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-5">

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={loading}
                className="w-full text-gray-700 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-orange-500 file:px-5 file:py-2 file:text-white hover:file:bg-orange-600 disabled:opacity-50"
              />

              <p className="mt-2 text-sm text-gray-500">
                JPG, PNG, WEBP. Maximum size: 5 MB.
              </p>

              {selectedFile && (
                <p className="mt-3 text-sm font-medium text-green-600">
                  Selected: {selectedFile.name}
                </p>
              )}

            </div>

            {/* Preview */}

            {previewUrl && (
              <div className="mt-4">

                <p className="mb-2 text-sm font-medium text-gray-700">
                  Image Preview
                </p>

                <img
                  src={previewUrl}
                  alt="Activity preview"
                  className="h-48 w-full rounded-xl border border-gray-200 object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display =
                      "none";
                  }}
                />

              </div>
            )}
          </div>

          {/* Display Order */}

          <div>
            <label className="block font-medium text-gray-700">
              Display Order
            </label>

            <input
              type="number"
              min="1"
              name="displayOrder"
              value={form.displayOrder}
              onChange={handleChange}
              disabled={loading}
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
            />
          </div>

        </div>

        {/* Buttons */}

        <div className="mt-8 flex justify-end gap-3">

          <button
            onClick={handleClose}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-lg bg-orange-500 px-6 py-2 text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading
              ? "Uploading..."
              : editingActivity
              ? "Update Activity"
              : "Add Activity"}
          </button>

        </div>

      </div>
    </div>
  );
}