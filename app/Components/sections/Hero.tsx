"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

interface HomepageData {
  templeName: string;
  heroTitle: string;
  subtitle: string;
  heroDescription: string;
  about: string;
  heroImage: string;
  address: string;
}

export default function Hero() {
  const [homepage, setHomepage] =
    useState<HomepageData | null>(null);

  useEffect(() => {
    async function loadHomepage() {
      try {
        const snap = await getDoc(
          doc(db, "homepage", "main")
        );

        if (snap.exists()) {
          setHomepage(
            snap.data() as HomepageData
          );
        }
      } catch (error) {
        console.error(
          "Failed to load homepage:",
          error
        );
      }
    }

    loadHomepage();
  }, []);

  return (
    <section
      id="home"
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Background Image */}

      {homepage?.heroImage ? (
        <Image
          src={homepage.heroImage}
          alt="Shri Shri Ram Thakur Seva Mandir"
          fill
          priority
          unoptimized
          className="object-cover object-center"
        />
      ) : (
        <div className="absolute inset-0 bg-stone-900" />
      )}

      {/* Dark Overlay */}

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/80" />

      {/* Hero Content */}

      <div className="relative z-10 flex h-full items-center justify-center px-6">

        <div className="max-w-4xl text-center">

          {/* Logo */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.85,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.8,
            }}
          >
            {/* Logo will be converted to Firebase
                in the next step. */}

            <div className="mx-auto flex h-[110px] w-[110px] items-center justify-center rounded-full border-4 border-amber-400 bg-black/40 text-sm text-white shadow-2xl">
              Temple
            </div>
          </motion.div>

          {/* Hero Title */}

          <motion.h2
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.3,
            }}
            className="mt-8 text-lg tracking-[0.35em] text-amber-400 md:text-xl"
          >
            {homepage?.heroTitle ||
              "JOY RAM"}
          </motion.h2>

          {/* Temple Name */}

          <motion.h1
            initial={{
              opacity: 0,
              y: 35,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.5,
            }}
            className="mt-4 text-5xl font-extrabold leading-tight text-white md:text-7xl"
          >
            {homepage?.templeName ||
              "Shri Shri Ram Thakur Seva Mandir"}
          </motion.h1>

          {/* Address */}

          <motion.p
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 0.8,
            }}
            className="mt-8 text-lg text-gray-200 md:text-2xl"
          >
            {homepage?.address ||
              "Banamalipur, Agartala, Tripura"}
          </motion.p>

          {/* Description */}

          <motion.p
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 1,
            }}
            className="mx-auto mt-4 max-w-2xl leading-8 text-gray-300"
          >
            {homepage?.heroDescription ||
              "A sacred place of devotion, peace, satsang, and selfless service."}
          </motion.p>

          {/* Buttons */}

          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 1.2,
            }}
            className="mt-10 flex flex-col justify-center gap-5 sm:flex-row"
          >

            <a
              href="#about"
              className="rounded-full bg-amber-500 px-8 py-4 text-lg font-semibold text-white transition hover:bg-amber-600"
            >
              Explore Temple
            </a>

            <a
              href="#contact"
              className="rounded-full border border-white/40 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
            >
              Visit Us
            </a>

          </motion.div>

        </div>

      </div>

      {/* Scroll Indicator */}

      <motion.div
        animate={{
          y: [0, 12, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.8,
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white"
      >
        <ChevronDown size={38} />
      </motion.div>

    </section>
  );
}