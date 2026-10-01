"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { Megaphone } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  active: boolean;
}

export default function Announcements() {
  const [announcements, setAnnouncements] =
    useState<Announcement[]>([]);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function loadAnnouncements() {
    try {
      const q = query(
        collection(db, "announcements"),
        where("active", "==", true)
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...(item.data() as Omit<Announcement, "id">),
      }));

      data.sort((a, b) =>
        b.date.localeCompare(a.date)
      );

      setAnnouncements(data);

    } catch (error) {
      console.error(
        "Failed to load announcements:",
        error
      );
    }
  }

  if (announcements.length === 0) {
    return null;
  }

  return (
    <section
      id="announcements"
      className="py-20 bg-amber-50"
    >

      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}

        <div className="text-center mb-12">

          <h2 className="text-4xl font-bold text-stone-800">
            Temple Announcements
          </h2>

          <p className="text-gray-600 mt-4">
            Stay updated with the latest temple
            activities and notices.
          </p>

        </div>

        {/* Announcements */}

        <div className="space-y-6">

          {announcements.map((item) => (

            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500"
            >

              <div className="flex items-start gap-4">

                <Megaphone
                  className="text-amber-600 mt-1 shrink-0"
                  size={24}
                />

                <div className="flex-1">

                  <div className="flex justify-between flex-wrap gap-2">

                    <h3 className="text-xl font-semibold text-stone-800">
                      {item.title}
                    </h3>

                    <span className="text-sm text-gray-500">
                      {item.date}
                    </span>

                  </div>

                  <p className="mt-3 text-gray-600">
                    {item.description}
                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}