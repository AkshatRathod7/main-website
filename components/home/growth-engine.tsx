"use client";

/**
 * The growth engine chapter (home). Left: the founder's copy and the three Cs as rows. Right: the orbit
 * drawing (the "pull engine", carried over from components/brand/living.tsx and extended).
 *
 * The rows and the drawing are one thing: a slow cycle lights one C at a time (its row, its orbit, its
 * route into the core and its card). Hover or focus on a row or a card takes over; a click holds it.
 * Each C is backed by one client fact, read from content/cases.ts by name (nothing typed in here).
 * Styles: styles/home-b.css (.ge-*), on top of the existing .pe-* rules in styles/living.css.
 * Reduced motion: no cycle and no loops; the first C is lit, and rows still answer to hover, focus and click.
 */
import { useEffect, useState } from "react";
import { Headline } from "@/components/ui/headline";
import { useInView } from "@/lib/use-in-view";
import { CCC, CLIENT_LOGOS, CLIENT_PHOTOS } from "@/content/site";
import { CLIENTS } from "@/content/cases";

const STEP = 5200; // ms each C stays lit while the cycle runs

type Proof = { who: string; fact: string; photo?: string; logo?: { src: string; w: number; h: number } };

/** One stated client fact per C, looked up by name so it can never drift from the content file. */
function proofFor(name: string, pick: (c: (typeof CLIENTS)[number]) => string | undefined): Proof | null {
  const c = CLIENTS.find((x) => x.name === name);
  const fact = c && pick(c);
  if (!c || !fact) return null;
  return { who: c.name, fact, photo: CLIENT_PHOTOS[c.name], logo: CLIENT_LOGOS[c.name] };
}
const PROOFS: (Proof | null)[] = [
  proofFor("Yogsadhak", (c) => c.result),
  proofFor("Meghna Dharamsey", (c) => c.result),
  proofFor("Meher On Money", (c) => c.did.find((d) => d.includes("upGrad"))),
];

// The drawing is 400×440 with the core at (200, 248). Each C has an orbit that passes through the point
// where its card's route begins, a route into the core, and a particle shape.
const CORE = { x: 200, y: 248 };
const PARTS = [
  { key: "content", r: 158, d: "M110 118 C120 170 150 200 182 228", shape: "heart", delay: 0, turn: 46 },
  { key: "community", r: 133, d: "M290 150 C280 190 250 210 220 230", shape: "bubble", delay: 0.45, turn: 34 },
  { key: "collab", r: 104, d: "M200 352 C196 330 198 316 200 302", shape: "plus", delay: 0.9, turn: 26 },
] as const;

const BUBBLES = ["Saved this for later.", "Who did your branding?", "Sharing with my team.", "How do I book a call?"];
/** What arrives at the core while each C is lit. */
const ARRIVALS = [
  ["follower", "enquiry"],
  ["referral", "enquiry"],
  ["partner", "enquiry"],
];

function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setReduce(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  return reduce;
}

function ProofMark({ p }: { p: Proof }) {
  if (p.photo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={p.photo} alt="" width={28} height={28} loading="lazy" decoding="async" className="ge-face" />;
  }
  if (p.logo) {
    return (
      <span className="ge-logo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.logo.src} alt="" width={p.logo.w} height={p.logo.h} loading="lazy" decoding="async" />
      </span>
    );
  }
  return <span className="ge-dot" />;
}

export function GrowthEngine() {
  const [ref, on] = useInView<HTMLDivElement>({ once: false, threshold: 0.3, rootMargin: "0px" });
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState(false); // pointer or focus is on a row or card: wait
  const [held, setHeld] = useState(false); // the visitor clicked one: stay there
  const [seen, setSeen] = useState(false); // the drawing starts once, the first time it is on screen
  const [n, setN] = useState(0);
  const [mode, setMode] = useState<"pull" | "push">("pull");
  const [touched, setTouched] = useState(false); // the visitor has used the push/pull switch

  useEffect(() => {
    if (on) setSeen(true);
  }, [on]);

  const run = on && !hover && !held && !reduce;
  useEffect(() => {
    if (!run) return;
    const t = window.setTimeout(() => setActive((a) => (a + 1) % PARTS.length), STEP);
    return () => window.clearTimeout(t);
  }, [run, active]);

  useEffect(() => {
    if (!on || reduce) return;
    const t = window.setInterval(() => setN((v) => v + 1), 1400);
    return () => window.clearInterval(t);
  }, [on, reduce]);

  const take = (i: number) => {
    setActive(i);
    setHover(true);
  };
  const lit = (i: number) => (active === i ? "" : undefined);

  return (
    <section aria-labelledby="ge-h" className="ge relative overflow-clip py-section" data-tone="paper">
      <div ref={ref} className="container-ds grid grid-cols-4 items-center gap-x-6 gap-y-12 md:grid-cols-12" style={{ ["--ge-step" as string]: `${STEP}ms` }}>
        <div className="col-span-4 md:col-span-6">
          <p className="flex items-center gap-3 text-body font-semibold tracking-[-0.01em] text-accent-text">
            <span>{CCC.eyebrow}</span>
          </p>
          <Headline id="ge-h" size="display-md" lines={[CCC.homeTitle]} className="mt-5 max-w-[18ch]" />
          <p className="mt-6 max-w-[48ch] text-body-lg text-fg-muted">{CCC.homeCopy}</p>

          <ol className="ge-rows" aria-label="The three parts of the growth engine" onPointerLeave={() => setHover(false)}>
            {CCC.parts.map((p, i) => {
              const proof = PROOFS[i];
              return (
                <li key={p.k} className="ge-row" data-on={lit(i)}>
                  <button
                    type="button"
                    className="ge-btn"
                    aria-pressed={active === i}
                    onClick={() => {
                      setActive(i);
                      setHeld(true);
                    }}
                    onPointerEnter={(e) => {
                      if (e.pointerType === "mouse") take(i);
                    }}
                    onFocus={() => take(i)}
                    onBlur={() => setHover(false)}
                    data-event={`Growth engine ${p.k}`}
                  >
                    <span className="ge-name">
                      <span className="text-accent-text">{p.k[0]}</span>
                      {p.k.slice(1)}
                    </span>
                    <span className="ge-desc">{p.v}</span>
                    {proof && (
                      <span className="ge-proof">
                        <ProofMark p={proof} />
                        <span>
                          <span className="ge-who">{proof.who}</span>
                          <span aria-hidden="true"> · </span>
                          <span className="sr-only">: </span>
                          {proof.fact}
                        </span>
                      </span>
                    )}
                  </button>
                  <span className="ge-bar" aria-hidden="true">
                    {active === i && <span key={`${i}-${run}`} data-run={run ? "" : undefined} />}
                  </span>
                </li>
              );
            })}
          </ol>

          {/* Push or pull, played with the words themselves: "push" gets shoved away, "pull." is hauled in.
              Each word is a button: pick push and the engine runs backwards; pick pull and it runs as built. */}
          <div className="pp" data-mode={mode} data-on={seen ? "" : undefined}>
            <p className="pp-line font-display text-heading-lg font-bold">
              From{" "}
              <button type="button" className="pp-w pp-push" aria-pressed={mode === "push"} onClick={() => { setTouched(true); setMode("push"); }} data-event="Growth engine push">
                <span key={mode}>push</span>
              </button>{" "}
              to{" "}
              <button type="button" className="pp-w pp-pull" aria-pressed={mode === "pull"} onClick={() => { setTouched(true); setMode("pull"); }} data-event="Growth engine pull">
                <span key={mode}>pull.</span>
              </button>
            </p>
            <p className="pp-say" aria-live="polite">
              {!touched ? "Tap a word." : mode === "pull" ? "Pull: they come to you." : "Push: you chase every lead."}
            </p>
          </div>
        </div>

        <div className="col-span-4 md:col-span-5 md:col-start-8">
          <div
            className="pe ge-pe"
            data-play={seen || undefined}
            data-active={PARTS[active].key}
            data-mode={mode}
            role="img"
            aria-label="Content, community and collaborations pulling attention, people and partners into your business"
            onPointerLeave={() => setHover(false)}
          >
            <svg viewBox="0 0 400 440" className="pe-svg" aria-hidden="true">
              <defs>
                <radialGradient id="ge-core" cx="50%" cy="40%" r="70%">
                  <stop offset="0" stopColor="#FFB37A" />
                  <stop offset="1" stopColor="#FF705C" />
                </radialGradient>
                <path id="ge-heart" d="M0 3.5 C-5 -1 -6.5 -4.5 -3.6 -6.3 C-1.9 -7.3 -0.6 -6.4 0 -5.2 C0.6 -6.4 1.9 -7.3 3.6 -6.3 C6.5 -4.5 5 -1 0 3.5Z" />
                <path id="ge-bubble" d="M-6 -5 h12 a2 2 0 0 1 2 2 v6 a2 2 0 0 1 -2 2 h-7 l-4 3 v-3 h-1 a2 2 0 0 1 -2 -2 v-6 a2 2 0 0 1 2 -2Z" />
                <path id="ge-plus" d="M-1.6 -6 h3.2 v4.4 h4.4 v3.2 h-4.4 v4.4 h-3.2 v-4.4 h-4.4 v-3.2 h4.4Z" />
              </defs>

              {/* One orbit per C, each with a satellite. The lit one turns coral. */}
              {PARTS.map((o, i) => (
                <g key={o.key} className="ge-orbit" data-on={lit(i)}>
                  <circle cx={CORE.x} cy={CORE.y} r={o.r} className="ge-orbit-base" />
                  <circle cx={CORE.x} cy={CORE.y} r={o.r} className="ge-orbit-lit" />
                  <g className="ge-sat" style={{ animationDuration: `${o.turn}s`, animationDelay: `${-o.turn * (0.18 + i * 0.31)}s` }}>
                    <circle cx={CORE.x} cy={CORE.y - o.r} r="3.5" />
                  </g>
                </g>
              ))}

              {/* Rings closing in on the core: the pull */}
              {[0, 1].map((k) => (
                <circle key={k} cx={CORE.x} cy={CORE.y} r="62" className="pe-ring" style={{ animationDelay: `${k * 1.8}s` }} />
              ))}

              {PARTS.map((r, i) => (
                <g key={r.key} className="ge-route" data-on={lit(i)}>
                  <path d={r.d} className="pe-route" />
                  {!reduce &&
                    [0, 1, 2].map((m) => (
                      <g key={m} className={`pe-p pe-p-${r.shape}`}>
                        <use href={`#ge-${r.shape}`} />
                        <animateMotion path={r.d} dur="2.1s" begin={`${r.delay + m * 0.7}s`} repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.15;.8;1" dur="2.1s" begin={`${r.delay + m * 0.7}s`} repeatCount="indefinite" />
                      </g>
                    ))}
                </g>
              ))}

              <circle cx={CORE.x} cy={CORE.y} r="56" fill="url(#ge-core)" className="pe-core" />
              <text x={CORE.x} y="242" textAnchor="middle" className="pe-core-t">
                Your
              </text>
              <text x={CORE.x} y="262" textAnchor="middle" className="pe-core-t">
                business
              </text>
            </svg>

            {/* Content: a reel that keeps collecting hearts */}
            <div className="pe-card pe-content ge-card" data-on={lit(0)} onPointerEnter={(e) => e.pointerType === "mouse" && take(0)}>
              <div className="pe-reel" aria-hidden="true">
                <span className="pe-play" />
                {[0, 1, 2, 3].map((k) => (
                  <span key={k} className="pe-heart" style={{ ["--k" as string]: k }} />
                ))}
              </div>
              <div className="min-w-0">
                <p className="pe-k">Content</p>
                <p className="pe-v">One reel, 169K views</p>
              </div>
            </div>

            {/* Community: the conversation keeps going */}
            <div className="pe-card pe-community ge-card" data-on={lit(1)} onPointerEnter={(e) => e.pointerType === "mouse" && take(1)}>
              <p className="pe-k">Community</p>
              <ul className="pe-chat" aria-hidden="true">
                {BUBBLES.map((b, k) => (
                  <li key={b} style={{ ["--k" as string]: k }}>
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Collaborations: two brands meet */}
            <div className="pe-card pe-collab ge-card" data-on={lit(2)} onPointerEnter={(e) => e.pointerType === "mouse" && take(2)}>
              <p className="pe-k">Collaborations</p>
              <div className="pe-meet" aria-hidden="true">
                <span className="pe-you">You</span>
                <span className="pe-x">×</span>
                <span className="pe-them">Partner</span>
              </div>
            </div>

            <p className="pe-count" aria-hidden="true">
              <span key={`${active}-${n}`} className="pe-pop">
                +1
              </span>{" "}
              {ARRIVALS[active][n % 2]}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
