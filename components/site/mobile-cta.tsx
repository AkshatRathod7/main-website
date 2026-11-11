"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CTA } from "./nav";

/**
 * Phones and tablets only (< lg, where the nav CTA folds into the menu). It appears once the hero has
 * scrolled away and steps aside whenever a page's own CTA panel or the footer is on screen, so it
 * never doubles up. Not shown on /contact (you're already there). WhatsApp joins it when configured.
 * Transform and opacity only; under reduced motion it simply appears.
 */
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

export function MobileCta() {
  const pathname = usePathname();
  const [past, setPast] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setPast(window.scrollY > window.innerHeight * 0.8);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const seen = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target));
      setBlocked(seen.size > 0);
    });
    document.querySelectorAll("[data-final-cta], footer").forEach((el) => io.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [pathname]);

  if (pathname?.startsWith("/contact")) return null;
  const show = past && !blocked;

  return (
    <div
      className="mobile-cta fixed inset-x-0 bottom-0 z-sticky px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 lg:hidden"
      data-show={show}
      aria-hidden={!show}
      inert={!show}
    >
      <div className="mx-auto flex max-w-[560px] gap-2">
        <Link
          href={CTA.href}
          data-event="Mobile sticky CTA"
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-btn px-5 font-semibold text-on-btn shadow-e2 transition-colors duration-fast ease-out hover:bg-btn-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          {CTA.label}
          <span aria-hidden="true">→</span>
        </Link>
        {WHATSAPP && (
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            data-event="Mobile sticky WhatsApp"
            className="flex size-12 shrink-0 items-center justify-center rounded-full border border-line-strong bg-bg-elevated text-fg shadow-e2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="currentColor">
              <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
            </svg>
            <span className="sr-only">Message us on WhatsApp (opens in a new tab)</span>
          </a>
        )}
      </div>
    </div>
  );
}
