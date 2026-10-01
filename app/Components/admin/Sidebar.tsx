"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Images,
  CalendarDays,
  User,
  House,
  Clock3,
  Megaphone,
  PanelBottom,
  Settings,
  BookOpen,
  Users,
  HandHeart,
  LogOut,
  MapPin,
  Activity,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Gallery",
    href: "/admin/gallery",
    icon: Images,
  },
  {
    title: "Events",
    href: "/admin/events",
    icon: CalendarDays,
  },
  {
    title: "Guru",
    href: "/admin/guru",
    icon: User,
  },
  {
    title: "Homepage",
    href: "/admin/homepage",
    icon: House,
  },
  {
    title: "Contact",
    href: "/admin/contact",
    icon: MapPin,
  },
  {
    title: "Timings",
    href: "/admin/timings",
    icon: Clock3,
  },
  {
    title: "Activities",
    href: "/admin/activities",
    icon: Activity,
  },
  {
    title: "Announcements",
    href: "/admin/announcements",
    icon: Megaphone,
  },
  {
    title: "Footer",
    href: "/admin/footer",
    icon: PanelBottom,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
  {
    title: "Committee",
    href: "/admin/committee",
    icon: Users,
  },
  {
    title: "Donation",
    href: "/admin/donation",
    icon: HandHeart,
  },
  {
    title: "About",
    href: "/admin/about",
    icon: BookOpen,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-stone-900 text-white min-h-screen flex flex-col">

      {/* Logo */}
      <div className="p-5 border-b border-stone-800">
        <h1 className="text-xl font-bold text-orange-400">
          Temple Admin
        </h1>

        <p className="text-sm text-gray-400 mt-1">
          Shri Shri Ram Thakur Seva Mandir
        </p>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto p-4">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition ${
                pathname === item.href
                  ? "bg-orange-500 text-white"
                  : "text-gray-300 hover:bg-stone-800"
              }`}
            >
              <Icon size={20} />

              <span>{item.title}</span>
            </Link>
          );
        })}

      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-stone-800">

        <button className="flex items-center gap-3 text-red-400 hover:text-white">
          <LogOut size={20} />
          Logout
        </button>

      </div>

    </aside>
  );
}