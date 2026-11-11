/**
 * Health Check — question bank.
 *
 * 14 questions across the four things DreamSVin works on: Foundation, Growth,
 * Execution and Scale (the same stages as the site). Every question offers four
 * behaviourally anchored answers, ordered worst → best and scored 0–3. Owners
 * pick the sentence that describes what actually happens, which is faster and
 * more honest than an agree/disagree scale.
 *
 * Each question carries the recommendation we make when it scores low.
 * See docs/health-check/SCORING.md for how these are combined.
 * Ids are sent to the webhook: never renumber within a version. (v2, Nov 2026:
 * re-voiced from the old operations bank, so every id changed on purpose.)
 */

export type PillarId = "foundation" | "growth" | "execution" | "scale";

export type Pillar = {
  id: PillarId;
  index: number; // 1-based, used for display ("Pillar 02")
  name: string;
  short: string; // used in tight UI (progress readout, bars)
  promise: string; // one line shown when the pillar begins
};

export type Question = {
  id: string; // stable id, sent to the webhook — never renumber
  pillar: PillarId;
  prompt: string;
  /** Four answers, worst first. Index = score (0–3). */
  options: [string, string, string, string];
  /** The move we recommend when this question scores 0–1 (or is a pillar's weakest). */
  recommendation: { title: string; body: string };
};

export const PILLARS: Pillar[] = [
  {
    id: "foundation",
    index: 1,
    name: "Foundation & Positioning",
    short: "Foundation",
    promise: "Whether your customer, your offer and your price are clear enough to grow on.",
  },
  {
    id: "growth",
    index: 2,
    name: "Growth & Reach",
    short: "Growth",
    promise: "How the right people find you, and what happens once they do.",
  },
  {
    id: "execution",
    index: 3,
    name: "Plan & Execution",
    short: "Execution",
    promise: "Whether there is a plan, and whether it actually gets done.",
  },
  {
    id: "scale",
    index: 4,
    name: "Systems & Scale",
    short: "Scale",
    promise: "Whether the business can grow without everything running through you.",
  },
];

export const QUESTIONS: Question[] = [
  // ── Foundation & Positioning ──────────────────────────────────────────
  {
    id: "f1_customer",
    pillar: "foundation",
    prompt: "How clearly can you describe the customer you serve best?",
    options: [
      "Anyone who will pay. We take what comes.",
      "A rough idea, but it shifts with every deal.",
      "Clear to me. My team would each describe it differently.",
      "Written down, specific, and the whole team says the same thing.",
    ],
    recommendation: {
      title: "Name your best customer",
      body: "Look at your five best clients from the last year. Write down what they share: who they are, the problem they came with, and why they chose you. That is who you build for.",
    },
  },
  {
    id: "f2_why_you",
    pillar: "foundation",
    prompt: "A prospect asks, “Why you and not the others?” What do they hear?",
    options: [
      "Price, or “we’re good at what we do”.",
      "A different answer from each person they ask.",
      "A clear answer, but only when I’m the one giving it.",
      "One sharp answer, the same on the website, in sales and from the team.",
    ],
    recommendation: {
      title: "Write the one line that wins",
      body: "Put the reason to choose you into one sentence a competitor could not say. Test it on three customers, then use it everywhere: website, proposals, introductions.",
    },
  },
  {
    id: "f3_offer",
    pillar: "foundation",
    prompt: "How are your offers and pricing set?",
    options: [
      "Case by case. Every quote starts from scratch.",
      "A rough rate card we often discount from.",
      "Defined packages, priced mostly by what others charge.",
      "Clear packages, priced on value and reviewed at least once a year.",
    ],
    recommendation: {
      title: "Package and price on value",
      body: "Turn your most common work into two or three named packages with a fixed scope. Price each on the outcome it delivers, not the hours it takes.",
    },
  },
  {
    id: "f4_brand",
    pillar: "foundation",
    prompt: "Does your brand look as serious as your work?",
    options: [
      "No. The logo, website and decks all look different.",
      "It’s dated. We apologise for it in meetings.",
      "It’s decent, but it doesn’t say what makes us different.",
      "Yes. It’s consistent everywhere and earns trust quickly.",
    ],
    recommendation: {
      title: "Make the first ten seconds count",
      body: "Start where prospects look first: your website’s first screen, your profile and your proposal. Make them consistent, and lead with your one line.",
    },
  },

  // ── Growth & Reach ────────────────────────────────────────────────────
  {
    id: "g1_channels",
    pillar: "growth",
    prompt: "Where do most new customers come from?",
    options: [
      "Wherever they turn up. We can’t predict it.",
      "Mostly referrals, when they come.",
      "A couple of channels that work, unevenly.",
      "Several channels we track, and we know which one to push.",
    ],
    recommendation: {
      title: "Find your two best channels",
      body: "Trace your last twenty customers back to where they first heard of you. Put your effort behind the top two before you try anything new.",
    },
  },
  {
    id: "g2_content",
    pillar: "growth",
    prompt: "How often does your market hear from you?",
    options: [
      "Rarely. We post when someone has time.",
      "In bursts, then silence for weeks.",
      "Regularly, but it’s mostly about us, not their problems.",
      "Consistently, in our own voice, with proof of what we do.",
    ],
    recommendation: {
      title: "Build a content rhythm you can keep",
      body: "Pick one channel and a cadence you can hold for 90 days. Make each piece answer a question your customers actually ask, and show your proof.",
    },
  },
  {
    id: "g3_network",
    pillar: "growth",
    prompt: "Who outside the business actively sends work your way?",
    options: [
      "No one we could name.",
      "A few loyal clients, now and then.",
      "Some partners and past clients, without a plan.",
      "A community and partners we look after on purpose.",
    ],
    recommendation: {
      title: "Turn goodwill into a network",
      body: "List the clients, partners and creators who already trust you. Give them a reason and an easy way to bring people to you: an event, a collaboration, a referral offer.",
    },
  },
  {
    id: "g4_followup",
    pillar: "growth",
    prompt: "What happens to an enquiry that doesn’t buy straight away?",
    options: [
      "Usually nothing. It goes cold.",
      "Someone follows up once, if they remember.",
      "It sits on a list we follow up now and then.",
      "A set follow-up path keeps in touch until they’re ready.",
    ],
    recommendation: {
      title: "Stop losing warm leads",
      body: "Give every enquiry the same path: a reply the same day, something useful within a week, and a check-in each month. Keep it in one place, not in someone’s memory.",
    },
  },

  // ── Plan & Execution ──────────────────────────────────────────────────
  {
    id: "e1_plan",
    pillar: "execution",
    prompt: "Is there a written plan for the next 90 days?",
    options: [
      "No. We respond to what comes.",
      "There is one, in my head.",
      "It’s written, but rarely looked at.",
      "Written, with owners and dates, reviewed every week.",
    ],
    recommendation: {
      title: "Put the next 90 days on one page",
      body: "Choose three priorities. Give each one owner, a measurable end point and a weekly check-in. That page becomes the agenda for every review.",
    },
  },
  {
    id: "e2_initiative",
    pillar: "execution",
    prompt: "What happened to the last big initiative you started?",
    options: [
      "It faded out in a WhatsApp thread.",
      "It started well, then stalled.",
      "It got done, but late or only in part.",
      "Delivered, measured, then scaled or stopped on purpose.",
    ],
    recommendation: {
      title: "Run initiatives as 90-day sprints",
      body: "One owner, a weekly fifteen-minute check-in and a fixed date to decide: scale it or stop it. Most initiatives die from drift, not from failure.",
    },
  },
  {
    id: "e3_capacity",
    pillar: "execution",
    prompt: "When something important needs doing, who does it?",
    options: [
      "Me, or it doesn’t happen.",
      "Whoever has a gap that week.",
      "A capable team, stretched thin.",
      "The right people, with specialists brought in when needed.",
    ],
    recommendation: {
      title: "Fill the gaps you keep covering",
      body: "List the jobs you do because nobody else can: content, sales follow-up, design, reporting. Decide which to hire for, which to hand to a specialist, and which to stop.",
    },
  },

  // ── Systems & Scale ───────────────────────────────────────────────────
  {
    id: "s1_absence",
    pillar: "scale",
    prompt: "If you were unreachable for two weeks, what would happen?",
    options: [
      "Most things would stop. Decisions would wait for me.",
      "It would limp along. I would still be on the phone daily.",
      "It would run. A few calls would still find their way to me.",
      "It would run. I would catch up in the weekly review.",
    ],
    recommendation: {
      title: "Run the two-week absence test",
      body: "List every decision that would wait for you. Give each one a named deputy and a spending limit, in writing, before you need it.",
    },
  },
  {
    id: "s2_systems",
    pillar: "scale",
    prompt: "How are your core processes written down?",
    options: [
      "They live in people’s heads.",
      "A few are written. Most are out of date.",
      "Most key processes are documented.",
      "Documented, followed and updated. New hires learn from them.",
    ],
    recommendation: {
      title: "Write down the five that cause rework",
      body: "Start with the processes that most often go wrong. Keep each one short and visual, make the person who runs it its owner, and automate the steps that repeat.",
    },
  },
  {
    id: "s3_expand",
    pillar: "scale",
    prompt: "Could you add a new market, product line or location without running it yourself?",
    options: [
      "No. Everything would run through me.",
      "Only with a great deal of my time.",
      "Probably, with a strong person in place.",
      "Yes. We have a playbook for it.",
    ],
    recommendation: {
      title: "Turn what works into a playbook",
      body: "Capture the roles, routines and numbers of your best-run part of the business before you expand, so growth copies a system rather than a person.",
    },
  },
];

export const TOTAL_QUESTIONS = QUESTIONS.length; // 14

export const pillarById = (id: PillarId) => PILLARS.find((p) => p.id === id)!;
export const questionsFor = (id: PillarId) => QUESTIONS.filter((q) => q.pillar === id);

/** Index of the last question in each pillar, used to fire "pillar complete". */
export const PILLAR_LAST_INDEX: Record<PillarId, number> = PILLARS.reduce(
  (acc, p) => {
    acc[p.id] = QUESTIONS.map((q) => q.pillar).lastIndexOf(p.id);
    return acc;
  },
  {} as Record<PillarId, number>,
);

/* ── Lead capture options ─────────────────────────────────────────────── */

export const ROLES = [
  "Founder",
  "Promoter / Owner",
  "Managing Director / CEO",
  "Next-generation leader",
  "Senior executive",
  "Other",
] as const;

export const TEAM_SIZES = ["1–10", "11–50", "51–200", "201–500", "500+"] as const;
export const LOCATIONS = ["1", "2–3", "4–10", "11+"] as const;

export type Role = (typeof ROLES)[number];
export type TeamSize = (typeof TEAM_SIZES)[number];
export type Locations = (typeof LOCATIONS)[number];
