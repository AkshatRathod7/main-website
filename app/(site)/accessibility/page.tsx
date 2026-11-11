// Accessibility statement. Every claim here is something this build does and was tested for (axe WCAG 2.2 AA,
// keyboard, reduced motion, 360–1440px). Update the "last checked" date when the site is re-audited.
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/brand/sections";

export const metadata: Metadata = pageMetadata({
  title: "Accessibility",
  description: "How the DreamSVin website is built to be usable by everyone, and how to tell us if something gets in your way.",
  path: "/accessibility",
});

const EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "grow@dreamsvin.com";
const CHECKED = "31 October 2026";

const done = [
  { k: "Keyboard first", v: "Every link, menu, filter and form works with a keyboard alone. A skip link jumps past the navigation, and focus is always visible." },
  { k: "Readable contrast", v: "Text and controls meet WCAG 2.2 AA contrast on every background, including the coral and charcoal sections." },
  { k: "Motion you control", v: "If your device asks for reduced motion, scroll animations, the pinned 90-day sprint and the moving cards switch to calm, static versions. Nothing is hidden behind an animation." },
  { k: "Works without JavaScript", v: "Every page's content renders on the server, so it is there even before scripts load." },
  { k: "Any screen size", v: "Layouts are tested from 360px phones to wide desktops, with no sideways scrolling and touch targets of at least 24px." },
  { k: "Forms that explain themselves", v: "Each field has a visible label. Errors sit beside the field they belong to, are linked to it for screen readers, and focus moves to the first one." },
];

export default function AccessibilityPage() {
  return (
    <>
      <PageHero
        kicker="Accessibility"
        lines={["A site everyone", "can use."]}
        sub="We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA. Here is what that means on this site, and how to reach us if something gets in your way."
        cta={null}
        icon="eye"
      />
      <section aria-labelledby="a11y-h" className="pb-section">
        <div className="container-ds">
          <h2 id="a11y-h" className="sr-only">What we do</h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {done.map((d) => (
              <li key={d.k} className="rounded-3xl bg-bg-elevated p-6 md:p-8">
                <h3 className="text-heading-sm">{d.k}</h3>
                <p className="mt-3 text-body text-fg-muted">{d.v}</p>
              </li>
            ))}
          </ul>
          <div className="mt-14 grid gap-8 pt-10 md:grid-cols-12">
            <div className="md:col-span-6">
              <h2 className="text-heading-lg">Something not working for you?</h2>
              <p className="mt-4 max-w-[52ch] text-body-lg text-fg-muted">
                Tell us the page and what got in the way. We reply within one working day, and we&apos;ll help you get what you came for another way while we fix it.
              </p>
            </div>
            <div className="md:col-span-5 md:col-start-8 md:self-end">
              <a
                href={`mailto:${EMAIL}?subject=${encodeURIComponent("Accessibility on dreamsvin.com")}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-sm font-semibold text-fg underline decoration-coral decoration-2 underline-offset-[0.3em] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              >
                {EMAIL}
              </a>
              <p className="mt-3 text-body-sm text-fg-subtle">Last checked {CHECKED}.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
