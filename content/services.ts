/**
 * The five service pages. Names, headlines and opening lines are from the Website Copy doc
 * ("a proposal. Isha's brief confirms five pages but not their names"). Each page follows the doc's template:
 * headline, who it's for, what you get, how it runs in 90 days, one related case, CTA.
 * "What you get" draws only on the stage lists and the capabilities list in the same doc.
 */
import type { StageKey } from "./site";

export type Service = {
  slug: string;
  name: string;
  headline: string;
  opening: string;
  stage: StageKey;
  icon: "grid" | "eye" | "play" | "chat" | "connect";
  forWho: string[];
  get: string[];
  sprint: [string, string, string, string]; // what each 90-day phase looks like for this service
  related: string; // case slug
};

export const SERVICES: Service[] = [
  {
    slug: "business-strategy-and-positioning",
    name: "Business Strategy and Positioning",
    headline: "Know exactly who you serve and why they choose you.",
    opening: "We turn a blurry offer into a clear position your market can repeat.",
    stage: "foundation",
    icon: "grid",
    forWho: ["Founders starting out or rebuilding", "Established businesses whose growth has levelled off", "Leadership teams entering a new market"],
    get: ["Business audit and gap analysis", "Business model design", "Market research", "Positioning and messaging", "Offers and pricing", "Go-to-market plan"],
    sprint: [
      "Audit the business, the market and the competition. Name the leaks.",
      "Agree your position, your offers and your pricing. Owners and dates on everything.",
      "Put the new position to work: sales conversations, pitch, website and launch.",
      "Review what the market repeated back, tighten, and plan the next stage.",
    ],
    related: "contiq",
  },
  {
    slug: "brand-identity-and-websites",
    name: "Brand Identity and Websites",
    headline: "A brand that looks as serious as your work.",
    opening: "Identity, messaging and a website built to earn trust in the first ten seconds.",
    stage: "foundation",
    icon: "eye",
    forWho: ["Institutions whose brand lags behind their standing", "Firms that need to look as credible as they are", "New ventures that need an identity from day one"],
    get: ["Brand identity: logo, colour and typography", "Messaging and tone of voice", "Website design and development", "Brand guidelines your team can use", "Launch and rollout materials"],
    sprint: [
      "Audit how the brand reads today, to the people who matter.",
      "Agree the direction: identity, message and the site map.",
      "Design and build the identity and the website with your team.",
      "Launch, roll out across touchpoints, and review what's working.",
    ],
    related: "snjb",
  },
  {
    slug: "content-and-personal-branding",
    name: "Content and Personal Branding",
    headline: "Be the name people think of first.",
    opening: "A content system built around your expertise, your voice and your goals.",
    stage: "growth",
    icon: "play",
    forWho: ["Founders and leaders whose story is not yet an asset", "Experts and creators who need a consistent presence", "Brands that post a lot and are remembered little"],
    get: ["Content strategy and production", "Personal branding and positioning", "Scripts, hooks and editing", "A posting system your week can sustain", "Growth reviews against agreed numbers"],
    sprint: [
      "Audit your presence and find the story only you can tell.",
      "Set the content system: pillars, formats, calendar and owners.",
      "Produce and publish, every week, with your voice intact.",
      "Review what moved, double down, and plan the next quarter.",
    ],
    related: "nagarsheth-group",
  },
  {
    slug: "community-and-collaborations",
    name: "Community and Collaborations",
    headline: "Grow through people who already trust you.",
    opening: "Events, partnerships and creator collaborations that bring the right audience to you.",
    stage: "growth",
    icon: "chat",
    forWho: ["Brands with loyal customers and no community around them", "Businesses that grow through trust and referral", "Institutions that want to be seen in the real world"],
    get: ["Community building", "Events and activations", "Creator and brand collaborations", "Partnerships with institutions", "Offline and online, joined up"],
    sprint: [
      "Map who already trusts you, and who they trust.",
      "Plan the community, the events and the partners worth having.",
      "Host, collaborate and show up, with content from every moment.",
      "Review reach and response, and plan the next season.",
    ],
    related: "ekoham",
  },
  {
    slug: "growth-systems-and-scale",
    name: "Growth Systems and Scale",
    headline: "Growth that doesn't depend on you doing everything.",
    opening: "Funnels, automation and playbooks that keep working as you add customers.",
    stage: "scale",
    icon: "connect",
    forWho: ["Businesses ready to grow beyond the founder", "Teams moving into a new city or market", "Owners who want growth without more chaos"],
    get: ["Lead generation and sales funnels", "Automation", "SOPs and systems", "New revenue channels", "Strategic alliances and market expansion"],
    sprint: [
      "Trace how leads, sales and delivery actually move. Find where they stall.",
      "Design the funnels, systems and playbooks, with an owner for each.",
      "Build and run them alongside your team until they hold.",
      "Review the numbers, tighten the system, and plan the next market.",
    ],
    related: "strongher-after-40",
  },
];

export const serviceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug);
