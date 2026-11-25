import Link from "next/link";
import { Head } from "@/components/brand/sections";
import { LANDING_LINKS } from "@/content/landing";
import { SERVICES } from "@/content/services";
import { STAGES } from "@/content/site";
import { ServicesIndex, type ServiceItem } from "./services-index";

/**
 * Services, as an index: five rows, each a link to its own page, showing the stage it belongs to and the
 * outcome it is for. On desktop the row you are on (hover, focus or tap) opens in the pane beside the list:
 * the opening line, what you get, and the way in. Every link is a plain <a>, so all five work without JS.
 * Copy is SERVICES (content/services.ts) and the stage names from STAGES, as written.
 */
export function HomeServicesIndex() {
  const items: ServiceItem[] = SERVICES.map((s) => {
    const stage = STAGES.find((st) => st.key === s.stage);
    return {
      slug: s.slug,
      name: s.name,
      headline: s.headline,
      opening: s.opening,
      icon: s.icon,
      get: s.get,
      stage: stage?.name ?? s.stage,
      stageTag: stage?.tag ?? "",
    };
  });
  return (
    <section aria-labelledby="services-h" className="py-section">
      <div className="container-ds">
        <Head id="services-h" kicker="Services" lines={["Five ways in."]} intro="Each service runs on the same 90-day rhythm, with the same team behind it." />
        <ServicesIndex items={items} />
        {/* Plain links to the pages for specific situations, so every one is a click (and a crawl) from home. */}
        <nav aria-label="More ways in" className="mt-10 border-t border-line pt-6">
          <ul className="flex flex-wrap gap-x-8 gap-y-1">
            {LANDING_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-flex min-h-11 items-center gap-2 rounded-sm text-body font-semibold text-fg underline decoration-line-strong underline-offset-[0.22em] hover:text-accent-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
