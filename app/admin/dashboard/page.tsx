"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

import StatCard from "@/app/Components/admin/StatCard";
import RecentActivity from "../../Components/admin/RecentActivity";

import {
  Images,
  CalendarDays,
  Megaphone,
  Clock3,
} from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    gallery: 0,
    events: 0,
    announcements: 0,
    timings: "Loading...",
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const gallerySnap = await getDocs(collection(db, "gallery"));
      const eventsSnap = await getDocs(collection(db, "events"));
      const announcementsSnap = await getDocs(
        collection(db, "announcements")
      );

      setStats({
        gallery: gallerySnap.size,
        events: eventsSnap.size,
        announcements: announcementsSnap.size,
        timings: "Configured",
      });
    } catch (error) {
      console.error(error);

      setStats((prev) => ({
        ...prev,
        timings: "Offline",
      }));
    }
  }

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold text-stone-800">
          Temple Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Manage your temple website from one place.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Gallery Images"
          value={stats.gallery}
          icon={Images}
          color="bg-blue-500"
        />

        <StatCard
          title="Events"
          value={stats.events}
          icon={CalendarDays}
          color="bg-green-500"
        />

        <StatCard
          title="Announcements"
          value={stats.announcements}
          icon={Megaphone}
          color="bg-purple-500"
        />

        <StatCard
          title="Temple Timings"
          value={stats.timings}
          icon={Clock3}
          color="bg-amber-500"
        />

      </div>

      <RecentActivity />

    </div>
  );
}