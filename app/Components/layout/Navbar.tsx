export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">

        <div>
          <h1 className="text-xl font-bold text-white">
            Shri Shri Ram Thakur
          </h1>
          <p className="text-sm text-amber-300">
            Seva Mandir
          </p>
        </div>

        <nav className="hidden md:flex gap-8 text-white">
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Gallery</a>
          <a href="#">Events</a>
          <a href="#">Contact</a>
        </nav>

        <button className="rounded-full bg-amber-500 px-5 py-2 font-semibold text-white hover:bg-amber-600">
          Visit
        </button>

      </div>
    </header>
  );
}