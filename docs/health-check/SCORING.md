# Health Check — scoring logic

Source of truth: `lib/health-check/questions.ts` (bank) and `lib/health-check/scoring.ts` (maths).
Tests: `lib/health-check/scoring.test.ts` (`npx tsx --test lib/health-check/scoring.test.ts`).

## 1. Answers

14 questions, 4 pillars. Each question has four **behaviourally anchored** answers: sentences describing what actually happens in the business, ordered worst → best. The owner picks the sentence that matches reality. This is faster and more honest than agree/disagree scales, which invite people to rate their intentions.

| Answer position | Score |
|---|---|
| 1st (worst) | 0 |
| 2nd | 1 |
| 3rd | 2 |
| 4th (best) | 3 |

| Pillar | Questions | Max points |
|---|---|---|
| Foundation & Positioning | f1 customer · f2 why you · f3 offer · f4 brand | 12 |
| Growth & Reach | g1 channels · g2 content · g3 network · g4 follow-up | 12 |
| Plan & Execution | e1 plan · e2 initiative · e3 capacity | 9 |
| Systems & Scale | s1 absence · s2 systems · s3 expand | 9 |

> **Version 2 (Nov 2026).** The bank was re-voiced from the old operations framing (delegation, visibility, process, growth planning) to the site's Foundation · Growth · Execution · Scale. Every id changed on purpose, `version` is now 2, and saved progress uses a new storage key. Rows in the leads sheet with version 1 used the old bank.

Question ids are stable and are what the webhook receives. Never renumber; add new ids if the bank changes and bump `version` in `scoring.ts`.

## 2. Pillar score

```
pillar = round( points earned / points available × 100 )
```

## 3. Overall score

```
overall = round( mean of the four exact pillar percentages )
```

The mean of **percentages**, not of raw points, so a 3-question pillar weighs the same as a 4-question pillar. (Raw-point averaging would quietly make Delegation and Visibility worth 57% of the score.) Rounding happens once, at the end.

## 4. Tier

| Overall | Tier | Meaning |
|---|---|---|
| 0–39 | **Running on effort** | Plenty of effort, no clear foundation or plan, so it leaks. |
| 40–59 | **Building momentum** | Basics in place but uneven; customers come in bursts, plans stall. |
| 60–79 | **Growing** | Sound core and momentum; a few gaps will widen with growth. |
| 80–100 | **Ready to scale** | Clear foundation, steady growth, a team that delivers; next is systems and expansion. |

Lower bounds are inclusive (40 is Building momentum, 60 is Growing, 80 is Ready to scale).

Calibration intent: an owner who answers "2nd sentence" everywhere scores 33 (Running on effort); "3rd sentence" everywhere scores 67 (Growing). Self-running needs mostly 4th-sentence answers, which is deliberate: the tier should be earned.

## 5. Weak pillars and recommendations

- A pillar is **weak** when its score is **below 60**.
- Every weak pillar gets **three recommendations**, weakest pillar first.
- Each question carries one recommendation. A pillar's three are taken from its **lowest-scoring answers**, ties broken by question order. So two owners with the same pillar score can get different advice, because it follows what they actually answered.
- For 3-question pillars this means all three recommendations, reordered by weakness.
- If **no** pillar is weak, the lowest pillar is shown as the **"next edge"** with its three recommendations, so every result ends with something to do.

## 6. Sharpest signal

The single lowest answer across all 14 (first by question order on ties) is quoted back on the results page as "The answer that stood out", but only when it scored 0 or 1. Above that it isn't a real constraint and is not shown.

## 7. Context note (why we ask for team size and locations)

One sentence calibrated by locations, team size and the weakest pillar:

- Multi-location + weakest is Visibility or Process → gaps multiply per site; fix centrally.
- Multi-location + weakest is Delegation → ownership must sit with site leads.
- Multi-location + weakest is Growth → the playbook exists in practice; write it down.
- Single location, 201+ people → informal coordination has stopped working.
- Single location, up to 50 people → cheapest moment to install systems.
- Otherwise → the gap is systems, not headcount.

## 8. Where scoring runs

- **Client**, for the instant reading and for preview/offline fallback.
- **Server** (`/api/health-check`), authoritative. The API re-scores from raw answers and ignores any score the client sends. The webhook and email always use the server result.

## 9. Webhook payload (`health_check.completed`)

```jsonc
{
  "event": "health_check.completed",
  "version": 2,
  "submittedAt": "2026-10-25T09:12:44.120Z",
  "lead": { "name": "…", "company": "…", "role": "Promoter / Owner", "email": "…", "whatsapp": "+919820012345",
            "teamSize": "51–200", "locations": "4–10", "consent": true },
  "scores": {
    "overall": 44, "tier": "building-momentum", "tierName": "Building momentum",
    "pillars": { "foundation": 25, "growth": 50, "execution": 44, "scale": 56 },
    "focus": [ { "pillar": "foundation", "reason": "weak", "recommendations": ["f3_offer", "f1_customer", "f2_why_you"] }, … ]
  },
  "answers": [ { "id": "f1_customer", "pillar": "foundation", "question": "…", "score": 1, "answer": "A rough idea, but it shifts with every deal." }, … ],
  "meta": { "startedAt": "…", "completedAt": "…", "referrer": "…", "utm": { "utm_source": "…" }, "ip": "…", "userAgent": "…" }
}
```

Header `X-Webhook-Secret` is sent when `HEALTH_CHECK_WEBHOOK_SECRET` is set; verify it in n8n / your CRM.

## 10. Analytics events

| Event | When | Props (no personal data) |
|---|---|---|
| `Health Check: Start` | Begin, resume or retake | `resumed`, `answered` |
| `Health Check: Pillar Complete` | Last question of a pillar answered (once per pillar per run) | `pillar`, `pillar_index`, `score` |
| `Health Check: Lead Captured` | Server accepted the submission | `tier`, `score`, `team_size`, `locations`, `role` |
| `Health Check: Booking Clicked` | Either booking button or the new-tab link | `method` (`inline_header` · `inline` · `new_tab`), `tier`, `score` |

Sent to Plausible (`window.plausible`) and Vercel Analytics (`window.va`) when present. Names, emails, companies and phone numbers are never sent to analytics.
