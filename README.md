# DreamSVin website

The website for DreamSVin: business architects and growth partners. One long home page that holds the whole story in chapters, plus service pages, case studies, insights, a contact form and a business health check.

Built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS v4.

## Run it

```bash
npm install
cp .env.example .env.local   # fill in what you have; empty values are simply not shown
npm run dev                  # http://localhost:3000
```

| Command | What it does |
|---|---|
| `npm run dev` | Local development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | TypeScript check |
| `npm test` | Health check scoring tests (9) |
| `npm run check:todos` | Lists any visible placeholder still used on a page |
| `npm run build:launch` | Production build that fails while a placeholder remains |

Node 20.9 or newer.

## Where things live

```
app/                 Routes
  (site)/            Home, service pages, case studies, insights, contact, legal pages
  health-check/      The business health check
  api/               Form endpoints: contact and health check
  fonts/             Host Grotesk, self-hosted
components/
  brand/             Home page pieces: hero drawing, sprint, sector index, logo, chapter rail
  home/              Sections merged onto the home page: services, FAQ, insights
  site/              Nav, footer, theme toggle, mobile call-to-action, analytics
  editorial/         Insights and legal page layout
  health-check/      Health check steps, form and results
  ui/                Buttons, headlines, accordion, toast, layout helpers
content/             All copy: site.ts, cases.ts, services.ts, sectors.ts, insights/*.mdx
lib/                 SEO, leads, rate limiting, share images, health check logic
styles/              Section styles (brand, living, pages, editorial, health-check)
tokens/              Design tokens and the contrast table (reference)
assets/og/           Fonts and wordmark used to draw share images
public/              Logo files, client logos, Isha's photo
docs/                Decisions log, health check scoring, the leads Apps Script
scripts/             check-todos.ts, build-client-logos.mjs
```

**To change words, edit `content/`, not the pages.** `content/site.ts` holds the home page and shared copy, `content/cases.ts` the case studies and results, `content/services.ts` the five service pages.

## Pages

| Route | What it is |
|---|---|
| `/` | The whole site in chapters: hero, results, what we do, services, growth engine, the 90-day sprint, work by industry, why us, founder, team, insights, questions, final call to action |
| `/what-we-do/[slug]` | Five service pages |
| `/work/[slug]` | Seven case studies |
| `/insights`, `/insights/[slug]` | Articles, written as MDX in `content/insights/` |
| `/contact` | Qualifying form and booking |
| `/health-check` | 14 questions, a score and next moves (`docs/health-check/SCORING.md`) |
| `/privacy`, `/terms`, `/accessibility` | Legal and accessibility pages |

`/what-we-do`, `/how-we-work`, `/work` and `/about` redirect to their chapters on the home page (`next.config.ts`).

## Look and behaviour

- **Theme.** Carbon black is the default. The toggle in the nav switches to the light cream theme and remembers the choice (`localStorage` key `dsv-theme`). Colours are tokens in `app/globals.css`; dark overrides sit under `[data-theme="dark"]`.
- **Type.** One family, Host Grotesk, self-hosted. No third-party font request.
- **Chapters.** `app/(site)/page.tsx` marks each chapter with `<SpyMark>`. The nav lights the chapter you are in, and the nav bar doubles as a progress bar.
- **Fit and settle.** A chapter marked `fit` fills the screen under the nav and centres its content. On short desktop screens it scales down slightly so it still fits. When a scroll stops just short of a chapter, the page glides the rest of the way; it never pulls back against the scroll. Desktop only, and off for visitors who ask for reduced motion (`components/brand/spy.tsx`, `styles/living.css`).
- **Motion.** Transform and opacity only. Every page is complete without JavaScript, and reduced motion is a designed state.

## Forms and leads

- The contact form posts to `/api/contact`, the health check to `/api/health-check`. Both validate, rate-limit and check a honeypot.
- Leads go to the DreamSVin leads Google Sheet through an Apps Script web app (`docs/leads.gs`). The default address is in `lib/leads.ts`; set `CONTACT_WEBHOOK_URL` to send leads elsewhere.
- **When testing, point `CONTACT_WEBHOOK_URL` and `HEALTH_CHECK_WEBHOOK_URL` at a stand-in.** Otherwise test entries land in the real sheet.
- All settings are listed in `.env.example`. Nothing secret is stored in this repository.

## Before launch

These need Isha or the team:

1. **Client approval for quotes.** Every quote in `content/cases.ts` has `approved: false`, so none show. Set each to `true` once that client agrees. `NEXT_PUBLIC_SHOW_DRAFT_QUOTES=1` previews them all.
2. **Permission to name each client and show each logo.**
3. **Result numbers and founder facts.** Confirm the figures in `content/cases.ts` and the founder credentials in `content/site.ts`.
4. **Founder bio.** Rewritten in first person from the old site. Isha should read it.
5. **Service page names.** The copy document calls the five names a proposal.
6. **Budget ranges and consent wording** on the contact form.
7. **Reply-time promise.** "Within one working day" stays only if the team can meet it.
8. **Settings.** Booking link, WhatsApp number, social links, legal entity name and city (`.env.example`).
9. **Privacy and Terms.** Both still have bracketed placeholders for counsel to fill in. Until then they are marked `noindex` and left out of the sitemap.
10. **Insights articles.** The two articles predate the current positioning. Keep, edit or replace.
11. **Health check wording.** The questions and stage summaries in `lib/health-check/` are new copy for Isha to read.
12. **Still missing.** Team photos and roles, real project photos for case pages.

## Earlier versions

Git tags mark each saved stage. `v13-first-build-polished` is this version. The redesign explorations (`v4` to `v11`) live on the `premium-preview` branch and are not part of `main`.
