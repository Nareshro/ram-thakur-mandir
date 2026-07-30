"use client";

import { useEffect, useState } from "react";

interface EditImageModalProps {
  open: boolean;
  image: {
    id: string;
    title: string;
    description: string;
  } | null;
  onClose: () => void;
  onSave: (title: string, description: string) => void;
}

export default function EditImageModal({
  open,
  image,
  onClose,
  onSave,
}: EditImageModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (image) {
      setTitle(image.title);
      setDescription(image.description);
    }
  }, [image]);

  if (!open || !image) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">

      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">

        <h2 className="mb-6 text-2xl font-bold text-stone-800">
          Edit Gallery Image
        </h2>

        <div className="space-y-5">

          <div>
            <label className="mb-2 block font-medium">
              Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border p-3 outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Description
            </label>

            <textarea
              rows={4}
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="w-full rounded-xl border p-3 outline-none focus:border-amber-500"
            />
          </div>

        </div>

        <div className="mt-8 flex justify-end gap-4">

          <button
            onClick={onClose}
            className="rounded-xl border px-5 py-2"
          >
            Cancel
          </button>

          <button
            onClick={() => onSave(title, description)}
            className="rounded-xl bg-amber-500 px-6 py-2 text-white hover:bg-amber-600"
          >
            Save Changes
          </button>

        </div>

      </div>

    </div>
  );
}