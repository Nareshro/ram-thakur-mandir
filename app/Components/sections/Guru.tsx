export default function Guru() {
  return (
    <section
      id="guru"
      className="bg-white py-24"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* Guru Image */}

          <div className="flex justify-center">

           <img
            src="/images/gallery/guruji.jpg.jpeg"
            alt="Guru Ji"
            className="w-full max-w-lg rounded-3xl shadow-2xl object-cover"
            />

          </div>

          {/* Text */}

          <div>

            <h4 className="mb-3 font-semibold tracking-[0.35em] text-amber-600">
              OUR GURU
            </h4>

            <h2 className="mb-6 text-5xl font-bold text-stone-900">
              Sri Sri Ram Thakur
            </h2>

            <p className="mb-6 text-xl italic text-amber-700">
              "Love All • Serve All • Remember the Holy Name"
            </p>

            <p className="mb-6 text-lg leading-8 text-gray-700">
              Sri Sri Ram Thakur (Ram Chandra Dev) was born on
              2 February 1860 at Dingamanik, Faridpur
              (present-day Bangladesh).
            </p>

            <p className="mb-6 text-lg leading-8 text-gray-700">
              Revered as Sri Sri Kaibalyanath and lovingly known
              as Dayal Thakur, he welcomed people from every
              caste, creed and religion with unconditional love,
              compassion and service.
            </p>

            <p className="mb-10 text-lg leading-8 text-gray-700">
              His timeless teachings continue to inspire
              millions of devotees through satsang,
              devotion, selfless service and remembrance
              of the Holy Name.
            </p>

            <button className="rounded-full bg-amber-500 px-8 py-4 text-white transition hover:bg-amber-600">
              Read More
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}