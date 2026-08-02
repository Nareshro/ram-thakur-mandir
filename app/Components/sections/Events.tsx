"use client";

import { motion } from "framer-motion";

const events = [
  {
    badge: "Every Sunday",
    title: "Weekly Satsang",
    description:
      "Devotional songs, satsang and spiritual discussion.",
  },
  {
    badge: "Annual Festival",
    title: "Guru Purnima",
    description:
      "Special prayers, bhajans and seva activities.",
  },
  {
    badge: "Morning & Evening",
    title: "Daily Aarti",
    description:
      "Join us every day for peaceful worship.",
  },
];

export default function Events() {
  return (
    <section
      id="events"
      className="bg-gradient-to-b from-white to-gray-100 py-24"
    >
      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="uppercase tracking-[0.35em] text-orange-500">
            Upcoming Events
          </p>

          <h2 className="mt-4 text-5xl font-bold text-gray-900">
            Spiritual Gatherings
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition"
            >
              <p className="text-orange-500 font-semibold">
                {event.badge}
              </p>

              <h3 className="mt-5 text-3xl font-bold text-gray-900">
                {event.title}
              </h3>

              <p className="mt-5 text-gray-700 leading-8">
                {event.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}