import { useState } from "react";
import Logo from "./Logo";

const links = [
  { href: "#how", label: "How We Work" },
  { href: "#what", label: "What We Do" },
  { href: "#work", label: "Our Work" },
  { href: "#about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-4 sm:top-8 left-1/2 -translate-x-1/2 w-[92%] max-w-[1200px] px-5 sm:px-8 py-3 sm:py-4 flex justify-between items-center z-1000 bg-surface/40 backdrop-blur-xl border border-white/5 rounded-full">
        <a
          href="#home"
          className="cursor-pointer transition-all duration-300 hover:opacity-80 active:scale-95"
        >
          <Logo size="md" />
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-6 lg:gap-8 items-center font-display text-[12px] uppercase tracking-wider font-semibold">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-foreground/60 hover:text-foreground transition-colors">{link.label}</a>
          ))}
          <a href="#contact" className="px-6 py-2 bg-accent text-white rounded-full hover:bg-accent/80 transition-all duration-300">Let's Talk</a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 z-1001"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${open ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      <div className={`fixed inset-0 z-999 flex flex-col items-center justify-center bg-background/95 backdrop-blur-xl transition-all duration-300 md:hidden ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="flex flex-col items-center gap-8 font-display text-2xl font-bold uppercase tracking-widest">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="text-foreground/60 hover:text-foreground transition-colors">{link.label}</a>
          ))}
          <a href="#contact" onClick={() => setOpen(false)} className="mt-4 px-10 py-4 bg-accent text-white rounded-full hover:bg-accent/80 transition-all duration-300 text-lg">Let's Talk</a>
        </div>
      </div>
    </>
  );
}
