"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

interface HomepageData {
  address: string;
  phone: string;
  email: string;
  mapUrl: string;
}

interface TimingsData {
  morningOpen: string;
  morningClose: string;
  eveningOpen: string;
  eveningClose: string;
  aartiTime: string;
  specialNote: string;
}

export default function Contact() {
  const [homepage, setHomepage] =
    useState<HomepageData | null>(null);

  const [timings, setTimings] =
    useState<TimingsData | null>(null);

  useEffect(() => {
    loadContactData();
    loadTimings();
  }, []);

  async function loadContactData() {
    try {
      const snap = await getDoc(
        doc(db, "homepage", "main")
      );

      if (snap.exists()) {
        const data = snap.data();

        setHomepage({
          address: data.address || "",
          phone: data.phone || "",
          email: data.email || "",
          mapUrl: data.mapUrl || "",
        });
      }
    } catch (error) {
      console.error(
        "Failed to load contact data:",
        error
      );
    }
  }

  async function loadTimings() {
    try {
      const snap = await getDoc(
        doc(db, "timings", "main")
      );

      if (snap.exists()) {
        setTimings(
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

  const address =
    homepage?.address ||
    "Shri Shri Ram Thakur Seva Mandir\nBanamalipur\nAgartala\nTripura – 799001";

  const phone =
    homepage?.phone ||
    "+91 97740 50010";

  const email =
    homepage?.email ||
    "info@ramthakurmandir.org";

  const mapUrl =
    homepage?.mapUrl ||
    "https://www.google.com/maps?q=Banamalipur%20Agartala&output=embed";

  const morningOpen =
    timings?.morningOpen || "5:30 AM";

  const morningClose =
    timings?.morningClose || "12:00 PM";

  const eveningOpen =
    timings?.eveningOpen || "4:30 PM";

  const eveningClose =
    timings?.eveningClose || "8:30 PM";

  return (
    <section
      id="contact"
      className="bg-[#0B0B0B] py-24 text-white"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}

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
            Contact Us
          </p>

          <h2 className="text-5xl font-bold mt-4">
            Visit Our Temple
          </h2>

          <p className="mt-6 max-w-3xl mx-auto text-gray-400 leading-8">
            We welcome all devotees to experience
            peace, devotion, satsang and seva at
            Shri Shri Ram Thakur Seva Mandir.
          </p>
        </motion.div>

        {/* Main Content */}

        <div className="grid lg:grid-cols-2 gap-12 mt-16">

          {/* Contact Details */}

          <motion.div
            initial={{
              opacity: 0,
              x: -40,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
          >
            <div className="space-y-8">

              {/* Address */}

              <div className="flex gap-5">

                <MapPin
                  className="text-amber-400 mt-1 flex-shrink-0"
                />

                <div>
                  <h3 className="text-xl font-semibold">
                    Temple Address
                  </h3>

                  <p className="text-gray-400 mt-2 leading-7 whitespace-pre-line">
                    {address}
                  </p>
                </div>

              </div>

              {/* Phone */}

              <div className="flex gap-5">

                <Phone
                  className="text-amber-400 mt-1 flex-shrink-0"
                />

                <div>
                  <h3 className="text-xl font-semibold">
                    Phone
                  </h3>

                  <a
                    href={`tel:${phone}`}
                    className="text-gray-400 hover:text-amber-400 transition"
                  >
                    {phone}
                  </a>
                </div>

              </div>

              {/* Email */}

              <div className="flex gap-5">

                <Mail
                  className="text-amber-400 mt-1 flex-shrink-0"
                />

                <div>
                  <h3 className="text-xl font-semibold">
                    Email
                  </h3>

                  <a
                    href={`mailto:${email}`}
                    className="text-gray-400 hover:text-amber-400 transition"
                  >
                    {email}
                  </a>
                </div>

              </div>

              {/* Temple Hours */}

              <div className="flex gap-5">

                <Clock
                  className="text-amber-400 mt-1 flex-shrink-0"
                />

                <div>
                  <h3 className="text-xl font-semibold">
                    Temple Hours
                  </h3>

                  <p className="text-gray-400 mt-2">
                    Morning:{" "}
                    {morningOpen} – {morningClose}
                  </p>

                  <p className="text-gray-400 mt-1">
                    Evening:{" "}
                    {eveningOpen} – {eveningClose}
                  </p>

                  {timings?.aartiTime && (
                    <p className="text-gray-400 mt-1">
                      Daily Aarti:{" "}
                      {timings.aartiTime}
                    </p>
                  )}
                </div>

              </div>

            </div>
          </motion.div>

          {/* Google Map */}

          <motion.div
            initial={{
              opacity: 0,
              x: 40,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
          >
            <div className="overflow-hidden rounded-3xl border border-white/10 shadow-xl">

              <iframe
                title="Temple Location"
                src={mapUrl}
                width="100%"
                height="500"
                loading="lazy"
                className="border-0"
              />

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}