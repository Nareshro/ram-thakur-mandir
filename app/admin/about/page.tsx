"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getHistory,
  updateHistory,
  getGlance,
  updateGlance,
} from "@/app/lib/aboutService";

export default function AboutManagement() {
  const [loading, setLoading] = useState(true);

  const [history, setHistory] = useState({
    title: "",
    description: "",
    image: "",
  });

  const [glance, setGlance] = useState({
    title: "",
    description: "",
    yearEstablished: "",
    dailyVisitors: "",
    location: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const historyData = await getHistory();
      const glanceData = await getGlance();

      if (historyData) {
        setHistory({
          title: historyData.title || "",
          description: historyData.description || "",
          image: historyData.image || "",
        });
      }

      if (glanceData) {
        setGlance({
          title: glanceData.title || "",
          description: glanceData.description || "",
          yearEstablished: glanceData.yearEstablished || "",
          dailyVisitors: glanceData.dailyVisitors || "",
          location: glanceData.location || "",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  async function saveHistory() {
    try {
      await updateHistory(history);
      toast.success("History Updated Successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update history");
    }
  }

  async function saveGlance() {
    try {
      await updateGlance(glance);
      toast.success("At a Glance Updated Successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update At a Glance");
    }
  }

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-8 space-y-10">

      <h1 className="text-3xl font-bold text-black">
        About Management
      </h1>

      {/* History */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-2xl font-bold text-black mb-5">
          History
        </h2>

        <input
          className="w-full border rounded-lg p-3 mb-4 text-black"
          placeholder="Title"
          value={history.title}
          onChange={(e) =>
            setHistory({
              ...history,
              title: e.target.value,
            })
          }
        />

        <input
          className="w-full border rounded-lg p-3 mb-4 text-black"
          placeholder="Image Path"
          value={history.image}
          onChange={(e) =>
            setHistory({
              ...history,
              image: e.target.value,
            })
          }
        />

        <textarea
          rows={8}
          className="w-full border rounded-lg p-3 text-black"
          placeholder="Description"
          value={history.description}
          onChange={(e) =>
            setHistory({
              ...history,
              description: e.target.value,
            })
          }
        />

        <button
          onClick={saveHistory}
          className="mt-5 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg"
        >
          Update History
        </button>

      </div>

      {/* At a Glance */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-2xl font-bold text-black mb-5">
          At a Glance
        </h2>

        <input
          className="w-full border rounded-lg p-3 mb-4 text-black"
          placeholder="Title"
          value={glance.title}
          onChange={(e) =>
            setGlance({
              ...glance,
              title: e.target.value,
            })
          }
        />

        <input
          className="w-full border rounded-lg p-3 mb-4 text-black"
          placeholder="Year Established"
          value={glance.yearEstablished}
          onChange={(e) =>
            setGlance({
              ...glance,
              yearEstablished: e.target.value,
            })
          }
        />

        <input
          className="w-full border rounded-lg p-3 mb-4 text-black"
          placeholder="Daily Visitors"
          value={glance.dailyVisitors}
          onChange={(e) =>
            setGlance({
              ...glance,
              dailyVisitors: e.target.value,
            })
          }
        />

        <input
          className="w-full border rounded-lg p-3 mb-4 text-black"
          placeholder="Location"
          value={glance.location}
          onChange={(e) =>
            setGlance({
              ...glance,
              location: e.target.value,
            })
          }
        />

        <textarea
          rows={6}
          className="w-full border rounded-lg p-3 text-black"
          placeholder="Description"
          value={glance.description}
          onChange={(e) =>
            setGlance({
              ...glance,
              description: e.target.value,
            })
          }
        />

        <button
          onClick={saveGlance}
          className="mt-5 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg"
        >
          Update At a Glance
        </button>

      </div>

    </div>
  );
}