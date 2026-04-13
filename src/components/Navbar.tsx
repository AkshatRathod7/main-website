import Logo from "./Logo";

export default function Navbar() {
  return (
    <nav className="fixed top-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[1200px] px-8 py-4 flex justify-between items-center z-[1000] bg-surface/40 backdrop-blur-xl border border-white/5 rounded-full">
      <a 
        href="#home"
        className="cursor-pointer transition-all duration-300 hover:opacity-80 active:scale-95"
      >
        <Logo size="md" />
      </a>
      <div className="flex gap-8 items-center font-display text-[12px] uppercase tracking-wider font-semibold">
        <a 
          href="#work"
          className="text-foreground/60 hover:text-foreground transition-colors"
        >
          Work
        </a>
        <a 
          href="#framework"
          className="text-foreground/60 hover:text-foreground transition-colors"
        >
          Framework
        </a>
        <a 
          href="#contact"
          className="px-6 py-2 bg-accent text-white rounded-full hover:bg-accent/80 transition-all duration-300"
        >
          Partner
        </a>
      </div>
    </nav>
  );
}
