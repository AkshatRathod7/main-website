import { Head } from "@/components/brand/sections";
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
      </div>
    </section>
  );
}
