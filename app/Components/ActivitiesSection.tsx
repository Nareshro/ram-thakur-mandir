"use client";

import { motion } from "framer-motion";
import { Heart, Flower2 } from "lucide-react";
import { useEffect, useState } from "react";

import { getActivities } from "@/app/lib/activityService";
import type { Activity } from "@/app/lib/activityService";

export default function ActivitiesSection() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadActivities() {
      try {
        const data = await getActivities();
        setActivities(data);
      } catch (error) {
        console.error("Failed to load activities:", error);
      } finally {
        setLoading(false);
      }
    }

    loadActivities();
  }, []);

  const socialActivities = activities
    .filter((activity) => activity.category === "social")
    .sort(
      (a, b) =>
        Number(a.displayOrder) - Number(b.displayOrder)
    );

  const pujaActivities = activities
    .filter((activity) => activity.category === "puja")
    .sort(
      (a, b) =>
        Number(a.displayOrder) - Number(b.displayOrder)
    );

  return (
    <section
      id="activities"
      className="scroll-mt-20 bg-[#0B0B0B] py-24 text-white"
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* Header */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="uppercase tracking-[0.35em] text-amber-400">
            Our Activities
          </p>

          <h2 className="mt-4 text-5xl font-bold">
            Devotion Through Service
          </h2>

          <p className="mx-auto mt-6 max-w-3xl leading-8 text-gray-400">
            Explore the social service and devotional activities
            conducted by Shri Shri Ram Thakur Seva Mandir.
          </p>
        </motion.div>

        {/* Loading */}

        {loading ? (
          <div className="py-20 text-center text-gray-400">
            Loading activities...
          </div>
        ) : (
          <div className="mt-16 space-y-20">

            {/* ================= SOCIAL ACTIVITIES ================= */}

            <div>
              <div className="mb-10 flex items-center justify-center gap-3">
                <Heart
                  className="text-amber-400"
                  size={30}
                />

                <h3 className="text-3xl font-bold">
                  Social Activities
                </h3>
              </div>

              {socialActivities.length === 0 ? (
                <p className="text-center text-gray-500">
                  No social activities available.
                </p>
              ) : (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {socialActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
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
                      transition={{
                        duration: 0.5,
                        delay: index * 0.1,
                      }}
                      className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-2 hover:border-amber-400"
                    >
                      {activity.image ? (
                        <img
                          src={activity.image}
                          alt={activity.title}
                          className="h-56 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-56 items-center justify-center bg-white/5 text-gray-500">
                          No Image
                        </div>
                      )}

                      <div className="p-7">
                        <h4 className="text-2xl font-bold">
                          {activity.title}
                        </h4>

                        <p className="mt-4 leading-7 text-gray-400">
                          {activity.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* ================= PUJA ACTIVITIES ================= */}

            <div>
              <div className="mb-10 flex items-center justify-center gap-3">
                <Flower2
                  className="text-amber-400"
                  size={30}
                />

                <h3 className="text-3xl font-bold">
                  Puja Activities
                </h3>
              </div>

              {pujaActivities.length === 0 ? (
                <p className="text-center text-gray-500">
                  No puja activities available.
                </p>
              ) : (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {pujaActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
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
                      transition={{
                        duration: 0.5,
                        delay: index * 0.1,
                      }}
                      className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-2 hover:border-amber-400"
                    >
                      {activity.image ? (
                        <img
                          src={activity.image}
                          alt={activity.title}
                          className="h-56 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-56 items-center justify-center bg-white/5 text-gray-500">
                          No Image
                        </div>
                      )}

                      <div className="p-7">
                        <h4 className="text-2xl font-bold">
                          {activity.title}
                        </h4>

                        <p className="mt-4 leading-7 text-gray-400">
                          {activity.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </section>
  );
}