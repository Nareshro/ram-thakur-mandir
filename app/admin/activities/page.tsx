"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import AddActivityModal from "@/app/Components/admin/AddActivityModal";

import {
  Activity,
  getActivities,
  addActivity,
  updateActivity,
  deleteActivity,
} from "@/app/lib/activityService";

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingActivity, setEditingActivity] =
    useState<Activity | null>(null);

  useEffect(() => {
    loadActivities();
  }, []);

  async function loadActivities() {
    try {
      setLoading(true);

      const data = await getActivities();

      setActivities(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load activities");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(activity: Activity) {
    if (
      !activity.title.trim() ||
      !activity.description.trim() ||
      !activity.image.trim()
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const data = {
        category: activity.category,
        title: activity.title,
        description: activity.description,
        image: activity.image,
        displayOrder: activity.displayOrder,
      };

      if (editingActivity?.id) {
        await updateActivity(
          editingActivity.id,
          data
        );

        toast.success("Activity updated successfully");
      } else {
        await addActivity(data);

        toast.success("Activity added successfully");
      }

      setEditingActivity(null);
      setIsModalOpen(false);

      await loadActivities();
    } catch (error) {
      console.error(error);
      toast.error("Operation failed");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this activity?")) {
      return;
    }

    try {
      await deleteActivity(id);

      toast.success("Activity deleted");

      await loadActivities();
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  }

  const filteredActivities = activities.filter(
    (activity) =>
      activity.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      activity.description
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const socialActivities =
    filteredActivities.filter(
      (activity) => activity.category === "social"
    );

  const pujaActivities =
    filteredActivities.filter(
      (activity) => activity.category === "puja"
    );

  function renderTable(data: Activity[]) {
    return (
      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="p-4 text-left">
                Image
              </th>

              <th className="p-4 text-left">
                Title
              </th>

              <th className="p-4 text-left">
                Description
              </th>

              <th className="p-4 text-center">
                Order
              </th>

              <th className="p-4 text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>

            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-10 text-center text-gray-500"
                >
                  No activities found.
                </td>
              </tr>
            ) : (
              data.map((activity) => (
                <tr
                  key={activity.id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-4">

                    {activity.image ? (
                      <img
                        src={activity.image}
                        alt={activity.title}
                        className="h-16 w-24 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-16 w-24 rounded-lg bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                        No Image
                      </div>
                    )}

                  </td>

                  <td className="p-4 font-semibold text-gray-800">
                    {activity.title}
                  </td>

                  <td className="p-4 max-w-md text-gray-600">
                    {activity.description}
                  </td>

                  <td className="p-4 text-center text-gray-800">
                    {activity.displayOrder}
                  </td>

                  <td className="p-4">

                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() => {
                          setEditingActivity(activity);
                          setIsModalOpen(true);
                        }}
                        className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(activity.id!)
                        }
                        className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
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
    );
  }

  return (
    <div className="p-8">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Activities Management
          </h1>

          <p className="mt-2 text-gray-600">
            Manage social and puja activities.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingActivity(null);
            setIsModalOpen(true);
          }}
          className="rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
        >
          + Add Activity
        </button>

      </div>

      {/* Search */}

      <div className="mb-6 rounded-xl bg-white p-5 shadow">

        <input
          type="text"
          placeholder="Search activities..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full rounded-lg border border-gray-300 p-3 text-gray-800 focus:border-orange-500 focus:outline-none"
        />

      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-500">
          Loading activities...
        </div>
      ) : (
        <div className="space-y-8">

          {/* Social Activities */}

          <div className="rounded-xl bg-white shadow overflow-hidden">

            <div className="border-b bg-gray-50 p-5">
              <h2 className="text-2xl font-bold text-gray-800">
                Social Activities
              </h2>

              <p className="mt-1 text-gray-500">
                Community and social service activities.
              </p>
            </div>

            {renderTable(socialActivities)}

          </div>

          {/* Puja Activities */}

          <div className="rounded-xl bg-white shadow overflow-hidden">

            <div className="border-b bg-gray-50 p-5">
              <h2 className="text-2xl font-bold text-gray-800">
                Puja Activities
              </h2>

              <p className="mt-1 text-gray-500">
                Religious and devotional activities.
              </p>
            </div>

            {renderTable(pujaActivities)}

          </div>

        </div>
      )}

      <AddActivityModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingActivity(null);
        }}
        onSave={handleSave}
        editingActivity={editingActivity}
      />

    </div>
  );
}