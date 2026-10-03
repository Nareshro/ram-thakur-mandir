"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "./lib/firebase";
const navigation = [
  {
    label: "Home",
    href: "#home",
  },
  {
    label: "About Us",
    children: [
      { label: "History", href: "#history" },
      { label: "At a Glance", href: "#glance" },
      { label: "Executive Committee", href: "#committee" },
    ],
  },
  {
    label: "Sri Sri Thakur",
    href: "#thakur",
  },
  {
    label: "Our Activities",
    children: [
      { label: "i) Social Activities (Seva)", href: "#social" },
      { label: "ii) Puja Activities & Rituals", href: "#puja" },
    ],
  },
  {
    label: "Present Facilities",
    href: "#facilities",
  },
  {
    label: "Puja Calendar",
    href: "#calendar",
  },
  {
    label: "Events & Archive",
    children: [
      { label: "Upcoming Events", href: "#events" },
      { label: "Special Events", href: "#special-events" },
      { label: "Archive", href: "#archive" },
    ],
  },
  {
    label: "Photo Gallery",
    href: "#gallery",
  },
  {
    label: "Publications",
    href: "#publications",
  },
  {
    label: "Connect",
    children: [
      { label: "Contact Us", href: "#contact" },
      { label: "Feedback", href: "#feedback" },
      { label: "Other Useful Links", href: "#links" },
    ],
  },
];
const aboutItems = [
  "History",
  "At a Glance",
  "Executive Committee",
];
export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [homeData, setHomeData] = useState<Record<string, any>>({});
  const [footerData, setFooterData] = useState<Record<string, any>>({});
  const [events, setEvents] = useState<any[]>([]);
  const [calendarItems, setCalendarItems] = useState<any[]>([]);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [historyData, setHistoryData] = useState<Record<string, any>>({});
const [glanceData, setGlanceData] = useState<Record<string, any>>({});
const [committeeMembers, setCommitteeMembers] = useState<any[]>([]);
const [guruData, setGuruData] = useState<Record<string, any>>({});
const [activitiesData, setActivitiesData] = useState<any[]>([]);
  const [facilityItems, setFacilityItems] = useState<any[]>([]);
  const [publicationItems, setPublicationItems] = useState<any[]>([]);
  const [donationData, setDonationData] = useState<Record<string, any>>({});
  const [usefulLinks, setUsefulLinks] = useState<any[]>([]);
  useEffect(() => {
    const loadPublicContent = async () => {
      try {
       const [
  homeSnap,
  footerSnap,
  eventsSnap,
  calendarSnap,
  gallerySnap,
  announcementSnap,
  historySnap,
  glanceSnap,
  committeeSnap,
  guruSnap,
  activitiesSnap,
  publicationsSnap,
  donationSnap,
usefulLinksSnap,
] = await Promise.all([
  getDoc(doc(db, "homepage", "main")),
  getDoc(doc(db, "footer", "main")),
  getDocs(collection(db, "events")),
  getDocs(collection(db, "pujaCalendar")),
  getDocs(collection(db, "gallery")),
  getDocs(collection(db, "announcements")),
   getDoc(doc(db, "about", "history")),
  getDoc(doc(db, "about", "glance")),
  getDocs(collection(db, "committee")),
  getDocs(collection(db, "guru")),
  getDocs(collection(db, "activities")),
  getDocs(collection(db, "publications")),
  getDocs(collection(db, "donation")),
  getDocs(collection(db, "usefulLinks")),
]);
        if (homeSnap.exists()) setHomeData(homeSnap.data());
        if (footerSnap.exists()) setFooterData(footerSnap.data());
        setEvents(eventsSnap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((x: any) => x.status !== "Draft"));
        setCalendarItems(calendarSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setAnnouncements(
          announcementSnap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter(
       (item: any) =>
        item.active !== false &&
        item.status !== "Draft" &&
        item.status !== "Inactive"
    )
);
        setGalleryItems(gallerySnap.docs.map((d) => ({ id: d.id, ...d.data() })));
        const guruRecords = guruSnap.docs.map((d) => ({
  id: d.id,
  ...d.data(),
}));
if (guruRecords.length > 0) {
  setGuruData(guruRecords[0]);
}
        if (historySnap.exists()) {
  setHistoryData(historySnap.data());
}
setActivitiesData(
  activitiesSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }))
);
setPublicationItems(
  publicationsSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }))
);
setUsefulLinks(
  usefulLinksSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }))
);
const donationRecords = donationSnap.docs.map((d) => ({
  id: d.id,
  ...d.data(),
}));

if (donationRecords.length > 0) {
  setDonationData(donationRecords[0]);
}
if (glanceSnap.exists()) {
  setGlanceData(glanceSnap.data());
}
setCommitteeMembers(
  committeeSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }))
  
);
      } catch (error) {
        console.error("Public homepage content loading error:", error);
      }
    };
    loadPublicContent();
  }, []);
  const templeName = homeData.templeName || footerData.templeName || "Shri Shri Ram Thakur Seva Mandir";
  const templeAddress = footerData.address || "Banamalipur, Agartala, Tripura, India";
  const templePhone = footerData.phone || "+91 9774050010";
  const templeEmail = footerData.email || "";
  return (
    <main className="min-h-screen bg-[#fffdf8] text-[#38271e]">
      {/* TOP INFORMATION BAR */}
      <div className="bg-[#681b1b] text-amber-100">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs font-medium sm:px-6">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span>
              ◷ Darshan: {footerData.darshanTimings || "06:00 AM – 12:30 PM | 04:30 PM – 08:45 PM"}
            </span>
            <span>☎ {templePhone}</span>
          </div>
          <a
            href="/admin/login"
            className="hidden text-amber-200 hover:text-white sm:block"
          >
            Admin Login →
          </a>
        </div>
      </div>
      {/* BRAND HEADER */}
      <header className="bg-[#fffdf8]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
          <a href="#home" className="flex items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-amber-500 bg-[#f6e9ff] text-3xl text-purple-700 shadow-sm">
              ॐ
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#642019] sm:text-2xl">
                {templeName}
              </h1>
              <p className="mt-1 text-xs text-[#8b472a] sm:text-sm">
                श्री श्री रामठाकुर सेवा मन्दिर • Spirituality • Devotion • Service
              </p>
            </div>
          </a>
          <a
            href="#donation"
            className="hidden items-center gap-2 rounded-full bg-gradient-to-r from-amber-600 to-red-700 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105 sm:flex"
          >
            ♡ Online Donation / Seva
          </a>
          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg border border-amber-700 px-4 py-2 text-sm font-semibold text-[#681b1b] lg:hidden"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? "✕ Close" : "☰ Menu"}
          </button>
        </div>
      </header>
      {/* NOTICE BAR */}
<div className="overflow-hidden border-y border-amber-500 bg-[#a94c08] py-2 text-white">
  <div className="mx-auto flex max-w-7xl items-center gap-4 px-4">
    <span className="shrink-0 rounded bg-[#76251d] px-3 py-1 text-xs font-bold">
      ♧ NOTICE
    </span>
    <div className="overflow-hidden whitespace-nowrap text-xs font-semibold flex-1">
      <div className="animate-[marquee_22s_linear_infinite]">
        {announcements.length > 0 ? (
          announcements.map((item: any) => (
            <span key={item.id} className="mr-12">
              🌸 {item.title || item.message || item.description}
              {item.date ? ` | ${item.date}` : ""}
            </span>
          ))
        ) : (
          <span>
            🌸 Jai Gurudev! Welcome to Shri Shri Ram Thakur Seva Mandir.
            Please check our upcoming pujas, festivals and special events.
          </span>
        )}
      </div>
    </div>
  </div>
</div>
      {/* DESKTOP NAVIGATION */}
      <nav className="relative z-40 hidden border-b-2 border-amber-500 bg-[#4b190f] text-[#fff1c7] lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-2">
          {navigation.map((item) => (
            <div key={item.label} className="group relative">
              {item.children ? (
                <>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-3 py-5 text-sm font-semibold transition hover:text-amber-300"
                  >
                    {item.label}
                    <span className="text-xs">⌄</span>
                  </button>
                  <div className="invisible absolute left-0 top-full z-50 min-w-56 translate-y-2 border-t-2 border-amber-400 bg-[#551b12] opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    {item.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        className="block border-b border-white/10 px-5 py-3 text-sm transition hover:bg-[#792d1c] hover:text-amber-300"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                </>
              ) : (
                <a
                  href={item.href}
                  className={`block px-3 py-5 text-sm font-semibold transition hover:text-amber-300 ${
                    item.label === "Home"
                      ? "border-b-2 border-amber-400 text-amber-300"
                      : ""
                  }`}
                >
                  {item.label}
                </a>
              )}
            </div>
          ))}
          <a
            href="#donation"
            className="my-2 rounded-full bg-amber-500 px-5 py-2 text-xs font-bold tracking-wide text-[#42190d] transition hover:bg-amber-300"
          >
            DONATE
          </a>
        </div>
      </nav>
      {/* MOBILE NAVIGATION */}
      {mobileMenuOpen && (
        <nav className="relative z-40 border-b-2 border-amber-500 bg-[#4b190f] px-4 py-3 text-[#fff1c7] lg:hidden">
          {navigation.map((item) => (
            <div
              key={item.label}
              className="border-b border-white/10"
            >
              {item.children ? (
                <details className="group">
                  <summary className="cursor-pointer list-none px-3 py-3 text-sm font-semibold hover:text-amber-300">
                    {item.label} <span className="float-right">⌄</span>
                  </summary>
                  <div className="bg-[#551b12] pl-4">
                    {item.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-3 text-sm hover:text-amber-300"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                </details>
              ) : (
                <a
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-3 text-sm font-semibold hover:text-amber-300"
                >
                  {item.label}
                </a>
              )}
            </div>
          ))}
          <a
            href="#donation"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-4 block rounded-full bg-amber-500 px-5 py-3 text-center text-sm font-bold text-[#42190d]"
          >
            DONATE
          </a>
          <a
            href="/admin/login"
            className="block px-3 py-4 text-center text-sm text-amber-200"
          >
            Admin Login
          </a>
        </nav>
      )}
      {/* HERO SECTION */}
      <section
        id="home"
        className="relative overflow-hidden bg-[#71351f] text-white"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 md:grid-cols-2 md:py-28">
          <div className="text-center md:text-left">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">
              Welcome to
            </p>
            <h2 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Shri Shri
              <br />
              Ram Thakur
              <br />
              Seva Mandir
            </h2>
            <p className="mx-auto mt-6 max-w-lg leading-7 text-orange-100 md:mx-0">
              A sacred place of devotion, spiritual guidance,
              community service and togetherness.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
              <a
                href="#about"
                className="rounded-full bg-amber-300 px-6 py-3 font-semibold text-[#492719] hover:bg-amber-200"
              >
                Explore Mandir
              </a>
              <a
                href="#calendar"
                className="rounded-full border border-white/40 px-6 py-3 font-semibold hover:bg-white/10"
              >
                Puja Calendar
              </a>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="flex aspect-[4/5] w-full max-w-md items-center justify-center rounded-3xl border border-white/20 bg-gradient-to-br from-amber-200/20 to-orange-100/5 p-8 text-center">
              <div>
                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-amber-200/50 bg-white/10 text-6xl text-amber-200">
                  ॐ
                </div>
                <p className="mt-6 text-2xl font-semibold">
                  श्री श्री राम ठाकुर
                </p>
                <p className="mt-3 text-sm text-orange-100">
                  Faith • Devotion • Service
                </p>
                <p className="mt-8 text-xs text-orange-100/70">
                  Shri Shri Ram Thakur Seva Mandir
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* QUICK LINKS */}
      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { title: "Puja Calendar", href: "#calendar", icon: "◷" },
            { title: "Upcoming Events", href: "#events", icon: "✦" },
            { title: "Photo Gallery", href: "#gallery", icon: "▧" },
            { title: "Donation", href: "#donation", icon: "♡" },
          ].map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <span className="text-3xl text-[#9a542e]">
                {item.icon}
              </span>
              <h3 className="mt-4 font-semibold">{item.title}</h3>
              <p className="mt-2 text-xs text-stone-500">
                Explore more →
              </p>
            </a>
          ))}
        </div>
      </section>
      {/* ABOUT US */}
      <section id="about" className="bg-[#f7f0e5] px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#a15a31]">
              About Our Mandir
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              A Tradition of Faith and Service
            </h2>
            <p className="mx-auto mt-5 max-w-3xl leading-8 text-stone-700">
              Shri Shri Ram Thakur Seva Mandir is dedicated to
              spiritual activities, worship, community service
              and preserving the traditions associated with
              Sri Sri Thakur.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
{[
  {
    title: "History",
    id: "history",
    data: historyData,
    fallback: "The history of Shri Shri Ram Thakur Seva Mandir.",
  },
  {
    title: "At a Glance",
    id: "glance",
    data: glanceData,
    fallback: "Learn more about our temple and its facilities.",
  },
].map((item) => (
  <div
    key={item.id}
    id={item.id}
    className="rounded-xl border border-[#eee1ce] bg-white p-5 transition hover:shadow-md"
  >
    <h3 className="font-semibold text-[#74361f]">
      {item.title}
    </h3>
    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-stone-600">
      {item.data.content ||
        item.data.description ||
        item.data.text ||
        item.data.history ||
        item.data.details ||
        item.fallback}
    </p>
  </div>
))}
<div
  id="committee"
  className="rounded-xl border border-[#eee1ce] bg-white p-5 transition hover:shadow-md"
>
  <h3 className="font-semibold text-[#74361f]">
    Executive Committee
  </h3>
  {committeeMembers.length > 0 ? (
    <div className="mt-4 space-y-3">
      {committeeMembers.map((member) => (
        <div
          key={member.id}
          className="border-b border-amber-100 pb-3"
        >
          <p className="font-semibold text-stone-800">
            {member.name || member.title || member.id}
          </p>
          <p className="text-sm text-stone-600">
            {member.designation ||
              member.position ||
              member.role ||
              ""}
          </p>
          {member.phone && (
            <p className="text-xs text-stone-500">
              {member.phone}
            </p>
          )}
        </div>
      ))}
    </div>
  ) : (
    <p className="mt-3 text-sm text-stone-600">
      Executive committee information will be updated soon.
    </p>
  )}
</div>
          </div>
        </div>
      </section>
<section
  id="thakur"
  className="mx-auto max-w-7xl px-5 py-16"
>
  <div className="grid items-center gap-10 md:grid-cols-2">
    <div className="flex min-h-80 items-center justify-center overflow-hidden rounded-3xl bg-[#f5e8d5] p-8">
      {guruData.image || guruData.imageUrl || guruData.photo ? (
        <img
          src={
            guruData.image ||
            guruData.imageUrl ||
            guruData.photo
          }
          alt="Sri Sri Thakur"
          className="max-h-[480px] w-full rounded-2xl object-contain"
        />
      ) : (
        <div className="text-center">
          <div className="text-7xl text-[#8b472a]">ॐ</div>
          <p className="mt-4 font-semibold text-[#71351f]">
            Sri Sri Thakur
          </p>
        </div>
      )}
    </div>
    <div>
      <p className="text-sm font-semibold uppercase tracking-widest text-[#a15a31]">
        Spiritual Heritage
      </p>
      <h2 className="mt-3 text-3xl font-bold text-[#71351f]">
        {guruData.title ||
          guruData.name ||
          "Sri Sri Thakur"}
      </h2>
      <div className="mt-5 whitespace-pre-line leading-8 text-stone-600">
        {guruData.biography ||
          guruData.description ||
          guruData.content ||
          guruData.details ||
          "Learn about the life, teachings, spiritual journey and legacy of Sri Sri Thakur."}
      </div>
      {(guruData.teachings || guruData.message) && (
        <div className="mt-6 rounded-xl bg-[#f7f0e5] p-5">
          <h3 className="font-semibold text-[#71351f]">
            Teachings
          </h3>
          <p className="mt-2 whitespace-pre-line leading-7 text-stone-600">
            {guruData.teachings || guruData.message}
          </p>
        </div>
      )}
    </div>
  </div>
</section>
      {/* ACTIVITIES */}
{[
  {
    id: "social",
    title: "Social Activities (Seva)",
    keywords: ["social", "seva"],
    fallback:
      "Community welfare, social service and initiatives supporting people.",
  },
  {
    id: "puja",
    title: "Puja Activities & Rituals",
    keywords: ["puja", "ritual", "worship"],
    fallback:
      "Religious observances, worship and spiritual celebrations.",
  },
].map((section) => {
  const item = activitiesData.find((activity) => {
    const key = `${activity.id} ${activity.title || ""} ${
      activity.name || ""
    } ${activity.category || ""}`.toLowerCase();
    return section.keywords.some((word) => key.includes(word));
  });
  return (
    <div
      id={section.id}
      key={section.id}
      className="rounded-2xl bg-white p-8 shadow-sm"
    >
      <h3 className="text-xl font-bold text-[#813b25]">
        {item?.title || item?.name || section.title}
      </h3>
      <p className="mt-3 whitespace-pre-line leading-7 text-stone-600">
        {item?.description ||
          item?.content ||
          item?.details ||
          section.fallback}
      </p>
      {(item?.image || item?.imageUrl) && (
        <img
          src={item.image || item.imageUrl}
          alt={item.title || section.title}
          className="mt-5 h-52 w-full rounded-xl object-cover"
        />
      )}
    </div>
  );
})}
      {/* FACILITIES */}
      <section id="facilities" className="mx-auto max-w-7xl px-5 py-16">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#a15a31]">
            Our Institution
          </p>
          <h2 className="mt-3 text-3xl font-bold">
            Present Facilities
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-stone-600">
            Information about the facilities and infrastructure
            available at the Mandir.
          </p>
        </div>
      </section>
      {/* UPCOMING EVENTS */}
     
      {/* UPCOMING EVENTS */}
      <section id="events" className="bg-[#f7f0e5] px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#a15a31]">
              Stay Connected
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Upcoming Events
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-stone-600">
              Join us in our spiritual celebrations, festivals and community activities.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.length > 0 ? (
              events.map((event: any) => {
                const eventDate = event.date || event.eventDate;

                const formattedDate =
                  eventDate && typeof eventDate.toDate === "function"
                    ? eventDate.toDate().toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : eventDate || "Date to be announced";

                const eventImage =
                  event.imageUrl || event.image || event.photo;

                return (
                  <article
                    key={event.id}
                    className="overflow-hidden rounded-2xl border border-[#eee1ce] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    {eventImage ? (
                      <img
                        src={eventImage}
                        alt={event.title || event.name || "Mandir Event"}
                        className="h-56 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-56 items-center justify-center bg-[#f3e5d0]">
                        <span className="text-6xl text-[#9a542e]">
                          ॐ
                        </span>
                      </div>
                    )}

                    <div className="p-6">
                      <div className="mb-3 inline-block rounded-full bg-[#f7f0e5] px-4 py-2 text-xs font-semibold text-[#9a542e]">
                        ◷ {formattedDate}
                      </div>

                      <h3 className="text-xl font-bold text-[#71351f]">
                        {event.title || event.name || "Mandir Event"}
                      </h3>

                      <p className="mt-3 whitespace-pre-line text-sm leading-7 text-stone-600">
                        {event.description ||
                          event.details ||
                          event.content ||
                          "Join us for this special event at Shri Shri Ram Thakur Seva Mandir."}
                      </p>

                      {(event.location || event.venue) && (
                        <p className="mt-4 border-t border-amber-100 pt-3 text-sm text-stone-500">
                          📍 {event.location || event.venue}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="col-span-full rounded-2xl border border-dashed border-[#cba77c] bg-white p-10 text-center">
                <div className="text-4xl text-[#9a542e]">◷</div>

                <h3 className="mt-4 font-semibold text-[#71351f]">
                  Upcoming events will appear here
                </h3>

                <p className="mt-2 text-sm text-stone-500">
                  Events will be managed by the administrator.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SPECIAL EVENTS AND ARCHIVE */}
      <section id="special-events" className="mx-auto max-w-7xl px-5 py-12">
        <div id="archive" className="rounded-2xl border border-[#eee1ce] bg-white p-8 text-center">
          <h2 className="text-2xl font-bold">
            Special Events & Archive
          </h2>
          <p className="mt-3 text-stone-600">
            Explore special celebrations and previous Mandir events.
          </p>
        </div>
      </section>
      {/* PUJA CALENDAR */}
      
      {/* PUJA CALENDAR */}
      <section id="calendar" className="mx-auto max-w-7xl px-5 py-16">
        <div className="rounded-3xl bg-[#71351f] px-6 py-12 text-center text-white sm:px-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-300">
            Annual Observances
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Annual Puja Calendar
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-orange-100">
            Stay informed about pujas, religious observances
            and important dates throughout the year.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {calendarItems.length > 0 ? (
            calendarItems.map((item: any) => {
              const rawDate = item.date || item.eventDate;

              const formattedDate =
                rawDate && typeof rawDate.toDate === "function"
                  ? rawDate.toDate().toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : rawDate || "Date to be announced";

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-[#eee1ce] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f7f0e5] text-2xl text-[#9a542e]">
                    ॐ
                  </div>

                  <p className="text-sm font-semibold text-[#a15a31]">
                    ◷ {formattedDate}
                  </p>

                  <h3 className="mt-3 text-xl font-bold text-[#71351f]">
                    {item.title ||
                      item.name ||
                      item.pujaName ||
                      "Puja Observance"}
                  </h3>

                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-stone-600">
                    {item.description ||
                      item.details ||
                      item.content ||
                      "Join us for this sacred observance at the Mandir."}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-[#cba77c] bg-[#fffdf8] p-10 text-center">
              <div className="text-4xl text-[#9a542e]">🪔</div>

              <h3 className="mt-4 font-semibold text-[#71351f]">
                Puja calendar will be updated soon
              </h3>

              <p className="mt-2 text-sm text-stone-500">
                Please check again for upcoming pujas and religious observances.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* PHOTO GALLERY */}
      
      {/* PHOTO GALLERY */}
      <section id="gallery" className="bg-[#f7f0e5] px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#a15a31]">
              Memories
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Photo Gallery
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-stone-600">
              Moments of devotion, celebrations, spiritual activities and community service.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {galleryItems.length > 0 ? (
              galleryItems.map((item: any) => {
                const imageUrl =
                  item.imageUrl ||
                  item.image ||
                  item.photo ||
                  item.url;

                return (
                  <div
                    key={item.id}
                    className="group overflow-hidden rounded-2xl border border-[#eee1ce] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    {imageUrl ? (
                      <div className="aspect-square overflow-hidden bg-[#f3e5d0]">
                        <img
                          src={imageUrl}
                          alt={
                            item.title ||
                            item.caption ||
                            "Mandir Gallery"
                          }
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-square items-center justify-center bg-[#f3e5d0] text-5xl text-[#9a542e]">
                        ॐ
                      </div>
                    )}

                    <div className="p-4">
                      <h3 className="font-semibold text-[#71351f]">
                        {item.title ||
                          item.name ||
                          item.caption ||
                          "Mandir Memories"}
                      </h3>

                      {(item.description || item.details) && (
                        <p className="mt-2 text-sm leading-6 text-stone-600">
                          {item.description || item.details}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full rounded-2xl border border-dashed border-[#cba77c] bg-white p-10 text-center">
                <div className="text-5xl text-[#9a542e]">▧</div>

                <h3 className="mt-4 font-semibold text-[#71351f]">
                  Gallery images will appear here
                </h3>

                <p className="mt-2 text-sm text-stone-500">
                  Photos will be updated by the administrator.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PUBLICATIONS */}
      
      {/* PUBLICATIONS */}
      <section id="publications" className="mx-auto max-w-7xl px-5 py-16">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#a15a31]">
            Read and Discover
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Our Publications
          </h2>

          <p className="mt-3 text-stone-600">
            Explore books, magazines and spiritual literature.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {publicationItems.length > 0 ? (
            publicationItems.map((item: any) => (
              <div
                key={item.id}
                className="rounded-2xl border border-[#eee1ce] bg-white p-6 shadow-sm"
              >
                <div className="text-4xl text-[#9a542e]">📖</div>

                <h3 className="mt-4 text-lg font-semibold text-[#71351f]">
                  {item.title || item.name || "Publication"}
                </h3>

                <p className="mt-2 text-sm leading-6 text-stone-600">
                  {item.description || item.details || ""}
                </p>

                {(item.url || item.link || item.documentUrl) && (
                  <a
                    href={item.url || item.link || item.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block font-semibold text-[#9a542e] hover:underline"
                  >
                    Read Publication →
                  </a>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-[#cba77c] p-10 text-center text-stone-500">
              Publications will be updated soon.
            </div>
          )}
        </div>
      </section>

      {/* CONTACT AND DONATION */}
      
      {/* CONTACT AND DONATION */}
      <section id="contact" className="bg-[#f7f0e5] px-5 py-16">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2">

          <div className="rounded-3xl border border-[#eee1ce] bg-white p-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#a15a31]">
              Get in Touch
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Contact Us
            </h2>

            <div className="mt-6 space-y-5 text-stone-700">
              <div>
                <p className="text-sm font-semibold text-[#71351f]">
                  Address
                </p>
                <p className="mt-1">📍 {templeAddress}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#71351f]">
                  Phone
                </p>
                <p className="mt-1">
                  ☎{" "}
                  <a href={`tel:${templePhone}`} className="hover:underline">
                    {templePhone}
                  </a>
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#71351f]">
                  Email
                </p>
                <p className="mt-1">
                  ✉{" "}
                  {templeEmail ? (
                    <a href={`mailto:${templeEmail}`} className="hover:underline">
                      {templeEmail}
                    </a>
                  ) : (
                    "Email will be updated by admin."
                  )}
                </p>
              </div>
            </div>
          </div>

          <div
            id="donation"
            className="rounded-3xl bg-[#71351f] p-8 text-white shadow-lg"
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-orange-200">
              Your Support Matters
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              Support Our Seva
            </h2>

            <p className="mt-4 leading-7 text-orange-100">
              {donationData.message ||
                donationData.description ||
                donationData.instructions ||
                "Your contribution supports the spiritual and social activities of our Mandir."}
            </p>

            <div className="mt-6 space-y-3 rounded-xl bg-white/10 p-5 text-sm">
              {donationData.upiId && (
                <p>
                  <strong>UPI ID:</strong> {donationData.upiId}
                </p>
              )}

              {donationData.accountName && (
                <p>
                  <strong>Account Name:</strong> {donationData.accountName}
                </p>
              )}

              {donationData.accountNumber && (
                <p>
                  <strong>Account Number:</strong> {donationData.accountNumber}
                </p>
              )}

              {donationData.ifsc && (
                <p>
                  <strong>IFSC:</strong> {donationData.ifsc}
                </p>
              )}

              {donationData.bankName && (
                <p>
                  <strong>Bank:</strong> {donationData.bankName}
                </p>
              )}
            </div>

            {(donationData.paymentLink || donationData.donationLink) && (
              <a
                href={donationData.paymentLink || donationData.donationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block rounded-full bg-amber-100 px-6 py-3 font-semibold text-[#71351f] transition hover:bg-white"
              >
                Donate Now
              </a>
            )}
          </div>

        </div>
      </section>

      {/* FEEDBACK AND USEFUL LINKS */}
      
      {/* FEEDBACK AND USEFUL LINKS */}
      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-12 sm:grid-cols-2">

        <div
          id="feedback"
          className="rounded-2xl border border-[#eee1ce] bg-white p-6"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-[#a15a31]">
            We Value Your Voice
          </p>

          <h3 className="mt-3 text-xl font-bold text-[#71351f]">
            Feedback
          </h3>

          <p className="mt-2 text-sm leading-6 text-stone-600">
            We welcome your suggestions and feedback to help us improve our services and activities.
          </p>

          <a
            href={
              templeEmail
                ? `mailto:${templeEmail}?subject=${encodeURIComponent("Mandir Feedback")}`
                : `tel:${templePhone}`
            }
            className="mt-5 inline-block rounded-full bg-[#71351f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#8b492b]"
          >
            Contact Us
          </a>
        </div>

        <div
          id="links"
          className="rounded-2xl border border-[#eee1ce] bg-white p-6"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-[#a15a31]">
            Explore
          </p>

          <h3 className="mt-3 text-xl font-bold text-[#71351f]">
            Other Useful Links
          </h3>

          <div className="mt-4 space-y-3">
            {usefulLinks.length > 0 ? (
              usefulLinks.map((item: any) => {
                const linkUrl = item.url || item.link || item.href;

                return (
                  <div key={item.id}>
                    {linkUrl ? (
                      <a
                        href={linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-[#9a542e] hover:underline"
                      >
                        {item.title || item.name || "Useful Link"} →
                      </a>
                    ) : (
                      <p className="text-sm text-stone-600">
                        {item.title || item.name || ""}
                      </p>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-stone-500">
                Important links and resources will be updated soon.
              </p>
            )}
          </div>
        </div>

      </section>

      {/* FOOTER */}
      <footer className="bg-[#3b2119] px-5 py-9 text-center text-orange-100">
        <h3 className="font-semibold text-white">
          Shri Shri Ram Thakur Seva Mandir
        </h3>
        <p className="mt-2 text-sm">
          {templeAddress}
        </p>
        <p className="mt-5 text-xs text-orange-100/60">
          © {new Date().getFullYear()} Shri Shri Ram Thakur Seva Mandir.
          All rights reserved.
        </p>
        <a
          href="/admin/login"
          className="mt-5 inline-block text-xs text-orange-100/50 hover:text-white"
        >
          Admin Login
        </a>
      </footer>
    </main>
  );
}
