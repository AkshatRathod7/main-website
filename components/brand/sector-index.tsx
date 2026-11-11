"use client";

/**
 * Our work, as one experience (home). Styles: styles/home-b.css (.ow-*).
 *
 *   1. A count line, computed from the content files: clients, industries, case studies.
 *   2. The eight industries are the way in: one row of tabs.
 *   3. The chosen industry: its motif and headline fact on a dark band, then its clients as tiles (face or
 *      logo and name) beside one detail panel for the client you pick: result, what we did, and the link to
 *      the full story where a case study exists.
 *   4. "Also worked with": the names that have no write-up yet, as one quiet line.
 *
 * Nothing auto-plays and nothing is hidden behind a timer. Everything shown comes from content/cases.ts,
 * content/sectors.ts and content/site.ts. Reduced motion: no entrances; the motif shows fully drawn.
 */
import Link from "next/link";
import { useState } from "react";
import { SECTORS } from "@/content/sectors";
import { ALSO_WORKED_WITH, CASES, ROSTER, type RosterEntry } from "@/content/cases";
import { CLIENT_LOGOS, CLIENT_PHOTOS } from "@/content/site";
import { useInView } from "@/lib/use-in-view";
import { CountUp } from "./motion";
import { SectorArt } from "./sector-art";

type Logo = { src: string; w: number; h: number };
type Entry = {
  /** The name as the industry list writes it. */
  name: string;
  roster?: RosterEntry;
  /** A name with no write-up of its own that another client's "what we did" mentions. */
  via?: { owner: string; line: string };
  photo?: string;
  logo?: Logo;
};

/** "CA Priyanshi Yadav" (sectors.ts) and "Priyanshi Yadav" (cases.ts) are the same client. */
const norm = (s: string) => s.replace(/^CA\s+/i, "").trim().toLowerCase();
const BY_NAME = new Map(ROSTER.map((r) => [norm(r.name), r]));

/** The person behind a brand, as cases.ts states it (case challenge and quote attribution). Used for the face only. */
const FACE_OF: Record<string, string> = {
  "Nagarsheth Group": "Dhaval Upendrakumar",
  "Strongher After 40": "Meghna Dharamsey",
};

function entry(name: string): Entry {
  const roster = BY_NAME.get(norm(name));
  const key = roster?.name ?? name;
  const logo = CLIENT_LOGOS[key] ?? CLIENT_LOGOS[name];
  const photo = CLIENT_PHOTOS[name] ?? CLIENT_PHOTOS[key] ?? (FACE_OF[key] ? CLIENT_PHOTOS[FACE_OF[key]] : undefined);
  let via: Entry["via"];
  if (!roster) {
    const owner = ROSTER.find((r) => r.did.some((d) => d.includes(name)));
    const line = owner?.did.find((d) => d.includes(name));
    if (owner && line) via = { owner: owner.name, line };
  }
  return { name, roster, via, logo, photo: logo ? undefined : photo };
}

const BOOK = SECTORS.map((s) => {
  const entries = s.clients.map(entry);
  const whos = s.proof.who.split("·").map(norm);
  const lead = entries.find((e) => e.roster && whos.includes(norm(e.name))) ?? entries.find((e) => e.roster);
  return { s, entries, stories: entries.filter((e) => e.roster?.slug).length, lead: lead?.name ?? null };
});

const COUNTS = [
  { n: ROSTER.length + ALSO_WORKED_WITH.length, one: "client", many: "clients" },
  { n: SECTORS.length, one: "industry", many: "industries" },
  { n: CASES.length, one: "case study", many: "case studies" },
];

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
const initials = (s: string) =>
  s
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

function Mark({ name, logo, photo }: { name: string; logo?: Logo; photo?: string }) {
  if (logo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className="ow-logo" src={logo.src} alt="" width={logo.w} height={logo.h} loading="lazy" decoding="async" />;
  }
  if (photo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className="ow-face" src={photo} alt="" width={96} height={96} loading="lazy" decoding="async" />;
  }
  return (
    <span className="ow-mono" aria-hidden="true">
      {initials(name)}
    </span>
  );
}

/** The one line a client is known by on its tile: the stated result, else the first thing we did. */
const factOf = (e: Entry) => e.roster?.result ?? e.roster?.did[0] ?? e.via?.line ?? "";

export function OurWork() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.08, rootMargin: "0px 0px -10% 0px" });
  const [active, setActive] = useState(0);
  const [sel, setSel] = useState<string | null>(BOOK[0].lead);
  const { s, entries, stories } = BOOK[active];
  const chosen = entries.find((e) => e.name === sel) ?? entries[0];
  const r = chosen.roster;

  const pick = (i: number) => {
    if (i === active) return;
    setActive(i);
    setSel(BOOK[i].lead);
  };

  return (
    <div ref={ref} className="ow" data-inview={inView ? "true" : undefined}>
      {/* 1. how much: one quiet line */}
      <ul className="ow-count" aria-label="Our work in numbers">
        {COUNTS.map((c) => (
          <li key={c.many}>
            <CountUp to={c.n} duration={1100} className="ow-count-n" />
            <span className="ow-count-k">{c.n === 1 ? c.one : c.many}</span>
          </li>
        ))}
      </ul>

      {/* 2. where: the industries, one row */}
      <ol className="owx-tabs" aria-label="Industries">
        {BOOK.map((b, i) => (
          <li key={b.s.key}>
            <button type="button" className="owx-tab" aria-pressed={i === active} aria-controls="ow-stage" onClick={() => pick(i)} data-event={`Our work industry ${b.s.name}`}>
              {b.s.name}
              <span className="owx-tab-n">
                {b.entries.length}
                <span className="sr-only"> {b.entries.length === 1 ? "client" : "clients"}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>

      {/* 3. who and what: the industry's headline, its clients, and the one you picked */}
      <div id="ow-stage" className="owx-stage" aria-live="polite">
        <div key={`${s.key}-${inView}`} className="owx-stage-in">
          <div className="ow-band owx-band" data-sector={s.key}>
            <div className="ow-art">
              <SectorArt sector={s.key} />
            </div>
            <div className="ow-band-copy">
              <h3 className="ow-kicker">
                {s.name}
                <span className="ow-kicker-meta">
                  {" "}
                  · {plural(entries.length, "client", "clients")}
                  {stories > 0 && ` · ${plural(stories, "case study", "case studies")}`}
                </span>
              </h3>
              <p className="ow-line">{s.line}</p>
              <p className="ow-proof">
                <span className="ow-v">{s.proof.v}</span>
                <span className="ow-k">
                  {s.proof.k}
                  <span className="ow-proof-who"> · {s.proof.who}</span>
                </span>
              </p>
            </div>
          </div>

          <div className="owx-work">
            <ul className="owx-tiles" aria-label={`${s.name} clients`}>
              {entries.map((e, i) => (
                <li key={e.name} style={{ ["--i" as string]: i }}>
                  <button type="button" className="owx-tile" aria-pressed={e.name === chosen.name} aria-controls="owx-detail" onClick={() => setSel(e.name)} data-event={`Our work client ${e.name}`}>
                    <span className="owx-mark">
                      <Mark name={e.name} logo={e.logo} photo={e.photo} />
                    </span>
                    <span className="owx-name">{e.name}</span>
                    {e.roster?.slug && <span className="owx-flag">Case study</span>}
                  </button>
                </li>
              ))}
            </ul>

            <div id="owx-detail" className="owx-detail">
              <div key={chosen.name} className="owx-detail-in">
                <p className="owx-cat">{r?.category ?? chosen.via?.owner ?? s.name}</p>
                <p className="owx-who">{chosen.name}</p>
                {r?.result ? <p className="owx-result">{r.result}</p> : !r && <p className="owx-result">{factOf(chosen)}</p>}
                {r && (
                  <>
                    <p className="owx-did-h">What we did</p>
                    <ul className="owx-did">
                      {r.did.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  </>
                )}
                {r?.slug && (
                  <Link href={`/work/${r.slug}`} className="owx-link" data-event={`Our work story ${r.name}`}>
                    Read the full story <span aria-hidden="true">→</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="owx-also">
        <span className="owx-also-h">Also worked with</span> {ALSO_WORKED_WITH.join(" · ")}
      </p>
    </div>
  );
}
