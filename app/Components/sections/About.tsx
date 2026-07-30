"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Users, Sunrise } from "lucide-react";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

interface HomepageData {
  about: string;
  aboutTitle: string;
  aboutHeading: string;
  mission: string;
  dailyAarti: string;
  devotees: string;
  peaceService: string;
}

export default function About() {
  const [homepage, setHomepage] =useState<HomepageData | null>(null);

 useEffect(() => {
  const loadHomepage = async () => {
    try {
      const snap = await getDoc(doc(db, "homepage", "main"));

      if (snap.exists()) {
        setHomepage(snap.data() as HomepageData);
      }
    } catch (error) {
      console.error("Failed to load homepage:", error);
    }
  };

  loadHomepage();
}, []);

  const stats = [
    {
      icon: Heart,
      title: "Daily Aarti",
      value: homepage?.dailyAarti || "2 Times",
    },
    {
      icon: Users,
      title: "Devotees",
      value: homepage?.devotees || "500+",
    },
    {
      icon: Sunrise,
      title: "Peace & Seva",
      value: homepage?.peaceService || "Every Day",
    },
  ];

  return (
    <section id="about" className="bg-[#0B0B0B] py-24 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Temple Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <Image
              src="/images/gallery/devotees1.jpg.jpeg"
              alt="Temple"
              width={700}
              height={850}
              className="rounded-3xl shadow-2xl object-cover"
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <p className="uppercase tracking-[0.3em] text-amber-400">
              {homepage?.aboutTitle || "About Our Mandir"}
            </p>

            <h2 className="text-5xl font-bold mt-5 leading-tight">
              {homepage?.aboutHeading ||
                "A Sacred Place of Devotion & Service"}
            </h2>

            <p className="mt-8 text-gray-300 leading-8">
              {homepage?.about ||
                "Shri Shri Ram Thakur Seva Mandir is a sacred place of devotion and service."}
            </p>

            <p className="mt-6 text-gray-400 leading-8">
              {homepage?.mission ||
                "Our mission is to spread peace, compassion and humanity."}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
              {stats.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center hover:border-amber-400 transition"
                  >
                    <Icon
                      className="mx-auto text-amber-400"
                      size={34}
                    />

                    <h3 className="mt-4 text-3xl font-bold">
                      {item.value}
                    </h3>

                    <p className="text-gray-400 mt-2">
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
  );
}