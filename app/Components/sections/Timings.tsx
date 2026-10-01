"use client";

import { motion } from "framer-motion";
import {
  Sunrise,
  Sunset,
  BellRing,
  CalendarDays,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";

interface TimingsData {
  morningOpen: string;
  morningClose: string;
  eveningOpen: string;
  eveningClose: string;
  aartiTime: string;
  specialNote: string;
}

interface SpecialTiming {
  id: string;
  title: string;
  date: string;
  openingTime: string;
  closingTime: string;
  aartiTime: string;
  note: string;
  active: boolean;
}

export default function Timings() {
  const [timingsData, setTimingsData] =
    useState<TimingsData | null>(null);

  const [specialTimings, setSpecialTimings] =
    useState<SpecialTiming[]>([]);

  useEffect(() => {
    loadTimings();
    loadSpecialTimings();
  }, []);

  async function loadTimings() {
    try {
      const snap = await getDoc(
        doc(db, "timings", "main")
      );

      if (snap.exists()) {
        setTimingsData(
          snap.data() as TimingsData
        );
      }
    } catch (error) {
      console.error(
        "Failed to load timings:",
        error
      );
    }
  }

  async function loadSpecialTimings() {
    try {
      const snapshot = await getDocs(
        collection(db, "specialTimings")
      );

      const today = new Date()
        .toISOString()
        .split("T")[0];

      const data = snapshot.docs
        .map((item) => ({
          id: item.id,
          ...(item.data() as Omit<
            SpecialTiming,
            "id"
          >),
        }))
        .filter(
          (item) =>
            item.active === true &&
            item.date >= today
        )
        .sort((a, b) =>
          a.date.localeCompare(b.date)
        );

      setSpecialTimings(data);
    } catch (error) {
      console.error(
        "Failed to load special timings:",
        error
      );
    }
  }

  const timings = [
    {
      icon: Sunrise,
      title: "Morning Darshan",
      time: `${timingsData?.morningOpen || "6:00 AM"} – ${
        timingsData?.morningClose || "12:30 PM"
      }`,
      color: "text-amber-400",
    },
    {
      icon: Sunset,
      title: "Evening Darshan",
      time: `${timingsData?.eveningOpen || "3:30 PM"} – ${
        timingsData?.eveningClose || "8:30 PM"
      }`,
      color: "text-orange-400",
    },
    {
      icon: BellRing,
      title: "Daily Aarti",
      time:
        timingsData?.aartiTime || "5:30 PM",
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
      <div className="mx-auto max-w-7xl px-6">

        {/* HEADER */}

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.7,
          }}
          className="text-center"
        >
          <p className="uppercase tracking-[0.35em] text-amber-400">
            Temple Timings
          </p>

          <h2 className="mt-4 text-5xl font-bold">
            Daily Schedule
          </h2>

          <p className="mx-auto mt-6 max-w-3xl leading-8 text-gray-400">
            Plan your visit and participate in
            the daily prayers, aarti, satsang
            and devotional activities at Shri
            Shri Ram Thakur Seva Mandir.
          </p>
        </motion.div>

        {/* REGULAR TIMINGS */}

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {timings.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: index * 0.15,
                }}
                className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:border-amber-400"
              >
                <div className="flex justify-center">
                  <Icon
                    size={48}
                    className={item.color}
                  />
                </div>

                <h3 className="mt-6 text-2xl font-bold">
                  {item.title}
                </h3>

                <p className="mt-4 leading-7 text-gray-400">
                  {item.time}
                </p>
              </motion.div>
            );
          })}

        </div>

        {/* SPECIAL TIMINGS */}

        {specialTimings.length > 0 && (
          <div className="mt-24">

            <div className="text-center">

              <p className="uppercase tracking-[0.3em] text-amber-400">
                Special Occasions
              </p>

              <h2 className="mt-4 text-4xl font-bold">
                Festival & Special Timings
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-gray-400">
                Special timings for upcoming
                festivals, poojas and important
                temple occasions.
              </p>

            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">

              {specialTimings.map(
                (item, index) => (

                  <motion.div
                    key={item.id}
                    initial={{
                      opacity: 0,
                      y: 30,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay: index * 0.1,
                    }}
                    className="rounded-3xl border border-amber-400/20 bg-amber-400/5 p-7 transition hover:border-amber-400"
                  >

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                      <h3 className="text-2xl font-bold text-white">
                        {item.title}
                      </h3>

                      <span className="rounded-full bg-amber-400/10 px-4 py-2 text-sm font-semibold text-amber-400">
                        {item.date}
                      </span>

                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-3">

                      <div>
                        <p className="text-sm text-gray-500">
                          Opening
                        </p>

                        <p className="mt-1 font-semibold text-gray-200">
                          {item.openingTime ||
                            "--"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">
                          Closing
                        </p>

                        <p className="mt-1 font-semibold text-gray-200">
                          {item.closingTime ||
                            "--"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">
                          Special Aarti
                        </p>

                        <p className="mt-1 font-semibold text-gray-200">
                          {item.aartiTime ||
                            "--"}
                        </p>
                      </div>

                    </div>

                    {item.note && (
                      <div className="mt-6 border-t border-white/10 pt-5">

                        <p className="text-gray-400">
                          {item.note}
                        </p>

                      </div>
                    )}

                  </motion.div>

                )
              )}

            </div>

          </div>
        )}

      </div>
    </section>
  );
}