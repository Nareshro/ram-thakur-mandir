"use client";

import { motion } from "framer-motion";

import {
  Heart,
  Users,
  Sunrise,
  MapPin,
  CalendarDays,
} from "lucide-react";

import { useEffect, useState } from "react";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "@/app/lib/firebase";

import {
  getCommitteeMembers,
} from "@/app/lib/committeeService";

import type {
  CommitteeMember,
} from "@/app/lib/committeeService";

interface HomepageData {
  about: string;
  aboutTitle: string;
  aboutHeading: string;
  mission: string;
  dailyAarti: string;
  devotees: string;
  peaceService: string;
}

interface HistoryData {
  title: string;
  description: string;
  image: string;
}

interface GlanceData {
  title: string;
  description: string;
  yearEstablished: string;
  dailyVisitors: string;
  location: string;
}

export default function About() {
  const [homepage, setHomepage] =
    useState<HomepageData | null>(null);

  const [history, setHistory] =
    useState<HistoryData | null>(null);

  const [glance, setGlance] =
    useState<GlanceData | null>(null);

  const [committee, setCommittee] =
    useState<CommitteeMember[]>([]);

  useEffect(() => {
    loadAboutData();
  }, []);

  async function loadAboutData() {
    try {
      /*
       * =========================
       * HOMEPAGE
       * =========================
       */

      const homepageSnap = await getDoc(
        doc(db, "homepage", "main")
      );

      if (homepageSnap.exists()) {
        setHomepage(
          homepageSnap.data() as HomepageData
        );
      }

      /*
       * =========================
       * HISTORY
       * =========================
       */

      const historySnap = await getDoc(
        doc(db, "about", "history")
      );

      if (historySnap.exists()) {
        setHistory(
          historySnap.data() as HistoryData
        );
      }

      /*
       * =========================
       * AT A GLANCE
       * =========================
       */

      const glanceSnap = await getDoc(
        doc(db, "about", "glance")
      );

      if (glanceSnap.exists()) {
        setGlance(
          glanceSnap.data() as GlanceData
        );
      }

      /*
       * =========================
       * EXECUTIVE COMMITTEE
       * =========================
       *
       * IMPORTANT:
       * CommitteeMember currently contains:
       *
       * id
       * name
       * designation
       * phone
       * email
       * image
       * displayOrder
       *
       * There is NO "active" field.
       *
       * Therefore we use the members
       * directly without filtering by active.
       */

      const committeeData =
        await getCommitteeMembers();

      setCommittee(committeeData);

    } catch (error) {
      console.error(
        "Failed to load About data:",
        error
      );
    }
  }

  /*
   * =========================
   * STATS
   * =========================
   */

  const stats = [
    {
      icon: Heart,
      title: "Daily Aarti",
      value:
        homepage?.dailyAarti ||
        "2 Times",
    },

    {
      icon: Users,
      title: "Devotees",
      value:
        homepage?.devotees ||
        "500+",
    },

    {
      icon: Sunrise,
      title: "Peace & Seva",
      value:
        homepage?.peaceService ||
        "Every Day",
    },
  ];

  return (
    <>
      {/* ===================================================== */}
      {/* ABOUT */}
      {/* ===================================================== */}

      <section
        id="about"
        className="bg-[#0B0B0B] py-24 text-white"
      >
        <div className="mx-auto max-w-7xl px-6">

          <div className="grid items-center gap-16 lg:grid-cols-2">

            {/* Image */}

            <motion.div
              initial={{
                opacity: 0,
                x: -40,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.7,
              }}
              viewport={{
                once: true,
              }}
            >

              {history?.image ? (
                <img
                  src={history.image}
                  alt="Shri Shri Ram Thakur Seva Mandir"
                  className="h-auto w-full rounded-3xl object-cover shadow-2xl"
                  onError={(e) => {
                    e.currentTarget.style.display =
                      "none";

                    const fallback =
                      e.currentTarget
                        .nextElementSibling;

                    if (
                      fallback instanceof
                      HTMLElement
                    ) {
                      fallback.style.display =
                        "flex";
                    }
                  }}
                />
              ) : null}

              <div
                className={`${
                  history?.image
                    ? "hidden"
                    : "flex"
                } h-[450px] w-full items-center justify-center rounded-3xl bg-stone-900 text-gray-500 shadow-2xl`}
              >
                Temple Image
              </div>

            </motion.div>

            {/* Content */}

            <motion.div
              initial={{
                opacity: 0,
                x: 40,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.7,
              }}
              viewport={{
                once: true,
              }}
            >

              <p className="uppercase tracking-[0.3em] text-amber-400">
                {homepage?.aboutTitle ||
                  "About Our Mandir"}
              </p>

              <h2 className="mt-5 text-5xl font-bold leading-tight">
                {homepage?.aboutHeading ||
                  "A Sacred Place of Devotion & Service"}
              </h2>

              <p className="mt-8 leading-8 text-gray-300">
                {homepage?.about ||
                  "Shri Shri Ram Thakur Seva Mandir is a sacred place of devotion and service."}
              </p>

              <p className="mt-6 leading-8 text-gray-400">
                {homepage?.mission ||
                  "Our mission is to spread peace, compassion and humanity."}
              </p>

              {/* Stats */}

              <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">

                {stats.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center transition hover:border-amber-400"
                    >
                      <Icon
                        className="mx-auto text-amber-400"
                        size={34}
                      />

                      <h3 className="mt-4 text-3xl font-bold">
                        {item.value}
                      </h3>

                      <p className="mt-2 text-gray-400">
                        {item.title}
                      </p>
                    </div>
                  );
                })}

              </div>

            </motion.div>

          </div>

        </div>
      </section>

      {/* ===================================================== */}
      {/* HISTORY */}
      {/* ===================================================== */}

      <section
        id="history"
        className="bg-stone-950 py-24 text-white"
      >
        <div className="mx-auto max-w-7xl px-6">

          <div className="grid items-center gap-16 lg:grid-cols-2">

            <motion.div
              initial={{
                opacity: 0,
                x: -40,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.7,
              }}
              viewport={{
                once: true,
              }}
            >

              <p className="uppercase tracking-[0.3em] text-amber-400">
                About Us
              </p>

              <h2 className="mt-4 text-5xl font-bold">
                {history?.title ||
                  "Our History"}
              </h2>

              <p className="mt-8 whitespace-pre-line leading-8 text-gray-300">
                {history?.description ||
                  "The history of Shri Shri Ram Thakur Seva Mandir will be updated here."}
              </p>

            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                x: 40,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.7,
              }}
              viewport={{
                once: true,
              }}
            >

              {history?.image ? (
                <img
                  src={history.image}
                  alt="Temple History"
                  className="h-[450px] w-full rounded-3xl object-cover shadow-2xl"
                  onError={(e) => {
                    e.currentTarget.style.display =
                      "none";

                    const fallback =
                      e.currentTarget
                        .nextElementSibling;

                    if (
                      fallback instanceof
                      HTMLElement
                    ) {
                      fallback.style.display =
                        "flex";
                    }
                  }}
                />
              ) : null}

              <div
                className={`${
                  history?.image
                    ? "hidden"
                    : "flex"
                } h-[450px] w-full items-center justify-center rounded-3xl bg-stone-900 text-gray-500`}
              >
                History Image
              </div>

            </motion.div>

          </div>

        </div>
      </section>

      {/* ===================================================== */}
      {/* AT A GLANCE */}
      {/* ===================================================== */}

      <section
        id="glance"
        className="bg-[#0B0B0B] py-24 text-white"
      >
        <div className="mx-auto max-w-7xl px-6">

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
            }}
            viewport={{
              once: true,
            }}
            className="text-center"
          >

            <p className="uppercase tracking-[0.3em] text-amber-400">
              About Us
            </p>

            <h2 className="mt-4 text-5xl font-bold">
              {glance?.title ||
                "At a Glance"}
            </h2>

            <p className="mx-auto mt-6 max-w-3xl leading-8 text-gray-400">
              {glance?.description ||
                "A brief overview of Shri Shri Ram Thakur Seva Mandir."}
            </p>

          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">

            {/* Established */}

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">

              <CalendarDays
                className="mx-auto text-amber-400"
                size={42}
              />

              <h3 className="mt-5 text-xl font-semibold">
                Established
              </h3>

              <p className="mt-3 text-3xl font-bold">
                {glance?.yearEstablished ||
                  "—"}
              </p>

            </div>

            {/* Daily Visitors */}

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">

              <Users
                className="mx-auto text-amber-400"
                size={42}
              />

              <h3 className="mt-5 text-xl font-semibold">
                Daily Visitors
              </h3>

              <p className="mt-3 text-3xl font-bold">
                {glance?.dailyVisitors ||
                  "—"}
              </p>

            </div>

            {/* Location */}

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">

              <MapPin
                className="mx-auto text-amber-400"
                size={42}
              />

              <h3 className="mt-5 text-xl font-semibold">
                Location
              </h3>

              <p className="mt-3 text-gray-400">
                {glance?.location ||
                  "—"}
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* ===================================================== */}
      {/* EXECUTIVE COMMITTEE */}
      {/* ===================================================== */}

      <section
        id="executive-committee"
        className="bg-stone-950 py-24 text-white"
      >
        <div className="mx-auto max-w-7xl px-6">

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
            }}
            viewport={{
              once: true,
            }}
            className="text-center"
          >

            <p className="uppercase tracking-[0.3em] text-amber-400">
              About Us
            </p>

            <h2 className="mt-4 text-5xl font-bold">
              Executive Committee
            </h2>

            <p className="mx-auto mt-6 max-w-3xl leading-8 text-gray-400">
              Meet the members serving the temple
              community with dedication and devotion.
            </p>

          </motion.div>

          {committee.length === 0 ? (

            <p className="mt-16 text-center text-gray-500">
              Committee information will be updated soon.
            </p>

          ) : (

            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

              {committee.map(
                (member, index) => (

                  <motion.div
                    key={
                      member.id || index
                    }
                    initial={{
                      opacity: 0,
                      y: 30,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.5,
                      delay:
                        index * 0.1,
                    }}
                    viewport={{
                      once: true,
                    }}
                    className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:border-amber-400"
                  >

                    {/* Member Image */}

                    <div className="h-72 bg-stone-900">

                      {member.image ? (
                        <img
                          src={member.image}
                          alt={
                            member.name
                          }
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display =
                              "none";

                            const fallback =
                              e.currentTarget
                                .nextElementSibling;

                            if (
                              fallback instanceof
                              HTMLElement
                            ) {
                              fallback.style.display =
                                "flex";
                            }
                          }}
                        />
                      ) : null}

                      <div
                        className={`${
                          member.image
                            ? "hidden"
                            : "flex"
                        } h-full items-center justify-center text-gray-500`}
                      >
                        No Image
                      </div>

                    </div>

                    {/* Member Details */}

                    <div className="p-6 text-center">

                      <h3 className="text-2xl font-bold">
                        {member.name}
                      </h3>

                      <p className="mt-2 text-amber-400">
                        {member.designation}
                      </p>

                    </div>

                  </motion.div>

                )
              )}

            </div>

          )}

        </div>
      </section>
    </>
  );
}