"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Images,
  CalendarDays,
  House,
  Clock3,
  Megaphone,
  Settings,
  LogOut,
  User,
  PanelBottom,
} from "lucide-react";



  const menuItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Gallery", href: "/admin/gallery", icon: Images },
  { title: "Events", href: "/admin/events", icon: CalendarDays },
  { title: "Guru", href: "/admin/guru", icon: User },
  { title: "Homepage", href: "/admin/homepage", icon: House },
  { title: "Timings", href: "/admin/timings", icon: Clock3 },
  { title: "Announcements", href: "/admin/announcements", icon: Megaphone },
  { title: "Footer", href: "/admin/footer", icon: PanelBottom },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-stone-900 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-stone-800">
        <h1 className="text-2xl font-bold text-amber-400">
          Temple Admin
        </h1>

        <p className="text-sm text-gray-400 mt-1">
          Shri Shri Ram Thakur Seva Mandir
        </p>
      </div>

      <nav className="flex-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition ${
                pathname === item.href
                  ? "bg-amber-500 text-white"
                  : "hover:bg-stone-800 text-gray-300"
              }`}
            >
              <Icon size={20} />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-stone-800">
        <button className="flex items-center gap-3 text-red-400 hover:text-white">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}