const activities = [
  {
    action: "Gallery image uploaded",
    time: "5 minutes ago",
  },
  {
    action: "Guru Purnima event updated",
    time: "20 minutes ago",
  },
  {
    action: "Temple timings changed",
    time: "1 hour ago",
  },
  {
    action: "Homepage banner updated",
    time: "Yesterday",
  },
];

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">

      <h2 className="text-2xl font-bold text-stone-800 mb-6">
        Recent Activity
      </h2>

      <div className="space-y-5">

        {activities.map((item, index) => (

          <div
            key={index}
            className="flex justify-between items-center border-b border-gray-100 pb-4"
          >
            <div>

              <h3 className="font-semibold text-stone-800">
                {item.action}
              </h3>

              <p className="text-sm text-gray-500">
                {item.time}
              </p>

            </div>

            <span className="w-3 h-3 rounded-full bg-green-500"></span>

          </div>

        ))}

      </div>

    </div>
  );
}