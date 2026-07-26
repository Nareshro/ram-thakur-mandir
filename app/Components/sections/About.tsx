export default function About() {
  return (
    <section
      id="about"
      className="bg-[#FFF9F0] py-24"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="grid items-center gap-16 lg:grid-cols-2">

          <img
            src="/images/hero/mandir-hero.jpg.jpeg"
            alt="Temple"
            className="rounded-3xl shadow-2xl"
          />

          <div>

            <h4 className="mb-3 text-amber-600 font-semibold tracking-[0.3em]">
              ABOUT OUR MANDIR
            </h4>

            <h2 className="mb-6 text-5xl font-bold text-stone-900">
              A Sacred Place of Peace & Devotion
            </h2>

            <p className="mb-6 text-lg leading-8 text-gray-700">
              Shri Shri Ram Thakur Seva Mandir at Banamalipur,
              Agartala is dedicated to spreading the teachings
              of Sri Sri Ram Thakur through devotion,
              satsang, prayer and selfless service.
            </p>

            <p className="mb-10 text-lg leading-8 text-gray-700">
              The temple welcomes devotees from all walks
              of life and serves as a spiritual home where
              everyone gathers in peace and harmony.
            </p>

            <button className="rounded-full bg-amber-500 px-8 py-4 text-white hover:bg-amber-600 transition">
              Learn More
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}