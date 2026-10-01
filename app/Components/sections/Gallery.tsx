"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt?: {
    seconds?: number;
  };
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGallery();
  }, []);

  async function loadGallery() {
    try {
      const q = query(
        collection(db, "gallery"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...(item.data() as Omit<GalleryItem, "id">),
      }));

      setImages(data);
    } catch (error) {
      console.error("Error loading gallery:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="gallery"
      className="py-24 bg-stone-900 text-white"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div className="text-center">

          <h3 className="text-amber-400 uppercase tracking-[0.3em]">
            Temple Gallery
          </h3>

          <h2 className="text-5xl font-bold mt-3">
            Moments of Devotion
          </h2>

          <p className="text-center text-gray-300 mt-5 max-w-2xl mx-auto">
            A glimpse into the spiritual life of Shri Shri Ram
            Thakur Seva Mandir, where devotees gather in faith,
            prayer, satsang and seva.
          </p>

        </div>

        {/* Loading */}

        {loading && (
          <div className="text-center mt-16 text-gray-400">
            Loading Gallery...
          </div>
        )}

        {/* Empty */}

        {!loading && images.length === 0 && (
          <div className="text-center mt-16 text-gray-400">
            No images found.
          </div>
        )}

        {/* Gallery */}

        {!loading && images.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">

            {images.map((image) => (

              <div
                key={image.id}
                className="overflow-hidden rounded-3xl shadow-2xl bg-white/5 group"
              >

                <div className="overflow-hidden">

                  <img
                    src={image.imageUrl}
                    alt={image.title || "Temple Gallery"}
                    className="h-80 w-full object-cover transition duration-700 group-hover:scale-110"
                    loading="lazy"
                  />

                </div>

                <div className="p-5">

                  <h3 className="text-xl font-bold text-white">
                    {image.title}
                  </h3>

                  {image.description && (
                    <p className="mt-2 text-gray-300">
                      {image.description}
                    </p>
                  )}

                </div>

              </div>

            ))}

          </div>
        )}

      </div>
    </section>
  );
}