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
}

export default function Contact() {
  const [homepage, setHomepage] = useState<HomepageData | null>(null);

  useEffect(() => {
    const loadHomepage = async () => {
      try {
        const snap = await getDoc(doc(db, "homepage", "main"));

        if (snap.exists()) {
          setHomepage(snap.data() as HomepageData);
        }
      } catch (error) {
        console.error("Failed to load contact data:", error);
      }
    };

    loadHomepage();
  }, []);

  return (
    <section
      id="contact"
      className="bg-[#111111] py-24 text-white"
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
            Contact Us
          </p>

          <h2 className="text-5xl font-bold mt-4">
            Visit Our Temple
          </h2>

          <p className="mt-6 max-w-3xl mx-auto text-gray-400 leading-8">
            We welcome all devotees to experience peace, devotion,
            satsang and seva at Shri Shri Ram Thakur Seva Mandir.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mt-16">

          {/* Contact Details */}

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >

            <div className="space-y-8">

              <div className="flex gap-5">
                <MapPin className="text-amber-400 mt-1" />

                <div>
                  <h3 className="text-xl font-semibold">
                    Temple Address
                  </h3>

                  <p className="text-gray-400 mt-2 leading-7 whitespace-pre-line">
                    {homepage?.address ||
                      "Shri Shri Ram Thakur Seva Mandir\nBanamalipur\nAgartala\nTripura – 799001"}
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <Phone className="text-amber-400 mt-1" />

                <div>
                  <h3 className="text-xl font-semibold">
                    Phone
                  </h3>

                  <a
                    href={`tel:${homepage?.phone || "+919774050010"}`}
                    className="text-gray-400 hover:text-amber-400"
                  >
                    {homepage?.phone || "+91 97740 50010"}
                  </a>
                </div>
              </div>

              <div className="flex gap-5">
                <Mail className="text-amber-400 mt-1" />

                <div>
                  <h3 className="text-xl font-semibold">
                    Email
                  </h3>

                  <a
                    href={`mailto:${homepage?.email || "info@ramthakurmandir.org"}`}
                    className="text-gray-400 hover:text-amber-400"
                  >
                    {homepage?.email || "info@ramthakurmandir.org"}
                  </a>
                </div>
              </div>

              <div className="flex gap-5">
                <Clock className="text-amber-400 mt-1" />

                <div>
                  <h3 className="text-xl font-semibold">
                    Temple Hours
                  </h3>

                  <p className="text-gray-400">
                    Daily : 5:30 AM – 8:30 PM
                  </p>
                </div>
              </div>

            </div>

          </motion.div>

          {/* Google Map */}

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >

            <div className="overflow-hidden rounded-3xl border border-white/10 shadow-xl">

              <iframe
                title="Temple Location"
                src="https://www.google.com/maps?q=Banamalipur%20Agartala&output=embed"
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