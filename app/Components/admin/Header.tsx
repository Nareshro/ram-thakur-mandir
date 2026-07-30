"use client";

import { Bell, UserCircle } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">

      <div>

        <h1 className="text-3xl font-bold text-stone-800">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Welcome back, Admin 👋
        </p>

      </div>

      <div className="flex items-center gap-6">

        <button className="relative">

          <Bell size={24} />

          <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            2
          </span>

        </button>

        <div className="flex items-center gap-3">

          <UserCircle size={38} className="text-amber-500" />

          <div>

            <p className="font-semibold">
              Temple Admin
            </p>

            <p className="text-sm text-gray-500">
              Administrator
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}