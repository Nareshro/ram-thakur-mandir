"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

import SearchBar from "@/app/Components/admin/SearchBar";
import EventTable from "@/app/Components/admin/EventTable";
import EventStats from "@/app/Components/admin/EventStats";
import AddEventModal from "@/app/Components/admin/AddEventModal";

interface EventItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  eventDate: string;
  status: string;
}

export default function EventsPage() {
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [totalEvents, setTotalEvents] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState(0);
  const [completedEvents, setCompletedEvents] = useState(0);

  useEffect(() => {
    fetchStats();
  }, [refreshKey]);

  const fetchStats = async () => {
    const snapshot = await getDocs(collection(db, "events"));

    const events = snapshot.docs.map(
      (doc) => doc.data() as EventItem
    );

    setTotalEvents(events.length);

    setUpcomingEvents(
      events.filter((e) => e.status === "Upcoming").length
    );

    setCompletedEvents(
      events.filter((e) => e.status === "Completed").length
    );
  };

  return (
    <div className="space-y-8">

      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-stone-800">
            Events Management
          </h1>

          <p className="mt-2 text-gray-600">
            Manage temple events and festivals.
          </p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="rounded-xl bg-amber-500 px-6 py-3 font-semibold text-white hover:bg-amber-600"
        >
          + Add Event
        </button>

      </div>

      <EventStats
        total={totalEvents}
        upcoming={upcomingEvents}
        completed={completedEvents}
      />

      <SearchBar
        value={search}
        onChange={setSearch}
      />

      <EventTable refreshKey={refreshKey} />

      <AddEventModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={() => {
          setRefreshKey((prev) => prev + 1);
        }}
      />

    </div>
  );
}