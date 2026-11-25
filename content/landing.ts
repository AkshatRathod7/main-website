/**
 * Pages written for the searches DreamSVin should be found for (Nov 2026 audit): the 90-day Growth Sprint,
 * Mumbai, Pune, the founder bottleneck, institutions and real estate. Rendered by components/pages/landing.tsx.
 *
 * Honesty rules, same as cases.ts: no invented numbers, clients, results, quotes or addresses. Every client
 * fact here is already stated in content/cases.ts or content/sectors.ts. Facts still to confirm carry
 * TODO(isha) and are listed in the PR.
 * Voice: plain, founder to founder, short sentences. None of: revolutionary, world-class, game-changing,
 * unlock, skyrocket.
 */

export type LandingSection = {
  h2: string;
  paras?: string[];
  list?: string[];
  /** Internal links shown under the section. */
  links?: { href: string; label: string }[];
};

export type Landing = {
  path: string;
  /** The layout adds " - DreamSVin"; keep ≤ 48 characters. */
  seoTitle: string;
  /** ≤ 155 characters. */
  seoDescription: string;
  kicker: string;
  h1: string[];
  sub: string;
  sections: LandingSection[];
  /** Show the four sprint phases (content/site.ts SPRINT) after this many sections. Omit to hide. */
  sprintAfter?: number;
  sprintIntro?: string;
  /** Case-study slugs from content/cases.ts. */
  cases: string[];
  casesTitle: string;
  faq: { q: string; a: string }[];
  cta: { title: string; copy: string };
  /** Breadcrumb label. */
  crumb: string;
  /** Schema: what the page offers and where. */
  service: { name: string; type: string; area?: "india" | "mumbai" | "pune" | "maharashtra" };
  /** Last substantive edit, for the sitemap. Update when the copy changes. */
  updated: string;
};

const SPRINT_LINK = { href: "/90-day-growth-sprint", label: "How the 90-day Growth Sprint works" };
const CONTACT_LINK = { href: "/contact", label: "Book a free consultation" };

export const LANDINGS: Landing[] = [
  /* ───────────────────────── The 90-day Growth Sprint ───────────────────────── */
  {
    path: "/90-day-growth-sprint",
    seoTitle: "90-Day Growth Sprint for Founder-Led Businesses",
    seoDescription:
      "How DreamSVin's 90-day Growth Sprint works: Diagnose (days 1–15), Plan (16–30), Execute (31–60), Optimise (61–90). What you get and who it is for.",
    kicker: "How we work",
    h1: ["The 90-day Growth Sprint."],
    sub: "One focused quarter to find what's holding your business back, fix what matters most, and leave with a plan for the next stage. Built with you, run with you.",
    crumb: "90-day Growth Sprint",
    service: { name: "90-day Growth Sprint", type: "Business growth consulting" },
    updated: "2026-11-25",
    sections: [
      {
        h2: "Why 90 days",
        paras: [
          "A year is too long to wait for proof. A month is too short to change anything that matters. Ninety days is long enough to diagnose properly, make real changes and see them hold. It is short enough that everyone stays focused.",
          "Most founders don't have a strategy problem. They have an execution problem. They know roughly what needs to happen. They don't have the time, the team or the systems to make it happen consistently. The sprint is built around that gap: a short plan, clear owners, and people who stay for the doing.",
        ],
      },
      {
        h2: "Days 1–15: Diagnose",
        paras: [
          "We start by looking closely at the business: the offer, the pricing, the customers, the team, the numbers you track and the ones you don't. We talk to you and, where it helps, to your team. By day 15 you have a business audit, a gap assessment and a short list of priority opportunities.",
          "The real constraint is often not where the founder expected it. That is why we don't skip this step, even when the answer seems obvious.",
        ],
      },
      {
        h2: "Days 16–30: Plan",
        paras: [
          "We turn the diagnosis into a 90-day roadmap. Every priority gets an owner and a date. We also name your stage, Foundation, Growth or Scale, because the stage decides where the effort goes first. The first improvements go live in this phase, so the plan is tested before it is final.",
        ],
      },
      {
        h2: "Days 31–60: Execute",
        paras: [
          "This is the longest phase, on purpose. We work through the agreed initiatives alongside your team, and bring in the right specialist when a problem needs one: a designer, a developer, a content team, a partnerships lead. You get regular check-ins. You always know what is done, what is next and what needs your decision.",
        ],
      },
      {
        h2: "Days 61–90: Optimise",
        paras: [
          "We review results against what we agreed, not against vanity numbers. We tighten what worked, drop what didn't, and map the next stage. You leave with a results review and a clear plan, whether you continue with us or run it yourself.",
        ],
      },
      {
        h2: "What you get",
        list: [
          "A business audit and a gap assessment",
          "A 90-day roadmap with an owner and a date on every priority",
          "Your stage named: Foundation, Growth or Scale",
          "Execution with our core team, plus specialists when the problem needs one",
          "Regular check-ins and milestone reviews",
          "A results review and a plan for the next stage",
        ],
      },
      {
        h2: "Who it is for",
        list: [
          "Founders whose growth has levelled off and who can't see why",
          "Founders who have become the bottleneck, with every decision waiting for them",
          "Businesses with a good offer and uneven demand",
          "Colleges and institutions whose brand lags behind their standing",
          "Leadership teams that need strategy and execution capacity without new headcount",
        ],
        paras: [
          "It is not for businesses that only want more posts. DreamSVin is a growth acceleration partner, not a social media agency. Content is one part of what we do. Many sprints start with strategy, positioning or brand.",
        ],
        links: [{ href: "/founder-bottleneck", label: "Read about the founder bottleneck" }],
      },
      {
        h2: "Where the CCC engine fits",
        paras: [
          "Once the foundation holds, the sprint runs the CCC growth engine: Content, Community and Collaborations. Content tells your story and your proof where customers pay attention. Community gathers people who know you and trust you. Collaborations put you in front of the right audiences through partners. Together they move a business from chasing every lead to having opportunities come to it.",
        ],
      },
    ],
    cases: ["snjb", "nagarsheth-group", "contiq"],
    casesTitle: "Sprints in practice",
    faq: [
      { q: "How much of my time does the sprint need?", a: "The most in the first 30 days, while we diagnose and plan. After that, regular check-ins and quick decisions when something needs you. We plan around your calendar." },
      { q: "Do you only plan, or do you execute too?", a: "Both. That is the point of the sprint. Some work we deliver ourselves and some with trusted partners. We tell you which, up front." },
      { q: "Do we have to start at Foundation?", a: "No. You can join at any stage. The diagnosis tells us whether you need Foundation, Growth or Scale work first." },
      { q: "What happens after day 90?", a: "You get a results review and a next-stage plan. Many clients continue. Some take the plan and run with it." },
      { q: "Is this a social media package?", a: "No. DreamSVin is a growth acceleration partner for founder-led businesses and institutions, not a social media agency. Content may be part of your plan, but the sprint starts with the business." },
    ],
    cta: { title: "Start with the diagnosis.", copy: "Book a free consultation. In one conversation we can tell you whether a 90-day sprint fits." },
  },

  /* ───────────────────────── Mumbai ───────────────────────── */
  {
    path: "/business-growth-consultant-mumbai",
    seoTitle: "Business Growth Consultant in Mumbai",
    seoDescription:
      "DreamSVin is a Mumbai-based growth partner for founder-led businesses. A 90-day Growth Sprint: diagnosis, plan and execution with your team.",
    kicker: "Mumbai",
    h1: ["Business growth consultant", "in Mumbai."],
    sub: "DreamSVin is based in Mumbai. We work with founders who have built something real and now need it to grow without depending on them for everything.",
    crumb: "Mumbai",
    service: { name: "Business growth consulting in Mumbai", type: "Business growth consulting", area: "mumbai" },
    updated: "2026-11-25",
    sections: [
      {
        h2: "Mumbai is our base",
        paras: [
          "Isha Vijay Ostwal runs DreamSVin from Mumbai. For Mumbai clients, that means we can be in the room when the work needs it: at your office, your site or your store, with your team. Diagnosis is better in person. So is an honest conversation about what is holding the business back.",
          "We are not a social media agency and we don't sell packages of posts. We are a growth acceleration partner. We find the constraint, build a focused 90-day plan, and help you carry it out.",
        ],
      },
      {
        h2: "What we see in Mumbai businesses",
        paras: [
          "Mumbai rewards speed. Many founder-led businesses here grew fast on the founder's own network and judgement. That is a strength until it becomes the ceiling. The same patterns come up again and again.",
        ],
        list: [
          "The founder is in every decision, so the business moves at the speed of one calendar",
          "New business depends on who the founder knows, not on a system",
          "The brand says less than the business actually delivers",
          "The team is capable, but nobody owns the plan end to end",
        ],
      },
      {
        h2: "Industries we have worked in",
        paras: [
          "Our work spans real estate, financial services, professional services and creators, consumer brands, health and wellness, events, education and technology. In real estate we built the founder's brand for Nagarsheth Group, a heritage developer. In financial services we built a website for Resurgence Capital. For a practising Chartered Accountant, we ran complete growth through the CCC engine.",
        ],
        links: [
          { href: "/what-we-do/real-estate", label: "Founder branding for real estate" },
          { href: "/#work", label: "See our work by industry" },
        ],
      },
      {
        h2: "A founder community behind the work",
        paras: [
          "Isha also founded Bombay Networking Circle (BNC), a founder community of 1,500 members across 10 cities. That matters for the Collaborations part of our CCC engine. The right introduction, partner or room is easier to find when it comes through people who already trust each other.",
        ],
      },
      {
        h2: "How a sprint runs for a Mumbai business",
        paras: [
          "Every engagement follows the same 90-day Growth Sprint. For a Mumbai business, the diagnosis can include time on site with you and your team, and check-ins can happen in person or online, whichever keeps the plan moving.",
        ],
        links: [SPRINT_LINK],
      },
    ],
    sprintAfter: 5,
    sprintIntro: "The same four steps as every engagement. You always know what is happening and who owns it.",
    cases: ["nagarsheth-group", "resurgence-capital", "priyanshi-yadav"],
    casesTitle: "Work we have done",
    faq: [
      { q: "Are you based in Mumbai?", a: "Yes. DreamSVin is based in Mumbai, and we meet Mumbai clients in person when the work needs it." },
      { q: "Do you only work with Mumbai businesses?", a: "No. We work with founder-led businesses and institutions across India, including Pune, in person and online." },
      { q: "Are you a digital marketing agency?", a: "No. We are a growth acceleration partner. Marketing and content can be part of the plan, but we start with the business: the offer, the positioning, the systems and the team." },
      { q: "What kind of business is a good fit?", a: "Founder-led businesses past the idea stage, colleges and institutions, and leadership teams that need strategy and execution capacity. The first call tells both of us whether we fit." },
      { q: "What does the first conversation cover?", a: "It takes 30 minutes. We look at where you are, where the leaks are, and what a focused 90 days could change. You leave with a clear view of what's slowing you down." },
    ],
    cta: { title: "Talk to a growth partner in Mumbai.", copy: "Book a free consultation. We'll look at where you are and what a focused 90 days could change." },
  },

  /* ───────────────────────── Pune ───────────────────────── */
  {
    path: "/business-growth-consultant-pune",
    seoTitle: "Business Growth Consultant in Pune",
    seoDescription:
      "Growth partner for founder-led businesses, colleges and tech founders in Pune. A 90-day Growth Sprint: we plan with you and help execute it.",
    kicker: "Pune",
    h1: ["Business growth consultant", "in Pune."],
    sub: "For founder-led businesses, colleges and technology founders in Pune. A 90-day Growth Sprint that you run with us, not a report you read and file.",
    crumb: "Pune",
    service: { name: "Business growth consulting in Pune", type: "Business growth consulting", area: "pune" },
    updated: "2026-11-25",
    sections: [
      {
        h2: "How we work with Pune businesses",
        paras: [
          "We are based in Mumbai, a short trip away. We come to Pune when the work needs us in the room, such as the diagnosis and key reviews, and work online in between. We don't have a Pune office and we won't pretend to.",
          "What matters more than an address is that the plan is clear, every priority has an owner, and somebody keeps it moving. That is the part we take on.",
        ],
      },
      {
        h2: "Colleges and institutions",
        paras: [
          "Pune is an education city. Many of its colleges and institutes have a reputation that their brand and website don't yet show. Families now judge an institution online long before they visit a campus.",
          "This is work we have done. We rebranded SNJB, a Maharashtra college group founded in 1928, across its institutions: a new logo, a colour and type system, centenary emblems, and online growth through the CCC engine. We have also worked with Entrelogy Business School and PharmaGyan Academy.",
        ],
        links: [{ href: "/what-we-do/institutions", label: "Branding and growth for institutions" }],
      },
      {
        h2: "Technology and SaaS founders",
        paras: [
          "Pune has a deep pool of technology companies, and many founders here are engineers first. The product is good. The positioning is blurry, and growth depends on the founder's own network.",
          "For ContIQ, a young SaaS platform for YouTube and Instagram creators, we owned the growth strategy: a growth audit, positioning work and a Content, Community and Collaborations plan.",
        ],
      },
      {
        h2: "Established and family businesses",
        paras: [
          "Some of the businesses we meet have run well for years and then levelled off. Often the cause is the founder bottleneck: every decision still waits at one desk. The Foundation stage resets the model, the offer and the systems so the business can grow past it.",
        ],
        links: [{ href: "/founder-bottleneck", label: "Read about the founder bottleneck" }],
      },
      {
        h2: "A wider network",
        // TODO(isha): confirm whether Bombay Networking Circle has members or a chapter in Pune; if so, say so here.
        paras: [
          "Isha Vijay Ostwal, our founder, also founded Bombay Networking Circle, a founder community of 1,500 members across 10 cities. For Pune clients it widens the Collaborations part of the work: introductions, partners and audiences beyond the city.",
        ],
      },
    ],
    sprintAfter: 5,
    sprintIntro: "Every Pune engagement follows the same four steps. In person when it counts, online in between.",
    cases: ["snjb", "contiq"],
    casesTitle: "Work we have done",
    faq: [
      { q: "Do you have an office in Pune?", a: "No. We are based in Mumbai and come to Pune when the sprint needs us there. Check-ins in between can run online." },
      { q: "Do you work with colleges in Pune?", a: "Yes. Colleges and institutions are one of the groups we work with. Our rebrand of SNJB, a Maharashtra college group founded in 1928, is a good example." },
      { q: "Can the whole sprint run online?", a: "Yes. The diagnosis is better with some time in person, but every phase can run online if that suits you." },
      { q: "Do you work with tech startups?", a: "Yes, from positioning through to the growth engine. Our work with ContIQ, a SaaS platform for creators, started with a growth audit and positioning." },
      { q: "Are you a social media agency?", a: "No. DreamSVin is a growth acceleration partner. Content can be part of the plan, but we start with the business." },
    ],
    cta: { title: "Talk to us about your Pune business.", copy: "Book a free consultation. We'll look at where you are and what a focused 90 days could change." },
  },

  /* ───────────────────────── Founder bottleneck ───────────────────────── */
  {
    path: "/founder-bottleneck",
    seoTitle: "The Founder Bottleneck: Signs and the Fix",
    seoDescription:
      "When every decision waits for the founder, growth slows to one person's attention. How to spot the founder bottleneck and remove it in 90 days.",
    kicker: "The founder bottleneck",
    h1: ["The founder bottleneck,", "and how to get out of it."],
    sub: "When every decision waits at one desk, the business grows at the speed of one person's attention. Here is how to spot it, and how a 90-day sprint removes it.",
    crumb: "Founder bottleneck",
    service: { name: "Founder bottleneck consulting", type: "Business process and operating design consulting" },
    updated: "2026-11-25",
    sections: [
      {
        h2: "What the founder bottleneck is",
        paras: [
          "In the early years, the founder's involvement in everything is the advantage. Decisions are fast. Judgement is sharp. Customers buy because they get you.",
          "Then the business grows and the habits don't change. Every decision that once took a minute now joins a queue at one desk. Growth slows, and the founder reads it as the team being slow. It isn't. The business was built around one person's judgement, and it still is.",
        ],
      },
      {
        h2: "Signs you are the constraint",
        list: [
          "Approvals wait until you are back from a trip",
          "Your team brings you questions they could answer themselves",
          "Revenue has levelled off, even though demand is there",
          "New business depends on your relationships, not on a system",
          "You are the only person who knows how the important things work",
          "You remind people of the same task three times before it is done",
        ],
        links: [
          { href: "/insights/the-owner-bottleneck", label: "Read: The owner bottleneck" },
          { href: "/insights/why-your-team-needs-reminding-three-times", label: "Read: Why your team needs reminding three times" },
        ],
      },
      {
        h2: "Why it isn't a people problem",
        paras: [
          "Most founders try to fix the bottleneck by hiring. A good manager helps, but only if there is something to manage: decisions written down, clear owners, and a rhythm the business runs on without being pushed. Without that, the new hire becomes a second queue.",
          "The bottleneck is a missing piece of infrastructure. Right now, that infrastructure is you.",
        ],
      },
      {
        h2: "How we remove it in 90 days",
        paras: [
          "We treat the founder bottleneck like any other constraint: diagnose it, plan the fix, build it with your team, and check that it holds.",
        ],
        list: [
          "Diagnose: map the decisions and tasks that wait for you, and why",
          "Plan: decide what stays with you, what moves, and who owns it",
          "Execute: write the SOPs, set the meeting rhythm and automate what repeats",
          "Optimise: review what still comes back to you, and close those gaps",
        ],
      },
      {
        h2: "What changes",
        paras: [
          "You stop being the answer to every question. Your team decides more, faster, inside limits you agreed. You spend your time on the few things only a founder can do: direction, key relationships and the next stage of growth.",
        ],
        links: [SPRINT_LINK, { href: "/what-we-do/growth-systems-and-scale", label: "Growth systems and scale" }],
      },
    ],
    cases: ["strongher-after-40", "nagarsheth-group"],
    casesTitle: "Related work",
    faq: [
      { q: "How do I know if I am the bottleneck?", a: "Take a week away and count the calls. If approvals wait, decisions queue and work slows until you are back, the business is built around you." },
      { q: "Can't I just hire a manager?", a: "You can, and later you probably should. But without written decisions, clear owners and a working rhythm, a new manager inherits the same queue. Build the system first." },
      { q: "Will I lose control of the business?", a: "No. You decide what stays with you. The aim is to keep your judgement on the decisions that matter and stop it being spent on the ones that don't." },
      { q: "How long does it take?", a: "We work in 90-day sprints. The first changes go live in the first month. By day 90 you can see which decisions no longer come to you." },
    ],
    cta: { title: "Find out where the business waits for you.", copy: "Book a free consultation. In 30 minutes we'll look at where the bottleneck sits and what 90 days could change." },
  },

  /* ───────────────────────── Institutions ───────────────────────── */
  {
    path: "/what-we-do/institutions",
    seoTitle: "Branding and Growth for Colleges in Maharashtra",
    seoDescription:
      "Brand identity, websites and growth for colleges and institutions in Maharashtra. Proof: the SNJB rebrand for a college group founded in 1928.",
    kicker: "For institutions",
    h1: ["Branding and growth for colleges", "and institutions in Maharashtra."],
    sub: "Your reputation took decades to build. Your brand, your website and your presence online should show it. We close that gap, and help you keep it closed.",
    crumb: "Institutions",
    service: { name: "Branding and growth for colleges and institutions", type: "Branding and growth consulting for educational institutions", area: "maharashtra" },
    updated: "2026-11-25",
    sections: [
      {
        h2: "The gap we close",
        paras: [
          "Many colleges in Maharashtra are better than they look. The teaching is good, the alumni are strong and the history is real. But the logo was designed decades ago, the website is hard to use on a phone, and the social pages are run by whoever has time.",
          "Students and parents now judge an institution online long before they visit. When the brand undersells the institution, good applicants go elsewhere.",
        ],
      },
      {
        h2: "What we do for institutions",
        list: [
          "A brand audit: how the institution reads today, to students, parents, faculty and industry",
          "Brand identity: logo, colour, typography and emblems",
          "Messaging that says what makes the institution different, in plain words",
          "A website built for the people who actually use it",
          "Brand guidelines your own team can follow",
          "Online growth through Content, Community and Collaborations",
        ],
        links: [{ href: "/what-we-do/brand-identity-and-websites", label: "Brand identity and websites" }],
      },
      {
        h2: "Proof: the SNJB rebrand",
        paras: [
          "SNJB is a group of colleges founded in 1928. Its brand needed to reflect the quality and ambition of the institutions behind it. We rebuilt the brand end to end, across the group, including K. B. Jain College of Engineering and Shri H. H. J. B. Polytechnic.",
          "The work covered a new logo inspired by knowledge and learning, the colour palette and typography system, \"100 Years Legacy\" centenary emblems, and the group's tagline brought to life: Vision through Knowledge. Life through Character. Online growth runs through the CCC framework. The rollout is in progress across the group.",
        ],
      },
      {
        h2: "How the sprint fits an institution",
        paras: [
          "Institutions decide through committees, and that is fine. We plan for it. The diagnosis includes the people who will approve the work, so decisions don't stall later. The roadmap names an owner on your side for every priority, and we time the rollout around your academic calendar.",
        ],
        links: [SPRINT_LINK],
      },
      {
        h2: "Content, community and collaborations for a campus",
        paras: [
          "Content shows the work: faculty, projects, placements and student life, told consistently. Community brings alumni, parents and students closer to the institution. Collaborations connect you with industry, other institutions and events that put your name in front of the right people.",
        ],
      },
    ],
    sprintAfter: 4,
    sprintIntro: "The same four steps as every engagement, planned around committee approvals and the academic calendar.",
    cases: ["snjb"],
    casesTitle: "Case study",
    faq: [
      { q: "Do you only work with colleges in Maharashtra?", a: "No. We work with institutions across India. We are based in Mumbai, and our rebrand of SNJB is in Maharashtra." },
      { q: "Can you work alongside our admissions team or an existing agency?", a: "Yes. We work with your team and with partners already in place. We tell you up front what we will deliver ourselves and what others will." },
      { q: "Do you build the website as well as the brand?", a: "Yes. Brand identity and the website are designed together, so the site carries the new brand from the first day." },
      { q: "Our decisions go through a committee. Is that a problem?", a: "No. We plan for it. The people who approve the work are part of the diagnosis, so the plan they sign off on is one they helped shape." },
    ],
    cta: { title: "Let your brand match your standing.", copy: "Book a free consultation. We'll look at how your institution reads today and what a focused 90 days could change." },
  },

  /* ───────────────────────── Real estate ───────────────────────── */
  {
    path: "/what-we-do/real-estate",
    seoTitle: "Founder Branding for Real Estate Businesses",
    seoDescription:
      "Founder positioning, content, community and collaborations for real estate developers in India. Proof: our work with Nagarsheth Group in Daman and Diu.",
    kicker: "For real estate",
    h1: ["Founder branding for", "real estate businesses."],
    sub: "In real estate, buyers want to know who is behind the project. We turn the founder's story into the developer's strongest asset, and build the engine that keeps it working.",
    crumb: "Real estate",
    service: { name: "Founder branding for real estate businesses", type: "Founder branding and growth consulting" },
    updated: "2026-11-25",
    sections: [
      {
        h2: "Why the founder matters in real estate",
        paras: [
          "Buying property is a large, slow decision built on trust. Before a buyer visits a site, they look up the developer, and then the person behind the developer. A founder with a clear story and a visible track record shortens that decision. A founder who can't be found online makes it longer.",
          "Many developers have exactly that story: a family name, decades of work, projects that stand. It just isn't working as an asset yet.",
        ],
      },
      {
        h2: "What we build",
        list: [
          "Founder positioning: what you stand for, and why buyers and partners should care",
          "A content strategy with a purpose behind every post",
          "Brand collaborations that put the founder and the projects in new rooms",
          "A community around the founder's work",
          "Experiences that create content and conversation, on site and around it",
        ],
        links: [{ href: "/what-we-do/content-and-personal-branding", label: "Content and personal branding" }],
      },
      {
        h2: "Proof: Nagarsheth Group",
        paras: [
          "Nagarsheth Group is a heritage real estate developer in Daman and Diu. The founder, Dhaval Upendrakumar, had a strong story that was not yet working as an asset. Our mandate was to build the founder's complete brand and run the CCC growth engine alongside it.",
          "We built founder positioning, a content strategy with a purpose behind every post, brand collaborations that opened new doors, and an engaged community around his work. The CCC system included a creator experience in Diu. The engine is live and building through the season.",
        ],
      },
      {
        h2: "More than leads",
        paras: [
          "Ads and listings bring enquiries. They don't build trust, and in real estate trust closes the sale. We are not a social media agency running ad campaigns. We build the founder's position and the CCC engine, Content, Community and Collaborations, so buyers, brokers and partners already know who you are when they meet you.",
        ],
      },
      {
        h2: "How the sprint runs",
        paras: [
          "Every engagement follows the same 90-day Growth Sprint. For a developer, the diagnosis looks at how the founder and the projects read today, to buyers, brokers and partners. The plan names the story, the channels and the collaborations. Then we produce, host and publish with you, and review what moved.",
        ],
        links: [SPRINT_LINK],
      },
    ],
    sprintAfter: 5,
    sprintIntro: "Four steps, one quarter, with the founder's voice intact.",
    cases: ["nagarsheth-group"],
    casesTitle: "Case study",
    faq: [
      { q: "Do I have to be on camera?", a: "Some of the time, yes. A founder brand needs the founder. We plan formats around your week, so it doesn't take over your calendar." },
      { q: "Do you run property ads or lead campaigns?", a: "That isn't where we start. We build the founder's position and the growth engine around it. Where paid campaigns make sense, we bring in the right specialist and tell you up front." },
      { q: "We are a family business. Whose story do we tell?", a: "The diagnosis decides that. Sometimes it is one founder, sometimes two generations. The aim is one clear story buyers can repeat." },
      { q: "Do you only work with developers in one region?", a: "No. We work with real estate businesses across India. Our work with Nagarsheth Group is in Daman and Diu, and we are based in Mumbai." },
    ],
    cta: { title: "Make the founder your strongest asset.", copy: "Book a free consultation. We'll look at how you and your projects read today and what a focused 90 days could change." },
  },
];

export const landingByPath = (path: string) => LANDINGS.find((l) => l.path === path);

/** Links for the home page and footer. */
export const LANDING_LINKS = [
  { href: "/90-day-growth-sprint", label: "The 90-day Growth Sprint" },
  { href: "/founder-bottleneck", label: "The founder bottleneck" },
  { href: "/what-we-do/institutions", label: "For colleges and institutions" },
  { href: "/what-we-do/real-estate", label: "For real estate founders" },
  { href: "/business-growth-consultant-mumbai", label: "Growth consultant in Mumbai" },
  { href: "/business-growth-consultant-pune", label: "Growth consultant in Pune" },
] as const;

export { CONTACT_LINK };
