"use client";

import { motion } from "framer-motion";
import { Sunrise, Sunset, BellRing, CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

interface TimingsData {
  morningOpen: string;
  morningClose: string;
  eveningOpen: string;
  eveningClose: string;
  aartiTime: string;
  specialNote: string;
}

export default function Timings() {
  const [timingsData, setTimingsData] = useState<TimingsData | null>(null);

  useEffect(() => {
    const loadTimings = async () => {
      try {
        const snap = await getDoc(doc(db, "timings", "main"));

        if (snap.exists()) {
          setTimingsData(snap.data() as TimingsData);
        }
      } catch (error) {
        console.error("Failed to load timings:", error);
      }
    };

    loadTimings();
  }, []);

  const timings = [
    {
      icon: Sunrise,
      title: "Morning Darshan",
      time: `${timingsData?.morningOpen || "5:30 AM"} – ${
        timingsData?.morningClose || "12:00 PM"
      }`,
      color: "text-amber-400",
    },
    {
      icon: Sunset,
      title: "Evening Darshan",
      time: `${timingsData?.eveningOpen || "4:30 PM"} – ${
        timingsData?.eveningClose || "8:30 PM"
      }`,
      color: "text-orange-400",
    },
    {
      icon: BellRing,
      title: "Daily Aarti",
      time: timingsData?.aartiTime || "6:00 PM",
      color: "text-yellow-400",
    },
    {
      icon: CalendarDays,
      title: "Special Note",
      time:
        timingsData?.specialNote ||
        "Temple remains open on all festivals.",
      color: "text-green-400",
    },
  ];

  return (
    <section
      id="timings"
      className="bg-[#0B0B0B] py-24 text-white"
    >
      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="uppercase tracking-[0.35em] text-amber-400">
            Temple Timings
          </p>

          <h2 className="text-5xl font-bold mt-4">
            Daily Schedule
          </h2>

          <p className="mt-6 text-gray-400 max-w-3xl mx-auto leading-8">
            Plan your visit and participate in the daily prayers,
            aarti, satsang and devotional activities at Shri Shri Ram
            Thakur Seva Mandir.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          {timings.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center hover:border-amber-400 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="flex justify-center">
                  <Icon size={48} className={item.color} />
                </div>

                <h3 className="mt-6 text-2xl font-bold">
                  {item.title}
                </h3>

                <p className="mt-4 text-gray-400 leading-7">
                  {item.time}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}