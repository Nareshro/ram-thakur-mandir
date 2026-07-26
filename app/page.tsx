import Image from "next/image";
import Navbar from "./Components/layout/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="relative">

        <section className="relative h-screen">

          <img
          src="/images/hero/mandir-hero.jpg.jpeg"
          alt="Temple"
          className="absolute inset-0 h-full w-full object-cover object-top"  
          
          />

          <div className="absolute inset-0 bg-black/60" />

          <div className="relative z-10 flex h-full -translate-y-12 flex-col items-center justify-center px-6 text-center">
            <img
           src="/images/logo/logo.jpg.jpeg"
            alt="Temple Logo"
            className="mb-6 h-24 w-24 rounded-full shadow-2xl"
            />
            <h3 className="mb-5 text-xl tracking-[0.5em] text-amber-300">
              JOY RAM
            </h3>

            <h1 className="text-5xl font-bold text-white md:text-7xl">
              Shri Shri Ram Thakur
            </h1>

            <h2 className="mt-5 text-3xl font-semibold text-amber-300">
              Seva Mandir
            </h2>

            <p className="mt-6 max-w-3xl text-lg text-gray-200">
              Banamalipur, Agartala, Tripura, Bharat
            </p>

            <div className="mt-10 flex gap-5">

              <button className="rounded-full bg-amber-500 px-8 py-4 text-white hover:bg-amber-600">
                Visit Temple
              </button>

              <button className="rounded-full border border-white px-8 py-4 text-white hover:bg-white hover:text-black transition">
                Temple Timings
              </button>

            </div>

          </div>

        </section>

      </main>
    </>
  );
}