export default function Gallery() {
  const images = [
    "/images/gallery/guruji.jpg.jpeg",
    "/images/gallery/devotees1.jpg.jpeg",
    "/images/gallery/devotees2.jpg.jpeg",
  ];

  return (
    <section
      id="gallery"
      className="py-24 bg-stone-950 text-white"
    >
      <div className="max-w-7xl mx-auto px-6">

        <h3 className="text-amber-400 uppercase tracking-[0.3em] text-center">
          Temple Gallery
        </h3>

        <h2 className="text-5xl font-bold text-center mt-3">
          Moments of Devotion
        </h2>

        <p className="text-center text-gray-300 mt-5 max-w-2xl mx-auto">
          A glimpse into the spiritual life of Shri Shri Ram Thakur Seva Mandir,
          where devotees gather in faith, prayer, satsang and seva.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-16">

          {images.map((img, index) => (

            <div
              key={index}
              className="overflow-hidden rounded-3xl shadow-2xl group"
            >

              <img
                src={img}
                alt="Temple"
                className="h-80 w-full object-cover transition duration-700 group-hover:scale-110"
              />

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}