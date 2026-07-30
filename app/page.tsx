import Navbar from "./Components/layout/Navbar";
import Hero from "./Components/sections/Hero";
import About from "./Components/sections/About";
import Guru from "./Components/sections/Guru";
import Gallery from "./Components/sections/Gallery";
import Events from "./Components/sections/Events";
import Contact from "./Components/sections/Contact";
import Timings from "./Components/sections/Timings";
import Footer from "./Components/sections/Footer";
import Announcements from "./Components/sections/Announcements";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Announcements />
      <About />
      <Guru />
      <Gallery />
      <Events />
      <Timings />
      <Contact />
      <Footer />
    </>
  );
}