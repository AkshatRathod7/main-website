/**
 * Our Work. Two layers:
 *   1. CASES: the seven featured case studies from the Website Copy doc (challenge, mandate, what we built,
 *      impact, what's next). "What we built" is filled in from the Client Testimonials doc (27 Oct) where that
 *      doc covers the client; points Isha marked * (unconfirmed) are left out.
 *   2. CLIENTS: everyone else in the Client Testimonials doc, as a compact index with what we did.
 *
 * Honesty rules (copy doc): nothing invented. Where there is no verified result, `impact` says what is in progress.
 * `quote.approved` stays false until the client signs off; unapproved quotes don't render in production.
 */

export type Track = "Build" | "Grow" | "Launch";

export type Quote = { text: string; by: string; approved: boolean };

export type Case = {
  slug: string;
  client: string;
  line: string; // one-line summary
  track: Track;
  sector: string;
  focus: string;
  challenge: string;
  mandate: string;
  built: string[];
  impact: string;
  impactInProgress: boolean;
  next: string;
  quote?: Quote;
  result?: { v: string; k: string };
  featured?: boolean;
  /** Art direction for the card: which brand colour leads. */
  tone: "coral" | "gold" | "charcoal" | "cream";
};

export const CASES: Case[] = [
  {
    slug: "snjb",
    client: "SNJB",
    line: "A complete rebrand for a group of colleges.",
    track: "Build",
    sector: "Education",
    focus: "Institutional transformation",
    challenge: "An established group of colleges, founded in 1928, whose brand needed to reflect the quality and ambition of the institutions behind it.",
    mandate: "Rebuild the brand end to end.",
    built: [
      "A complete rebranding across the group, covering K. B. Jain College of Engineering and Shri H. H. J. B. Polytechnic",
      "A new logo inspired by knowledge and learning",
      "The colour palette and typography system",
      "\"100 Years Legacy\" centenary emblems",
      "The tagline brought to life: Vision through Knowledge. Life through Character.",
      "Online growth through the CCC framework",
    ],
    impact: "Rollout in progress across the group.",
    impactInProgress: true,
    next: "Extending the new brand across admissions, digital presence and campus communication.",
    quote: { text: "A 100-year legacy, reborn for the digital age.", by: "SNJB", approved: false },
    result: { v: "1928", k: "A century-old institution, rebranded" },
    featured: true,
    tone: "charcoal",
  },
  {
    slug: "nagarsheth-group",
    client: "Nagarsheth Group",
    line: "Founder positioning and growth for a heritage real estate developer in Diu and Daman.",
    track: "Grow",
    sector: "Real estate",
    focus: "Founder-led brand",
    challenge: "A real estate developer in Daman and Diu with a strong heritage and a founder whose story was not yet working as an asset.",
    mandate: "Build the founder's complete brand and run the CCC growth engine alongside it.",
    built: [
      "Founder positioning for Dhaval Upendrakumar",
      "A content strategy with a purpose behind every post",
      "Brand collaborations that opened new doors",
      "An engaged community around his work",
      "A Content, Community and Collaborations system, including a creator experience in Diu",
    ],
    impact: "The engine is live and building through the season.",
    impactInProgress: true,
    next: "Scaling the activation and the content engine through the next season.",
    quote: { text: "They didn't grow my page. They built my ecosystem.", by: "Dhaval Upendrakumar, Nagarsheth Group", approved: false },
    featured: true,
    tone: "gold",
  },
  {
    slug: "contiq",
    client: "ContIQ",
    line: "Growth foundations for an AI platform for creators.",
    track: "Grow",
    sector: "SaaS",
    focus: "Startup foundation",
    challenge: "A young SaaS platform for YouTube and Instagram creators that needed clear positioning and a repeatable way to grow.",
    mandate: "Own the growth strategy: the audit, the positioning and the CCC engine.",
    built: ["A growth audit", "Positioning work", "A Content, Community and Collaborations plan"],
    impact: "Work in progress.",
    impactInProgress: true,
    next: "Moving from plan to live execution across content and creator partnerships.",
    featured: true,
    tone: "coral",
  },
  {
    slug: "priyanshi-yadav",
    client: "Priyanshi Yadav",
    line: "Full growth for a Chartered Accountant creator.",
    track: "Grow",
    sector: "Professional services",
    focus: "Personal brand",
    challenge: "A practising Chartered Accountant with real expertise who needed a consistent, credible presence online.",
    mandate: "Handle complete growth through the CCC engine.",
    built: ["A done-for-you content and Instagram partnership", "A fast-growth content strategy", "Ongoing content support"],
    impact: "Her account grew to 10,000 followers in two weeks.",
    impactInProgress: false,
    next: "Deepening community and collaborations around her expertise.",
    quote: { text: "10,000 followers in just two weeks.", by: "CA Priyanshi Yadav", approved: false },
    result: { v: "10K", k: "followers in 2 weeks" },
    tone: "cream",
  },
  {
    slug: "resurgence-capital",
    client: "Resurgence Capital",
    line: "A website for a financial firm.",
    track: "Build",
    sector: "Financial services",
    focus: "Website",
    challenge: "A capital firm that needed a website that carries the credibility of the business.",
    mandate: "Design the website.",
    built: ["Complete end-to-end website design and development"],
    impact: "Delivered.",
    impactInProgress: false,
    next: "Live and in use.",
    quote: { text: "Website done right, from start to finish.", by: "Resurgence Capital", approved: false },
    tone: "charcoal",
  },
  {
    slug: "strongher-after-40",
    client: "Strongher After 40",
    line: "Product and content launch for a fitness coach.",
    track: "Launch",
    sector: "Health and fitness",
    focus: "Done-for-you",
    challenge: "A coach, Meghna Dharamsey, with a product ready to launch and no time to build the content engine around it.",
    mandate: "Launch the product and the content, done for her.",
    built: ["Her own product", "The content strategy and launch", "Her community, built from the ground up", "100% organic, real-audience growth"],
    impact: "Grew from 2,000 to 7,000 organic followers.",
    impactInProgress: false,
    next: "Keeping the content engine running after launch.",
    quote: { text: "Real, organic growth, and a community that cares.", by: "Meghna Dharamsey, Strongher After 40", approved: false },
    result: { v: "2K → 7K", k: "organic followers" },
    tone: "coral",
  },
  {
    slug: "ekoham",
    client: "Ekoham",
    line: "Events and page growth for a holistic wellness brand.",
    track: "Grow",
    sector: "Wellness",
    focus: "Community",
    challenge: "A wellness brand that needed to bring its community together and grow its audience.",
    mandate: "Host events and grow the page.",
    built: ["Community events, including the Wellness Weekend Reset", "Content for social media", "A complete rebrand of the business", "A strong offline presence"],
    impact: "More presence, more events and a growing customer base.",
    impactInProgress: false,
    next: "Building the event calendar into a repeatable community engine.",
    quote: { text: "More presence, more events, more customers.", by: "Ekoham Holistic Wellness", approved: false },
    tone: "gold",
  },
];

export type Client = { name: string; category: string; group: "Businesses" | "Creators" | "Institutions & events"; did: string[]; result?: string; quote?: Quote };

/** The rest of the client roster (Client Testimonials doc). Only unstarred points are used. */
export const CLIENTS: Client[] = [
  {
    name: "Oceanman Goa",
    category: "International open-water swimming event",
    group: "Institutions & events",
    did: ["Positioned Goa as a premium sports destination", "Built the full event strategy from scratch", "Acquired sponsors including Taj and Evocus", "Designed the athlete experience journey", "Managed end-to-end event execution"],
    quote: { text: "DreamSVin turned Goa into a world-class sports destination.", by: "Oceanman Goa", approved: false },
  },
  {
    name: "Mengo",
    category: "AI startup, founded by 14-year-old Jainam Jain",
    group: "Businesses",
    did: ["Helped build Mengo, an AI co-founder, from scratch", "Ran in-depth strategy calls with the founder", "Shaped the brand and growth plan", "End-to-end support across content and execution"],
    quote: { text: "They believed in a 14-year-old's dream and built it.", by: "Jainam Jain, Mengo", approved: false },
  },
  {
    name: "Spectratix Pharma",
    category: "Pharma brand and education ecosystem",
    group: "Businesses",
    did: ["Built PharmaGyan Academy with a complete LMS", "Developed and launched the website", "Built and positioned the Spectratix brand", "Created the founders' growth plan", "Ran the full CCC framework"],
    quote: { text: "From a regular pharmacy to a complete ecosystem.", by: "Spectratix Pharma", approved: false },
  },
  {
    name: "Bandma",
    category: "Business growth and consultation",
    group: "Businesses",
    did: ["End-to-end business consultation", "Systems and SOPs for smoother operations", "AI integrated into day-to-day work", "Planned and executed the growth strategy"],
    quote: { text: "They transformed our entire business, not just our marketing.", by: "Bandma", approved: false },
  },
  {
    name: "Prustlr",
    category: "Brand",
    group: "Businesses",
    did: ["Brand and content strategy", "Reels, creatives and video editing", "Social media managed end to end", "A standout ad creative"],
    quote: { text: "Like having an in-house creative powerhouse.", by: "Prustlr", approved: false },
  },
  {
    name: "Audex",
    category: "Brand",
    group: "Businesses",
    did: ["Rebranded the company end to end", "An automated lead generation system", "Online presence built from scratch", "Brand assets and creatives"],
    quote: { text: "A complete rebrand and a lead machine.", by: "Audex", approved: false },
  },
  {
    name: "Supremm Bhagar",
    category: "Food brand",
    group: "Businesses",
    did: ["Grew the page from scratch", "Influencer marketing campaigns", "Social media managed end to end"],
    quote: { text: "Built from scratch, powered by influence.", by: "Supremm Bhagar", approved: false },
  },
  {
    name: "Yogsadhak",
    category: "Prenatal and postnatal yoga coach",
    group: "Businesses",
    did: ["Repositioned from yoga teacher to pregnancy coach", "Complete rebrand", "Built the product", "Content end to end"],
    result: "169K views on one reel, from a dormant page",
    quote: { text: "From a dead page to 169K views.", by: "Yogsadhak", approved: false },
  },
  {
    name: "Entrelogy Business School",
    category: "Business school",
    group: "Institutions & events",
    did: ["Hosted and managed an ice-bath plunge event for students", "A memorable student experience", "Boosted student visibility"],
    quote: { text: "An event our students will never forget.", by: "Entrelogy Business School", approved: false },
  },
  {
    name: "Will Power Star",
    category: "Creator · events collaboration",
    group: "Institutions & events",
    did: ["Co-hosted AI events", "Offline marketing exposure", "Real-world connections with the audience"],
    quote: { text: "Bringing our brand into the real world.", by: "Will Power Star", approved: false },
  },
  {
    name: "Karishma Rathod",
    category: "Creator",
    group: "Creators",
    did: ["Content strategy, scripts and hooks", "Video editing and posting", "Designed and built karishmarathod.com", "Created her offers and set up lead generation"],
    result: "0 to 15K followers",
    quote: { text: "From zero to 15K, and a real business.", by: "Karishma Rathod", approved: false },
  },
  {
    name: "Dhaval Upendrakumar",
    category: "Creator and personal brand",
    group: "Creators",
    did: ["End-to-end growth of his personal brand", "A content strategy with purpose behind every post", "Brand collaborations that opened new doors", "An engaged community around his work", "The full 3C framework: Content, Collaboration, Community"],
    quote: { text: "They didn't grow my page. They built my ecosystem.", by: "Dhaval Upendrakumar", approved: false },
  },
  {
    name: "Meghna Dharamsey",
    category: "Creator",
    group: "Creators",
    did: ["Built her community from the ground up", "Built her own product", "Planned her content strategy", "100% organic, real-audience growth"],
    result: "2K to 7K organic followers",
    quote: { text: "Real, organic growth, and a community that cares.", by: "Meghna Dharamsey", approved: false },
  },
  {
    name: "Meher On Money",
    category: "Finance creator",
    group: "Creators",
    did: ["Broke a 100K creator out of a growth plateau", "Scripts and hooks built for reach", "Landed a brand collaboration with upGrad"],
    quote: { text: "They broke my plateau and took me viral.", by: "Meher On Money", approved: false },
  },
  {
    name: "Priya Jain",
    category: "Fitness creator",
    group: "Creators",
    did: ["Done-with-you, end-to-end support", "Scripts and video editing", "Built her own product", "Logo and complete brand identity"],
    quote: { text: "They helped me build my own brand.", by: "Priya Jain", approved: false },
  },
  {
    name: "Chandani Academy",
    category: "English educator",
    group: "Creators",
    did: ["Moved from offline teaching to fully online", "Built her online brand from scratch", "Grew her online presence and leads"],
    quote: { text: "From the classroom to a thriving online brand.", by: "Chandani Academy", approved: false },
  },
  // The next three come from the previous dreamsvin.com (the team's own published client list), not the
  // testimonials doc. Only the facts stated there are used; Isha should confirm them before launch.
  {
    name: "Eureka Forbes",
    category: "Legacy consumer brand",
    group: "Businesses",
    did: ["Found 12+ gaps in the brand's digital presence", "Ran an online reputation strategy with Schbang", "Gave a 40-year-old brand a modern growth set-up"],
  },
  {
    name: "Mumbai 10K Challenge",
    category: "Community running event",
    group: "Institutions & events",
    did: ["Ran the event end to end", "Secured Red Bull and Fitbit as partners", "Coordinated 200+ volunteers", "Built a repeatable system for 10,000+ participants"],
  },
  {
    name: "Redefined",
    category: "Community",
    group: "Institutions & events",
    did: ["Built the playbook for scaling the community", "Planned expansion across Mumbai, Pune, Delhi and Bangalore", "A repeatable launch system for each new city"],
  },
];

/** Also on the client list of the previous site, with no write-up yet. Shown by name or logo only. */
export const ALSO_WORKED_WITH = ["Culture Circle", "Analogy Design", "Estoquie", "Rise Global", "Pickle Paloza", "Here Comes The Bride", "House of Ekketa", "Ironman Kapil Arora", "Transform with Purva", "With Love Hitay", "PharmaGyan Academy"] as const;

/**
 * Every client in one list, for the client wall on the home page: the seven case studies first (they link to
 * their story), then the rest of the roster. "What we did" comes straight from the entries above.
 */
export type RosterEntry = { name: string; category: string; group: Client["group"]; did: string[]; result?: string; slug?: string };
const CASE_GROUP: Record<string, Client["group"]> = { snjb: "Institutions & events", "priyanshi-yadav": "Creators", "strongher-after-40": "Creators" };
export const ROSTER: RosterEntry[] = [
  ...CASES.map((c) => ({ name: c.client, category: c.sector, group: CASE_GROUP[c.slug] ?? ("Businesses" as const), did: c.built, result: c.result ? `${c.result.v} · ${c.result.k}` : undefined, slug: c.slug })),
  ...CLIENTS.map((c) => ({ name: c.name, category: c.category, group: c.group, did: c.did, result: c.result })),
];

/**
 * Results strip. The copy doc (24 Oct) says to hold it until the numbers are verified. The testimonials doc
 * (27 Oct, later) marks unconfirmed points with *, and all four figures below are unstarred, so they count
 * as stated facts. Set `verified: false` on any figure a client hasn't cleared, and it drops out.
 */
export const RESULTS = [
  { v: 15, suffix: "K", prefix: "0 → ", k: "followers, from a standing start", who: "Karishma Rathod", verified: true },
  { v: 10, suffix: "K", prefix: "", k: "followers in two weeks", who: "CA Priyanshi Yadav", verified: true },
  { v: 169, suffix: "K", prefix: "", k: "views on one reel, from a dormant page", who: "Yogsadhak", verified: true },
  { v: 7, suffix: "K", prefix: "2K → ", k: "organic followers", who: "Meghna Dharamsey", verified: true },
  { v: 100, suffix: "", prefix: "", k: "years of legacy, rebranded", who: "SNJB, est. 1928", verified: true },
] as const;

export const SHOW_DRAFT_QUOTES = process.env.NEXT_PUBLIC_SHOW_DRAFT_QUOTES === "1";
export const VISIBLE_RESULTS = RESULTS.filter((r) => r.verified || SHOW_DRAFT_QUOTES);
export const showQuote = (q?: Quote): q is Quote => Boolean(q && (q.approved || SHOW_DRAFT_QUOTES));

export const caseBySlug = (slug: string) => CASES.find((c) => c.slug === slug);
export const FEATURED = CASES.filter((c) => c.featured);
