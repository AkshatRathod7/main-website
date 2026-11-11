"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import {
  contactSchema,
  MESSAGE_MAX,
  type ContactInput,
  type FieldErrors,
} from "@/lib/contact-schema";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/content/site";
import { track } from "@/lib/site";

type Status = "idle" | "submitting" | "success" | "error";
type Field = "name" | "email" | "company" | "phone" | "stage" | "budget" | "message";

const fields: { key: Field; label: string; type?: string; autoComplete?: string; optional?: boolean; span?: string; max: number }[] = [
  { key: "name", label: "Your name", autoComplete: "name", max: 80 },
  { key: "company", label: "Company or organisation", autoComplete: "organization", max: 120 },
  { key: "email", label: "Work email", type: "email", autoComplete: "email", max: 254 },
  { key: "phone", label: "Phone number", type: "tel", autoComplete: "tel", optional: true, max: 20 },
];

const empty: Record<Field, string> = { name: "", email: "", company: "", phone: "", stage: "", budget: "", message: "" };

function validateField(values: Record<Field, string>, key: Field | "consent", consent = true): string | undefined {
  const r = contactSchema.safeParse({ ...values, budget: values.budget || undefined, consent, startedAt: 1, website: "" });
  if (r.success) return undefined;
  return r.error.issues.find((i) => i.path[0] === key)?.message;
}

export function ContactForm({ bookHref }: { bookHref?: string }) {
  const id = useId();
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<Field | "consent", boolean>>>({});
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string>();
  const startedAt = useRef<number>(0);
  const honeypot = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (status !== "success") return;
    // Bring the whole receipt into view below the fixed nav, then focus its heading without a second jump.
    const el = successRef.current;
    el?.closest("[role=status]")?.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    el?.focus({ preventScroll: true });
  }, [status]);

  const set = (key: Field, v: string) => {
    const next = { ...values, [key]: v };
    setValues(next);
    // Only re-validate live once a field has been visited — no shouting while typing.
    if (touched[key]) setErrors((e) => ({ ...e, [key]: validateField(next, key) }));
  };

  const blur = (key: Field) => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors((e) => ({ ...e, [key]: validateField(values, key) }));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(undefined);

    const payload: ContactInput & { referrer?: string } = {
      ...values,
      phone: values.phone || undefined,
      budget: values.budget || undefined,
      consent: consent as true,
      referrer: document.referrer,
      website: honeypot.current?.value ?? "",
      startedAt: startedAt.current,
    };

    const check = contactSchema.safeParse({ ...payload, website: "", startedAt: 1 });
    if (!check.success) {
      const next: FieldErrors = {};
      for (const i of check.error.issues) next[i.path[0] as keyof FieldErrors] ??= i.message;
      setErrors(next);
      setTouched({ name: true, email: true, company: true, phone: true, stage: true, budget: true, message: true, consent: true });
      const first = (Object.keys(next) as Field[])[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fieldErrors?: FieldErrors };
      if (res.ok && data.ok) {
        setStatus("success");
        track("Contact Submitted");
        return;
      }
      if (data.fieldErrors) setErrors(data.fieldErrors);
      setFormError(data.error ?? "Please check the highlighted fields.");
      setStatus("error");
      track("Contact Failed", { status: String(res.status) });
    } catch {
      setFormError("We couldn’t reach our server. Check your connection; your message is still here.");
      setStatus("error");
      track("Contact Failed", { status: "network" });
    }
  }

  if (status === "success") {
    const first = values.name.trim().split(/\s+/)[0];
    return (
      <div role="status" aria-live="polite" className="success-in rounded-3xl bg-bg-elevated p-8 shadow-e2 md:p-10">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-accent text-on-accent">
            <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
              <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <p className="label-mono text-fg-subtle">Received · {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
        </div>
        <h3 ref={successRef} tabIndex={-1} className="mt-6 text-heading-lg outline-none [overflow-wrap:anywhere]">
          Thank you, {first}.
        </h3>
        <p className="mt-3 max-w-[48ch] text-body-lg text-fg-muted">{CONTACT.thanks.replace(/^Thank you\. /, "")}</p>
        {process.env.NEXT_PUBLIC_LEADS_AUTOREPLY === "1" && (
          <p className="mt-2 text-body text-fg-muted">Check your inbox for a confirmation.</p>
        )}
        <ol className="mt-8 text-body-sm">
          {CONTACT.next.map((t, i) => (
            <li key={t} className="flex gap-5 py-3.5">
              <span className="numeric text-caption text-accent-text">0{i + 1}</span>
              <span className="text-fg-muted">{t}</span>
            </li>
          ))}
        </ol>
        <dl className="mt-8 grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-2 text-body-sm [overflow-wrap:anywhere]">
          <dt className="label-mono text-fg-subtle">Company</dt>
          <dd className="text-fg-muted">{values.company}</dd>
          <dt className="label-mono text-fg-subtle">Reply to</dt>
          <dd className="text-fg-muted">{values.email}</dd>
        </dl>
        {bookHref && (
          <p className="mt-8 text-body-sm text-fg-muted">
            Rather not wait?{" "}
            <a href={bookHref} className="text-fg underline decoration-coral decoration-2 underline-offset-4">
              Pick a time now
            </a>
            .
          </p>
        )}
      </div>
    );
  }

  const busy = status === "submitting";
  const msgLen = values.message.length;

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} aria-busy={busy} className="relative">
      {formError && (
        <p role="alert" className="mb-6 rounded-lg border border-danger px-4 py-3 text-body-sm text-fg">
          {formError}
        </p>
      )}

      <div className="grid gap-x-6 gap-y-7 sm:grid-cols-2">
        {fields.map((f) => {
          const err = touched[f.key] ? errors[f.key] : undefined;
          const fid = `${id}-${f.key}`;
          return (
            <div key={f.key} className="field">
              <label htmlFor={fid} className="flex justify-between text-caption text-fg-muted">
                {f.label}
                {f.optional && <span className="text-fg-subtle">Optional</span>}
              </label>
              <input
                id={fid}
                name={f.key}
                type={f.type ?? "text"}
                autoComplete={f.autoComplete}
                inputMode={f.type === "tel" ? "tel" : undefined}
                maxLength={f.max}
                spellCheck={f.key === "company" ? undefined : false}
                value={values[f.key]}
                onChange={(e) => set(f.key, e.target.value)}
                onBlur={() => blur(f.key)}
                readOnly={busy}
                aria-invalid={!!err}
                aria-describedby={err ? `${fid}-err` : undefined}
                aria-required={!f.optional}
                className="input"
              />
              {err && (
                <p id={`${fid}-err`} className="mt-2 text-caption text-danger">
                  {err}
                </p>
              )}
            </div>
          );
        })}

        {(["stage", "budget"] as const).map((k) => {
          const isStage = k === "stage";
          const err = touched[k] ? errors[k] : undefined;
          const fid = `${id}-${k}`;
          const opts = isStage ? CONTACT.stages : CONTACT.budgets;
          return (
            <div key={k} className="field">
              <label htmlFor={fid} className="flex justify-between text-caption text-fg-muted">
                {isStage ? "Where is your business today?" : "Monthly investment range"}
                {!isStage && <span className="text-fg-subtle">Optional</span>}
              </label>
              <select
                id={fid}
                name={k}
                value={values[k]}
                onChange={(e) => set(k, e.target.value)}
                onBlur={() => blur(k)}
                disabled={busy}
                aria-invalid={!!err}
                aria-describedby={err ? `${fid}-err` : undefined}
                aria-required={isStage}
                className="input select"
              >
                <option value="">{isStage ? "Choose one" : "Prefer not to say"}</option>
                {opts.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              {err && (
                <p id={`${fid}-err`} className="mt-2 text-caption text-danger">
                  {err}
                </p>
              )}
            </div>
          );
        })}

        <div className="field sm:col-span-2">
          <label htmlFor={`${id}-message`} className="flex justify-between text-caption text-fg-muted">
            What would you like help with?
            <span className={`font-mono tabular-nums ${msgLen > MESSAGE_MAX ? "text-danger" : "text-fg-subtle"}`} aria-hidden>
              {msgLen}/{MESSAGE_MAX}
            </span>
          </label>
          <textarea
            id={`${id}-message`}
            name="message"
            rows={5}
            maxLength={MESSAGE_MAX + 200}
            value={values.message}
            onChange={(e) => set("message", e.target.value)}
            onBlur={() => blur("message")}
            readOnly={busy}
            placeholder="A line or two is plenty."
            aria-invalid={!!(touched.message && errors.message)}
            aria-describedby={touched.message && errors.message ? `${id}-message-err` : undefined}
            aria-required
            className="input min-h-[132px] resize-y"
          />
          {touched.message && errors.message && (
            <p id={`${id}-message-err`} className="mt-2 text-caption text-danger">
              {errors.message}
            </p>
          )}
        </div>
      </div>

      {/* Honeypot: off-screen, unfocusable, unlabelled for AT */}
      <div aria-hidden className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden">
        <label htmlFor={`${id}-website`}>Website</label>
        <input ref={honeypot} id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="mt-8">
        <label htmlFor={`${id}-consent`} className="flex min-h-11 cursor-pointer items-start gap-3 text-body-sm text-fg-muted">
          <input
            id={`${id}-consent`}
            name="consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked);
              if (touched.consent) setErrors((er) => ({ ...er, consent: e.target.checked ? undefined : validateField(values, "consent", false) }));
            }}
            aria-invalid={!!(touched.consent && errors.consent)}
            aria-describedby={touched.consent && errors.consent ? `${id}-consent-err` : undefined}
            className="check mt-0.5"
          />
          <span>
            {CONTACT.consent} See our{" "}
            <a href="/privacy" className="text-fg underline decoration-line-strong underline-offset-[0.22em]">
              privacy notice
            </a>
            .
          </span>
        </label>
        {touched.consent && errors.consent && (
          <p id={`${id}-consent-err`} className="mt-1 pl-8 text-caption text-danger">
            {errors.consent}
          </p>
        )}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-5">
        <p className="max-w-[36ch] text-caption text-fg-subtle">We reply within one working day.</p>
        {/* Stage 10: locked loading state (width held, aria-busy). Fields go read-only, not disabled,
            so focus is never dropped mid-submit. */}
        <Button type="submit" size="lg" arrow status={busy ? "loading" : "idle"}>
          {CONTACT.submit}
        </Button>
      </div>
      <p className="sr-only" aria-live="polite">{busy ? "Sending your message" : ""}</p>
    </form>
  );
}
