"use client";

import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/app/lib/firebase";

import EditImageModal from "./EditImageModal";
import DeleteModal from "./DeleteModal";
import Toast from "./Toast";

interface GalleryImage {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt?: any;
}

interface GalleryTableProps {
  search?: string;
}

export default function GalleryTable({
  search = "",
}: GalleryTableProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] =
    useState<GalleryImage | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [toastType, setToastType] = useState<
    "success" | "error"
  >("success");

  /* =========================
     LOAD GALLERY
  ========================= */

  async function loadGallery() {
    try {
      setLoading(true);

      const snapshot = await getDocs(
        collection(db, "gallery")
      );

      const gallery: GalleryImage[] =
        snapshot.docs.map((item) => ({
          id: item.id,
          ...(item.data() as Omit<
            GalleryImage,
            "id"
          >),
        }));

      setImages(gallery);
    } catch (error) {
      console.error(
        "Failed to load gallery:",
        error
      );

      showToast(
        "Failed to load gallery",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGallery();
  }, []);

  /* =========================
     TOAST
  ========================= */

  useEffect(() => {
    if (!toastOpen) {
      return;
    }

    const timer = setTimeout(() => {
      setToastOpen(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [toastOpen]);

  function showToast(
    message: string,
    type: "success" | "error"
  ) {
    setToastMessage(message);
    setToastType(type);
    setToastOpen(true);
  }

  /* =========================
     SEARCH
  ========================= */

  const keyword = search
    .trim()
    .toLowerCase();

  const filteredImages =
    images.filter((image) => {
      if (!keyword) {
        return true;
      }

      return (
        (image.title || "")
          .toLowerCase()
          .includes(keyword) ||
        (image.description || "")
          .toLowerCase()
          .includes(keyword)
      );
    });

  /* =========================
     EDIT
  ========================= */

  async function handleSave(
    title: string,
    description: string
  ) {
    if (!selectedImage) {
      return;
    }

    try {
      await updateDoc(
        doc(db, "gallery", selectedImage.id),
        {
          title: title.trim(),
          description: description.trim(),
        }
      );

      setEditOpen(false);
      setSelectedImage(null);

      showToast(
        "Image updated successfully",
        "success"
      );

      await loadGallery();
    } catch (error) {
      console.error(
        "Failed to update image:",
        error
      );

      showToast(
        "Update failed",
        "error"
      );
    }
  }

  /* =========================
     DELETE
  ========================= */

  async function handleDelete() {
    if (!selectedImage) {
      return;
    }

    try {
      await deleteDoc(
        doc(db, "gallery", selectedImage.id)
      );

      setDeleteOpen(false);
      setSelectedImage(null);

      showToast(
        "Image deleted successfully",
        "success"
      );

      await loadGallery();
    } catch (error) {
      console.error(
        "Failed to delete image:",
        error
      );

      showToast(
        "Delete failed",
        "error"
      );
    }
  }

  /* =========================
     DATE
  ========================= */

  function formatDate(createdAt: any) {
    if (!createdAt) {
      return "--";
    }

    try {
      if (
        typeof createdAt.seconds === "number"
      ) {
        return new Date(
          createdAt.seconds * 1000
        ).toLocaleDateString();
      }

      if (
        typeof createdAt.toDate === "function"
      ) {
        return createdAt
          .toDate()
          .toLocaleDateString();
      }

      return "--";
    } catch {
      return "--";
    }
  }

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow">
        <p className="text-gray-500">
          Loading gallery...
        </p>
      </div>
    );
  }

  /* =========================
     UI
  ========================= */

  return (
    <>
      <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">

            <thead className="bg-stone-100 text-stone-700">
              <tr>
                <th className="px-6 py-4 text-left">
                  Image
                </th>

                <th className="px-6 py-4 text-left">
                  Title
                </th>

                <th className="px-6 py-4 text-left">
                  Description
                </th>

                <th className="px-6 py-4 text-left">
                  Uploaded
                </th>

                <th className="px-6 py-4 text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredImages.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-10 text-center text-gray-500"
                  >
                    {keyword
                      ? "No images match your search."
                      : "No images found."}
                  </td>
                </tr>
              ) : (
                filteredImages.map((image) => (
                  <tr
                    key={image.id}
                    className="border-t hover:bg-gray-50"
                  >

                    {/* IMAGE */}

                    <td className="px-6 py-4">
                      <div className="h-24 w-24 overflow-hidden rounded-xl bg-gray-100">
                        <img
                          src={image.imageUrl}
                          alt={
                            image.title ||
                            "Gallery image"
                          }
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>

                    {/* TITLE */}

                    <td className="px-6 py-4 font-semibold text-stone-800">
                      {image.title || "--"}
                    </td>

                    {/* DESCRIPTION */}

                    <td className="max-w-md px-6 py-4 text-gray-700">
                      {image.description || "--"}
                    </td>

                    {/* DATE */}

                    <td className="whitespace-nowrap px-6 py-4 text-gray-700">
                      {formatDate(
                        image.createdAt
                      )}
                    </td>

                    {/* ACTIONS */}

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedImage(
                              image
                            );
                            setEditOpen(true);
                          }}
                          className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedImage(
                              image
                            );
                            setDeleteOpen(true);
                          }}
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

      {/* EDIT MODAL */}

      <EditImageModal
        open={editOpen}
        image={
          selectedImage
            ? {
                id: selectedImage.id,
                title: selectedImage.title,
                description:
                  selectedImage.description,
              }
            : null
        }
        onClose={() => {
          setEditOpen(false);
          setSelectedImage(null);
        }}
        onSave={handleSave}
      />

      {/* DELETE MODAL */}

      <DeleteModal
        open={deleteOpen}
        title={
          selectedImage?.title || ""
        }
        onCancel={() => {
          setDeleteOpen(false);
          setSelectedImage(null);
        }}
        onDelete={handleDelete}
      />

      {/* TOAST */}

      <Toast
        show={toastOpen}
        message={toastMessage}
        type={toastType}
      />
    </>
  );
}