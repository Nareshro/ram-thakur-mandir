"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

import GalleryTable from "@/app/Components/admin/GalleryTable";
import UploadImageModal from "@/app/Components/admin/UploadImageModal";
import SearchBar from "@/app/Components/admin/SearchBar";
import GalleryStats from "@/app/Components/admin/GalleryStats";

export default function GalleryPage() {
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");

  const [totalImages, setTotalImages] = useState(0);
  const [thisMonth, setThisMonth] = useState(0);
  const [latestUpload, setLatestUpload] = useState("--");

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const snapshot = await getDocs(collection(db, "gallery"));

      const images = snapshot.docs.map((item) => item.data());

      // Total images
      setTotalImages(images.length);

      // Current month
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      const monthCount = images.filter((item: any) => {
        if (!item.createdAt) return false;

        let date: Date;

        if (item.createdAt.seconds) {
          date = new Date(item.createdAt.seconds * 1000);
        } else if (item.createdAt.toDate) {
          date = item.createdAt.toDate();
        } else {
          return false;
        }

        return (
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        );
      });

      setThisMonth(monthCount.length);

      // Latest upload
      const sortedImages = images
        .filter((item: any) => item.createdAt)
        .sort((a: any, b: any) => {
          const dateA = a.createdAt.seconds
            ? a.createdAt.seconds
            : a.createdAt.toDate
            ? a.createdAt.toDate().getTime() / 1000
            : 0;

          const dateB = b.createdAt.seconds
            ? b.createdAt.seconds
            : b.createdAt.toDate
            ? b.createdAt.toDate().getTime() / 1000
            : 0;

          return dateB - dateA;
        });

      const latest = sortedImages[0];

      if (latest?.createdAt) {
        let latestDate: Date | null = null;

        if (latest.createdAt.seconds) {
          latestDate = new Date(
            latest.createdAt.seconds * 1000
          );
        } else if (latest.createdAt.toDate) {
          latestDate = latest.createdAt.toDate();
        }

        if (latestDate) {
          setLatestUpload(
            latestDate.toLocaleDateString()
          );
        }
      }
    } catch (error) {
      console.error(
        "Failed to load gallery stats:",
        error
      );
    }
  }

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-stone-800">
            Gallery Management
          </h1>

          <p className="mt-2 text-gray-500">
            Upload and manage temple gallery images.
          </p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="rounded-xl bg-amber-500 px-6 py-3 font-semibold text-white transition hover:bg-amber-600"
        >
          + Upload Images
        </button>

      </div>

      {/* Statistics */}

      <GalleryStats
        total={totalImages}
        thisMonth={thisMonth}
        latestUpload={latestUpload}
      />

      {/* Search */}

      <SearchBar
        value={search}
        onChange={setSearch}
      />

      {/* Gallery Table */}

      <GalleryTable
        search={search}
      />

      {/* Upload Modal */}

      <UploadImageModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          loadStats();
        }}
      />

    </div>
  );
}