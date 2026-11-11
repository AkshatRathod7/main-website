// Contact. Copy: DreamSVin Website Copy, "Contact" blocks (hero, qualifying form, sidebar).
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { site, whatsappHref } from "@/lib/site";
import { Headline } from "@/components/ui/headline";
import { Kicker } from "@/components/brand/sections";
import { BrandIcon } from "@/components/brand/icons";
import { CopyEmail } from "@/components/site/CopyEmail";
import { CONTACT } from "@/content/site";
import { CalBooking } from "./cal-booking";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = pageMetadata({
    ownImage: true,
  title: "Book a Free Consultation",
  description: "Tell us about your business. We'll set up a free 30-minute call to find what's holding it back.",
  path: "/contact",
});

export default function ContactPage() {
  const wa = whatsappHref();
  return (
    <>
      <section aria-labelledby="page-h" className="hero pb-12 pt-[calc(var(--nav-height)+clamp(3rem,8vw,7rem))]">
        <span aria-hidden="true" className="hero-glow" />
        <div className="container-ds grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <Kicker>Book a Free Consultation</Kicker>
            <Headline as="h1" id="page-h" size="display-lg" reveal="load" lines={["Let's find what's", "holding your business back."]} className="mt-6 max-w-[24ch]" />
          </div>
          <p className="text-body-lg text-fg-muted md:col-span-4">{CONTACT.sub}</p>
        </div>
      </section>

      <section id="message" aria-label="Enquiry" className="scroll-mt-24 pb-section">
        <div className="container-ds grid gap-12 lg:grid-cols-12">
          <div className="rounded-[12px] bg-bg-raised p-6 shadow-e1 md:p-10 lg:col-span-8">
            <ContactForm bookHref={site.calLink ? "#book" : undefined} />
          </div>

          <aside className="lg:col-span-4" aria-labelledby="next-h">
            <div className="lg:sticky lg:top-[calc(var(--nav-height)+24px)]">
              <h2 id="next-h" className="label-mono text-fg-subtle">
                What happens next
              </h2>
              <ol className="mt-5 grid gap-3">
                {CONTACT.next.map((t, i) => (
                  <li key={t} className="flex gap-4 rounded-2xl bg-bg-elevated p-5">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent font-display text-body-sm font-bold text-on-accent numeric">{i + 1}</span>
                    <span className="pt-1 text-body">{t}</span>
                  </li>
                ))}
              </ol>

              <div className="mt-10 pt-2">
                <p className="label-mono text-fg-subtle">Or reach us directly</p>
                <div className="mt-3">
                  <CopyEmail email={site.email || "grow@dreamsvin.com"} />
                </div>
                {wa && (
                  <a href={wa} target="_blank" rel="noopener noreferrer" data-event="WhatsApp Clicked" className="mt-1 inline-flex min-h-11 items-center text-body-sm text-fg-muted underline decoration-line-strong underline-offset-[0.22em] hover:text-fg">
                    Message us on WhatsApp<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
                <p className="mt-3 text-body-sm text-fg-subtle">{site.city ? `Based in ${site.city}. ` : "Based in India. "}Working with businesses everywhere.</p>
              </div>

              <div className="mt-10 flex items-start gap-4 rounded-2xl bg-bg-raised p-5">
                <BrandIcon name="eye" size={36} />
                <p className="text-body-sm text-fg-muted">
                  Not ready to talk yet? The{" "}
                  <a href="/health-check" className="font-semibold text-fg underline decoration-coral decoration-2 underline-offset-[0.22em]">
                    Business Health Check
                  </a>{" "}
                  takes about three minutes and shows where your business is leaking.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {site.calLink && (
        <section id="book" aria-labelledby="book-h" className="scroll-mt-24 py-section-sm">
          <div className="container-ds">
            <h2 id="book-h" className="text-heading-lg">
              Rather pick a time now?
            </h2>
            <p className="mt-2 text-body text-fg-muted">A 30-minute call. Times are shown in your timezone.</p>
            <div className="mt-8">
              <CalBooking calLink={site.calLink} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
