"use client";

interface EventStatsProps {
  total: number;
  upcoming: number;
  completed: number;
}

export default function EventStats({
  total,
  upcoming,
  completed,
}: EventStatsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3 mb-8">

      <div className="rounded-3xl border bg-white p-6 shadow-lg">
        <p className="text-sm text-gray-500">
          Total Events
        </p>

        <h2 className="mt-3 text-4xl font-bold text-amber-600">
          {total}
        </h2>
      </div>

      <div className="rounded-3xl border bg-white p-6 shadow-lg">
        <p className="text-sm text-gray-500">
          Upcoming Events
        </p>

        <h2 className="mt-3 text-4xl font-bold text-green-600">
          {upcoming}
        </h2>
      </div>

      <div className="rounded-3xl border bg-white p-6 shadow-lg">
        <p className="text-sm text-gray-500">
          Completed Events
        </p>

        <h2 className="mt-3 text-4xl font-bold text-blue-600">
          {completed}
        </h2>
      </div>

    </div>
  );
}