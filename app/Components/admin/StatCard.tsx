import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "bg-amber-500",
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg boarder-md p-6 border border-gray-100 hover:shadow-lg boarder-xl transition-all">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-gray-500 text-sm">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2 text-stone-800">
            {value}
          </h2>

        </div>

        <div
          className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center text-white`}
        >
          <Icon size={28} />
        </div>

      </div>

    </div>
  );
}