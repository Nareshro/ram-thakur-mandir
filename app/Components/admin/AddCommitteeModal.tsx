"use client";

import { useEffect, useState } from "react";
import type { CommitteeMember } from "@/app/lib/committeeService";
import { uploadImage } from "@/app/lib/storageService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: CommitteeMember) => Promise<void>;
  editingMember?: CommitteeMember | null;
}

export default function AddCommitteeModal({
  isOpen,
  onClose,
  onSave,
  editingMember,
}: Props) {
  const emptyForm: CommitteeMember = {
    name: "",
    designation: "",
    phone: "",
    email: "",
    image: "",
    displayOrder: 1,
  };

  const [form, setForm] =
    useState<CommitteeMember>(emptyForm);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [previewUrl, setPreviewUrl] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  /* =========================
     LOAD EDIT DATA
  ========================= */

  useEffect(() => {
    if (editingMember) {
      setForm({
        ...editingMember,
        displayOrder: Number(
          editingMember.displayOrder
        ),
      });

      setSelectedFile(null);

      setPreviewUrl(
        editingMember.image || ""
      );
    } else {
      setForm(emptyForm);
      setSelectedFile(null);
      setPreviewUrl("");
    }
  }, [editingMember, isOpen]);

  if (!isOpen) {
    return null;
  }

  /* =========================
     HANDLE INPUT
  ========================= */

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "displayOrder"
          ? Number(value)
          : value,
    }));
  }

  /* =========================
     HANDLE IMAGE
  ========================= */

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

    const objectUrl =
      URL.createObjectURL(file);

    setPreviewUrl(objectUrl);
  }

  /* =========================
     SUBMIT
  ========================= */

  async function handleSubmit() {
    if (!form.name.trim()) {
      alert("Please enter member name.");
      return;
    }

    if (!form.designation.trim()) {
      alert("Please enter designation.");
      return;
    }

    if (!form.phone.trim()) {
      alert("Please enter phone number.");
      return;
    }

    if (!form.email.trim()) {
      alert("Please enter email.");
      return;
    }

    /*
     * New member must have an image.
     * Existing member can keep the old image.
     */

    if (!editingMember && !selectedFile) {
      alert("Please select a member image.");
      return;
    }

    if (
      editingMember &&
      !selectedFile &&
      !form.image
    ) {
      alert("Please select a member image.");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = form.image;

      /* =========================
         UPLOAD IMAGE
      ========================= */

      if (selectedFile) {
        imageUrl = await uploadImage(
          selectedFile,
          "committee"
        );
      }

      /* =========================
         SAVE MEMBER
      ========================= */

      const member: CommitteeMember = {
        ...form,
        name: form.name.trim(),
        designation: form.designation.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        image: imageUrl,
        displayOrder: Number(
          form.displayOrder
        ),
      };

      await onSave(member);

      setSelectedFile(null);
      setPreviewUrl("");

    } catch (error) {
      console.error(
        "Failed to save committee member:",
        error
      );

      alert(
        "Failed to save committee member."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     CLOSE MODAL
  ========================= */

  function handleClose() {
    if (loading) {
      return;
    }

    setSelectedFile(null);
    setPreviewUrl("");

    setForm(emptyForm);

    onClose();
  }

  /* =========================
     UI
  ========================= */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b px-6 py-5">

          <div>
            <h2 className="text-2xl font-bold text-stone-800">
              {editingMember
                ? "Edit Committee Member"
                : "Add Committee Member"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {editingMember
                ? "Update committee member details."
                : "Add a new committee member."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="rounded-lg px-3 py-2 text-xl text-gray-500 hover:bg-gray-100 hover:text-black"
          >
            ✕
          </button>

        </div>

        {/* FORM */}

        <div className="space-y-5 p-6">

          {/* NAME */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter member name"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-500 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            />
          </div>

          {/* DESIGNATION */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Designation
            </label>

            <input
              type="text"
              name="designation"
              value={form.designation}
              onChange={handleChange}
              placeholder="Enter designation"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-500 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            />
          </div>

          {/* PHONE */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Phone
            </label>

            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-500 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            />
          </div>

          {/* EMAIL */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-500 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            />
          </div>

          {/* DISPLAY ORDER */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Display Order
            </label>

            <input
              type="number"
              name="displayOrder"
              min="1"
              value={form.displayOrder}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            />

            <p className="mt-1 text-xs text-gray-500">
              Smaller numbers appear first.
            </p>
          </div>

          {/* IMAGE */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Member Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-black"
            />

            <p className="mt-1 text-xs text-gray-500">
              Maximum image size: 5 MB
            </p>
          </div>

          {/* IMAGE PREVIEW */}

          {previewUrl && (
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">
                Image Preview
              </p>

              <div className="flex justify-center rounded-xl border bg-gray-50 p-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-48 w-48 rounded-xl object-cover shadow"
                />
              </div>
            </div>
          )}

        </div>

        {/* FOOTER */}

        <div className="flex justify-end gap-3 border-t bg-gray-50 px-6 py-4">

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="rounded-lg bg-gray-500 px-5 py-2.5 font-medium text-white hover:bg-gray-600 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-lg bg-orange-500 px-5 py-2.5 font-medium text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : editingMember
              ? "Update Member"
              : "Save Member"}
          </button>

        </div>

      </div>

    </div>
  );
}