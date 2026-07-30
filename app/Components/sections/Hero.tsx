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

export default function Hero() 
{
    const [homepage, setHomepage] = useState<HomepageData | null>(null);

useEffect(() => {
  const loadHomepage = async () => {
    const snap = await getDoc(doc(db, "homepage", "main"));

    if (snap.exists()) {
      setHomepage(snap.data() as HomepageData);
    }
  };

  loadHomepage();
}, []);
  return (
    <section
      id="home"
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Background Image */}
      <Image
        src={homepage?.heroImage || "/images/hero/mandir-hero.jpg.jpeg"}
        alt="Shri Shri Ram Thakur Seva Mandir"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/80" />

      {/* Hero Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div className="max-w-4xl text-center">

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Image
              src="/images/logo/logo.jpg.jpeg"
              alt="Temple Logo"
              width={110}
              height={110}
              className="mx-auto rounded-full border-4 border-amber-400 shadow-2xl"
            />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .3 }}
            className="mt-8 text-amber-400 text-lg md:text-xl tracking-[0.35em]"
          >
            {homepage?.heroTitle || "JOY RAM"}
          </motion.h2>

          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .5 }}
            className="mt-4 text-5xl md:text-7xl font-extrabold text-white leading-tight"
          >
           {homepage?.templeName || "Shri Shri Ram Thakur Seva Mandir"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: .8 }}
            className="mt-8 text-lg md:text-2xl text-gray-200"
          >
            {homepage?.address || "Banamalipur, Agartala, Tripura"}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-4 max-w-2xl mx-auto text-gray-300 leading-8"
          >
           {homepage?.heroDescription ||
         "A sacred place of devotion, peace, satsang, and selfless service."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-10 flex flex-col sm:flex-row justify-center gap-5"
          >
            <a
              href="#about"
              className="rounded-full bg-amber-500 px-8 py-4 text-lg font-semibold text-white transition hover:bg-amber-600"
            >
              Explore Temple
            </a>

            <a
              href="#contact"
              className="rounded-full border border-white/40 bg-white/10 backdrop-blur-md px-8 py-4 text-lg font-semibold text-white transition hover:bg-white/20"
            >
              Visit Us
            </a>
          </motion.div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{
          repeat: Infinity,
          duration: 1.8
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white"
      >
        <ChevronDown size={38} />
      </motion.div>
    </section>
  );
}