"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";

import { auth, db } from "../../lib/firebase";
import EventsManager from "../components/EventsManager";
import GalleryManager from "../components/GalleryManager";
import AboutManager from "../components/AboutManager";
import PujaCalendarManager from "../components/PujaCalendarManager";
import SpecialEventsManager from "../components/SpecialEventsManager";
import ContactManager from "../components/ContactManager";

const menuItems = [
  "Dashboard",
  "Website Information",
  "About Us",
  "Sri Sri Thakur",
  "Activities",
  "Puja Calendar",
  "Events",
  "Special Events",
  "Photo Gallery",
  "Publications",
  "Contact Details",
];

type Counts = {
  events: number;
  gallery: number;
  activities: number;
  publications: number;
};

export default function AdminDashboard() {
  const router = useRouter();

  const [user, setUser] = useState("Administrator");
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("Dashboard");
  const [counts, setCounts] = useState<Counts>({
    events: 0,
    gallery: 0,
    activities: 0,
    publications: 0,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/admin/login");
        return;
      }

      setUser(currentUser.email || "Administrator");

      try {
        const [events, gallery, activities, publications] =
          await Promise.all([
            getDocs(collection(db, "events")),
            getDocs(collection(db, "gallery")),
            getDocs(collection(db, "activities")),
            getDocs(collection(db, "publications")),
          ]);

        setCounts({
          events: events.size,
          gallery: gallery.size,
          activities: activities.size,
          publications: publications.size,
        });
      } catch (error) {
        console.error("Dashboard data error:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  async function handleLogout() {
    await signOut(auth);
    router.replace("/admin/login");
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fff8ed]">
        <p className="text-red-900">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8f5f0]">
      <aside className="hidden w-64 shrink-0 bg-[#50190f] p-5 text-white md:block">
        <div className="mb-8 border-b border-white/20 pb-6">
          <h1 className="text-xl font-bold">ॐ Ram Thakur</h1>
          <p className="text-sm text-orange-200">Admin Panel</p>
        </div>

        <p className="mb-4 text-xs font-semibold tracking-widest text-orange-300">
          MANAGEMENT
        </p>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setActivePage(item)}
              className={`w-full rounded-lg px-4 py-3 text-left text-sm transition ${
                activePage === item
                  ? "bg-amber-500 font-semibold text-red-950"
                  : "text-white hover:bg-white/10"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-10 w-full rounded-lg border border-white/30 px-4 py-3 text-left text-sm hover:bg-white/10"
        >
          Logout
        </button>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b bg-white px-5 py-5 md:px-8">
          <div>
            <p className="text-xs uppercase tracking-wider text-orange-700">
              Admin Panel
            </p>
            <h2 className="text-2xl font-bold text-red-950">{activePage}</h2>
          </div>

          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800">
              Administrator
            </p>
            <p className="text-xs text-gray-500">{user}</p>
          </div>

          <div className="flex w-full gap-2 overflow-x-auto pb-1 md:hidden">
            {menuItems.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setActivePage(item)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs ${
                  activePage === item
                    ? "bg-amber-500 font-semibold text-red-950"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {item}
              </button>
            ))}
            <button
              type="button"
              onClick={handleLogout}
              className="shrink-0 rounded-full border px-4 py-2 text-xs"
            >
              Logout
            </button>
          </div>
        </header>

        {activePage === "Dashboard" && (
          <div className="p-5 md:p-8">
            <p className="text-sm text-gray-500">
              Welcome back, Administrator
            </p>
            <h1 className="mt-1 text-3xl font-bold text-red-950">
              Temple Website Dashboard
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage Shri Shri Ram Thakur Seva Mandir website content.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { title: "Events", count: counts.events, icon: "◆" },
                { title: "Gallery Images", count: counts.gallery, icon: "▧" },
                { title: "Activities", count: counts.activities, icon: "✦" },
                {
                  title: "Publications",
                  count: counts.publications,
                  icon: "▤",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="flex items-center justify-between rounded-2xl border border-orange-100 bg-white p-5 shadow-sm"
                >
                  <div>
                    <p className="text-sm text-gray-500">{card.title}</p>
                    <h3 className="mt-2 text-3xl font-bold text-red-900">
                      {card.count}
                    </h3>
                  </div>
                  <div className="rounded-xl bg-orange-100 p-4 text-xl text-orange-800">
                    {card.icon}
                  </div>
                </div>
              ))}
            </div>

            <h2 className="mt-9 text-xl font-bold text-red-950">
              Quick Management
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[
                {
                  title: "Manage Events",
                  description: "Add, edit, or remove temple events.",
                  target: "Events",
                },
                {
                  title: "Manage Gallery",
                  description: "Maintain photographs shown on the website.",
                  target: "Photo Gallery",
                },
                {
                  title: "Update Contact",
                  description: "Change phone number and contact information.",
                  target: "Contact Details",
                },
                {
                  title: "About the Mandir",
                  description: "Update the temple introduction and history.",
                  target: "About Us",
                },
                {
                  title: "Puja Calendar",
                  description: "Update annual puja dates and details.",
                  target: "Puja Calendar",
                },
                {
                  title: "Website Information",
                  description: "Manage other website content records.",
                  target: "Website Information",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-orange-100 bg-white p-5"
                >
                  <h3 className="font-bold text-red-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {item.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => setActivePage(item.target)}
                    className="mt-4 text-sm font-semibold text-orange-700"
                  >
                    Open section →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activePage === "Events" && <EventsManager />}
        {activePage === "Photo Gallery" && <GalleryManager />}
        {activePage === "About Us" && <AboutManager />}
        {activePage === "Puja Calendar" && <PujaCalendarManager />}
        {activePage === "Special Events" && <SpecialEventsManager />}
        {activePage === "Contact Details" && <ContactManager />}

        {activePage !== "Dashboard" &&
          activePage !== "Events" &&
          activePage !== "Photo Gallery" &&
          activePage !== "About Us" &&
          activePage !== "Puja Calendar" &&
          activePage !== "Special Events" &&
          activePage !== "Contact Details" && (
            <div className="h-[calc(100vh-85px)] min-h-[600px] bg-[#f8f5f0]">
              <iframe
                src="/admin/manage?embedded=1"
                title={`${activePage} Content Manager`}
                className="h-full w-full border-0"
              />
            </div>
          )}
      </main>
    </div>
  );
}
