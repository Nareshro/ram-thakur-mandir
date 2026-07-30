"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";

import EditImageModal from "./EditImageModal";
import DeleteModal from "./DeleteModal";
import Toast from "./Toast";
import Loader from "./Loader";

interface GalleryImage {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt?: any;
}

interface GalleryTableProps {
  search: string;
}

export default function GalleryTable({
  search,
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

  const loadGallery = async () => {
    try {
      setLoading(true);

      const snapshot = await getDocs(collection(db, "gallery"));

      const gallery = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<GalleryImage, "id">),
      }));

      setImages(gallery);
    } catch (error) {
      console.error(error);

      setToastMessage("Failed to load gallery");
      setToastType("error");
      setToastOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  useEffect(() => {
    if (!toastOpen) return;

    const timer = setTimeout(() => {
      setToastOpen(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [toastOpen]);

  const filteredImages = images.filter((image) => {
    const keyword = search.toLowerCase();

    return (
      image.title.toLowerCase().includes(keyword) ||
      image.description.toLowerCase().includes(keyword)
    );
  });

  const handleSave = async (
    title: string,
    description: string
  ) => {
    if (!selectedImage) return;

    try {
      await updateDoc(doc(db, "gallery", selectedImage.id), {
        title,
        description,
      });

      setEditOpen(false);

      setToastMessage("Image updated successfully");
      setToastType("success");
      setToastOpen(true);

      await loadGallery();
    } catch (error) {
      console.error(error);

      setToastMessage("Update failed");
      setToastType("error");
      setToastOpen(true);
    }
  };

  const handleDelete = async () => {
    if (!selectedImage) return;

    try {
      await deleteDoc(doc(db, "gallery", selectedImage.id));

      setDeleteOpen(false);

      setToastMessage("Image deleted successfully");
      setToastType("success");
      setToastOpen(true);

      await loadGallery();
    } catch (error) {
      console.error(error);

      setToastMessage("Delete failed");
      setToastType("error");
      setToastOpen(true);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full">

            <thead className="bg-stone-100 text-stone-700">
              <tr>
                <th className="px-6 py-4 text-left">Image</th>
                <th className="px-6 py-4 text-left">Title</th>
                <th className="px-6 py-4 text-left">Description</th>
                <th className="px-6 py-4 text-left">Uploaded</th>
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
                    className="py-10 text-center text-gray-700"
                  >
                    No images found.
                  </td>
                </tr>
              ) : (
                filteredImages.map((image) => (
                  <tr
                    key={image.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="relative h-24 w-24 overflow-hidden rounded-xl">
                        <Image
                          src={image.imageUrl}
                          alt={image.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>

                    <td className="px-6 py-4 font-semibold text-stone-800">
                      {image.title}
                    </td>

                    <td className="px-6 py-4 max-w-md text-gray-700">
                      {image.description}
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {image.createdAt?.seconds
                        ? new Date(
                            image.createdAt.seconds * 1000
                          ).toLocaleDateString()
                        : "--"}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">

                        <button
                          onClick={() => {
                            setSelectedImage(image);
                            setEditOpen(true);
                          }}
                          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => {
                            setSelectedImage(image);
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

      <EditImageModal
        open={editOpen}
        image={
          selectedImage
            ? {
                id: selectedImage.id,
                title: selectedImage.title,
                description: selectedImage.description,
              }
            : null
        }
        onClose={() => {
          setEditOpen(false);
          setSelectedImage(null);
        }}
        onSave={handleSave}
      />

      <DeleteModal
        open={deleteOpen}
        title={selectedImage?.title || ""}
        onCancel={() => {
          setDeleteOpen(false);
          setSelectedImage(null);
        }}
        onDelete={handleDelete}
      />

      <Toast
        show={toastOpen}
        message={toastMessage}
        type={toastType}
      />
    </>
  );
}
            