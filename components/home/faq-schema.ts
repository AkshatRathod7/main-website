// Server-safe: plain-text FAQ answers for FAQPage JSON-LD, from the Website Copy doc (How We Work FAQ).
import { FAQ } from "@/content/site";

export const FAQ_SCHEMA = FAQ.map((f) => ({ q: f.q, text: f.a }));
