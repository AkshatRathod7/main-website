import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Clients from "./components/Clients";
import Problem from "./components/Problem";
import HowWeWork from "./components/HowWeWork";
import Stages from "./components/Stages";
import GrowthEngine from "./components/GrowthEngine";
import Team from "./components/Team";
import Capabilities from "./components/Capabilities";
import Work from "./components/Work";
import WhoWeWorkWith from "./components/WhoWeWorkWith";
import WhyDreamSVin from "./components/WhyDreamSVin";
import Founder from "./components/Founder";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
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
        <Problem />
        <div id="how">
          <HowWeWork />
        </div>
        <div id="what">
          <Stages />
          <GrowthEngine />
          <Team />
          <Capabilities />
        </div>
        <div id="work">
          <Work />
        </div>
        <WhoWeWorkWith />
        <WhyDreamSVin />
        <div id="about">
          <Founder />
        </div>
        <Testimonials />
        <div id="contact">
          <Contact />
        </div>
      </main>
      <Footer />
    </div>
  );
}
