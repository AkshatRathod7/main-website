# Decisions log

## Stage 03 — Design system locked (25 Oct 2026)

| # | Decision | Why |
|---|---|---|
| 1 | Route = bible default "Dark Precision", champagne brass `#C8A96A` | Chosen by Midnight (prompt placeholder was unfilled). |
| 2 | Components use semantic tokens only; `data-tone="paper"` swaps the set | Paper sections need zero component variants. |
| 3 | `ivory-subtle #9A968D` is the lowest text colour (6.8:1); `ivory-faint` is disabled/decorative only | Keeps captions legible on every surface. |
| 4 | New `line-control #706D66` (3.3–3.9:1) for input and secondary-button boundaries | WCAG 1.4.11 — the hairline `line` (1.3:1) can't define a control. |
| 5 | Brass text on paper becomes `brass-deep #7A5F2C` (5.2:1); brass fill stays | Brass on ivory is 1.96:1. |
| 6 | Focus ring = 2px brass, offset 3 (ink on paper) | 8.9:1 on canvas; one consistent ring. |
| 7 | Tailwind v4 with a JS config via `@config`, values as CSS variables; scales replace defaults | Satisfies "Tailwind config", keeps one value per token, closed scales enforced by the build. |
| 8 | 44px added as the one off-grid spacing value | Minimum hit target. |
| 9 | Fonts: Geist + Geist Mono (npm `geist`), Instrument Serif italic 400 only | 3 families, serif never upright. |
| 10 | Headline reveal: CSS keyframes for hero (`load`), IntersectionObserver for the rest | Hero LCP must not wait for hydration. Blur is the one sanctioned non-transform/opacity property. |
| 11 | Accordion height via grid-rows 0fr→1fr is the single height animation | Instant height jumps read cheap; scoped to one component. |
| 12 | Mobile nav built on native `<dialog>` | Free focus trap, Esc, inert background. |
| 13 | No marquee; logos are a static hairline grid, TODO-PROOF until supplied | Bible + honesty rules. |
| 14 | Motion library not required for components (CSS + IO only) | Saves JS; Motion/GSAP reserved for hero assembly and pinned 90-day arc. |

## Open items
- [TODO-PROOF] Final logo file (typeset wordmark in use).
- [TODO-PROOF] Client logos + permission; client quote + permission; real metrics with sources.
- [TODO-PROOF] Registered entity name / city / GST-CIN for the footer, if displayed.
- [TODO-COPY] FAQ answers: first-fortnight scope; minimum size / fit criteria.
- Confirm "Book a health check" as the single site-wide CTA label.
- Favicon / OG image set will use canvas + brass wordmark — build in the launch stage.

## Stage 10 — Merge, craft and polish (26 Oct 2026)

| # | Decision | Why |
|---|---|---|
| 10-1 | Stages 03–09 merged into one app on the Stage 03 lock; every stage-local token block, nav, footer and button removed or mapped onto it | One source of truth; four token sets and three button systems had drifted |
| 10-2 | Page H1s arrive by travel only (no opacity, no blur); blur-to-sharp kept for scroll headlines | Hero FCP/LCP 616 → 316 ms on a 4× throttled phone |
| 10-3 | CTA labels: "Take the Health Check" (self-serve) and "Book a conversation" (human). Supersedes "Book a health check" (Stage 03 open item) | You take a check; you book a call |
| 10-4 | The instrument is the "Business Health Check": 14 questions, 4 areas, about 3 minutes. Home reads these from the Stage 07 bank | Home promised five areas and four minutes |
| 10-5 | Footer carries no closing statement or CTA | Every page already ends on a closing CTA; two read as a double sign-off |
| 10-6 | Fonts self-hosted as Latin subsets; Mono not preloaded | 104 KB less on the critical path |
| 10-7 | One page width (`container-ds`) on every route, including Home and Stage 09 pages | 1280 / 1360 / 1440 had been in use |
| 10-8 | Separate Cal.com env vars for the contact call and the Health Check walkthrough | Stages 07 and 09 shared one variable for two events |

Resolved from the Stage 03 open items: CTA label (10-3); favicon and OG set built (typeset placeholder mark until the logo file arrives).
