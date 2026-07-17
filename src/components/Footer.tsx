import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="py-12 sm:py-16 px-6 sm:px-[8vw] border-t border-white/5">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center text-center space-y-6">
        <Logo size="md" />
        <p className="font-display text-lg sm:text-xl md:text-2xl font-bold text-foreground">
          We Get Growth Done.
        </p>
        <p className="font-display text-sm sm:text-base text-muted font-semibold tracking-wide">
          Execution Partners for Founder-Led Brands.
        </p>
        <div className="pt-6 flex flex-col sm:flex-row items-center gap-4 text-muted text-xs sm:text-sm font-display">
          <a href="mailto:grow@dreamsvin.com" className="text-accent hover:underline">grow@dreamsvin.com</a>
          <span className="hidden sm:inline text-white/20">·</span>
          <span>© {new Date().getFullYear()} DreamSVin Consultancy. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
