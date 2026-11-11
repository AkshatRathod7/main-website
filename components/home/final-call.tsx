import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Headline } from "@/components/ui/headline";
import { Reveal } from "@/components/brand/motion";
import { CONTACT, PRIMARY_CTA } from "@/content/site";

/**
 * Home, Talk to us: the ask, then what happens after it. Same copy and links as FinalCta
 * (FINAL_CTA.home, PRIMARY_CTA, /contact#message) on the same warm closing card (.final-card, styles/living.css);
 * the three steps underneath are CONTACT.next, so nothing here is new copy. Layout: styles/home-c.css (.fc-*).
 * `data-final-cta` keeps the phone sticky CTA out of the way while this is on screen (components/site/mobile-cta.tsx).
 */
export function FinalCall({
  title,
  copy,
  secondary,
  id = "final-h",
}: {
  title: string;
  copy?: string;
  secondary?: { href: string; label: string };
  id?: string;
}) {
  return (
    <section aria-labelledby={id} data-final-cta className="relative overflow-clip py-section-sm">
      <div className="container-ds">
        <Reveal data-tone="paper" className="final-card fc-card relative overflow-hidden">
          <div className="relative">
            <Headline id={id} size="display-lg" lines={[title]} className="fc-h" />
            {copy && <p className="rv fc-copy">{copy}</p>}
            <div className="rv fc-acts" style={{ ["--i" as string]: 1 }}>
              <ButtonLink href={PRIMARY_CTA.href} size="lg" arrow data-event="Final CTA">
                {PRIMARY_CTA.label}
              </ButtonLink>
              {secondary && (
                <Link href={secondary.href} className="group inline-flex min-h-11 items-center gap-2 rounded-sm text-body text-fg-muted underline decoration-line-strong underline-offset-[0.22em] hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
                  {secondary.label.replace(/ →$/, "")}
                  <span aria-hidden="true" className="nudge">→</span>
                </Link>
              )}
            </div>
            <div className="fc-next">
              <p id={`${id}-next`} className="rv fc-next-k" style={{ ["--i" as string]: 2 }}>
                What happens next
              </p>
              <ol className="fc-steps" aria-labelledby={`${id}-next`}>
                {CONTACT.next.map((s, i) => (
                  <li key={s} className="fc-step" style={{ ["--k" as string]: i }}>
                    <span className="fc-n" aria-hidden="true">
                      {i + 1}
                    </span>
                    <span className="fc-t">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
