"use client";

/**
 * The moving parts of the home page (1 Nov redesign). Styles: styles/living.css.
 *
 *   HeroProof    a story-style card in the hero that cycles through real client results
 *   ResultTile   a result that grows: the number counts, the curve draws, the area fills, a dot rides the line
 *   StackWatch   colours the "What we do" section by the stage card on top of the deck
 *   TeamBoard    the extended team as an org chart whose empty seats get filled by DreamSVin
 *   PullEngine   Content, Community and Collaborations pulling attention into your business
 *
 * Every component renders its finished state on the server; motion starts once it is on screen.
 * Numbers come from content/cases.ts (VISIBLE_RESULTS); the mock UI inside PullEngine is illustrative.
 */
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { VISIBLE_RESULTS } from "@/content/cases";
import { BrandIcon, type BrandIconName } from "./icons";

type Result = (typeof VISIBLE_RESULTS)[number];

/** Shape of each result, in a 300×120 box: a climb from zero, a two-week jump, one reel spiking, a century then a lift. */
const CURVES = [
  "M0 116 C70 115 125 109 170 92 S250 30 300 8",
  "M0 112 C90 111 130 107 158 88 S205 14 300 8",
  "M0 110 C90 110 150 109 188 103 S216 6 236 6 S272 46 300 52",
  "M0 84 C90 82 160 78 214 72 S272 34 300 12",
];

function useOnScreen<T extends Element>(threshold = 0.4) {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, on] as const;
}

function countTo(el: HTMLElement | null, r: Result, ms = 1800) {
  if (!el) return;
  const start = performance.now();
  const tick = (t: number) => {
    const p = Math.min(1, (t - start) / ms);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = `${r.prefix}${Math.round(e * r.v)}${r.suffix}`;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const initials = (s: string) =>
  s
    .replace(/^CA\s+/, "")
    .split(/[\s,]+/)
    .filter((w) => /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

/* ───────────────────────── Hero proof (story card) ───────────────────────── */
export function HeroProof() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const numRef = useRef<HTMLSpanElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const r = VISIBLE_RESULTS[i];
  const STEP = 3600;

  useEffect(() => {
    countTo(numRef.current, r, 1300);
    svgRef.current?.querySelectorAll<SVGAnimationElement>("animate").forEach((a) => {
      try {
        a.beginElement();
      } catch {}
    });
  }, [i, r]);

  useEffect(() => {
    if (paused) return;
    const t = window.setTimeout(() => setI((n) => (n + 1) % VISIBLE_RESULTS.length), STEP);
    return () => window.clearTimeout(t);
  }, [i, paused]);

  if (!r) return null;
  return (
    <div
      className="hp"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      data-paused={paused || undefined}
    >
      <div className="hp-bars" aria-hidden="true">
        {VISIBLE_RESULTS.map((_, k) => (
          <span key={k} data-s={k < i ? "done" : k === i ? "now" : "next"} style={{ ["--step" as string]: `${STEP}ms` }}>
            <i key={k === i ? `on-${i}` : "off"} />
          </span>
        ))}
      </div>
      <div className="hp-who">
        <span className="hp-ava" aria-hidden="true">
          {initials(r.who)}
        </span>
        <span>
          <b>{r.who}</b>
          <span className="hp-tag">Client result</span>
        </span>
      </div>
      <p className="hp-num" aria-live="polite">
        <span ref={numRef} className="numeric">{`${r.prefix}${r.v}${r.suffix}`}</span>
        <span className="hp-k">{r.k}</span>
      </p>
      <svg ref={svgRef} viewBox="0 0 300 120" className="hp-chart" aria-hidden="true" key={i}>
        <path d={`${CURVES[i % CURVES.length]} L300 120 L0 120 Z`} className="hp-area" />
        <path d={CURVES[i % CURVES.length]} className="hp-line" pathLength={1} strokeDasharray="1" strokeDashoffset="0">
          <animate attributeName="stroke-dashoffset" from="1" to="0" dur="1.3s" begin="indefinite" fill="freeze" calcMode="spline" keySplines=".3 0 .2 1" keyTimes="0;1" />
        </path>
      </svg>
      <button type="button" className="hp-next" onClick={() => setI((n) => (n + 1) % VISIBLE_RESULTS.length)} data-event="Hero proof next">
        <span className="sr-only">Next client result</span>
      </button>
    </div>
  );
}

/* ───────────────────────── Result tile ───────────────────────── */
export function ResultTile({ r, i }: { r: Result; i: number }) {
  const id = useId().replace(/:/g, "");
  const [ref, on] = useOnScreen<HTMLDivElement>(0.5);
  const numRef = useRef<HTMLSpanElement>(null);
  const busy = useRef(false);
  const curve = CURVES[i % CURVES.length];

  const play = useCallback(() => {
    const el = ref.current;
    if (!el || busy.current) return;
    busy.current = true;
    el.querySelectorAll<SVGAnimationElement>("animate, animateMotion, set").forEach((a) => {
      try {
        a.beginElement();
      } catch {}
    });
    countTo(numRef.current, r);
    window.setTimeout(() => (busy.current = false), 1900);
  }, [r, ref]);

  useEffect(() => {
    if (on) window.setTimeout(play, i * 160);
  }, [on, play, i]);

  const spline = { calcMode: "spline", keySplines: ".3 0 .2 1", keyTimes: "0;1" } as const;
  return (
    <div ref={ref} className="rt" data-tint={i % 5} style={{ ["--i" as string]: i }} onMouseEnter={play}>
      <dt className="sr-only">{r.who}</dt>
      <dd className="rt-v">
        <span ref={numRef} className="numeric">{`${r.prefix}${r.v}${r.suffix}`}</span>
      </dd>
      <dd className="mt-3 max-w-[22ch] text-body text-fg">{r.k}</dd>
      <dd className="mt-2 text-body-sm font-semibold text-fg-muted">{r.who}</dd>
      <dd aria-hidden="true" className="rt-chart">
        <svg viewBox="0 0 300 120" overflow="visible">
          <defs>
            <linearGradient id={`${id}-a`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" style={{ stopColor: "var(--hue, #FF705C)" }} stopOpacity=".3" />
              <stop offset="1" style={{ stopColor: "var(--hue, #FF705C)" }} stopOpacity="0" />
            </linearGradient>
            <clipPath id={`${id}-c`}>
              <rect x="0" y="-10" width="300" height="140">
                <animate attributeName="width" from="0" to="300" dur="1.8s" begin="indefinite" fill="freeze" {...spline} />
              </rect>
            </clipPath>
          </defs>
          <g className="rt-grid">
            <line x1="0" y1="30" x2="300" y2="30" />
            <line x1="0" y1="60" x2="300" y2="60" />
            <line x1="0" y1="90" x2="300" y2="90" />
          </g>
          <path d={`${curve} L300 120 L0 120 Z`} fill={`url(#${id}-a)`} clipPath={`url(#${id}-c)`} />
          <path d={curve} className="rt-line" pathLength={1} strokeDasharray="1" strokeDashoffset="0">
            <animate attributeName="stroke-dashoffset" from="1" to="0" dur="1.8s" begin="indefinite" fill="freeze" {...spline} />
          </path>
          <g className="rt-dot" opacity="0">
            <set attributeName="opacity" to="1" begin="indefinite" fill="freeze" />
            <animateMotion path={curve} dur="1.8s" begin="indefinite" fill="freeze" keyPoints="0;1" {...spline} />
            <circle r="14" className="rt-dot-ring" />
            <circle r="5.5" className="rt-dot-core" />
          </g>
        </svg>
      </dd>
    </div>
  );
}

/* ───────────────────────── Stage stack colour ───────────────────────── */
/** Sets data-stage on the enclosing section to the stage card currently on top of the deck. */
export function StackWatch() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const marker = ref.current;
    const section = marker?.closest("section");
    const stack = marker?.parentElement;
    if (!section || !stack) return;
    const cards = Array.from(stack.querySelectorAll<HTMLElement>(".stack-card"));
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.45;
      let active = -1;
      cards.forEach((c, k) => {
        if (c.getBoundingClientRect().top < line) active = k;
      });
      const sr = section.getBoundingClientRect();
      if (sr.bottom < window.innerHeight * 0.35 || sr.top > window.innerHeight * 0.6) active = -1;
      section.dataset.stage = active < 0 ? "none" : (cards[active]?.dataset.stage ?? "none");
      cards.forEach((c, k) => c.toggleAttribute("data-under", active > k));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return <span ref={ref} hidden />;
}

/* ───────────────────────── Team board ───────────────────────── */
const SPECIALISTS = ["Brand designer", "Performance marketer", "Content producer", "Video editor", "Web developer", "PR and media"];

export function TeamBoard({ roles }: { roles: readonly { role: string; like: string; desc: string }[] }) {
  const [ref, on] = useOnScreen<HTMLDivElement>(0.3);
  const [spec, setSpec] = useState(0);
  const icons: BrandIconName[] = ["eye", "spark", "stack"];
  useEffect(() => {
    if (!on) return;
    const t = window.setInterval(() => setSpec((n) => (n + 1) % SPECIALISTS.length), 1500);
    return () => window.clearInterval(t);
  }, [on]);

  return (
    <div ref={ref} className="tb" data-play={on || undefined}>
      <div className="tb-top">
        <span className="tb-you">
          <span className="tb-you-dot" aria-hidden="true" />
          You, the founder
        </span>
      </div>
      <svg className="tb-wires" viewBox="0 0 1200 90" preserveAspectRatio="none" aria-hidden="true">
        <path d="M600 0 V40 H200 V90" pathLength={1} />
        <path d="M600 0 V90" pathLength={1} />
        <path d="M600 0 V40 H1000 V90" pathLength={1} />
      </svg>
      <ol className="tb-seats">
        {roles.map((r, k) => (
          <li key={r.role} className="tb-seat" style={{ ["--k" as string]: k }}>
            <div className="tb-head">
              <BrandIcon name={icons[k] ?? "spark"} size={36} />
              <span className="tb-stamp" aria-hidden="true">
                <span className="tb-vacant">Seat empty</span>
                <span className="tb-filled">Filled by DreamSVin</span>
              </span>
            </div>
            <p className="mt-8 text-body-sm font-semibold text-accent-text">{r.like}</p>
            <h3 className="mt-2 text-heading-lg">{r.role}</h3>
            <p className="mt-3 text-body text-fg-muted">{r.desc}</p>
          </li>
        ))}
      </ol>
      <div className="tb-bench">
        <p className="tb-bench-k">
          <span className="tb-you-dot" aria-hidden="true" />
          On call: specialists we bring in when the problem needs one
        </p>
        <ul className="flex flex-wrap gap-2">
          {SPECIALISTS.map((s, n) => (
            <li key={s} className="tb-spec" data-on={n === spec || undefined}>
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ───────────────────────── Pull engine (CCC) ───────────────────────── */
const BUBBLES = ["Saved this for later.", "Who did your branding?", "Sharing with my team.", "How do I book a call?"];

export function PullEngine() {
  const [ref, on] = useOnScreen<HTMLDivElement>(0.3);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!on) return;
    const t = window.setInterval(() => setN((v) => v + 1), 1400);
    return () => window.clearInterval(t);
  }, [on]);

  // Particle routes, in the 400×440 drawing: from each source card into the core.
  const routes = [
    { d: "M110 118 C120 170 150 200 182 228", k: "heart", delay: 0 },
    { d: "M290 150 C280 190 250 210 220 230", k: "bubble", delay: 0.45 },
    { d: "M200 352 C196 330 198 316 200 302", k: "plus", delay: 0.9 },
  ];
  return (
    <div ref={ref} className="pe" data-play={on || undefined} role="img" aria-label="Content, community and collaborations pulling attention, people and partners into your business">
      <svg viewBox="0 0 400 440" className="pe-svg" aria-hidden="true">
        <defs>
          <radialGradient id="pe-core" cx="50%" cy="40%" r="70%">
            <stop offset="0" stopColor="#FFB37A" />
            <stop offset="1" stopColor="#FF705C" />
          </radialGradient>
          <path id="pe-heart" d="M0 3.5 C-5 -1 -6.5 -4.5 -3.6 -6.3 C-1.9 -7.3 -0.6 -6.4 0 -5.2 C0.6 -6.4 1.9 -7.3 3.6 -6.3 C6.5 -4.5 5 -1 0 3.5Z" />
          <path id="pe-bubble" d="M-6 -5 h12 a2 2 0 0 1 2 2 v6 a2 2 0 0 1 -2 2 h-7 l-4 3 v-3 h-1 a2 2 0 0 1 -2 -2 v-6 a2 2 0 0 1 2 -2Z" />
          <path id="pe-plus" d="M-1.6 -6 h3.2 v4.4 h4.4 v3.2 h-4.4 v4.4 h-3.2 v-4.4 h-4.4 v-3.2 h4.4Z" />
        </defs>
        {/* Rings closing in on the core: the pull */}
        {[0, 1, 2].map((k) => (
          <circle key={k} cx="200" cy="248" r="62" className="pe-ring" style={{ animationDelay: `${k * 1.2}s` }} />
        ))}
        {routes.map((r) => (
          <g key={r.k}>
            <path d={r.d} className="pe-route" />
            {[0, 1, 2].map((m) => (
              <g key={m} className={`pe-p pe-p-${r.k}`}>
                <use href={`#pe-${r.k}`} />
                <animateMotion path={r.d} dur="2.1s" begin={`${r.delay + m * 0.7}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.15;.8;1" dur="2.1s" begin={`${r.delay + m * 0.7}s`} repeatCount="indefinite" />
              </g>
            ))}
          </g>
        ))}
        <circle cx="200" cy="248" r="56" fill="url(#pe-core)" className="pe-core" />
        <text x="200" y="242" textAnchor="middle" className="pe-core-t">
          Your
        </text>
        <text x="200" y="262" textAnchor="middle" className="pe-core-t">
          business
        </text>
      </svg>

      {/* Content: a reel that keeps collecting hearts */}
      <div className="pe-card pe-content">
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
      <div className="pe-card pe-community">
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
      <div className="pe-card pe-collab">
        <p className="pe-k">Collaborations</p>
        <div className="pe-meet" aria-hidden="true">
          <span className="pe-you">You</span>
          <span className="pe-x">×</span>
          <span className="pe-them">Partner</span>
        </div>
      </div>

      <p className="pe-count" aria-hidden="true">
        <span key={n} className="pe-pop">+1</span> {["enquiry", "follower", "partner", "referral"][n % 4]}
      </p>
    </div>
  );
}
