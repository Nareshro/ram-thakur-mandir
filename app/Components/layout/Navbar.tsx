"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { title: "Home", id: "home" },
    { title: "About", id: "about" },
    { title: "Guru", id: "guru" },
    { title: "Gallery", id: "gallery" },
    { title: "Events", id: "events" },
    { title: "Contact", id: "contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/80 backdrop-blur-xl shadow-xl"
          : "bg-black/40 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Empty div keeps the navigation centered */}
        <div className="w-32"></div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="text-white hover:text-amber-400 transition duration-300 font-medium"
            >
              {item.title}
            </a>
          ))}
        </nav>

        {/* Visit Button */}
        <a
          href="#contact"
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full font-semibold transition"
        >
          Visit
        </a>
      </div>
    </header>
  );
}