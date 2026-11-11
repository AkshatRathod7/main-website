import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { BrandIcon, type BrandIconName } from "@/components/brand/icons";
import { Nav } from "@/components/site/nav";
import { PRIMARY_CTA as CTA } from "@/content/site";
import { Footer } from "@/components/site/footer";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

/** 404 in the brand book: the same "find what's holding you back" voice, and a way forward for every visitor. */
const links: { href: string; label: string; note: string; icon: BrandIconName }[] = [
  { href: "/#what-we-do", label: "What We Do", note: "Foundation, Growth, Scale", icon: "grid" },
  { href: "/#how-we-work", label: "How We Work", note: "The 90-day sprint", icon: "loop" },
  { href: "/#work", label: "Our Work", note: "Real businesses, real work", icon: "stack" },
  { href: "/#about", label: "About", note: "Who you'd work with", icon: "eye" },
];

export default function NotFound() {
  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1} className="outline-none">
        <section className="hero relative overflow-clip pb-section-sm pt-40 md:pt-52">
          <div className="container-ds grid grid-cols-4 gap-x-6 gap-y-12 md:grid-cols-12 md:items-end">
            <div className="col-span-4 md:col-span-8">
              <p className="label-mono text-fg-subtle">
                <span className="text-accent-text">404</span> · Page not found
              </p>
              <h1 className="mt-6 font-display text-display-lg font-bold">
                This page went missing.{" "}
                Your next step didn&apos;t.
              </h1>
              <p className="mt-6 max-w-[48ch] text-body-lg text-fg-muted">
                The link may be old, or the page has moved. Start from the top, or tell us where your business is and we&apos;ll point you to the right place.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <ButtonLink href="/">Back to home</ButtonLink>
                <ButtonLink href={CTA.href} variant="secondary">
                  {CTA.label}
                </ButtonLink>
              </div>
            </div>
            <span aria-hidden="true" className="col-span-4 block select-none font-display text-[clamp(7rem,22vw,16rem)] font-extrabold leading-[0.8] tracking-[-0.06em] text-line-strong md:col-span-4 md:text-right before:content-[attr(data-n)]" data-n="404" />
          </div>
        </section>
        <nav aria-label="Useful pages" className="container-ds pb-section">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="lift group flex h-full items-center gap-4 rounded-2xl bg-bg-raised p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                  <BrandIcon name={l.icon} size={32} />
                  <span className="flex flex-col">
                    <span className="font-display text-heading-sm font-bold text-fg">{l.label}</span>
                    <span className="text-body-sm text-fg-muted">{l.note}</span>
                  </span>
                  <span aria-hidden="true" className="ml-auto text-fg-subtle transition-transform duration-base ease-out group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>
      <Footer />
    </>
  );
}
