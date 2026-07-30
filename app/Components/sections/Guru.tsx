"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

interface GuruData {
  name: string;
  subtitle: string;
  description1: string;
  description2: string;
  description3: string;
  image: string;
}

export default function Guru() {
  const [guru, setGuru] = useState<GuruData | null>(null);

  useEffect(() => {
    const loadGuru = async () => {
      try {
        const snap = await getDoc(doc(db, "guru", "main"));

        if (snap.exists()) {
          setGuru(snap.data() as GuruData);
        }
      } catch (error) {
        console.error("Failed to load guru:", error);
      }
    };

    loadGuru();
  }, []);

  return (
    <section
      id="guru"
      className="bg-white py-24"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* Guru Image */}

          <div className="flex justify-center">

            <img
              src={guru?.image || "/images/gallery/guruji.jpg.jpeg"}
              alt={guru?.name || "Guru Ji"}
              className="w-full max-w-lg rounded-3xl shadow-2xl object-cover"
            />

          </div>

          {/* Text */}

          <div>

            <h4 className="mb-3 font-semibold tracking-[0.35em] text-amber-600">
              OUR GURU
            </h4>

            <h2 className="mb-6 text-5xl font-bold text-stone-900">
              {guru?.name || "Sri Sri Ram Thakur"}
            </h2>

            <p className="mb-6 text-xl italic text-amber-700">
              {guru?.subtitle ||
                "Love All • Serve All • Remember the Holy Name"}
            </p>

            <p className="mb-6 text-lg leading-8 text-gray-700">
              {guru?.description1 ||
                "Sri Sri Ram Thakur (Ram Chandra Dev) was born on 2 February 1860 at Dingamanik, Faridpur (present-day Bangladesh)."}
            </p>

            <p className="mb-6 text-lg leading-8 text-gray-700">
              {guru?.description2 ||
                "Revered as Sri Sri Kaibalyanath and lovingly known as Dayal Thakur, he welcomed people from every caste, creed and religion with unconditional love, compassion and service."}
            </p>

            <p className="mb-10 text-lg leading-8 text-gray-700">
              {guru?.description3 ||
                "His timeless teachings continue to inspire millions of devotees through satsang, devotion, selfless service and remembrance of the Holy Name."}
            </p>

            <button className="rounded-full bg-amber-500 px-8 py-4 text-white transition hover:bg-amber-600">
              Read More
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}