"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { motion } from "framer-motion";

interface EventItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  eventDate: string;
  status: string;
}

export default function Events() {
  const [events, setEvents] =
    useState<EventItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      setLoading(true);

      const snapshot = await getDocs(
        collection(db, "events")
      );

      const data = snapshot.docs.map(
        (item) => ({
          id: item.id,
          ...(item.data() as Omit<
            EventItem,
            "id"
          >),
        })
      );

      const upcomingEvents =
        data.filter(
          (event) =>
            event.status === "Upcoming"
        );

      upcomingEvents.sort((a, b) =>
        a.eventDate.localeCompare(
          b.eventDate
        )
      );

      setEvents(upcomingEvents);

    } catch (error) {
      console.error(
        "Failed to load events:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <section
        id="events"
        className="bg-gray-50 py-24"
      >
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-gray-500">
            Loading events...
          </p>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return null;
  }

  return (
    <section
      id="events"
      className="bg-gray-50 py-24"
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}

        <motion.div
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
          className="text-center"
        >
          <p className="uppercase tracking-[0.35em] text-orange-500">
            Upcoming Events
          </p>

          <h2 className="mt-4 text-5xl font-bold text-gray-900">
            Spiritual Gatherings
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-gray-600">
            Join us for spiritual gatherings,
            festivals, prayers and special
            temple activities.
          </p>
        </motion.div>

        {/* Events */}

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {events.map(
            (event, index) => (

              <motion.div
                key={event.id}
                initial={{
                  opacity: 0,
                  y: 25,
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
                className="overflow-hidden rounded-3xl bg-white shadow-xl transition hover:shadow-2xl"
              >

                {/* Image */}

                {event.imageUrl ? (

                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="h-56 w-full object-cover"
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

                {/* Image fallback */}

                <div
                  className={`h-56 w-full items-center justify-center bg-amber-100 text-amber-600 ${
                    event.imageUrl
                      ? "hidden"
                      : "flex"
                  }`}
                >
                  Temple Event
                </div>

                {/* Content */}

                <div className="p-8">

                  <p className="font-semibold text-orange-500">
                    {event.eventDate}
                  </p>

                  <h3 className="mt-4 text-3xl font-bold text-gray-900">
                    {event.title}
                  </h3>

                  <p className="mt-5 leading-8 text-gray-700">
                    {event.description}
                  </p>

                </div>

              </motion.div>

            )
          )}

        </div>

      </div>
    </section>
  );
}