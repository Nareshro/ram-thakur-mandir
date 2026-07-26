import Navbar from "./Components/layout/Navbar";
import Hero from "./Components/sections/Hero";
import About from "./Components/sections/About";
import Guru from "./Components/sections/Guru";
import Gallery from "./Components/sections/Gallery";
import Events from "./Components/sections/Events";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Guru />
      <Gallery />
      <Events />
    </>
  );
}