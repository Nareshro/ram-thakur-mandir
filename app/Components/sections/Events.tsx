export default function Events() {

  const events = [
    {
      title: "Weekly Satsang",
      date: "Every Sunday",
      description: "Devotional songs, satsang and spiritual discussion."
    },
    {
      title: "Guru Purnima",
      date: "Annual Festival",
      description: "Special prayers, bhajans and seva activities."
    },
    {
      title: "Daily Aarti",
      date: "Morning & Evening",
      description: "Join us every day for peaceful worship."
    }
  ];

  return (
    <section
      id="events"
      className="bg-stone-100 py-24"
    >

      <div className="max-w-7xl mx-auto px-6">

        <p className="uppercase tracking-[0.35em] text-amber-600 text-center">
          Upcoming Events
        </p>

        <h2 className="text-center text-5xl font-bold mt-3 text-gray-900">
          Spiritual Gatherings
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mt-16">

          {events.map((event, index) => (

            <div
              key={index}
              className="bg-white rounded-3xl shadow-xl p-8 hover:-translate-y-2 transition duration-300"
            >

              <p className="text-amber-600 font-semibold">
                {event.date}
              </p>

              <h3 className="text-2xl font-bold mt-3">
                {event.title}
              </h3>

              <p className="text-gray-600 mt-4 leading-7">
                {event.description}
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}