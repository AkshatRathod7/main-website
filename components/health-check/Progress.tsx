"use client";

import { PILLARS, QUESTIONS, TOTAL_QUESTIONS, type PillarId } from "@/lib/health-check/questions";
import type { Answers } from "@/lib/health-check/scoring";

/**
 * Fourteen segments in four pillar groups, each group named underneath (sm+).
 * Answered = ivory, current = accent. When a pillar completes, its group
 * pulses once and the readout confirms it.
 */
export function Progress({
  index,
  answers,
  recorded,
  label,
}: {
  index: number | null; // null when not on a question
  answers: Answers;
  recorded: PillarId | null;
  label?: string;
}) {
  const answered = QUESTIONS.filter((q) => answers[q.id] !== undefined).length;
  const position = index === null ? answered : index + 1;
  const currentPillar = index === null ? null : QUESTIONS[index].pillar;

  return (
    <div className="w-full">
      <div className="flex min-h-4 items-baseline justify-between gap-4">
        <p className="hc-label min-w-0 truncate text-muted" aria-live="polite">
          {recorded ? (
            <span key={recorded} className="hc-enter inline-block text-accent-text">
              {PILLARS.find((p) => p.id === recorded)!.name} · recorded
            </span>
          ) : (
            label && <span>{label}</span>
          )}
        </p>
        <p className="hc-label shrink-0 text-muted">
          <span className="text-ivory">{String(position).padStart(2, "0")}</span>
          <span className="text-faint"> / {TOTAL_QUESTIONS}</span>
        </p>
      </div>

      <div
        className="mt-3 flex gap-3 sm:gap-5"
        role="progressbar"
        aria-label="Health Check progress"
        aria-valuemin={0}
        aria-valuemax={TOTAL_QUESTIONS}
        aria-valuenow={answered}
        aria-valuetext={`${answered} of ${TOTAL_QUESTIONS} answered`}
      >
        {PILLARS.map((p) => {
          const qs = QUESTIONS.map((q, i) => ({ q, i })).filter(({ q }) => q.pillar === p.id);
          const groupDone = qs.every(({ q }) => answers[q.id] !== undefined);
          const isCurrent = currentPillar === p.id;
          return (
            <div key={p.id} className="min-w-0" style={{ flex: qs.length }}>
              <div className={`flex gap-1 ${recorded === p.id ? "hc-group-done" : ""}`}>
                {qs.map(({ q, i }) => {
                  const current = index === i;
                  const done = answers[q.id] !== undefined;
                  return (
                    <span
                      key={q.id}
                      className={`hc-seg block h-[2px] flex-1 ${
                        current ? "bg-accent" : done ? "bg-ivory/70" : "bg-hairline-strong"
                      }`}
                    />
                  );
                })}
              </div>
              <p
                aria-hidden
                className={`hc-label mt-3 hidden truncate text-[10.5px] sm:block ${
                  isCurrent ? "text-ivory" : groupDone ? "text-muted" : "text-faint"
                }`}
              >
                {p.short}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
