/**
 * Health Check — scoring.
 *
 * Pure functions, shared by the client (instant results) and the API route
 * (authoritative re-score; the server never trusts client-sent scores).
 * The full method is written up in docs/health-check/SCORING.md.
 */
import {
  PILLARS,
  QUESTIONS,
  type Locations,
  type PillarId,
  type Question,
  type TeamSize,
} from "./questions";

export type AnswerValue = 0 | 1 | 2 | 3;
export type Answers = Partial<Record<string, AnswerValue>>;

export type TierId = "running-on-effort" | "building-momentum" | "growing" | "ready-to-scale";

export type Tier = {
  id: TierId;
  name: string; // reads as "<Company> is <name>." on the result
  min: number; // inclusive lower bound, 0–100
  summary: string;
};

/** Tier bands. Lower bound inclusive. Keep in sync with SCORING.md. */
export const TIERS: Tier[] = [
  {
    id: "running-on-effort",
    name: "Running on effort",
    min: 0,
    summary:
      "There is no shortage of effort. What is missing is a clear foundation and a plan, so the effort leaks. Start with the basics: who you serve, why they choose you, and the next 90 days.",
  },
  {
    id: "building-momentum",
    name: "Building momentum",
    min: 40,
    summary:
      "The basics are in place but uneven. Customers come in bursts, plans stall halfway, and too much still depends on you. A focused 90 days would show quickly.",
  },
  {
    id: "growing",
    name: "Growing",
    min: 60,
    summary:
      "A sound core and real momentum. A few gaps will widen as you push for more, so fix them before they start costing you.",
  },
  {
    id: "ready-to-scale",
    name: "Ready to scale",
    min: 80,
    summary:
      "A clear foundation, steady growth and a team that delivers. The next step is systems, alliances and new markets that let you expand without running everything yourself.",
  },
];

/** A pillar below this is "weak" and gets three recommendations. */
export const WEAK_THRESHOLD = 60;
export const RECS_PER_PILLAR = 3;
export const MAX_PER_QUESTION: AnswerValue = 3;

export type PillarResult = {
  id: PillarId;
  name: string;
  score: number; // 0–100, rounded
  raw: number; // points earned
  max: number; // points available
  tier: TierId;
  weak: boolean;
};

export type Recommendation = {
  questionId: string;
  title: string;
  body: string;
  answerScore: AnswerValue;
};

export type FocusPillar = PillarResult & {
  /** "weak" = below threshold. "edge" = no pillar is weak; this is the lowest. */
  reason: "weak" | "edge";
  recommendations: Recommendation[];
};

export type HealthResult = {
  version: 2; // 2 = re-voiced bank (Foundation · Growth · Execution · Scale), Nov 2026
  overall: number; // 0–100, rounded
  tier: Tier;
  pillars: PillarResult[];
  focus: FocusPillar[];
  sharpest: { questionId: string; prompt: string; answer: string; score: AnswerValue } | null;
  context: string | null;
  answered: number;
  complete: boolean;
};

export const tierFor = (score: number): Tier =>
  [...TIERS].reverse().find((t) => score >= t.min) ?? TIERS[0];

const pct = (raw: number, max: number) => (max === 0 ? 0 : (raw / max) * 100);

/** Score of one question, or undefined if unanswered. */
const valueOf = (answers: Answers, q: Question) => {
  const v = answers[q.id];
  return v === 0 || v === 1 || v === 2 || v === 3 ? v : undefined;
};

export function scorePillars(answers: Answers): PillarResult[] {
  return PILLARS.map((p) => {
    const qs = QUESTIONS.filter((q) => q.pillar === p.id);
    const raw = qs.reduce((sum, q) => sum + (valueOf(answers, q) ?? 0), 0);
    const max = qs.length * MAX_PER_QUESTION;
    const score = Math.round(pct(raw, max));
    return {
      id: p.id,
      name: p.name,
      score,
      raw,
      max,
      tier: tierFor(score).id,
      weak: score < WEAK_THRESHOLD,
    };
  });
}

/**
 * Overall = unweighted mean of the four pillar percentages (not of raw points),
 * so a 3-question pillar counts as much as a 4-question pillar.
 */
export function overallScore(pillars: PillarResult[]): number {
  const exact = pillars.map((p) => pct(p.raw, p.max));
  return Math.round(exact.reduce((a, b) => a + b, 0) / exact.length);
}

function recommendationsFor(answers: Answers, pillar: PillarId): Recommendation[] {
  return QUESTIONS.filter((q) => q.pillar === pillar)
    .map((q, order) => ({ q, order, v: valueOf(answers, q) ?? 0 }))
    .sort((a, b) => a.v - b.v || a.order - b.order) // weakest answer first, then question order
    .slice(0, RECS_PER_PILLAR)
    .map(({ q, v }) => ({
      questionId: q.id,
      title: q.recommendation.title,
      body: q.recommendation.body,
      answerScore: v as AnswerValue,
    }));
}

export function focusPillars(answers: Answers, pillars: PillarResult[]): FocusPillar[] {
  const weak = pillars.filter((p) => p.weak).sort((a, b) => a.score - b.score);
  if (weak.length > 0) {
    return weak.map((p) => ({ ...p, reason: "weak", recommendations: recommendationsFor(answers, p.id) }));
  }
  // Nothing below threshold: still give the owner the next three moves, on the lowest pillar.
  const lowest = [...pillars].sort((a, b) => a.score - b.score)[0];
  return [{ ...lowest, reason: "edge", recommendations: recommendationsFor(answers, lowest.id) }];
}

function sharpestSignal(answers: Answers): HealthResult["sharpest"] {
  let best: { q: Question; v: AnswerValue } | null = null;
  for (const q of QUESTIONS) {
    const v = valueOf(answers, q);
    if (v === undefined) continue;
    if (!best || v < best.v) best = { q, v };
  }
  if (!best || best.v >= 2) return null; // only call it out when it is a real constraint
  return {
    questionId: best.q.id,
    prompt: best.q.prompt,
    answer: best.q.options[best.v],
    score: best.v,
  };
}

/**
 * One calibrating sentence from team size and locations. This is why the form
 * asks for them; keep the copy factual and tied to the weakest pillar.
 */
export function contextNote(
  team: TeamSize | undefined,
  locations: Locations | undefined,
  weakest: PillarId | undefined,
): string | null {
  if (!team && !locations) return null;
  const multiSite = locations && locations !== "1";
  const large = team === "201–500" || team === "500+";
  const small = team === "1–10" || team === "11–50";

  if (multiSite && weakest === "foundation") {
    return `Across ${locations} locations, a fuzzy position multiplies: each one ends up telling its own story. Settle it once, centrally, and roll it out.`;
  }
  if (multiSite && weakest === "growth") {
    return `With ${locations} locations, a channel that works in one is a playbook for the rest. Find it, write it down, then repeat it.`;
  }
  if (multiSite && weakest === "execution") {
    return `With ${locations} locations, a plan only moves if each site lead owns a piece of it, with dates everyone can see.`;
  }
  if (multiSite && weakest === "scale") {
    return `With ${locations} locations, decisions have to sit with site leads by design. If they travel back to you, distance becomes delay.`;
  }
  if (large) {
    return `At ${team} people, informal coordination stops working. What you set now shapes how the next hundred hires work.`;
  }
  if (small) {
    return `At ${team} people, this is the cheapest moment to get the foundation right. What you set now scales with you instead of against you.`;
  }
  return `At ${team ?? "your"} people, the gap between growing and stalling is mostly clarity and follow-through, not headcount.`;
}

export function scoreHealthCheck(
  answers: Answers,
  profile?: { teamSize?: TeamSize; locations?: Locations },
): HealthResult {
  const pillars = scorePillars(answers);
  const overall = overallScore(pillars);
  const focus = focusPillars(answers, pillars);
  const answered = QUESTIONS.filter((q) => valueOf(answers, q) !== undefined).length;
  return {
    version: 2,
    overall,
    tier: tierFor(overall),
    pillars,
    focus,
    sharpest: sharpestSignal(answers),
    context: contextNote(profile?.teamSize, profile?.locations, focus[0]?.id),
    answered,
    complete: answered === QUESTIONS.length,
  };
}
