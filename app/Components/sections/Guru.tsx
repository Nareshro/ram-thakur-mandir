"use client";

import { useEffect, useState } from "react";
import { getGurus } from "@/app/lib/guruService";
import type { Guru as GuruType } from "@/app/lib/guruService";

export default function Guru() {
  const [gurus, setGurus] = useState<GuruType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGurus() {
      try {
        const data = await getGurus();

        const sortedGurus = [...data].sort(
          (a, b) =>
            Number(a.displayOrder) -
            Number(b.displayOrder)
        );

        setGurus(sortedGurus);
      } catch (error) {
        console.error(
          "Failed to load Gurus:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadGurus();
  }, []);

  return (
    <section
      id="guru"
      className="scroll-mt-20 bg-white py-24"
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* Header */}

        <div className="mb-16 text-center">

          <p className="font-semibold tracking-[0.35em] text-amber-600">
            OUR GURUS
          </p>

          <h2 className="mt-4 text-5xl font-bold text-stone-900">
            Spiritual Guidance & Divine Teachings
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg text-gray-600">
            Learn about the spiritual guides and revered Gurus
            who continue to inspire devotees through their teachings
            and service.
          </p>

        </div>

        {/* Loading */}

        {loading ? (

          <div className="py-20 text-center text-gray-500">
            Loading Gurus...
          </div>

        ) : gurus.length === 0 ? (

          <div className="py-20 text-center text-gray-500">
            No Guru information available.
          </div>

        ) : (

          <div className="space-y-24">

            {gurus.map((guru, index) => (

              <div
                key={guru.id}
                className="grid items-center gap-12 lg:grid-cols-2"
              >

                {/* Image */}

                <div
                  className={
                    index % 2 === 0
                      ? "flex justify-center"
                      : "flex justify-center lg:order-2"
                  }
                >

                  {guru.image ? (

                    <img
                      src={guru.image}
                      alt={guru.name}
                      className="h-auto w-full max-w-lg rounded-3xl object-cover shadow-2xl"
                    />

                  ) : (

                    <div className="flex h-96 w-full max-w-lg items-center justify-center rounded-3xl bg-gray-100 text-gray-500 shadow-2xl">
                      No Image Available
                    </div>

                  )}

                </div>

                {/* Content */}

                <div
                  className={
                    index % 2 === 0
                      ? ""
                      : "lg:order-1"
                  }
                >

                  <p className="mb-3 font-semibold tracking-[0.35em] text-amber-600">
                    OUR GURU
                  </p>

                  <h3 className="mb-5 text-4xl font-bold text-stone-900">
                    {guru.name}
                  </h3>

                  {guru.subtitle && (
                    <p className="mb-6 text-xl italic text-amber-700">
                      {guru.subtitle}
                    </p>
                  )}

                  {guru.description1 && (
                    <p className="mb-5 text-lg leading-8 text-gray-700">
                      {guru.description1}
                    </p>
                  )}

                  {guru.description2 && (
                    <p className="mb-5 text-lg leading-8 text-gray-700">
                      {guru.description2}
                    </p>
                  )}

                  {guru.description3 && (
                    <p className="text-lg leading-8 text-gray-700">
                      {guru.description3}
                    </p>
                  )}

                </div>

              </div>

            ))}

          </div>

        )}

      </div>
    </section>
  );
}