"use client";

interface DeleteModalProps {
  open: boolean;
  title: string;
  onCancel: () => void;
  onDelete: () => void;
}

export default function DeleteModal({
  open,
  title,
  onCancel,
  onDelete,
}: DeleteModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">

        <h2 className="text-2xl font-bold text-red-600">
          Delete Image
        </h2>

        <p className="mt-5 text-gray-600">
          Are you sure you want to delete
        </p>

        <p className="mt-2 font-semibold text-lg">
          "{title}"
        </p>

        <div className="mt-8 flex justify-end gap-4">

          <button
            onClick={onCancel}
            className="rounded-xl border px-5 py-2"
          >
            Cancel
          </button>

          <button
            onClick={onDelete}
            className="rounded-xl bg-red-500 px-6 py-2 text-white hover:bg-red-600"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
}