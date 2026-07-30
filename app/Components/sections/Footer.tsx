"use client";

import Image from "next/image";
import { ArrowUp } from "lucide-react";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

interface FooterData {
  templeName: string;
  address: string;
  phone: string;
  email: string;
  facebook: string;
  instagram: string;
  youtube: string;
  copyright: string;
}

export default function Footer() {
  const [footer, setFooter] = useState<FooterData | null>(null);

  useEffect(() => {
    const loadFooter = async () => {
      try {
        const snap = await getDoc(doc(db, "footer", "main"));

        if (snap.exists()) {
          setFooter(snap.data() as FooterData);
        }
      } catch (error) {
        console.error("Failed to load footer:", error);
      }
    };

    loadFooter();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative bg-black text-white border-t border-white/10">

      {/* Top Section */}

      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid lg:grid-cols-4 gap-10">

          {/* Temple Info */}

          <div>

            <Image
              src="/images/logo/logo.jpg.jpeg"
              alt="Temple Logo"
              width={90}
              height={90}
              className="rounded-full border-2 border-amber-400"
            />

            <h3 className="mt-5 text-2xl font-bold">
              {footer?.templeName || "Shri Shri Ram Thakur Seva Mandir"}
            </h3>

            <p className="text-gray-400 mt-5 leading-7 whitespace-pre-line">
              {footer?.address || "Banamalipur, Agartala, Tripura"}
            </p>

          </div>

          {/* Quick Links */}

          <div>

            <h3 className="text-xl font-semibold mb-5">
              Quick Links
            </h3>

            <div className="space-y-3">

              <a href="#home" className="block hover:text-amber-400">
                Home
              </a>

              <a href="#about" className="block hover:text-amber-400">
                About
              </a>

              <a href="#gallery" className="block hover:text-amber-400">
                Gallery
              </a>

              <a href="#events" className="block hover:text-amber-400">
                Events
              </a>

              <a href="#contact" className="block hover:text-amber-400">
                Contact
              </a>

            </div>

          </div>

          {/* Temple Hours */}

          <div>

            <h3 className="text-xl font-semibold mb-5">
              Temple Hours
            </h3>

            <div className="space-y-3 text-gray-400">

              <p>Morning : 5:30 AM – 12:00 PM</p>

              <p>Evening : 4:30 PM – 8:30 PM</p>

              <p>Daily Aarti : 6:00 PM</p>

              <p>Weekly Satsang : Sunday</p>

            </div>

          </div>

          {/* Social */}

          <div>

            <h3 className="text-xl font-semibold mb-5">
              Follow Us
            </h3>

            <div className="flex gap-4">

              <a
                href={footer?.facebook || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-amber-500 transition flex items-center justify-center"
              >
                <FaFacebookF size={20} />
              </a>

              <a
                href={footer?.instagram || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-amber-500 transition flex items-center justify-center"
              >
                <FaInstagram size={20} />
              </a>

              <a
                href={footer?.youtube || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-amber-500 transition flex items-center justify-center"
              >
                <FaYoutube size={20} />
              </a>

            </div>

            <p className="mt-8 text-gray-400 leading-7">
              Follow our temple for updates on festivals,
              satsang and seva activities.
            </p>

          </div>

        </div>

      </div>

      {/* Bottom */}

      <div className="border-t border-white/10">

        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center">

          <p className="text-gray-500 text-center">
            {footer?.copyright ||
              "© 2026 Shri Shri Ram Thakur Seva Mandir. All Rights Reserved."}
          </p>

          <p className="text-amber-400 font-semibold mt-3 md:mt-0">
            Guru Kripahi Kevalam
          </p>

        </div>

      </div>

      {/* Scroll To Top */}

      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 bg-amber-500 hover:bg-amber-600 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300"
      >
        <ArrowUp size={22} />
      </button>

    </footer>
  );
}