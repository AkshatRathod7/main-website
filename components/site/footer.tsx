import Link from "next/link";
import { cn } from "@/lib/cn";
import { CopyEmail } from "./CopyEmail";
import { Wordmark } from "./nav";
import { FooterFloor } from "./footer-grow";

/**
 * Footer: charcoal floor, the brand line, the index, contact, then the wordmark set large as a sign-off.
 * Copy from the DreamSVin Website Copy doc (Footer block). Socials and WhatsApp render only when configured.
 */
const COLUMNS = [
  {
    title: "Explore",
    links: [
      { href: "/#what-we-do", label: "What We Do" },
      { href: "/#how-we-work", label: "How We Work" },
      { href: "/#work", label: "Our Work" },
      { href: "/#about", label: "About" },
    ],
  },
  {
    title: "Start",
    links: [
      { href: "/contact", label: "Book a Free Consultation" },
      { href: "/health-check", label: "Business Health Check" },
      { href: "/insights", label: "Insights" },
      { href: "/contact", label: "Contact" },
    ],
  },
] as const;

const EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "grow@dreamsvin.com";
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
const ENTITY = process.env.NEXT_PUBLIC_LEGAL_ENTITY;
const SOCIALS = [
  { label: "Instagram", href: process.env.NEXT_PUBLIC_INSTAGRAM_URL },
  { label: "LinkedIn", href: process.env.NEXT_PUBLIC_LINKEDIN_URL },
  { label: "YouTube", href: process.env.NEXT_PUBLIC_YOUTUBE_URL },
].filter((s): s is { label: string; href: string } => Boolean(s.href));

const linkCls =
  "group/fl inline-flex min-h-11 items-center gap-2 rounded-xs text-body-sm text-fg-muted transition-colors duration-fast ease-out hover:text-fg " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

export function Footer({ className }: { className?: string }) {
  return (
    <footer data-tone="ink" className={cn("relative overflow-hidden", className)}>
      <div className="container-ds pt-section-sm">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-12">
          <div className="col-span-2 flex flex-col gap-5 md:col-span-5">
            <Wordmark height={20} className="self-start" />
            <p className="max-w-[26ch] font-display text-heading-md font-bold text-fg">
              Business architects and growth partners.
            </p>
            <p className="max-w-[40ch] text-body-sm text-fg-subtle">
              We help businesses build, grow and scale. We make the plan, then help you carry it out.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title} className="col-span-1 md:col-span-2">
              <p className="label-mono mb-3 text-fg-subtle">{col.title}</p>
              <ul className="flex flex-col">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className={linkCls}>
                      <span aria-hidden="true" className="h-px w-0 bg-accent transition-[width] duration-moderate ease-out group-hover/fl:w-3" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="col-span-2 flex flex-col gap-1 md:col-span-3">
            <p className="label-mono mb-2 text-fg-subtle">Contact</p>
            <CopyEmail email={EMAIL} />
            {WHATSAPP && (
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                data-event="Footer WhatsApp"
                className={cn(linkCls, "self-start")}
              >
                Message on WhatsApp<span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
            {SOCIALS.length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-x-5">
                {SOCIALS.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className={linkCls}>
                      {s.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-2 text-body-sm text-fg-subtle">Based in India. Working with businesses everywhere.</p>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-line pt-6 text-caption text-fg-subtle md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {ENTITY || "DreamSVin"}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6">
            <li>
              <Link href="/privacy" className={cn(linkCls, "text-caption text-fg-subtle")}>
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className={cn(linkCls, "text-caption text-fg-subtle")}>
                Terms
              </Link>
            </li>
            <li>
              <Link href="/accessibility" className={cn(linkCls, "text-caption text-fg-subtle")}>
                Accessibility
              </Link>
            </li>
            <li>
              <a href="#main" className={cn(linkCls, "text-caption text-fg-subtle")}>
                Back to top <span aria-hidden="true">↑</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* The floor: try to scroll past the end and the plateau breaks. */}
      <FooterFloor />
    </footer>
  );
}
