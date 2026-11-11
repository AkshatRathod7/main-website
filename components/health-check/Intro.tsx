"use client";

import { PILLARS, questionsFor, TOTAL_QUESTIONS } from "@/lib/health-check/questions";
import { ScoreDial } from "./ScoreDial";
import { Arrow, Button, Kbd } from "./ui";

export type ResumeInfo = { answered: number; stage: "questions" | "lead" | "results" } | null;

export function Intro({
  resume,
  onStart,
  onResume,
}: {
  resume: ResumeInfo;
  onStart: () => void;
  onResume: () => void;
}) {
  return (
    <section className="grid items-center gap-x-8 gap-y-16 lg:grid-cols-12" aria-labelledby="hc-title">
      <div className="lg:col-span-7">
        <p className="hc-enter text-body font-semibold tracking-[-0.01em] text-accent-text">
          Business Health Check: {TOTAL_QUESTIONS} questions, about 3 minutes
        </p>

        <h1
          id="hc-title"
          className="hc-display hc-sharpen mt-8 text-display-lg text-ivory"
        >
          What&apos;s holding your <span className="hc-serif text-[1.06em]">business back?</span>
        </h1>

        <p className="hc-enter mt-8 max-w-[52ch] text-body text-muted [animation-delay:120ms] sm:text-body-lg">
          Fourteen questions across foundation, growth, execution and scale. Answer for how things are
          today, not how they should be. You get a score, your stage, and the first three moves we would make.
        </p>

        <div className="hc-enter mt-10 flex flex-wrap items-center gap-3 [animation-delay:200ms]">
          {resume && resume.stage !== "results" ? (
            <>
              <Button onClick={onResume}>
                {resume.stage === "lead" ? "Continue to your result" : `Resume at question ${Math.min(resume.answered + 1, TOTAL_QUESTIONS)}`}
                <Arrow />
              </Button>
              <Button variant="secondary" onClick={onStart}>
                Start again
              </Button>
            </>
          ) : resume?.stage === "results" ? (
            <>
              <Button onClick={onResume}>
                View your last result <Arrow />
              </Button>
              <Button variant="secondary" onClick={onStart}>
                Take it again
              </Button>
            </>
          ) : (
            <Button onClick={onStart}>
              Begin the check <Arrow />
            </Button>
          )}
          <span className="hidden items-center gap-2 pl-2 text-caption text-faint sm:inline-flex">
            or press <Kbd>Enter ↵</Kbd>
          </span>
        </div>
        <p className="hc-enter mt-4 text-caption text-faint [animation-delay:240ms]">
          Progress saves on this device. Nothing is sent until you ask for your report.
        </p>

        <ol className="hc-stagger mt-16 border-t border-hairline">
          {PILLARS.map((p) => (
            <li key={p.id} className="grid grid-cols-[3rem_1fr_auto] items-baseline gap-4 border-b border-hairline py-4">
              <span className="hc-label text-faint">{String(p.index).padStart(2, "0")}</span>
              <span className="min-w-0">
                <span className="text-body text-ivory">{p.name}</span>
                <span className="mt-1 block text-body-sm leading-snug text-muted">{p.promise}</span>
              </span>
              <span className="hc-label text-faint">{questionsFor(p.id).length} Q</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="hc-enter mx-auto w-full max-w-[340px] [animation-delay:160ms] lg:col-span-5 lg:max-w-none">
        <ScoreDial calibrate caption="Four pillars · one score · 0 to 100" />
      </div>
    </section>
  );
}
