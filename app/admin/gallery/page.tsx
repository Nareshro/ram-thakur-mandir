"use client";

import { useEffect, useState } from "react";

import GalleryTable from "@/app/Components/admin/GalleryTable";
import UploadImageModal from "@/app/Components/admin/UploadImageModal";
import SearchBar from "@/app/Components/admin/SearchBar";
import GalleryStats from "@/app/Components/admin/GalleryStats";

import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

export default function GalleryPage() {
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");

  const [totalImages, setTotalImages] = useState(0);
  const [thisMonth, setThisMonth] = useState(0);
  const [latestUpload, setLatestUpload] = useState("--");

  useEffect(() => {
    const loadStats = async () => {
      try {
        const snapshot = await getDocs(collection(db, "gallery"));

        const docs = snapshot.docs.map((doc) => doc.data());

        setTotalImages(docs.length);

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const monthCount = docs.filter((item: any) => {
          if (!item.createdAt?.seconds) return false;

          const date = new Date(item.createdAt.seconds * 1000);

          return (
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear
          );
        });

        setThisMonth(monthCount.length);

        const latest = docs
          .filter((item: any) => item.createdAt?.seconds)
          .sort(
            (a: any, b: any) =>
              b.createdAt.seconds - a.createdAt.seconds
          )[0];

        if (latest?.createdAt?.seconds) {
          setLatestUpload(
            new Date(
              latest.createdAt.seconds * 1000
            ).toLocaleDateString()
          );
        }
      } catch (error) {
        console.error("Failed to load gallery stats:", error);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="space-y-8">

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

      <GalleryStats
        total={totalImages}
        thisMonth={thisMonth}
        latestUpload={latestUpload}
      />

      <SearchBar
        value={search}
        onChange={setSearch}
      />

      <GalleryTable
        search={search}
      />

      <UploadImageModal
        open={openModal}
        onClose={() => setOpenModal(false)}
      />

    </div>
  );
}