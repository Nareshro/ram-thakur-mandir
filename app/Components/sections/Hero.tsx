export default function Hero() {
  return (
    <section className="relative h-screen">
      <img
        src="/images/hero/mandir-hero.jpg.jpeg"
        alt="Temple"
        className="absolute inset-0 h-full w-full object-cover object-[center_35%]"
      />

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center">

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

        <h2 className="mt-6 text-3xl font-bold text-amber-400">
          Seva Mandir
        </h2>

        <p className="mt-6 text-xl text-white">
          Banamalipur, Agartala, Tripura, Bharat
        </p>

        <div className="mt-10 flex gap-6">
          <button className="rounded-full bg-amber-500 px-10 py-4 text-lg text-white hover:bg-amber-600 transition">
            Visit Temple
          </button>

          <button className="rounded-full border border-white px-10 py-4 text-lg text-white hover:bg-white hover:text-black transition">
            Temple Timings
          </button>
        </div>
      </div>
    </section>
  );
}