import { z } from "zod";
import { CONTACT } from "@/content/site";

const STAGES = CONTACT.stages as unknown as [string, ...string[]];

/** Shared by the client form (instant feedback) and the API route (authority). */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Your name, please.").max(80, "That’s longer than we expected. 80 characters max."),
  email: z.string().trim().toLowerCase().email("That email doesn’t look complete."),
  company: z.string().trim().min(2, "Which business is this about?").max(120),
  phone: z
    .string()
    .trim()
    .max(20)
    .optional()
    .transform((v) => (v ? v.replace(/[^\d+]/g, "") : undefined))
    .refine((v) => !v || /^\+?\d{10,15}$/.test(v), "Use 10–15 digits, country code optional."),
  stage: z.enum(STAGES, { errorMap: () => ({ message: "Pick the one closest to where your business is today." }) }),
  budget: z.string().trim().max(60).optional(),
  consent: z.literal(true, { errorMap: () => ({ message: "Tick this so we can reply to you." }) }),
  message: z
    .string()
    .trim()
    .min(10, "A line or two is plenty. 10 characters minimum.")
    .max(1500, "Keep it under 1,500 characters. We’ll ask the rest."),

  // ── anti-spam (never shown to people) ──
  website: z.string().max(0).optional(), // honeypot: must stay empty
  startedAt: z.coerce.number().int().positive(), // time-trap: ms epoch when the form mounted
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;
export type FieldErrors = Partial<Record<keyof ContactInput, string>>;

export const MESSAGE_MAX = 1500;
export const MIN_FILL_MS = 3000;
