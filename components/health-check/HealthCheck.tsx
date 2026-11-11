"use client";

/**
 * /health-check — the diagnostic instrument.
 *
 * Stages: intro → questions (14, one per screen) → lead → results.
 * State is saved locally after every change; scoring runs client-side for an
 * instant reading and again on the server, which is authoritative.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PILLAR_LAST_INDEX, PILLARS, QUESTIONS, TOTAL_QUESTIONS, type PillarId } from "@/lib/health-check/questions";
import { scoreHealthCheck, type AnswerValue, type Answers, type HealthResult } from "@/lib/health-check/scoring";
import type { Lead, LeadInput } from "@/lib/health-check/schema";
import { clearState, loadState, saveState, type Stage } from "@/lib/health-check/storage";
import { HC_EVENTS, track } from "@/lib/health-check/analytics";
import { submitHealthCheck, type SubmitInput } from "@/lib/health-check/submit";
import { Intro, type ResumeInfo } from "./Intro";
import { Progress } from "./Progress";
import { QuestionStep } from "./QuestionStep";
import { LeadForm } from "./LeadForm";
import { Results, type DeliveryState } from "./Results";
import { Arrow, Button, Kbd } from "./ui";
import { usePrefersReducedMotion } from "./hooks";
import { Wordmark } from "@/components/site/nav";

const ADVANCE_MS = 380; // pause after choosing, so the choice registers before the screen moves
const LEAVE_MS = 160;

const countAnswered = (a: Answers) => QUESTIONS.filter((q) => a[q.id] !== undefined).length;

function utmFromUrl() {
  if (typeof window === "undefined") return undefined;
  const p = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
    const v = p.get(k);
    if (v) utm[k] = v.slice(0, 200);
  }
  return Object.keys(utm).length ? utm : undefined;
}

/** Start somewhere other than the intro. For previews, QA and Storybook only. */
export type HealthCheckSeed = {
  stage: Stage;
  index?: number;
  answers?: Answers;
  lead?: Partial<LeadInput>;
};

export function HealthCheck({ seed }: { seed?: HealthCheckSeed } = {}) {
  const reduced = usePrefersReducedMotion();

  const [stage, setStage] = useState<Stage>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [lead, setLead] = useState<Partial<LeadInput>>({});
  const [startedAt, setStartedAt] = useState<string | undefined>();
  const [completedAt, setCompletedAt] = useState<string | undefined>();
  const [resume, setResume] = useState<ResumeInfo>(null);

  const [dir, setDir] = useState<"fwd" | "back">("fwd");
  const [leaving, setLeaving] = useState(false);
  const [recorded, setRecorded] = useState<PillarId | null>(null);
  const [keyboardNav, setKeyboardNav] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [result, setResult] = useState<HealthResult | null>(null);
  const [delivery, setDelivery] = useState<DeliveryState>(null);

  const advanceTimer = useRef<number | undefined>(undefined);
  const recordedTimer = useRef<number | undefined>(undefined);
  const firedPillars = useRef(new Set<PillarId>());
  const pendingSubmit = useRef<SubmitInput | null>(null);
  const hydrated = useRef(false);
  const topRef = useRef<HTMLDivElement>(null);

  /* ── Restore ─────────────────────────────────────────────────────── */
  useEffect(() => {
    if (seed) {
      const a = seed.answers ?? {};
      const l = seed.lead ?? {};
      setAnswers(a);
      setLead(l);
      setIndex(seed.index ?? 0);
      setStartedAt(new Date().toISOString());
      if (seed.stage === "results") {
        setCompletedAt(new Date().toISOString());
        setResult(scoreHealthCheck(a, { teamSize: l.teamSize, locations: l.locations }));
        setDelivery("sent");
      }
      setStage(seed.stage);
      hydrated.current = true;
      return;
    }
    const s = loadState();
    // Home §7 hands over question 1 as ?q1=0–3. Apply it unless there is saved progress to resume.
    const q1 = new URLSearchParams(window.location.search).get("q1");
    const q1Value = q1 !== null && /^[0-3]$/.test(q1) ? (Number(q1) as AnswerValue) : null;
    if (q1Value !== null) {
      const url = new URL(window.location.href);
      url.searchParams.delete("q1");
      window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    }
    if (q1Value !== null && (!s || countAnswered(s.answers ?? {}) === 0)) {
      setAnswers({ [QUESTIONS[0].id]: q1Value });
      setLead(s?.lead ?? {});
      setStartedAt(new Date().toISOString());
      setIndex(1);
      setStage("questions");
      track(HC_EVENTS.start, { resumed: false, from: "home" });
      hydrated.current = true;
      return;
    }
    if (s) {
      setAnswers(s.answers ?? {});
      setLead(s.lead ?? {});
      setIndex(Math.min(s.index ?? 0, TOTAL_QUESTIONS - 1));
      setStartedAt(s.startedAt);
      setCompletedAt(s.completedAt);
      const answered = countAnswered(s.answers ?? {});
      if (s.stage === "results" || answered > 0) {
        setResume({ answered, stage: s.stage === "intro" ? "questions" : (s.stage as "questions" | "lead" | "results") });
      }
    }
    hydrated.current = true;
  }, []);

  /* ── Persist ─────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!hydrated.current) return;
    if (stage === "intro" && countAnswered(answers) === 0) return; // nothing worth saving yet
    saveState({ stage, index, answers, lead, startedAt, completedAt });
  }, [stage, index, answers, lead, startedAt, completedAt]);

  /* ── Navigation ──────────────────────────────────────────────────── */
  const scrollTop = () => {
    const el = topRef.current;
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  };

  const transition = useCallback(
    (d: "fwd" | "back", apply: () => void) => {
      window.clearTimeout(advanceTimer.current);
      setDir(d);
      if (reduced) {
        apply();
        scrollTop();
        return;
      }
      setLeaving(true);
      window.setTimeout(() => {
        apply();
        setLeaving(false);
        scrollTop();
      }, LEAVE_MS);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reduced],
  );

  const start = () => {
    clearState();
    firedPillars.current.clear();
    setAnswers({});
    setLead((l) => ({ ...l, consent: undefined }));
    setResult(null);
    setDelivery(null);
    setCompletedAt(undefined);
    setStartedAt(new Date().toISOString());
    setResume(null);
    track(HC_EVENTS.start, { resumed: false });
    transition("fwd", () => {
      setIndex(0);
      setStage("questions");
    });
  };

  const resumeSaved = () => {
    if (!resume) return start();
    track(HC_EVENTS.start, { resumed: true, answered: resume.answered });
    if (resume.stage === "results") {
      setResult(scoreHealthCheck(answers, { teamSize: lead.teamSize, locations: lead.locations }));
      setDelivery(null);
      transition("fwd", () => setStage("results"));
      return;
    }
    if (resume.stage === "lead" && countAnswered(answers) === TOTAL_QUESTIONS) {
      transition("fwd", () => setStage("lead"));
      return;
    }
    const firstOpen = QUESTIONS.findIndex((q) => answers[q.id] === undefined);
    transition("fwd", () => {
      setIndex(firstOpen === -1 ? TOTAL_QUESTIONS - 1 : firstOpen);
      setStage("questions");
    });
  };

  const goNext = () => {
    if (answers[QUESTIONS[index].id] === undefined) return;
    if (index < TOTAL_QUESTIONS - 1) transition("fwd", () => setIndex(index + 1));
    else transition("fwd", () => setStage("lead"));
  };

  const goBack = () => {
    if (stage === "lead") return transition("back", () => { setIndex(TOTAL_QUESTIONS - 1); setStage("questions"); });
    if (index === 0) return transition("back", () => setStage("intro"));
    transition("back", () => setIndex(index - 1));
  };

  const select = (v: AnswerValue) => {
    const q = QUESTIONS[index];
    const next = { ...answers, [q.id]: v };
    setAnswers(next);

    // Pillar complete: fire once per pillar per run, on its last question.
    const pillarDone = QUESTIONS.filter((x) => x.pillar === q.pillar).every((x) => next[x.id] !== undefined);
    if (index === PILLAR_LAST_INDEX[q.pillar] && pillarDone && !firedPillars.current.has(q.pillar)) {
      firedPillars.current.add(q.pillar);
      const p = scoreHealthCheck(next).pillars.find((x) => x.id === q.pillar)!;
      track(HC_EVENTS.pillarComplete, {
        pillar: q.pillar,
        pillar_index: PILLARS.findIndex((x) => x.id === q.pillar) + 1,
        score: p.score,
      });
      window.clearTimeout(recordedTimer.current);
      setRecorded(q.pillar);
      recordedTimer.current = window.setTimeout(() => setRecorded(null), 1800);
    }

    window.clearTimeout(advanceTimer.current);
    advanceTimer.current = window.setTimeout(() => {
      if (index < TOTAL_QUESTIONS - 1) transition("fwd", () => setIndex(index + 1));
      else {
        setCompletedAt(new Date().toISOString());
        transition("fwd", () => setStage("lead"));
      }
    }, ADVANCE_MS);
  };

  /* ── Keyboard ────────────────────────────────────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement;
      const typing = t.closest("input, textarea, select, [contenteditable='true']");
      const onControl = t.closest("button, a");
      if (typing) return;

      if (stage === "intro" && e.key === "Enter" && !onControl) {
        e.preventDefault();
        resume ? resumeSaved() : start();
      }
      if (stage !== "questions" || leaving) return;
      setKeyboardNav(true);
      if (/^[1-4]$/.test(e.key)) {
        e.preventDefault();
        select((Number(e.key) - 1) as AnswerValue);
      } else if ((e.key === "ArrowRight" || (e.key === "Enter" && !onControl))) {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft" || e.key === "Backspace") {
        e.preventDefault();
        goBack();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => () => {
    window.clearTimeout(advanceTimer.current);
    window.clearTimeout(recordedTimer.current);
  }, []);

  /* ── Submit ──────────────────────────────────────────────────────── */
  const send = async (input: SubmitInput, local: HealthResult) => {
    setDelivery("pending");
    const res = await submitHealthCheck(input);
    if (res.ok) {
      pendingSubmit.current = null;
      setResult(res.result);
      setDelivery(res.email);
      track(HC_EVENTS.leadCaptured, {
        tier: res.result.tier.id,
        score: res.result.overall,
        team_size: input.lead.teamSize,
        locations: input.lead.locations,
        role: input.lead.role,
      });
      return { ok: true as const };
    }
    if (res.retryable) {
      // Show the reading anyway; keep the submission so the owner can retry.
      pendingSubmit.current = input;
      setResult(local);
      setDelivery("failed");
      return { ok: true as const };
    }
    setDelivery(null);
    return { ok: false as const, error: res.error };
  };

  const submitLead = async (l: Lead, website: string) => {
    setSubmitting(true);
    setServerError(null);
    const done = completedAt ?? new Date().toISOString();
    setCompletedAt(done);
    const input: SubmitInput = {
      answers,
      lead: l,
      website,
      meta: { startedAt, completedAt: done, referrer: document.referrer.slice(0, 500) || undefined, utm: utmFromUrl() },
    };
    const local = scoreHealthCheck(answers, { teamSize: l.teamSize, locations: l.locations });
    const out = await send(input, local);
    setSubmitting(false);
    if (!out.ok) {
      setServerError(out.error);
      return;
    }
    transition("fwd", () => setStage("results"));
  };

  const retry = async () => {
    if (!pendingSubmit.current || !result) return;
    await send(pendingSubmit.current, result);
  };

  /* ── Render ──────────────────────────────────────────────────────── */
  const q = QUESTIONS[index];
  const answered = useMemo(() => countAnswered(answers), [answers]);
  const progressLabel = stage === "lead" ? "Your details" : undefined;

  return (
    <div ref={topRef} className="hc-root flex min-h-[100svh] flex-col">
      <header className="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-6 px-5 pt-6 sm:px-8 lg:px-12">
        <a href="/" aria-label="DreamSVin home" className="inline-flex min-h-11 items-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
          <Wordmark height={16} />
        </a>
        <div className="flex items-center gap-5">
          <span className="hc-label hidden text-faint sm:inline">Health Check</span>
          {(stage === "questions" || stage === "lead") && (
            <a href="/" className="text-body-sm text-muted transition-colors hover:text-ivory">
              Save and exit
            </a>
          )}
        </div>
      </header>

      {(stage === "questions" || stage === "lead") && (
        <div className="mx-auto mt-8 w-full max-w-[1240px] px-5 sm:px-8 lg:px-12">
          <Progress index={stage === "questions" ? index : null} answers={answers} recorded={recorded} label={progressLabel} />
        </div>
      )}

      <main
        className={`mx-auto flex w-full max-w-[1240px] flex-1 flex-col px-5 sm:px-8 lg:px-12 ${
          stage === "results" ? "pb-24 pt-16 sm:pt-24" : "pb-16 pt-12 sm:pt-[clamp(4rem,11vh,8rem)]" /* top-aligned: the prompt holds its position from screen to screen */
        }`}
      >
        <div className={leaving ? "hc-leaving" : undefined} data-dir={dir}>
          {stage === "intro" && <Intro resume={resume} onStart={start} onResume={resumeSaved} />}

          {stage === "questions" && (
            <QuestionStep
              key={q.id}
              question={q}
              value={answers[q.id]}
              dir={dir}
              onSelect={select}
              focusOnMount={keyboardNav}
            />
          )}

          {stage === "lead" && (
            <LeadForm
              initial={lead}
              onChange={setLead}
              onSubmit={submitLead}
              onBack={goBack}
              submitting={submitting}
              serverError={serverError}
            />
          )}

          {stage === "results" && result && (
            <Results
              result={result}
              lead={lead as Partial<Lead>}
              delivery={delivery}
              onRetry={retry}
              onRetake={start}
              completedAt={completedAt}
            />
          )}
        </div>
      </main>

      {stage === "questions" && (
        <nav
          aria-label="Question navigation"
          className="sticky bottom-0 z-10 mx-auto flex w-full max-w-[1240px] items-center justify-between gap-4 border-t border-hairline bg-canvas px-5 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:static sm:px-8 sm:py-5 lg:px-12"
        >
          <Button variant="ghost" onClick={goBack} className="-ml-3">
            <Arrow dir="left" /> Back
          </Button>
          <p className="hidden items-center gap-2 text-caption text-faint md:flex">
            <Kbd>1</Kbd>–<Kbd>4</Kbd> to answer <span className="mx-2 text-hairline-strong">|</span>
            <Kbd>←</Kbd> <Kbd>→</Kbd> to move <span className="mx-2 text-hairline-strong">|</span> Saved on this device
          </p>
          <Button variant="secondary" onClick={goNext} disabled={answers[q.id] === undefined}>
            {index === TOTAL_QUESTIONS - 1 ? "Finish" : "Continue"} <Arrow />
          </Button>
        </nav>
      )}

      <p className="sr-only" aria-live="polite">
        {stage === "questions" ? `Question ${index + 1} of ${TOTAL_QUESTIONS}. ${answered} answered.` : ""}
      </p>
    </div>
  );
}
