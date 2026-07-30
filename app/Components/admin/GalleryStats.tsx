"use client";

interface GalleryStatsProps {
  total: number;
  thisMonth: number;
  latestUpload: string;
}

export default function GalleryStats({
  total,
  thisMonth,
  latestUpload,
}: GalleryStatsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3 mb-8">
      <div className="rounded-2xl bg-white p-6 shadow-lg border">
        <p className="text-gray-500 text-sm">Total Images</p>
        <h2 className="mt-2 text-4xl font-bold text-amber-600">
          {total}
        </h2>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-lg border">
        <p className="text-gray-500 text-sm">
          Uploaded This Month
        </p>
        <h2 className="mt-2 text-4xl font-bold text-green-600">
          {thisMonth}
        </h2>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-lg border">
        <p className="text-gray-500 text-sm">
          Latest Upload
        </p>
        <h2 className="mt-2 text-lg font-semibold">
          {latestUpload}
        </h2>
      </div>
    </div>
  );
}