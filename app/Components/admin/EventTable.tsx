"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import EditEventModal from "./EditEventModal";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

interface EventItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  eventDate: string;
  status: string;
  createdAt?: any;
}

interface EventTableProps {
  refreshKey: number;
}

export default function EventTable({
  refreshKey,
}: EventTableProps) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const handleDelete = async (id: string) => {
  const result = await Swal.fire({
    title: "Delete Event?",
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, Delete",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  try {
    await deleteDoc(doc(db, "events", id));

    const snapshot = await getDocs(collection(db, "events"));

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<EventItem, "id">),
    }));

    setEvents(data);

    toast.success("Event deleted successfully!");
  } catch (error) {
    console.error(error);

    toast.error("Failed to delete event.");
  }
};

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);

      try {
        const snapshot = await getDocs(collection(db, "events"));

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<EventItem, "id">),
        }));

        setEvents(data);
      } catch (error) {
        console.error("Error loading events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [refreshKey]);
  const filteredEvents = events.filter((event) =>
  event.title.toLowerCase().includes(search.toLowerCase()) ||
  event.description.toLowerCase().includes(search.toLowerCase()) ||
  event.status.toLowerCase().includes(search.toLowerCase())
);

  if (loading) {
    const filteredEvents = events.filter((event) =>
  event.title.toLowerCase().includes(search.toLowerCase()) ||
  event.description.toLowerCase().includes(search.toLowerCase()) ||
  event.status.toLowerCase().includes(search.toLowerCase())
 );
    return (
        
      <div className="flex items-center justify-between border-b bg-white p-4">
  <input
    type="text"
    placeholder="🔍 Search events..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full max-w-sm rounded-lg border border-gray-300 px-4 py-2 focus:border-amber-500 focus:outline-none"
  />
</div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-stone-100 text-stone-700">
            <tr>
              <th className="px-6 py-4 text-left">Image</th>
              <th className="px-6 py-4 text-left">Title</th>
              <th className="px-6 py-4 text-left">Date</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Description</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {events.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-10 text-center text-gray-500"
                >
                  No events found.
                </td>
              </tr>
            ) : (
              filteredEvents.map((event) => (
                <tr
                  key={event.id}
                  className="border-t transition hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                 <div className="relative h-20 w-20 overflow-hidden rounded-xl border bg-gray-100">
                 {event.imageUrl ? (
                <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                className="object-cover"
                />
                 ) : (
             <div className="flex h-full w-full items-center justify-center text-3xl">
              🖼️
            </div>
            )}
            </div>
            </td>

                  <td className="px-6 py-4 font-semibold text-stone-800">
                    {event.title}
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    {event.eventDate}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        event.status === "Upcoming"
                          ? "bg-green-100 text-green-700"
                          : event.status === "Completed"
                          ? "bg-gray-200 text-gray-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {event.status}
                    </span>
                  </td>

                  <td className="max-w-sm px-6 py-4 text-gray-700">
                    {event.description}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button 
                      onClick={() => {
                            setSelectedEvent(event);
                            setEditOpen(true);
                        }}
                      
                      className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600">
                        Edit
                      </button>

                     <button
                        onClick={() => handleDelete(event.id)}
                         className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                        >
                        Delete
                        </button>
                    </div>
                    
                  </td>
                </tr>
              ))
            )}
               </tbody>
    </table>
  </div>

  <EditEventModal
    open={editOpen}
    onClose={() => setEditOpen(false)}
    event={selectedEvent}
    onSuccess={async () => {
      const snapshot = await getDocs(collection(db, "events"));

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<EventItem, "id">),
      }));

      setEvents(data);
      setEditOpen(false);
    }}
  />
</div>
);
}