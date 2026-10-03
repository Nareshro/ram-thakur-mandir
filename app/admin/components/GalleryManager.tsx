"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

type GalleryItem = {
  id: string;
  title: string;
  description: string;
  image: string;
};

const emptyForm = {
  title: "",
  description: "",
  image: "",
};

function isValidImageUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export default function GalleryManager() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [previewFailed, setPreviewFailed] = useState(false);

  async function loadGallery() {
    setLoading(true);

    try {
      const snapshot = await getDocs(collection(db, "gallery"));

      setItems(
        snapshot.docs.map((item) => {
          const data = item.data();

          return {
            id: item.id,
            title: String(data.title ?? data.name ?? ""),
            description: String(data.description ?? ""),
            image: String(data.image ?? data.imageUrl ?? data.url ?? ""),
          };
        })
      );
    } catch (error) {
      console.error("Gallery loading error:", error);
      setMessage("Unable to load gallery. Check Firestore permissions.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadGallery();
  }, []);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
    setPreviewFailed(false);
  }

  function startEditing(item: GalleryItem) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      image: item.image,
    });
    setMessage("");
    setPreviewFailed(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveImage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const title = form.title.trim();
    const image = form.image.trim();

    if (!title || !image) {
      setMessage("Please enter an image title and image URL.");
      return;
    }

    if (!isValidImageUrl(image)) {
      setMessage("Use a complete public image URL beginning with https://.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const payload = {
        title,
        description: form.description.trim(),
        image,
        updatedAt: new Date().toISOString(),
      };

      if (editingId) {
        await updateDoc(doc(db, "gallery", editingId), payload);
        setMessage("Gallery item updated.");
      } else {
        await addDoc(collection(db, "gallery"), {
          ...payload,
          createdAt: new Date().toISOString(),
        });
        setMessage("Gallery image added.");
      }

      resetForm();
      await loadGallery();
      setMessage(editingId ? "Gallery item updated." : "Gallery image added.");
    } catch (error) {
      console.error("Gallery save error:", error);
      setMessage("Save failed. Check Firestore permissions and try again.");
    } finally {
      setSaving(false);
    }
  }

  async function removeImage(id: string) {
    if (!window.confirm("Permanently delete this gallery item?")) return;

    try {
      await deleteDoc(doc(db, "gallery", id));
      if (editingId === id) resetForm();
      setMessage("Gallery item deleted.");
      await loadGallery();
    } catch (error) {
      console.error("Gallery delete error:", error);
      setMessage("Delete failed. Check Firestore permissions.");
    }
  }

  const hasPreviewUrl = isValidImageUrl(form.image.trim());

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-red-950">Photo Gallery</h2>
        <p className="mt-1 text-sm text-gray-600">
          Add a photo by pasting its public image link. Check the preview before saving.
        </p>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <section className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-red-950">
            {editingId ? "Edit Gallery Photo" : "Add Gallery Photo"}
          </h3>

          <form onSubmit={saveImage} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Photo Title *
              </label>
              <input
                required
                value={form.title}
                onChange={(e) =>
                  setForm((previous) => ({ ...previous, title: e.target.value }))
                }
                placeholder="Example: Temple Entrance"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-orange-600"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Public Image URL *
              </label>
              <input
                required
                type="url"
                value={form.image}
                onChange={(e) => {
                  setForm((previous) => ({ ...previous, image: e.target.value }));
                  setPreviewFailed(false);
                }}
                placeholder="https://example.com/photo.jpg"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-orange-600"
              />
              <p className="mt-1 text-xs text-gray-500">
                Use a direct, publicly accessible image link—not a local path such as /images/photo.jpg.
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm((previous) => ({
                    ...previous,
                    description: e.target.value,
                  }))
                }
                placeholder="A short description (optional)"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-orange-600"
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">Photo Preview</p>
              <div className="flex min-h-44 items-center justify-center overflow-hidden rounded-xl border bg-gray-50">
                {hasPreviewUrl && !previewFailed ? (
                  <img
                    src={form.image.trim()}
                    alt="Photo preview"
                    onError={() => setPreviewFailed(true)}
                    className="h-48 w-full object-contain"
                  />
                ) : (
                  <div className="px-4 py-8 text-center text-sm text-gray-500">
                    {previewFailed
                      ? "This image link did not load. Try a direct public image URL."
                      : "Paste an image URL to preview the photo here."}
                  </div>
                )}
              </div>
            </div>

            {message && (
              <p role="status" className="rounded-lg bg-orange-50 p-3 text-sm text-red-900">
                {message}
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-lg bg-[#50190f] px-4 py-3 text-sm font-semibold text-white hover:bg-[#682719] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : editingId ? "Update Photo" : "Add Photo"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-red-950">Saved Photos</h3>
              <p className="text-sm text-gray-500">
                Select a photo to edit it or remove it from the website.
              </p>
            </div>
            <span className="rounded-full bg-orange-100 px-3 py-1 text-sm text-red-900">
              {items.length} {items.length === 1 ? "Photo" : "Photos"}
            </span>
          </div>

          {loading ? (
            <p className="py-10 text-center text-sm text-gray-500">
              Loading photos...
            </p>
          ) : items.length === 0 ? (
            <div className="rounded-xl border border-dashed p-10 text-center text-sm text-gray-500">
              No photos saved yet. Add your first photo using the form.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
              {items.map((item) => (
                <GalleryCard
                  key={item.id}
                  item={item}
                  onEdit={() => startEditing(item)}
                  onDelete={() => void removeImage(item.id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function GalleryCard({
  item,
  onEdit,
  onDelete,
}: {
  item: GalleryItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex h-44 items-center justify-center bg-gray-50">
        {item.image && !imageFailed ? (
          <img
            src={item.image}
            alt={item.title || "Gallery photo"}
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="px-4 text-center text-sm text-gray-500">
            Photo unavailable
            <p className="mt-1 text-xs">Edit this item to replace its image link.</p>
          </div>
        )}
      </div>

      <div className="p-4">
        <h4 className="font-semibold text-gray-900">
          {item.title || "Untitled photo"}
        </h4>
        {item.description && (
          <p className="mt-1 line-clamp-2 text-sm text-gray-600">
            {item.description}
          </p>
        )}

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="flex-1 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex-1 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
