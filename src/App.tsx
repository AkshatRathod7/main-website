import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Clients from "./components/Clients";
import Work from "./components/Work";
import Framework from "./components/Framework";
import Contact from "./components/Contact";
import Lenis from 'lenis';

export default function App() {
  React.useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="bg-background text-foreground min-h-screen selection:bg-gold selection:text-black">
      <Navbar />
      <main>
        <div id="home">
          <Hero />
        </div>
        <Clients />
        <div id="work">
          <Work />
        </div>
        <div id="framework">
          <Framework />
        </div>
        <div id="contact">
          <Contact />
        </div>
      </main>
    </div>
  );
}
