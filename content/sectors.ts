/**
 * The industries DreamSVin has grown, built from CASES and CLIENTS (content/cases.ts).
 * Honesty rule (same as cases.ts): every proof line is a figure or fact already stated in the client docs.
 * No invented numbers; a sector without a stated figure shows what was done instead.
 */
export type SectorKey = "education" | "realestate" | "wellness" | "creators" | "finance" | "tech" | "events" | "consumer";

export type Sector = {
  key: SectorKey;
  name: string;
  line: string;
  clients: string[];
  proof: { v: string; k: string; who: string };
};

export const SECTORS: Sector[] = [
  {
    key: "education",
    name: "Education",
    line: "Institutions with a century behind them, and students ahead.",
    clients: ["SNJB", "Entrelogy Business School", "Chandani Academy", "PharmaGyan Academy"],
    proof: { v: "1928", k: "A century-old college group, rebranded for its next hundred years", who: "SNJB" },
  },
  {
    key: "realestate",
    name: "Real estate",
    line: "Heritage developers, told as well as they build.",
    clients: ["Nagarsheth Group"],
    proof: { v: "Diu · Daman", k: "A founder's story turned into the developer's strongest asset", who: "Nagarsheth Group" },
  },
  {
    key: "wellness",
    name: "Health & wellness",
    line: "Coaches and brands people trust with their bodies.",
    clients: ["Strongher After 40", "Ekoham", "Yogsadhak", "Priya Jain"],
    proof: { v: "169K", k: "views on one reel, from a dormant page", who: "Yogsadhak" },
  },
  {
    key: "creators",
    name: "Creators & experts",
    line: "People with something to teach, finally heard.",
    clients: ["Karishma Rathod", "Meher On Money", "CA Priyanshi Yadav", "Will Power Star"],
    proof: { v: "0 → 15K", k: "followers, from a standing start", who: "Karishma Rathod" },
  },
  {
    key: "finance",
    name: "Finance",
    line: "Money businesses that look as sound as they are.",
    clients: ["Resurgence Capital", "Meher On Money", "CA Priyanshi Yadav"],
    proof: { v: "10K", k: "followers in two weeks for a Chartered Accountant", who: "CA Priyanshi Yadav" },
  },
  {
    key: "tech",
    name: "Tech & AI",
    line: "Products taken from first idea to first users.",
    clients: ["ContIQ", "Mengo"],
    proof: { v: "14", k: "the age of Mengo's founder. We helped build his AI co-founder from scratch", who: "Mengo" },
  },
  {
    key: "events",
    name: "Sport & events",
    line: "Experiences people travel for.",
    clients: ["Oceanman Goa", "Entrelogy Business School", "Will Power Star"],
    proof: { v: "Taj", k: "among the sponsors brought to an open-water swim in Goa", who: "Oceanman Goa" },
  },
  {
    key: "consumer",
    name: "Consumer brands",
    line: "Products that deserve a shelf, and a feed.",
    clients: ["Supremm Bhagar", "Prustlr", "Audex", "Spectratix Pharma"],
    proof: { v: "From zero", k: "pages grown from scratch, rebrands and a lead system that runs itself", who: "Supremm Bhagar · Audex" },
  },
];

/** Case-study sector (cases.ts) → the motif it wears. */
export const SECTOR_OF: Record<string, SectorKey> = {
  Education: "education",
  "Real estate": "realestate",
  SaaS: "tech",
  "Professional services": "finance",
  "Financial services": "finance",
  "Health and fitness": "wellness",
  Wellness: "wellness",
};
