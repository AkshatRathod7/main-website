import { Reveal } from "@/components/brand/motion";
import { Head } from "@/components/brand/sections";
import { ROSTER, VISIBLE_RESULTS } from "@/content/cases";
import { CLIENT_LOGOS, CLIENT_PHOTOS } from "@/content/site";
import { ResultsBoard, type ResultItem } from "./results-board";

/**
 * Results, as a scoreboard: every number sits under the client it belongs to (their logo or their face),
 * and each tile can show what we did for them. Numbers come from VISIBLE_RESULTS, the "what we did" lines
 * from ROSTER; nothing here is written by hand. The board itself (count-up, curve, reveal) is a client island.
 */

/** "CA Priyanshi Yadav" and "SNJB, est. 1928" are the same clients as "Priyanshi Yadav" and "SNJB" elsewhere. */
const bare = (who: string) => who.replace(/^CA\s+/, "").replace(/,\s*est\.\s*\d{4}$/, "");

/** Up to three lines of what we did, short ones first so they read at a glance in a narrow tile. */
function didFor(name: string) {
  const did = ROSTER.find((e) => e.name === name)?.did ?? [];
  const short = did.filter((d) => d.length <= 64);
  return (short.length >= 3 ? short : did).slice(0, 3);
}

export function HomeResults({ quotes = [] }: { quotes?: { text: string; by: string }[] }) {
  if (VISIBLE_RESULTS.length === 0 && quotes.length === 0) return null; // nothing cleared yet: no empty proof section
  const items: ResultItem[] = VISIBLE_RESULTS.map((r, i) => {
    const name = bare(r.who);
    return {
      who: r.who,
      category: ROSTER.find((e) => e.name === name)?.category,
      from: r.prefix.replace("→", "").trim() || undefined,
      v: r.v,
      suffix: r.suffix,
      k: r.k,
      did: didFor(name),
      photo: CLIENT_PHOTOS[name] ?? CLIENT_PHOTOS[r.who],
      logo: CLIENT_LOGOS[name],
      shape: i,
    };
  });
  return (
    <section aria-labelledby="proof-h" className="py-section">
      <div className="container-ds">
        <Head
          id="proof-h"
          kicker="What the work has done"
          lines={items.length ? ["Real businesses.", "Real numbers."] : ["What clients say."]}
          intro="A few results from client work so far, from our client records."
        />
        {items.length > 0 && <ResultsBoard items={items} />}
        {quotes.length > 0 && (
          <Reveal as="ul" className="mt-16 grid gap-4 md:grid-cols-3">
            {quotes.map((q, i) => (
              <li key={q.text} className="rv rounded-3xl bg-bg-elevated p-6 md:p-8" style={{ ["--i" as string]: i }}>
                <figure>
                  <blockquote className="font-display text-heading-md font-bold">{q.text}</blockquote>
                  <figcaption className="mt-6 text-body-sm text-fg-subtle">{q.by}</figcaption>
                </figure>
              </li>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  );
}
