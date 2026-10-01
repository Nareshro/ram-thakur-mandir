"use client";

import { ArrowUp, Mail, Phone } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";

interface FooterData {
  templeName: string;
  address: string;
  phone: string;
  email: string;

  morningHours: string;
  eveningHours: string;
  aartiTime: string;
  satsangTime: string;

  facebook: string;
  instagram: string;
  youtube: string;

  copyright: string;
}

export default function Footer() {
  const [footer, setFooter] =
    useState<FooterData | null>(null);

  const [logoError, setLogoError] =
    useState(false);

  useEffect(() => {
    const loadFooter = async () => {
      try {
        const snap = await getDoc(
          doc(db, "footer", "main")
        );

        if (snap.exists()) {
          setFooter(
            snap.data() as FooterData
          );
        }
      } catch (error) {
        console.error(
          "Failed to load footer:",
          error
        );
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
    <footer className="relative border-t border-white/10 bg-black text-white">

      {/* Top Section */}

      <div className="mx-auto max-w-7xl px-6 py-16">

        <div className="grid gap-10 lg:grid-cols-4">

          {/* Temple Info */}

          <div>

            {!logoError ? (
              <img
                src="/images/logo/logo.jpg.jpeg"
                alt="Shri Shri Ram Thakur Seva Mandir"
                className="h-[90px] w-[90px] rounded-full border-2 border-amber-400 object-cover"
                onError={() => {
                  setLogoError(true);
                }}
              />
            ) : (
              <div className="flex h-[90px] w-[90px] items-center justify-center rounded-full border-2 border-amber-400 bg-stone-900 text-2xl font-bold text-amber-400">
                RT
              </div>
            )}

            <h3 className="mt-5 text-2xl font-bold">
              {footer?.templeName ||
                "Shri Shri Ram Thakur Seva Mandir"}
            </h3>

            <p className="mt-5 whitespace-pre-line leading-7 text-gray-400">
              {footer?.address ||
                "Banamalipur, Agartala, Tripura"}
            </p>

            {/* Phone */}

            <a
              href={`tel:${
                footer?.phone ||
                "9774054846"
              }`}
              className="mt-5 flex items-center gap-3 text-gray-400 hover:text-amber-400"
            >
              <Phone size={18} />

              <span>
                {footer?.phone ||
                  "9774054846"}
              </span>
            </a>

            {/* Email */}

            <a
              href={`mailto:${
                footer?.email ||
                "info@ramthakurmandir.org"
              }`}
              className="mt-3 flex items-center gap-3 text-gray-400 hover:text-amber-400"
            >
              <Mail size={18} />

              <span>
                {footer?.email ||
                  "info@ramthakurmandir.org"}
              </span>
            </a>

          </div>

          {/* Quick Links */}

          <div>

            <h3 className="mb-5 text-xl font-semibold">
              Quick Links
            </h3>

            <div className="space-y-3">

              <a
                href="#home"
                className="block hover:text-amber-400"
              >
                Home
              </a>

              <a
                href="#about"
                className="block hover:text-amber-400"
              >
                About
              </a>

              <a
                href="#gallery"
                className="block hover:text-amber-400"
              >
                Gallery
              </a>

              <a
                href="#events"
                className="block hover:text-amber-400"
              >
                Events
              </a>

              <a
                href="#contact"
                className="block hover:text-amber-400"
              >
                Contact
              </a>

            </div>

          </div>

          {/* Temple Hours */}

          <div>

            <h3 className="mb-5 text-xl font-semibold">
              Temple Hours
            </h3>

            <div className="space-y-3 text-gray-400">

              <p>
                Morning :{" "}
                {footer?.morningHours ||
                  "5:30 AM – 12:00 PM"}
              </p>

              <p>
                Evening :{" "}
                {footer?.eveningHours ||
                  "4:30 PM – 8:30 PM"}
              </p>

              <p>
                Daily Aarti :{" "}
                {footer?.aartiTime ||
                  "6:00 PM"}
              </p>

              <p>
                Weekly Satsang :{" "}
                {footer?.satsangTime ||
                  "Sunday"}
              </p>

            </div>

          </div>

          {/* Social */}

          <div>

            <h3 className="mb-5 text-xl font-semibold">
              Follow Us
            </h3>

            <div className="flex gap-4">

              {footer?.facebook && (
                <a
                  href={footer.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition hover:bg-amber-500"
                >
                  <FaFacebookF size={20} />
                </a>
              )}

              {footer?.instagram && (
                <a
                  href={footer.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition hover:bg-amber-500"
                >
                  <FaInstagram size={20} />
                </a>
              )}

              {footer?.youtube && (
                <a
                  href={footer.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition hover:bg-amber-500"
                >
                  <FaYoutube size={20} />
                </a>
              )}

            </div>

            <p className="mt-8 leading-7 text-gray-400">
              Follow our temple for updates on
              festivals, satsang and seva activities.
            </p>

          </div>

        </div>

      </div>

      {/* Bottom */}

      <div className="border-t border-white/10">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-6 py-6 md:flex-row">

          <p className="text-center text-gray-500">
            {footer?.copyright ||
              "© 2026 Shri Shri Ram Thakur Seva Mandir. All Rights Reserved."}
          </p>

          <p className="mt-3 font-semibold text-amber-400 md:mt-0">
            Guru Kripahi Kevalam
          </p>

        </div>

      </div>

      {/* Scroll To Top */}

      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 shadow-xl transition-all duration-300 hover:bg-amber-600"
      >
        <ArrowUp size={22} />
      </button>

    </footer>
  );
}