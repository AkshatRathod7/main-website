"use client";

/**
 * The two moving parts of the home About chapter (components/home/about.tsx).
 *   Reasons   the four reasons; one at a time is "being read": its line fills and its mark replays.
 *   TeamLine  three seats filled by DreamSVin, then the specialists on call, one name at a time.
 * Both render their finished state on the server; motion starts once they are on screen and stops when
 * they leave. Under reduced motion nothing cycles: every mark sits finished and the list reads as a list.
 */
import { useEffect, useRef, useState } from "react";
import { Reveal, useMedia } from "@/components/brand/motion";

const CYCLE = 3600;

/** On screen or not, plus a primed entrance ("wait" → "go") for parts that start below the fold. */
function usePlay<T extends HTMLElement>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [state, setState] = useState<"wait" | "go" | undefined>(undefined);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setOn(true);
      return;
    }
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!calm && el.getBoundingClientRect().top > window.innerHeight * 0.9) setState("wait");
    const io = new IntersectionObserver(
      ([e]) => {
        const visible = !!e?.isIntersecting;
        setOn(visible);
        if (visible) setState((s) => (s === "wait" ? "go" : s));
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, state, on] as const;
}

const svg = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "url(#dsv-grad)",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
  className: "ab-g",
};
const k = (n: number) => ({ ["--k" as string]: n });

/** One small mark per reason, in the brand's line-icon language (coral to gold stroke, one coral dot). */
function Mark({ i }: { i: number }) {
  // 01 Strategy and execution together: two rings slide into one, and lock.
  if (i === 0)
    return (
      <svg {...svg}>
        <circle className="g-join-a" cx="18" cy="24" r="11" />
        <circle className="g-join-b" cx="30" cy="24" r="11" />
        <circle className="g-solid g-pop" cx="24" cy="24" r="2.6" />
      </svg>
    );
  // 02 The right expertise for the right problem: of three on the bench, the right one goes in.
  if (i === 1)
    return (
      <svg {...svg}>
        <circle cx="14" cy="24" r="9.5" />
        <circle cx="38" cy="11" r="3" />
        <circle className="g-faint" cx="38" cy="24" r="3" strokeDasharray="1.5 3" />
        <circle cx="38" cy="37" r="3" />
        <circle className="g-solid g-pick" cx="14" cy="24" r="3.6" />
      </svg>
    );
  // 03 Plain talk, clear milestones: a line that runs, and three milestones met in order.
  if (i === 2)
    return (
      <svg {...svg}>
        {/* rects, not a flat path: a bounding-box gradient cannot paint a zero-height line */}
        <rect className="g-grad g-faint" x="4" y="23" width="40" height="2" rx="1" />
        <rect className="g-grad g-run" x="4" y="23" width="40" height="2" rx="1" />
        {[11, 24, 37].map((x, n) => (
          <circle key={x} className="g-grad g-step" style={k(n)} cx={x} cy="24" r="4" />
        ))}
      </svg>
    );
  // 04 Built here, aimed globally: one point, reaching out.
  return (
    <svg {...svg}>
      <path className="g-arc" style={k(0)} d="M12.9 26.2A11 11 0 0 1 21.8 35.1" />
      <path className="g-arc" style={k(1)} d="M14.5 17.3A20 20 0 0 1 30.7 33.5" />
      <path className="g-arc" style={k(2)} d="M16 8.4A29 29 0 0 1 39.6 32" />
      <circle className="g-solid" cx="11" cy="37" r="3.2" />
    </svg>
  );
}

export function Reasons({ points }: { points: readonly { k: string; v: string }[] }) {
  const [ref, , on] = usePlay<HTMLDivElement>(0.3);
  const calm = useMedia("(prefers-reduced-motion: reduce)");
  const [active, setActive] = useState(0);
  const [hold, setHold] = useState(false);
  const live = on && !calm;

  useEffect(() => {
    if (!live || hold) return;
    const t = window.setInterval(() => setActive((n) => (n + 1) % points.length), CYCLE);
    return () => window.clearInterval(t);
  }, [live, hold, points.length]);

  return (
    <div ref={ref}>
      <Reveal as="ul" className="ab-why" data-live={live || undefined} data-hold={hold || undefined} style={{ ["--ab-cycle" as string]: `${CYCLE}ms` }}>
        {points.map((p, i) => (
          <li
            key={p.k}
            className="rv ab-reason"
            data-on={i === active || undefined}
            style={{ ["--i" as string]: i }}
            onPointerEnter={(e) => {
              if (e.pointerType !== "mouse") return;
              setActive(i);
              setHold(true);
            }}
            onPointerLeave={() => setHold(false)}
          >
            <span className="ab-bar" aria-hidden="true">
              <span />
            </span>
            <Mark i={i} />
            <div>
              <h3 className="ab-k">{p.k}</h3>
              <p className="ab-v">{p.v}</p>
            </div>
          </li>
        ))}
      </Reveal>
    </div>
  );
}

export function TeamLine({
  kicker,
  title,
  roles,
  onCall,
}: {
  kicker: string;
  title: string;
  roles: readonly { role: string; like: string }[];
  onCall: readonly string[];
}) {
  const [ref, state, on] = usePlay<HTMLDivElement>(0.4);
  const calm = useMedia("(prefers-reduced-motion: reduce)");
  const [n, setN] = useState(0);
  const live = on && !calm;

  useEffect(() => {
    if (!live) return;
    const t = window.setInterval(() => setN((v) => (v + 1) % onCall.length), 1900);
    return () => window.clearInterval(t);
  }, [live, onCall.length]);

  const list = onCall.map((s) => s.toLowerCase());
  const spoken = `${list.slice(0, -1).join(", ")} and ${list[list.length - 1]}`;

  return (
    <div ref={ref} className="ab-team" data-play={state}>
      <h3 className="ab-team-h">
        <small>{kicker}</small>
        {title}
      </h3>
      <ol className="ab-track">
        {roles.map((r, i) => (
          <li key={r.role} className="ab-stop" style={k(i)}>
            <span className="ab-node" aria-hidden="true">
              <i />
            </span>
            <span className="ab-stop-k">{r.role}</span>
            <span className="ab-stop-v">{r.like}</span>
          </li>
        ))}
        <li className="ab-stop" data-call="" style={k(roles.length)}>
          <span className="ab-node" aria-hidden="true">
            <i />
          </span>
          <span className="ab-stop-k">Specialists</span>
          <span className="ab-stop-v">
            <span className="sr-only">On call: {spoken}</span>
            <span aria-hidden="true">
              On call{calm ? " when needed" : ": "}
              {!calm && (
                <span className="ab-cycle">
                  {list.map((s, i) => (
                    <span key={s} data-on={i === n || undefined}>
                      {s}
                    </span>
                  ))}
                </span>
              )}
            </span>
          </span>
        </li>
      </ol>
    </div>
  );
}
