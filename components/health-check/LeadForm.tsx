"use client";

import { useRef, useState } from "react";
import { LOCATIONS, ROLES, TEAM_SIZES, TOTAL_QUESTIONS } from "@/lib/health-check/questions";
import { leadSchema, type Lead, type LeadInput } from "@/lib/health-check/schema";
import { Arrow, Button } from "./ui";

type Errors = Partial<Record<keyof LeadInput, string>>;

const FIELD_ORDER: (keyof LeadInput)[] = ["name", "company", "role", "email", "whatsapp", "teamSize", "locations", "consent"];

export function LeadForm({
  initial,
  onChange,
  onSubmit,
  onBack,
  submitting,
  serverError,
}: {
  initial: Partial<LeadInput>;
  onChange: (lead: Partial<LeadInput>) => void;
  onSubmit: (lead: Lead, honeypot: string) => void;
  onBack: () => void;
  submitting: boolean;
  serverError: string | null;
}) {
  const [lead, setLead] = useState<Partial<LeadInput>>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const honeypot = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const set = <K extends keyof LeadInput>(k: K, v: LeadInput[K]) => {
    const next = { ...lead, [k]: v };
    setLead(next);
    onChange({ ...next, consent: undefined }); // never persist consent; ask each time
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validateField = (k: keyof LeadInput) => {
    const shape = leadSchema.shape[k];
    const r = shape.safeParse(lead[k]);
    setErrors((e) => ({ ...e, [k]: r.success ? undefined : r.error.issues[0]?.message }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = leadSchema.safeParse(lead);
    if (!r.success) {
      const next: Errors = {};
      for (const issue of r.error.issues) {
        const k = issue.path[0] as keyof LeadInput;
        next[k] ??= issue.message;
      }
      setErrors(next);
      const first = FIELD_ORDER.find((k) => next[k]);
      formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
      return;
    }
    onSubmit(r.data, honeypot.current?.value ?? "");
  };

  return (
    <section className="hc-enter grid gap-x-8 gap-y-14 lg:grid-cols-12" aria-labelledby="lead-title">
      <div className="lg:col-span-5">
        <p className="hc-label text-accent-text">
          {TOTAL_QUESTIONS} of {TOTAL_QUESTIONS} answered <span className="text-faint">·</span>{" "}
          <span className="text-muted">Score calculated</span>
        </p>
        <h2 id="lead-title" className="hc-display hc-sharpen mt-6 text-display-md">
          Where should we send <span className="hc-serif">your report?</span>
        </h2>

        {/* Phones: collapsed, so the form is within reach. Desktop: always visible beside the form. */}
        <details className="group mt-8 border-y border-hairline lg:hidden">
          <summary className="hc-label flex min-h-12 cursor-pointer list-none items-center justify-between text-muted [&::-webkit-details-marker]:hidden">
            Why we ask for these
            <span aria-hidden className="text-body-sm transition-transform duration-200 group-open:rotate-45">+</span>
          </summary>
          <div className="pb-6">
            <WhyWeAsk />
          </div>
        </details>
        <div className="mt-10 hidden border-t border-hairline lg:block">
          <p className="hc-label pt-5 text-faint">Why we ask</p>
          <div className="mt-4">
            <WhyWeAsk />
          </div>
        </div>
      </div>

      <form
        ref={formRef}
        onSubmit={submit}
        noValidate
        className="grid content-start gap-6 lg:col-span-6 lg:col-start-7"
        aria-describedby={serverError ? "lead-server-error" : undefined}
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField id="hc-name" label="Your name" autoComplete="name" field="name" value={lead.name} error={errors.name} onChange={(v) => set("name", v)} onBlur={() => validateField("name")} />
          <TextField id="hc-company" label="Company" autoComplete="organization" field="company" value={lead.company} error={errors.company} onChange={(v) => set("company", v)} onBlur={() => validateField("company")} />
        </div>

        <ChoiceField name="role" label="Your role" options={ROLES} value={lead.role} error={errors.role} onChange={(v) => set("role", v as LeadInput["role"])} />

        <div className="grid gap-6 sm:grid-cols-2">
          <TextField id="hc-email" type="email" inputMode="email" label="Email" autoComplete="email" field="email" value={lead.email} error={errors.email} onChange={(v) => set("email", v)} onBlur={() => validateField("email")} />
          <TextField
            id="hc-whatsapp"
            type="tel"
            inputMode="tel"
            label="WhatsApp"
            optional
            placeholder="+91 98200 12345"
            autoComplete="tel"
            field="whatsapp"
            value={lead.whatsapp}
            error={errors.whatsapp}
            onChange={(v) => set("whatsapp", v)}
            onBlur={() => validateField("whatsapp")}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-[3fr_2fr]">
          <ChoiceField name="teamSize" label="Team size" options={TEAM_SIZES} value={lead.teamSize} error={errors.teamSize} onChange={(v) => set("teamSize", v as LeadInput["teamSize"])} />
          <ChoiceField name="locations" label="Locations" options={LOCATIONS} value={lead.locations} error={errors.locations} onChange={(v) => set("locations", v as LeadInput["locations"])} />
        </div>

        {/* Honeypot: hidden from people and assistive tech */}
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Website
            <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div>
          <label className="flex cursor-pointer items-start gap-3 text-body-sm leading-snug text-muted">
            <input
              type="checkbox"
              data-field="consent"
              checked={lead.consent === true}
              onChange={(e) => set("consent", e.target.checked as true)}
              className="mt-[3px] h-[18px] w-[18px] shrink-0 cursor-pointer accent-[var(--accent)]"
              aria-invalid={!!errors.consent}
              aria-describedby={errors.consent ? "err-consent" : undefined}
            />
            <span>Email me this report. DreamSVin may contact me about it.</span>
          </label>
          {errors.consent && <FieldError id="err-consent">{errors.consent}</FieldError>}
        </div>

        {serverError && (
          <p id="lead-server-error" role="alert" className="border-l border-alert pl-4 text-body-sm text-alert">
            {serverError}
          </p>
        )}

        <div className="mt-2 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-6">
          <Button type="button" variant="ghost" onClick={onBack} className="-ml-3">
            <Arrow dir="left" /> Review answers
          </Button>
          <Button type="submit" loading={submitting}>
            {submitting ? "Calculating" : "Show my result"}
            {!submitting && <Arrow />}
          </Button>
        </div>
      </form>
    </section>
  );
}

function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="mt-2 text-caption text-alert">
      {children}
    </p>
  );
}

function TextField({
  id,
  label,
  field,
  value,
  error,
  optional,
  onChange,
  onBlur,
  ...rest
}: {
  id: string;
  label: string;
  field: keyof LeadInput;
  value: string | undefined;
  error?: string;
  optional?: boolean;
  onChange: (v: string) => void;
  onBlur?: () => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "onBlur">) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="hc-label flex justify-between text-muted">
        <span>{label}</span>
        {optional && <span className="text-faint">Optional</span>}
      </label>
      <input
        id={id}
        data-field={field}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        className={`mt-2 h-14 w-full rounded-[6px] border bg-surface-1 px-4 text-body text-ivory outline-none transition-colors duration-200 placeholder:text-faint hover:border-faint focus:border-accent focus-visible:outline-none ${
          error ? "border-alert" : "border-line-control"
        }`}
        {...rest}
      />
      {error && <FieldError id={`${id}-err`}>{error}</FieldError>}
    </div>
  );
}

function ChoiceField({
  name,
  label,
  options,
  value,
  error,
  onChange,
}: {
  name: keyof LeadInput;
  label: string;
  options: readonly string[];
  value: string | undefined;
  error?: string;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset aria-invalid={!!error} aria-describedby={error ? `err-${name}` : undefined} className="min-w-0">
      <legend className="hc-label text-muted">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((opt, i) => {
          const id = `hc-${name}-${i}`;
          const checked = value === opt;
          return (
            <label
              key={opt}
              htmlFor={id}
              className={`relative inline-flex min-h-11 cursor-pointer items-center rounded-[6px] border px-4 text-body-sm transition-colors duration-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-[1.5px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
                checked
                  ? "border-accent bg-accent/10 text-ivory"
                  : error
                    ? "border-alert/60 text-muted hover:text-ivory"
                    : "border-line-control text-muted hover:border-faint hover:text-ivory"
              }`}
            >
              <input
                id={id}
                type="radio"
                name={name}
                value={opt}
                data-field={i === 0 ? name : undefined}
                checked={checked}
                onChange={() => onChange(opt)}
                className="sr-only"
              />
              <span className="hc-tabular">{opt}</span>
            </label>
          );
        })}
      </div>
      {error && <FieldError id={`err-${name}`}>{error}</FieldError>}
    </fieldset>
  );
}

function WhyWeAsk() {
  return (
    <>
          <dl className="grid gap-5 text-body-sm leading-relaxed">
            <div>
              <dt className="text-ivory">Email</dt>
              <dd className="text-muted">Your full report goes here, so you can keep it or forward it to a partner.</dd>
            </div>
            <div>
              <dt className="text-ivory">Team size and locations</dt>
              <dd className="text-muted">
                They calibrate your result. What holds 20 people in one office together is different from what
                holds 300 across six cities.
              </dd>
            </div>
            <div>
              <dt className="text-ivory">Name, company and role</dt>
              <dd className="text-muted">So the consultation starts with your business, not with introductions.</dd>
            </div>
            <div>
              <dt className="text-ivory">WhatsApp, if you like</dt>
              <dd className="text-muted">Only to confirm a consultation there, if you book one.</dd>
            </div>
          </dl>
          <p className="mt-6 text-caption leading-relaxed text-faint">
            We don’t share or sell your details, and we don’t add you to a newsletter. See our{" "}
            <a href="/privacy" className="underline decoration-hairline-strong underline-offset-4 hover:text-ivory">
              privacy policy
            </a>
            .
          </p>
    </>
  );
}
