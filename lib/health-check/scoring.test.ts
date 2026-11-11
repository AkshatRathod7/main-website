/**
 * Run: npx tsx --test src/lib/health-check/scoring.test.ts
 * (or move to your Vitest/Jest setup; it only uses node:test + node:assert)
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { QUESTIONS } from "./questions";
import { scoreHealthCheck, tierFor, type AnswerValue, type Answers } from "./scoring";
import { submissionSchema } from "./schema";

const all = (v: AnswerValue): Answers => Object.fromEntries(QUESTIONS.map((q) => [q.id, v]));

test("bank shape: 14 questions, 4 pillars, 4 options each, unique ids", () => {
  assert.equal(QUESTIONS.length, 14);
  assert.equal(new Set(QUESTIONS.map((q) => q.id)).size, 14);
  assert.deepEqual(
    [...new Set(QUESTIONS.map((q) => q.pillar))],
    ["foundation", "growth", "execution", "scale"],
  );
  for (const q of QUESTIONS) assert.equal(q.options.length, 4);
});

test("all best answers → 100, Ready to scale, one 'edge' focus pillar, no sharpest signal", () => {
  const r = scoreHealthCheck(all(3));
  assert.equal(r.overall, 100);
  assert.equal(r.tier.id, "ready-to-scale");
  assert.equal(r.focus.length, 1);
  assert.equal(r.focus[0].reason, "edge");
  assert.equal(r.focus[0].recommendations.length, 3);
  assert.equal(r.sharpest, null);
  assert.equal(r.complete, true);
});

test("all worst answers → 0, Running on effort, four weak pillars × 3 recommendations", () => {
  const r = scoreHealthCheck(all(0));
  assert.equal(r.overall, 0);
  assert.equal(r.tier.id, "running-on-effort");
  assert.equal(r.focus.length, 4);
  for (const f of r.focus) {
    assert.equal(f.reason, "weak");
    assert.equal(f.recommendations.length, 3);
  }
  assert.equal(r.sharpest?.questionId, "f1_customer");
});

test("overall is the mean of pillar percentages, not of raw points", () => {
  const a = all(0);
  for (const q of QUESTIONS.filter((q) => q.pillar === "execution")) a[q.id] = 3; // 3-question pillar
  const r = scoreHealthCheck(a);
  assert.equal(r.pillars.find((p) => p.id === "execution")!.score, 100);
  assert.equal(r.overall, 25); // raw-points mean would give 9/42 = 21
});

test("tier boundaries are inclusive at the lower bound", () => {
  assert.equal(tierFor(39).id, "running-on-effort");
  assert.equal(tierFor(40).id, "building-momentum");
  assert.equal(tierFor(59).id, "building-momentum");
  assert.equal(tierFor(60).id, "growing");
  assert.equal(tierFor(79).id, "growing");
  assert.equal(tierFor(80).id, "ready-to-scale");
});

test("recommendations follow the weakest answers inside a pillar, ties by question order", () => {
  const a = all(3);
  Object.assign(a, { g1_channels: 2, g2_content: 0, g3_network: 1, g4_followup: 0 });
  const r = scoreHealthCheck(a);
  const vis = r.focus.find((f) => f.id === "growth")!;
  assert.equal(vis.score, 25); // 3 / 12
  assert.deepEqual(vis.recommendations.map((x) => x.questionId), ["g2_content", "g4_followup", "g3_network"]);
});

test("weak pillars are ordered weakest first", () => {
  const a = all(3);
  Object.assign(a, { e1_plan: 1, e2_initiative: 1, e3_capacity: 1 }); // execution 33
  Object.assign(a, { s1_absence: 0, s2_systems: 0, s3_expand: 1 }); // scale 11
  const r = scoreHealthCheck(a);
  assert.deepEqual(r.focus.map((f) => f.id), ["scale", "execution"]);
});

test("a realistic mid-market owner lands in Building momentum", () => {
  const a: Answers = {
    f1_customer: 1, f2_why_you: 1, f3_offer: 0, f4_brand: 1,
    g1_channels: 1, g2_content: 2, g3_network: 2, g4_followup: 1,
    e1_plan: 2, e2_initiative: 1, e3_capacity: 1,
    s1_absence: 2, s2_systems: 1, s3_expand: 2,
  };
  const r = scoreHealthCheck(a, { teamSize: "51–200", locations: "4–10" });
  assert.deepEqual(r.pillars.map((p) => p.score), [25, 50, 44, 56]);
  assert.equal(r.overall, 44);
  assert.equal(r.tier.id, "building-momentum");
  assert.equal(r.focus[0].id, "foundation");
  assert.equal(r.focus[0].recommendations[0].questionId, "f3_offer");
  assert.match(r.context ?? "", /4–10 locations/);
});

test("submission schema rejects a missing answer and accepts a complete one", () => {
  const lead = {
    name: "Asha Mehta", company: "Mehta Group", role: "Promoter / Owner", email: "asha@example.com",
    whatsapp: "+91 98200 12345", teamSize: "51–200", locations: "2–3", consent: true,
  };
  assert.equal(submissionSchema.safeParse({ answers: all(2), lead }).success, true);
  const missing = { ...all(2) };
  delete missing.s3_expand;
  assert.equal(submissionSchema.safeParse({ answers: missing, lead }).success, false);
  assert.equal(submissionSchema.safeParse({ answers: { ...all(2), extra: 1 }, lead }).success, false);
  assert.equal(submissionSchema.safeParse({ answers: all(2), lead: { ...lead, whatsapp: "12" } }).success, false);
});
