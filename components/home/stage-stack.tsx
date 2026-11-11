import Link from "next/link";
import { BrandIcon, type BrandIconName } from "@/components/brand/icons";
import { Reveal } from "@/components/brand/motion";
import { Head } from "@/components/brand/sections";
import { STAGES, WHAT_TEASER } from "@/content/site";
import { StagePin } from "./stage-pin";

/**
 * What we do: the three stages as a deck. On desktop the chapter holds under the nav while Growth lands on
 * Foundation and Scale lands on Growth, each covered card keeping its top strip (number, name, tagline) in
 * view; only then does the page move on. Phones, short screens and reduced motion get the three cards as a
 * plain stack. Copy is STAGES and WHAT_TEASER from content/site.ts, as written. The cards stay neutral in
 * both themes. Styles: styles/home-a.css (stk-); the scroll work is in stage-pin.tsx.
 */
const ICON: Record<string, BrandIconName> = { foundation: "grid", growth: "flower", scale: "connect" };

export function HomeStageStack() {
  return (
    <StagePin labelledBy="what-h">
      <div className="stk-pin">
        <div className="stk-inner container-ds">
          <Head id="what-h" kicker="What we do" index="02" lines={[WHAT_TEASER.title]} intro={WHAT_TEASER.intro} />
          <Reveal className="stk-deck">
            {STAGES.map((s, k) => (
              <article key={s.key} className="stk-card rv" aria-labelledby={`stage-${s.key}`} style={{ ["--k" as string]: k, ["--i" as string]: k }}>
                <header className="stk-strip">
                  <span className="stk-n numeric">
                    <span className="sr-only">Stage </span>
                    {s.n}
                  </span>
                  <h3 id={`stage-${s.key}`} className="stk-name">
                    {s.name}
                  </h3>
                  <p className="stk-tag">{s.tag}</p>
                  <BrandIcon name={ICON[s.key]} size={28} />
                </header>
                <div className="stk-body">
                  <p className="stk-say">&ldquo;{s.quote}&rdquo;</p>
                  <div>
                    <p className="stk-sum">{s.summary}</p>
                    <Link href={`/contact?stage=${s.key}`} className="stk-cta group" data-event={`Stage CTA ${s.name}`}>
                      {s.cta}
                      <span aria-hidden="true" className="nudge">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </Reveal>
        </div>
      </div>
    </StagePin>
  );
}
