import { z } from "zod";
import { LOCATIONS, QUESTIONS, ROLES, TEAM_SIZES } from "./questions";

const answerValue = z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]);

/** Every question must be answered, and only known question ids are accepted. */
export const answersSchema = z
  .object(Object.fromEntries(QUESTIONS.map((q) => [q.id, answerValue])) as Record<string, typeof answerValue>)
  .strict();

/** Loose international format; Indian numbers are the common case. Optional. */
const whatsapp = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s\-()]/g, ""))
  .refine((v) => v === "" || /^\+?[0-9]{8,15}$/.test(v), {
    message: "Enter a number with country code, for example +91 98200 12345.",
  });

export const leadSchema = z.object({
  name: z.string({ required_error: "Enter your name." }).trim().min(2, "Enter your name.").max(80),
  company: z.string({ required_error: "Enter your company’s name." }).trim().min(2, "Enter your company’s name.").max(120),
  role: z.enum(ROLES, { errorMap: () => ({ message: "Choose the role closest to yours." }) }),
  email: z.string({ required_error: "Enter an email address we can send your report to." }).trim().toLowerCase().email("Enter an email address we can send your report to."),
  whatsapp: whatsapp.optional().default(""),
  teamSize: z.enum(TEAM_SIZES, { errorMap: () => ({ message: "Choose your team size." }) }),
  locations: z.enum(LOCATIONS, { errorMap: () => ({ message: "Choose the number of locations." }) }),
  consent: z.literal(true, { errorMap: () => ({ message: "Tick the box so we can email your report." }) }),
});

export const submissionSchema = z.object({
  answers: answersSchema,
  lead: leadSchema,
  meta: z
    .object({
      startedAt: z.string().datetime().optional(),
      completedAt: z.string().datetime().optional(),
      referrer: z.string().max(500).optional(),
      utm: z.record(z.string().max(200)).optional(),
    })
    .optional(),
  /** Honeypot. Real people never fill it; the route answers bots with a quiet success. */
  website: z.string().max(500).optional(),
});

export type Lead = z.infer<typeof leadSchema>;
export type LeadInput = z.input<typeof leadSchema>;
export type Submission = z.infer<typeof submissionSchema>;
