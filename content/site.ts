/**
 * DreamSVin site copy. One source for every page.
 *
 * Sources (Oct 2026, from Isha Ostwal):
 *   - "DreamSVin Website Copy" (24 Oct): every headline, section and CTA below, used as written.
 *   - "Isha's Website Brief" (15 Oct): positioning, the journey, language to use and avoid.
 *   - "DreamSVin Client Testimonials – Slide Content" (27 Oct): client facts and results.
 * Rules carried from the copy doc: one primary action ("Book a Free Consultation"); no invented proof.
 * Testimonial statements are drafts in the client's voice: they render only when `approved: true`
 * (or when NEXT_PUBLIC_SHOW_DRAFT_QUOTES=1 for review builds).
 */

export const PRIMARY_CTA = { href: "/contact", label: "Book a Free Consultation" } as const;

/* ───────────────────────── Home ───────────────────────── */

export const HERO = {
  eyebrow: "Build · Grow · Scale",
  lines: ["Your Business Architects.", "Your Growth Partners."],
  sub: "We find what's holding your business back, build a focused 90-day plan, and help you execute it. Starting out, rebuilding or scaling, you get strategy and the team to deliver it.",
  secondary: { href: "/#work", label: "See Our Work" },
  micro: "A 30-minute conversation. You leave with a clear view of what's slowing you down.",
} as const;

export const TRUST = {
  label: "Trusted by colleges, startups, developers, financial firms and founder-led brands",
  names: ["SNJB", "ContIQ", "Nagarsheth Group", "Resurgence Capital", "Ekoham", "Strongher After 40", "Priyanshi Yadav", "Oceanman Goa", "Spectratix Pharma", "Mengo", "Prustlr", "Entrelogy Business School", "Yogsadhak"],
} as const;

/**
 * Client logos for the logo wall, made one-colour by scripts/build-client-logos.mjs from each client's own site
 * (researched 1 Nov 2026). Names without a logo here show as a wordmark in the display face.
 * Left out on purpose: Oceanman (the logo is the global series trademark, not the Goa event's), Audex (not
 * confirmed as the same company) and Bandma (only a low-resolution file, match not certain).
 * Showing a client's logo needs their permission, the same as naming them (README, before launch).
 */
export const CLIENT_LOGOS: Record<string, { src: string; w: number; h: number }> = {
  SNJB: { src: "/clients/snjb.png", w: 649, h: 160 },
  ContIQ: { src: "/clients/contiq.png", w: 152, h: 160 },
  "Resurgence Capital": { src: "/clients/resurgence-capital.png", w: 248, h: 160 },
  Ekoham: { src: "/clients/ekoham.png", w: 396, h: 160 },
  "Spectratix Pharma": { src: "/clients/spectratix-pharma.png", w: 603, h: 160 },
  Prustlr: { src: "/clients/prustlr.png", w: 840, h: 160 },
  "Entrelogy Business School": { src: "/clients/entrelogy.png", w: 855, h: 160 },
  Mengo: { src: "/clients/mengo.png", w: 569, h: 160 },
};

export const PROBLEM = {
  title: "Let's find what's holding your business back.",
  intro: "Most businesses don't lack effort. They lack a clear picture of where the effort is leaking. We start there.",
  cards: [
    { k: "Starting out", v: "You have the idea. You need the business model, the positioning and a launch plan that works.", stage: "foundation" },
    { k: "Established, but stuck", v: "Revenue has levelled off. The cause is rarely where you think it is.", stage: "foundation" },
    { k: "Growing, but stretched", v: "Enquiries are coming in. Your systems, offers and team haven't caught up.", stage: "growth" },
    { k: "Leading an institution", v: "Your reputation should match the quality of what you deliver. We close that gap.", stage: "foundation" },
  ],
  link: { href: "/health-check", label: "Find out which one sounds like you" },
} as const;

/* ───────────────────────── The 90-day sprint ───────────────────────── */

export type SprintPhase = { n: string; days: string; from: number; to: number; title: string; short: string; get: string; items: string[] };

export const SPRINT: SprintPhase[] = [
  {
    n: "01",
    days: "Days 1–15",
    from: 1,
    to: 15,
    title: "Diagnose",
    short: "A business audit, a gap assessment and your priority opportunities.",
    get: "A business audit, a gap assessment and your priority opportunities",
    items: ["Business audit", "Gap assessment", "Priority opportunities"],
  },
  {
    n: "02",
    days: "Days 16–30",
    from: 16,
    to: 30,
    title: "Plan",
    short: "Your 90-day roadmap with clear owners. First improvements go live.",
    get: "Your 90-day roadmap, clear ownership and the first improvements",
    items: ["90-day roadmap", "Clear owners", "First improvements live"],
  },
  {
    n: "03",
    days: "Days 31–60",
    from: 31,
    to: 60,
    title: "Execute",
    short: "We work through the agreed initiatives alongside your team and the right specialists.",
    get: "Agreed initiatives, implemented with your team and specialists",
    items: ["Agreed initiatives", "Your team + ours", "The right specialists"],
  },
  {
    n: "04",
    days: "Days 61–90",
    from: 61,
    to: 90,
    title: "Optimise",
    short: "We review results, tighten your systems and map the next stage.",
    get: "A results review, stronger systems and a plan for the next stage",
    items: ["Results review", "Stronger systems", "Next-stage plan"],
  },
];

export const HOW_TEASER = {
  title: "One 90-day plan. Built with you, run with you.",
  intro: "Every engagement follows the same four steps. You always know what is happening and who owns it.",
  cta: { href: "/#how-we-work", label: "See how the 90-day sprint works" },
} as const;

/* ───────────────────────── Stages ───────────────────────── */

export type StageKey = "foundation" | "growth" | "scale";
export type Stage = {
  key: StageKey;
  n: string;
  name: string;
  tag: string;
  header: string;
  copy: string;
  summary: string;
  get: string[];
  bestFor: string;
  cta: string;
  quote: string;
};

export const STAGES: Stage[] = [
  {
    key: "foundation",
    n: "01",
    name: "Foundation",
    tag: "Build or rebuild.",
    header: "Foundation. Build it right, or rebuild it.",
    summary: "Business model, market research, positioning, brand identity, offers, pricing, go-to-market and the SOPs that keep it running.",
    copy: "A strong business starts with clear answers. Who is this for? What do we sell, and at what price? Why should anyone choose us? We settle these first, so every rupee spent later works harder.",
    get: ["Business model and market research", "Positioning and brand identity", "Offers and pricing", "Go-to-market plan", "SOPs and systems your team can follow"],
    bestFor: "Startups, new ventures, and established businesses that need a reset.",
    cta: "Talk about your foundation",
    quote: "I'm starting out or need to rebuild.",
  },
  {
    key: "growth",
    n: "02",
    name: "Growth",
    tag: "Attract, convert, retain.",
    header: "Growth. Attract, convert, retain.",
    summary: "Content, community, collaborations, marketing, lead generation, partnerships and sales funnels.",
    copy: "A good business that nobody hears about stays small. We help the right people find you, trust you and come back.",
    get: ["Content and personal branding", "Community building", "Collaborations and partnerships", "Marketing and lead generation", "Sales funnels"],
    bestFor: "Businesses with a solid offer that need steady, qualified demand.",
    cta: "Talk about growth",
    quote: "I have a business. I need more of the right customers.",
  },
  {
    key: "scale",
    n: "03",
    name: "Scale",
    tag: "Expand and systemise.",
    header: "Scale. Expand and systemise.",
    summary: "Repeatable growth systems, automation, new revenue channels, strategic alliances and market expansion.",
    copy: "Growth that depends on you doesn't last. We help you build systems that keep working as you add customers, markets and people.",
    get: ["Repeatable growth systems", "Automation", "New revenue channels", "Strategic alliances", "Market expansion"],
    bestFor: "Businesses ready to grow beyond the founder, the city or the current playbook.",
    cta: "Talk about scaling",
    quote: "It works. Now I need it to run without me and reach further.",
  },
];

export const WHAT_TEASER = {
  title: "Wherever you are, there is a place to start.",
  intro: "Join at any stage. Three stages, one team.",
  cta: { href: "/#what-we-do", label: "Explore what we do" },
} as const;

export const EXTENDED_TEAM = {
  title: "Your extended strategy, growth and execution team.",
  short: "Think of us as your virtual Chief Strategy Officer, Chief Growth Officer and execution team. When a problem needs a specialist, we bring the right one in.",
  long: "You don't need to hire a Chief Strategy Officer, a Chief Growth Officer and a delivery team to move forward. We work as yours, and we bring in the right specialist when a problem needs one.",
  roles: [
    { role: "Strategy", like: "Like your Chief Strategy Officer", desc: "Where to play, how to win, and the 90-day plan that gets you there." },
    { role: "Growth", like: "Like your Chief Growth Officer", desc: "Content, community, collaborations and the funnels that turn attention into revenue." },
    { role: "Execution", like: "Your growth team", desc: "The people who carry the plan out, with specialists brought in when the problem needs one." },
  ],
} as const;

/* ───────────────────────── CCC ───────────────────────── */

export const CCC = {
  eyebrow: "The growth engine",
  homeTitle: "From chasing leads to attracting them.",
  homeCopy: "Once your foundation is solid, we run the CCC growth engine: Content, Community and Collaborations. Together they move your business from pushing for every lead to having opportunities come to you.",
  title: "The CCC growth engine: Content, Community, Collaborations.",
  copy: "When your foundation is in place, CCC changes how growth reaches you. Instead of chasing every lead, you build an audience, a community and a set of partners who bring opportunities to you.",
  parts: [
    { k: "Content", v: "Your story, your expertise and your proof, told consistently where your customers pay attention." },
    { k: "Community", v: "People who know you, trust you and talk about you." },
    { k: "Collaborations", v: "Partners, creators and institutions that put you in front of the right people." },
  ],
  closing: "From push to pull.",
} as const;

/* ───────────────────────── Who / Why ───────────────────────── */

export const WHO = {
  title: "For people building something that matters.",
  rows: [
    { k: "Startups", v: "Get the foundation right before you spend on growth." },
    { k: "Established businesses", v: "Find the leaks, fix them, and grow again." },
    { k: "Colleges and institutions", v: "Build a brand that matches your standing." },
    { k: "CXOs and leadership teams", v: "Add strategy and execution capacity without adding headcount." },
  ],
} as const;

export const WHY = {
  title: "Why clients choose us.",
  points: [
    { k: "Strategy and execution together.", v: "We don't hand you a deck and leave. We help you carry the plan out." },
    { k: "The right expertise for the right problem.", v: "A core team plus specialists, brought in when your business needs them." },
    { k: "Plain talk, clear milestones.", v: "No jargon. You see the plan, the owners and the progress." },
    { k: "Built here, aimed globally.", v: "We start with where you are and help you build to compete anywhere." },
  ],
} as const;

export const FINAL_CTA = {
  home: {
    title: "Ready to find what's holding your business back?",
    copy: "Book a free consultation. We'll look at where you are, where the leaks are, and what a focused 90 days could change.",
    secondary: { href: "/contact#message", label: "Or send us a message" },
  },
  whatWeDo: { title: "Tell us where you are. We'll tell you where to start." },
  howWeWork: { title: "Start with the diagnosis.", copy: "In one conversation we can tell you whether a 90-day sprint fits." },
  work: { title: "Your business could be the next case.", copy: "Tell us where you are. We'll show you how we would start." },
  about: { title: "Let's build something worth growing." },
} as const;

/* ───────────────────────── Capabilities ───────────────────────── */

export const CAPABILITIES = {
  title: "What we can take on.",
  list: [
    "Business audits and gap analysis",
    "Business model design",
    "Market research",
    "Positioning and messaging",
    "Brand identity",
    "Website design",
    "Offers and pricing",
    "Go-to-market",
    "SOPs and systems",
    "Content strategy and production",
    "Personal branding",
    "Community building",
    "Events and activations",
    "Collaborations and partnerships",
    "Lead generation",
    "Sales funnels",
    "Automation",
    "Market expansion",
  ],
  note: "Some work we deliver ourselves. Some we deliver with trusted partners. We tell you which, up front.",
} as const;

/* ───────────────────────── How we work page ───────────────────────── */

export const JOURNEY = {
  title: "How every engagement runs.",
  steps: [
    { k: "We find what's holding you back.", v: "We look at your business closely and name the leaks: where time, money and attention are slipping away." },
    { k: "We identify your stage.", v: "Foundation, Growth or Scale. This decides where the effort goes first." },
    { k: "We build a focused 90-day plan.", v: "A short list of priorities, each with an owner and a date." },
    { k: "We execute it together.", v: "Your team, our team and the right specialists work the plan with full support." },
    { k: "We run the growth engine.", v: "Once the foundation holds, Content, Community and Collaborations bring opportunities to you." },
  ],
} as const;

export const EXPECT = {
  title: "What you can expect.",
  points: [
    { k: "A named plan.", v: "You see priorities, owners and dates from week three." },
    { k: "Regular check-ins.", v: "You always know what is done, what is next and what needs your decision." },
    { k: "Real milestones.", v: "We report against what we agreed, not against vanity numbers." },
    { k: "A next step.", v: "At day 90, you leave with a clear plan for the stage after this one." },
  ],
} as const;

export const FAQ = [
  { q: "Is this only strategy?", a: "No. We make the plan and help you execute it. That is the point of the sprint." },
  { q: "Do I have to start at Foundation?", a: "No. You can join at any stage. The diagnosis tells us where you should begin." },
  { q: "Will we work only on content?", a: "No. Content and personal branding are one part of what we do. Many engagements start with strategy, positioning or brand." },
  { q: "Who does the work?", a: "Our core team, plus specialists brought in for the problem in front of us. We tell you who is doing what." },
  { q: "What happens after 90 days?", a: "You get a results review and a next-stage plan. Many clients continue. Some take the plan and run with it." },
] as const;

/* ───────────────────────── About ───────────────────────── */

export const ABOUT = {
  lines: ["We Don't Just Consult.", "We Co-Build."],
  sub: "DreamSVin helps businesses build, grow and scale. We make the plan, then we sit next to you and help carry it out.",
  philosophyTitle: "Why we work this way.",
  philosophy:
    "Advice alone rarely changes a business. The gap sits between the plan and the doing. So we stay for the doing. We find what's holding you back, agree on a focused 90-day plan, and work through it with you, with the right specialists on board.",
  beliefs: [
    { k: "Clarity before activity.", v: "A clear plan beats a busy calendar." },
    { k: "Work that shows.", v: "Real projects, clear milestones, accountability." },
    { k: "Plain language.", v: "If it needs decoding, we haven't done our job." },
  ],
  founder: {
    name: "Isha Vijay Ostwal",
    title: "Founder",
    roles: "Entrepreneur · Growth Consultant · Execution Partner · Career Strategist · Speaker",
    photo: { src: "/people/isha.jpg", alt: "Isha Vijay Ostwal, founder of DreamSVin, at the World Economic Forum" },
    // Copy doc: "a three to four line bio in her voice… first person… keep numbers out unless they are verified."
    // Condensed from the founder section of the old live site. Needs Isha's read.
    bio: [
      "Most founders don't have a strategy problem. They have an execution problem: they know what needs to happen, but not the team, the systems or the bandwidth to make it happen consistently.",
      "I built DreamSVin to close that gap, as a partner that sits with businesses, founders and institutions and turns strategy into measurable outcomes. It comes from my own work co-founding Ragandha Lifecare and guiding companies from idea to scale.",
    ],
    // Order matters: the home strip shows the first three. Checked 1 Nov 2026: the JITO role and Ragandha
    // (MCA registry, MIT-WPU) have outside sources; the rest come from Isha's own profile and the old site.
    roles2: [
      "National Co-Convenor, JITO Incubation & Innovation Foundation",
      "Co-founder, Ragandha Lifecare",
      "Mentor, Mercedes-Benz BeVisioneers",
      "Global Shaper, World Economic Forum",
      "Advisor to WISE, SNDT University and the Government of Maharashtra on education and innovation",
    ],
    // From the old live site. Hidden until Isha verifies them (copy doc: no unverified numbers in the founder section).
    linkedin: "https://www.linkedin.com/in/isha-ostwal-2112641a9",
    factsVerified: false,
    facts: [
      { v: "50+", k: "speaking engagements" },
      { v: "1,000+", k: "people mentored" },
      { v: "1", k: "patent in healthcare innovation" },
    ],
    closing: "Whether you're building a company, a career or an idea that matters, DreamSVin exists to help you move from potential to performance.",
  },
  teamTitle: "The team behind your plan.",
  teamLine: "A core team that stays with you, and specialists who join when your business needs them.",
  // Draft (not in the copy doc): a way in for specialists, since the model depends on them. Needs Isha's OK.
  specialists: {
    title: "Are you a specialist?",
    copy: "Strategists, designers, marketers, developers and operators join our extended team when a client needs them. Send us a short note and your work.",
    cta: "Join the extended team",
    subject: "Extended team: specialist introduction",
  },
} as const;

/* ───────────────────────── Contact ───────────────────────── */

export const CONTACT = {
  title: "Let's find what's holding your business back.",
  sub: "Tell us a little about your business. We'll reply within one working day to set up a free consultation.",
  stages: ["Just starting", "Established, but stuck", "Growing, but stretched", "Institution or leadership team"],
  budgets: ["₹1 lakh – ₹2.5 lakh per month", "₹2.5 lakh – ₹5 lakh per month", "₹5 lakh+ per month"], // copy doc: ₹1 lakh to ₹5 lakh+ per month (optional, pending her decision)
  consent: "I agree to be contacted by DreamSVin about my enquiry.",
  submit: "Book My Free Consultation",
  thanks: "Thank you. We've got your details and will be in touch within one working day.", // copy doc adds "Check your inbox for a confirmation." — restore once the Apps Script sends one
  next: ["We read your enquiry.", "We reply to set up a 30-minute call.", "You leave the call with a clear view of what's holding you back."],
} as const;

/* ───────────────────────── Language guardrails (for reviewers) ───────────────────────── */

export const LANGUAGE = {
  use: [
    "We help businesses build, grow and scale",
    "We find what's holding your business back",
    "We make the plan and help execute it",
    "Your extended strategy, growth and execution team",
    "A focused 90-day action plan",
    "The right expertise for the right problem",
    "Real projects, clear milestones and accountability",
  ],
  avoid: [
    "We empower visionary brands",
    "We unlock limitless potential",
    "End-to-end holistic solutions",
    "Full-stack 360-degree agency",
    "Revolutionary growth hacking",
    "We do everything",
    "Guaranteed exponential growth",
  ],
} as const;
