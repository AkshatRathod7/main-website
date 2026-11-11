"use client";

import { useEffect, useRef } from "react";
import { pillarById, questionsFor, type Question } from "@/lib/health-check/questions";
import type { AnswerValue } from "@/lib/health-check/scoring";

export function QuestionStep({
  question,
  value,
  dir,
  onSelect,
  focusOnMount,
}: {
  question: Question;
  value: AnswerValue | undefined;
  dir: "fwd" | "back";
  onSelect: (v: AnswerValue) => void;
  focusOnMount: boolean;
}) {
  const pillar = pillarById(question.pillar);
  const inPillar = questionsFor(question.pillar);
  const pos = inPillar.findIndex((q) => q.id === question.id);
  const firstOfPillar = pos === 0;
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  // Keep keyboard users in the answers: focus the chosen (or first) option on arrival.
  useEffect(() => {
    if (!focusOnMount) return;
    const target = refs.current[value ?? 0];
    target?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const move = (to: number) => {
      e.preventDefault();
      const n = (to + 4) % 4;
      refs.current[n]?.focus();
    };
    if (e.key === "ArrowDown") move(i + 1);
    else if (e.key === "ArrowUp") move(i - 1);
    else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      onSelect(i as AnswerValue);
    }
  };

  return (
    <section className="hc-enter grid gap-x-8 gap-y-10 lg:grid-cols-12" data-dir={dir} aria-labelledby={`q-${question.id}`}>
      <div className="lg:col-span-5">
        <p className="hc-label text-muted">
          <span className="text-accent-text">Pillar {String(pillar.index).padStart(2, "0")}</span>
          <span className="text-faint"> · </span>
          {pillar.name}
        </p>
        {firstOfPillar && (
          <p className="mt-3 max-w-[38ch] text-body-sm leading-relaxed text-muted">{pillar.promise}</p>
        )}
        <h2
          id={`q-${question.id}`}
          className="hc-display hc-sharpen mt-6 text-display-md text-ivory"
        >
          {question.prompt}
        </h2>
        <p className="hc-label mt-6 text-faint">
          Question {pos + 1} of {inPillar.length}
        </p>
      </div>

      <div
        role="radiogroup"
        aria-labelledby={`q-${question.id}`}
        className="hc-stagger lg:col-span-6 lg:col-start-7 lg:self-end"
      >
        {question.options.map((opt, i) => {
          const checked = value === i;
          const tabbable = value === undefined ? i === 0 : checked;
          return (
            <button
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={tabbable ? 0 : -1}
              onClick={() => onSelect(i as AnswerValue)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`hc-option group relative flex min-h-[64px] w-full items-center gap-5 border-t border-hairline px-1 py-5 text-left last:border-b sm:px-3 ${
                checked ? "text-ivory" : "text-ivory/80 hover:bg-surface-1 hover:text-ivory"
              }`}
            >
              <span
                aria-hidden
                className="hc-key grid h-8 w-8 shrink-0 place-items-center rounded-[4px] border border-hairline-strong font-mono text-caption text-muted group-hover:border-faint group-hover:text-ivory"
              >
                {i + 1}
              </span>
              <span className="min-w-0 text-body leading-snug sm:text-body-lg">{opt}</span>
              <span aria-hidden className="hc-rule pointer-events-none absolute inset-x-0 -bottom-px h-px bg-accent" />
            </button>
          );
        })}
      </div>
    </section>
  );
}
