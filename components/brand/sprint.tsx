"use client";

/**
 * The 90-day Growth Sprint, as a pinned scroll story.
 *
 * Desktop (≥1024 × ≥640, motion allowed): CSS-sticky pin. Scrolling drives a day counter 001 → 090,
 * a 90-cell calendar that fills phase by phase, and four phase panels that crossfade.
 * Everything else (phones, short screens, reduced motion): a vertical stepper whose rail fills as you read.
 * One DOM for both modes, so all four phases are always in the accessibility tree.
 * Mechanics carried from Stage 10's 90-day arc: one rAF-throttled passive listener, direct DOM writes
 * for per-frame values, React state only when the active phase changes.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { SPRINT } from "@/content/site";

const DESK = "(min-width: 1024px) and (min-height: 640px)";
const REDUCE = "(prefers-reduced-motion: reduce)";
const DAYS = Array.from({ length: 90 }, (_, i) => i + 1);
const phaseOf = (day: number) => SPRINT.findIndex((p) => day >= p.from && day <= p.to);

export function Sprint({ title, intro, id = "sprint-h" }: { title: React.ReactNode; intro: string; id?: string }) {
  const rootRef = useRef<HTMLElement>(null);
  const dayRef = useRef<HTMLSpanElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const [pinned, setPinned] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const desk = window.matchMedia(DESK);
    const reduce = window.matchMedia(REDUCE);
    const set = () => setPinned(desk.matches);
    set();
    desk.addEventListener("change", set);
    reduce.addEventListener("change", set);
    return () => {
      desk.removeEventListener("change", set);
      reduce.removeEventListener("change", set);
    };
  }, []);

  const range = useCallback(() => {
    const el = rootRef.current!;
    return { top: el.getBoundingClientRect().top + window.scrollY, len: el.offsetHeight - window.innerHeight };
  }, []);

  useEffect(() => {
    let raf = 0;
    let lastDay = -1;
    const update = () => {
      raf = 0;
      const root = rootRef.current;
      if (!root) return;
      if (pinned) {
        const { top, len } = range();
        const p = Math.min(1, Math.max(0, (window.scrollY - top) / Math.max(1, len)));
        // Hold day 90 for the last 12% so the final phase can be read.
        const day = Math.max(1, Math.min(90, Math.round((p / 0.88) * 90)));
        if (day !== lastDay) {
          lastDay = day;
          if (dayRef.current) dayRef.current.textContent = String(day).padStart(3, "0");
          gridRef.current?.style.setProperty("--day", String(day));
          root.style.setProperty("--sp", (day / 90).toFixed(4));
          setActive(phaseOf(day));
        }
      } else {
        const list = listRef.current;
        if (!list) return;
        const r = list.getBoundingClientRect();
        const line = window.innerHeight * 0.6;
        list.style.setProperty("--rail", Math.min(1, Math.max(0, (line - r.top) / r.height)).toFixed(4));
        let a = 0;
        Array.from(list.children).forEach((li, k) => {
          if (li.getBoundingClientRect().top < line) a = k;
        });
        if (a !== lastDay) {
          lastDay = a;
          setActive(a);
        }
      }
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
  }, [pinned, range]);

  const goTo = (i: number) => {
    if (!pinned) {
      (listRef.current?.children[i] as HTMLElement | undefined)?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }
    const { top, len } = range();
    const day = SPRINT[i].from + 1;
    window.scrollTo({ top: top + len * ((day / 90) * 0.88), behavior: "smooth" });
  };

  return (
    <section ref={rootRef} aria-labelledby={id} className={cn("sprint", pinned && "is-pinned")} data-tone="ink" data-phase={active}>
      <div className="sprint-pin">
        <div className="sprint-bgword" aria-hidden="true">
          <span key={active} data-word={SPRINT[active]?.title} />
        </div>
        <div className="container-ds grid w-full grid-cols-4 gap-x-6 gap-y-12 lg:grid-cols-12">
          {/* Left: the clock */}
          <div className="col-span-4 flex flex-col lg:col-span-5">
            {!String(title).startsWith("The 90-day Growth Sprint") && (
              <p className="mb-5 text-body font-semibold tracking-[-0.01em] text-accent-text">The 90-day Growth Sprint</p>
            )}
            <h2 id={id} className=" text-display-md text-fg">
              {title}
            </h2>
            <p className="mt-5 max-w-[42ch] text-body-lg text-fg-muted">{intro}</p>

            <div className="sprint-clock mt-10 hidden lg:block" aria-hidden="true">
              <div className="flex items-baseline gap-3">
                <span className="label-mono text-fg-subtle">Day</span>
                <span ref={dayRef} className="sprint-day numeric">
                  001
                </span>
                <span className="numeric text-heading-sm font-display text-fg-subtle">/ 090</span>
              </div>
              <div ref={gridRef} className="sprint-grid mt-6" style={{ ["--day" as string]: 1 }}>
                {DAYS.map((d) => (
                  <span key={d} data-ph={phaseOf(d)} style={{ ["--d" as string]: d }} />
                ))}
              </div>
            </div>

            <nav aria-label="Sprint phases" className="mt-8 hidden flex-wrap gap-2 lg:flex">
              {SPRINT.map((p, i) => (
                <button
                  key={p.title}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-current={pinned && i === active ? "step" : undefined}
                  className={cn(
                    "sprint-chip inline-flex h-11 items-center gap-2 rounded-full border px-4 text-body-sm transition-[background-color,border-color,color] duration-base ease-out",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                    pinned && i === active
                      ? "border-accent bg-accent text-on-accent"
                      : pinned && i < active
                        ? "border-line-strong text-fg"
                        : "border-line-strong text-fg-muted hover:border-fg-subtle hover:text-fg",
                  )}
                >
                  <span className="numeric text-caption">{p.n}</span>
                  {p.title}
                </button>
              ))}
            </nav>
          </div>

          {/* Right: the phases */}
          <div className="col-span-4 lg:col-span-6 lg:col-start-7">
            <ol ref={listRef} className="sprint-list">
              {SPRINT.map((p, i) => (
                <li
                  key={p.title}
                  className={cn("sprint-phase", pinned && i === active && "is-active", pinned && i < active && "is-past")}
                  aria-current={pinned && i === active ? "step" : undefined}
                >
                  <div className="sprint-card">
                    <div className="flex items-center justify-between gap-4">
                      <span className="label-mono text-accent-text">{p.days}</span>
                      <span className="sprint-num font-display numeric" aria-hidden="true">
                        {p.n}
                      </span>
                    </div>
                    <h3 className="mt-6 text-display-md text-fg">{p.title}</h3>
                    <p className="mt-4 max-w-[38ch] text-body-lg text-fg-muted">{p.short}</p>
                    <div className="mt-8">
                      <p className="label-mono text-fg-subtle">What you get</p>
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {p.items.map((it, k) => (
                          <li key={it} className="sprint-item" style={{ ["--k" as string]: k }}>
                            <span aria-hidden="true" className="size-1.5 rounded-full bg-highlight" />
                            {it}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="sprint-bar mt-8" aria-hidden="true">
                      <span style={{ left: `${((p.from - 1) / 90) * 100}%`, width: `${((p.to - p.from + 1) / 90) * 100}%` }} />
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
