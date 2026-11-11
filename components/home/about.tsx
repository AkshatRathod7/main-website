import Image from "next/image";
import { Headline } from "@/components/ui/headline";
import { Reveal } from "@/components/brand/motion";
import { Kicker } from "@/components/brand/sections";
import { ABOUT, EXTENDED_TEAM, WHY } from "@/content/site";
import { Reasons, TeamLine } from "./about-live";

/**
 * Home, About: why us, told by the person you work with. One screen instead of three
 * (it replaces WhyGrid + FounderStrip + ExtendedTeam on the home page).
 *   left   Isha's photo
 *   right  the heading, her line, the two links (her story opens in place), the four reasons, the team
 * All copy comes from content/site.ts (WHY, ABOUT.founder, EXTENDED_TEAM). Styles: styles/home-c.css (.ab-*).
 */

// The kinds of specialist who join when a client needs them: ABOUT.specialists.copy, as single words.
const ON_CALL = ["Strategists", "Designers", "Marketers", "Developers", "Operators"] as const;

export function HomeAbout() {
  const f = ABOUT.founder;
  return (
    <section aria-labelledby="about-h" data-tone="paper" className="py-section">
      <Reveal className="container-ds ab-grid">
        <div className="ab-title">
          <Kicker className="rv">Why DreamSVin</Kicker>
          <Headline id="about-h" size="display-md" lines={[WHY.title]} className="mt-4" />
        </div>

        <div className="rv ab-photo" style={{ ["--i" as string]: 1 }}>
          <Image src={f.photo.src} alt={f.photo.alt} width={576} height={1024} sizes="(min-width: 768px) 30vw, 100vw" />
        </div>

        <div className="ab-founder">
          {/* Her line: the opening of ABOUT.founder.bio, as the home page has always quoted it. */}
          <blockquote className="rv ab-quote" style={{ ["--i" as string]: 2 }}>
            <p>
              <span>&ldquo;Most founders don&apos;t have a strategy problem.</span>{" "}
              <span>They have an execution problem.&rdquo;</span>
            </p>
            <footer>
              <cite className="ab-cite">
                <b>{f.name}</b>
                <span>Founder, DreamSVin</span>
              </cite>
            </footer>
          </blockquote>
          <div className="rv ab-links" style={{ ["--i" as string]: 3 }}>
            <details className="founder-more group/fm w-full">
              <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-sm text-body font-semibold text-fg hover:text-accent-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus [&::-webkit-details-marker]:hidden">
                Read Isha&apos;s story
                <span aria-hidden="true" className="transition-transform duration-base group-open/fm:rotate-90">›</span>
              </summary>
              <div className="mt-4 grid gap-4 text-body-lg text-fg-muted">
                <p className="text-body-sm font-semibold text-accent-text">{f.roles}</p>
                {f.bio.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
                <ul className="grid gap-2">
                  {f.roles2.map((r) => (
                    <li key={r} className="flex gap-3 text-body">
                      <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-coral" />
                      {r}
                    </li>
                  ))}
                </ul>
                <p className="border-l-2 border-coral pl-6 font-display text-heading-md font-bold leading-[1.3] text-fg">{f.closing}</p>
              </div>
            </details>
            <a
              href={f.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              data-event="Founder LinkedIn"
              className="inline-flex min-h-11 items-center gap-2 rounded-sm text-body font-semibold text-fg hover:text-accent-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.5h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1v5.46h-4v-4.84c0-1.15-.02-2.64-1.6-2.64-1.62 0-1.86 1.26-1.86 2.56v4.92h-4v-11Z" /></svg>
              Follow Isha on LinkedIn
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>

        <div className="ab-lower">
          <Reasons points={WHY.points} />
          <TeamLine kicker="One team" title={EXTENDED_TEAM.title} roles={EXTENDED_TEAM.roles} onCall={ON_CALL} />
        </div>
      </Reveal>
    </section>
  );
}
