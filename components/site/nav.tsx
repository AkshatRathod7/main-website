"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/button";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { Close } from "@/components/ui/icons";
import { Logo } from "@/components/brand/logo";
import { NavChapter, NavGrow, NavProgress } from "@/components/site/nav-progress";
import { jumpTo } from "@/components/brand/spy";

/**
 * Nav — 72px, fixed. Transparent over the hero; after 24px of scroll it takes a solid
 * canvas at 92% + bottom hairline (no blur, no glass). Active link: fg + 1px brass rule.
 * Mobile (< lg): "Menu" button opens a full-height sheet built on <dialog> (native focus trap,
 * Esc, inert background). Sheet: 400ms drawer ease, links stagger 60ms. Scroll locked while open.
 */
/**
 * The home page is the site: each nav item is a chapter of it (/#key), lit by scroll (SpyRail → "spy:nav").
 * `prefix`: detail pages under it (/what-we-do/:slug, /work/:slug, /insights/:slug) keep that item lit.
 */
export const NAV_LINKS = [
  { href: "/#what-we-do", key: "what-we-do", prefix: "/what-we-do", label: "What We Do" },
  { href: "/#how-we-work", key: "how-we-work", prefix: "/how-we-work", label: "How We Work" },
  { href: "/#work", key: "work", prefix: "/work", label: "Our Work" },
  { href: "/#about", key: "about", prefix: "/about", label: "About" },
  { href: "/#insights", key: "insights", prefix: "/insights", label: "Insights" },
] as const;
type NavItem = (typeof NAV_LINKS)[number];

export const CTA = { href: "/contact", label: "Book a Free Consultation" };

/** The DreamSVin logo (vector, animated). Kept under this name for the nav, footer and Health Check. */
export function Wordmark({ className, height = 20 }: { className?: string; height?: number }) {
  return <Logo height={height} className={className} />;
}

export function SkipLink() {
  return (
    <a
      href="#main"
      className="fixed left-4 top-4 z-skip -translate-y-24 rounded-full bg-btn px-4 py-3 text-body-sm font-medium text-on-btn transition-transform duration-base ease-out focus-visible:translate-y-0"
    >
      Skip to content
    </a>
  );
}

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openSheet = () => {
    dialogRef.current?.showModal();
    document.documentElement.style.overflow = "hidden";
    requestAnimationFrame(() => setOpen(true));
  };

  const closeSheet = useCallback(() => {
    const d = dialogRef.current;
    if (!d?.open) return;
    setClosing(true);
    setOpen(false);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(
      () => {
        d.close();
        setClosing(false);
        document.documentElement.style.overflow = "";
        triggerRef.current?.focus();
      },
      reduce ? 0 : 260,
    );
  }, []);

  // Close on route change.
  useEffect(() => {
    closeSheet();
  }, [pathname, closeSheet]);

  // on the home page the lit item follows the scroll; elsewhere it follows the route
  const [spyNav, setSpyNav] = useState("");
  useEffect(() => {
    const on = (e: Event) => setSpyNav((e as CustomEvent<string>).detail);
    window.addEventListener("spy:nav", on);
    const w = window as unknown as { __spy?: { nav?: string } };
    if (w.__spy?.nav) setSpyNav(w.__spy.nav);
    return () => window.removeEventListener("spy:nav", on);
  }, []);
  const isActive = (l: NavItem) =>
    pathname === "/" ? spyNav === l.key : pathname === l.prefix || !!pathname?.startsWith(`${l.prefix}/`);

  // same-page chapter jump: close the sheet first (it locks scroll), then glide there
  const jump = (e: React.MouseEvent, l: NavItem) => {
    if (pathname !== "/") return;
    const el = document.getElementById(l.key);
    if (!el) return;
    e.preventDefault();
    const sheetOpen = !!dialogRef.current?.open;
    if (sheetOpen) closeSheet();
    window.setTimeout(() => jumpTo(el), sheetOpen ? 300 : 0);
  };

  return (
    <>
      <SkipLink />
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-header h-nav border-b transition-[background-color,border-color] duration-moderate ease-out",
          scrolled ? "border-line/70 bg-bg/95 backdrop-blur-xl backdrop-saturate-[1.8]" : "border-transparent bg-transparent",
        )}
      >
        <nav aria-label="Primary" className="container-ds flex h-full items-center justify-between gap-3 lg:gap-8">
          <div className="flex min-w-0 items-center gap-3 md:gap-4">
            <Link
              href="/"
              aria-label="DreamSVin — home"
              onClick={(e) => {
                // already home: glide back to the top instead of doing nothing
                if (pathname !== "/") return;
                e.preventDefault();
                if (dialogRef.current?.open) closeSheet();
                const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
                if (location.hash) history.pushState(null, "", "/");
              }}
              className="-mx-2 inline-flex h-11 items-center rounded-sm px-2 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-focus"
            >
              <Wordmark />
            </Link>
            <NavGrow />
          </div>

          <NavChapter />

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((l) => {
              const active = isActive(l);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active ? (pathname === "/" ? "location" : "page") : undefined}
                    onClick={(e) => jump(e, l)}
                    className={cn(
                      "relative inline-flex h-11 items-center rounded-sm px-3 text-body-sm transition-colors duration-fast ease-out",
                      "focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-focus",
                      active ? "text-fg" : "text-fg-muted hover:text-fg",
                    )}
                  >
                    {l.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-3 bottom-2 h-px origin-left bg-accent transition-transform duration-moderate ease-out",
                        active ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1 lg:gap-3">
            <ThemeToggle />
            <div className="hidden lg:block">
              <ButtonLink href={CTA.href} size="md">
                {CTA.label}
              </ButtonLink>
            </div>

          <button
            ref={triggerRef}
            type="button"
            onClick={openSheet}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="-mr-3 inline-flex h-11 items-center gap-3 rounded-sm px-3 text-body-sm text-fg focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-focus lg:hidden"
          >
            <span className="max-[479px]:sr-only">Menu</span>
            <span aria-hidden="true" className="flex w-5 flex-col gap-2">
              <span className="h-px w-full bg-current" />
              <span className="h-px w-3 self-end bg-current" />
            </span>
          </button>
          </div>
        </nav>
        <NavProgress />
      </header>

      {/* Mobile sheet */}
      <dialog
        id="mobile-nav"
        ref={dialogRef}
        aria-label="Site menu"
        onCancel={(e) => {
          e.preventDefault();
          closeSheet();
        }}
        onClick={(e) => {
          if (e.target === dialogRef.current) closeSheet();
        }}
        className={cn(
          "fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 text-fg backdrop:bg-transparent lg:hidden",
          "open:flex",
        )}
      >
        <div
          className={cn(
            "flex h-full w-full flex-col bg-bg-overlay shadow-e3",
            "transition-[opacity,transform] ease-drawer motion-reduce:transform-none",
            open ? "translate-y-0 opacity-100 duration-slow" : "-translate-y-3 opacity-0 duration-moderate",
            closing && "pointer-events-none",
          )}
        >
          <div className="container-ds flex h-nav shrink-0 items-center justify-between border-b border-line">
            <Wordmark />
            <button
              type="button"
              onClick={closeSheet}
              className="-mr-3 inline-flex h-11 items-center gap-3 rounded-sm px-3 text-body-sm text-fg focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-focus"
            >
              Close
              <Close size={18} />
            </button>
          </div>

          <ul className="container-ds flex flex-1 flex-col justify-center gap-1 overflow-y-auto py-8">
            {NAV_LINKS.map((l, i) => {
              const active = isActive(l);
              return (
                <li
                  key={l.href}
                  style={{ ["--i" as string]: i }}
                  className={cn(
                    "transition-[opacity,transform] duration-slow ease-out [transition-delay:calc(120ms+var(--i)*var(--stagger-item))]",
                    open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                    "motion-reduce:translate-y-0",
                  )}
                >
                  <Link
                    href={l.href}
                    aria-current={active ? (pathname === "/" ? "location" : "page") : undefined}
                    onClick={(e) => {
                      if (pathname === "/" && document.getElementById(l.key)) jump(e, l);
                      else closeSheet();
                    }}
                    className={cn(
                      "flex min-h-14 items-center justify-between rounded-sm py-2 font-display text-display-md transition-colors duration-fast",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                      active ? "text-fg" : "text-fg-muted active:text-fg",
                    )}
                  >
                    {l.label}
                    {active && <span aria-hidden="true" className="size-2 rounded-full bg-accent" />}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="container-ds shrink-0 border-t border-line py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <ButtonLink href={CTA.href} size="lg" className="w-full" onClick={closeSheet}>
              {CTA.label}
            </ButtonLink>
            <p className="mt-4 text-center text-caption text-fg-subtle">
              Or write to{" "}
              <a href="mailto:grow@dreamsvin.com" className="text-fg-muted underline underline-offset-[0.22em] decoration-line-strong">
                grow@dreamsvin.com
              </a>
            </p>
          </div>
        </div>
      </dialog>
    </>
  );
}

/** A 2px coral rule under the nav that fills as the page scrolls. Transform-only (scaleX), rAF-throttled. */
