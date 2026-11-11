"use client";

import { useEffect, useState } from "react";

/* Light / dark switch. The theme is set before first paint by the inline script in app/layout.tsx
   (the saved choice, else light); this button flips it and remembers the choice. The page does not
   follow the device setting: light is the default for everyone, carbon black is one click away. */
type Theme = "light" | "dark";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    setTheme(root.dataset.theme === "dark" ? "dark" : "light");
  }, []);

  const flip = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("dsv-theme", next);
    } catch {}
    setTheme(next);
  };

  const label =
    theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
  return (
    <button
      type="button"
      onClick={flip}
      aria-label={label}
      title={label}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-fg-muted transition-colors duration-fast ease-out hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-focus ${className}`}
    >
      {/* half-filled circle: reads as "theme" in both states */}
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
        <circle
          cx="9"
          cy="9"
          r="7.25"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M9 1.75a7.25 7.25 0 0 1 0 14.5Z" fill="currentColor" />
      </svg>
    </button>
  );
}
