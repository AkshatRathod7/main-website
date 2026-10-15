import React, { useState } from "react";
import Logo from "./Logo";
import { motion } from 'framer-motion';
import { submitLead } from "../lib/leads";

const stages = [
  "Starting or rebuilding",
  "Growing an existing business",
  "Preparing to scale or expand",
  "Not sure yet",
];

const labelClass = "block font-display text-sm font-bold text-muted uppercase tracking-widest ml-1";
const fieldClass = "w-full bg-background/50 border border-white/5 rounded-2xl px-6 py-4 focus:border-accent outline-hidden transition-all disabled:opacity-50";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [stage, setStage] = useState("");
  const [challenge, setChallenge] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !challenge) return;

    setStatus("submitting");

    try {
      await submitLead({ name, email, company, phone, stage, challenge, website });

      setStatus("success");
      setName("");
      setEmail("");
      setCompany("");
      setPhone("");
      setStage("");
      setChallenge("");
    } catch (err) {
      console.error("Lead submit error:", err);
      setStatus("error");
    }
  };

  return (
    <section className="min-h-screen pt-28 sm:pt-40 flex flex-col items-center px-6 sm:px-[8vw] pb-16 sm:pb-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-[800px] w-full text-center space-y-12"
      >
        <div className="space-y-6">
          <Logo size="custom" className="text-6xl md:text-8xl" />
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold">Let's Figure Out What's Next for <span className="text-accent">Your Business.</span></h2>
          <p className="text-muted text-base sm:text-xl/7 max-w-[640px] mx-auto leading-relaxed">
            Tell us what you're building, what isn't working or where you want to grow. We'll start by understanding your business and show you what the next 90 days could look like.
          </p>
        </div>

        {status === "success" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface/50 border border-gold/30 p-8 sm:p-12 rounded-[32px] sm:rounded-[40px] text-center space-y-4"
          >
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-accent">Request Received</h3>
            <p className="text-foreground/80 text-sm sm:text-base max-w-[500px] mx-auto">
              Thank you. We'll review your details and reach out within 24 hours to set up a conversation.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-4 px-6 py-3 border border-white/10 hover:border-accent/40 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Submit another request
            </button>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-surface/50 border border-white/5 p-7 sm:p-8 md:p-12 rounded-[32px] sm:rounded-[40px] space-y-6 sm:space-y-8 text-left"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-2">
                <label htmlFor="lead-name" className={labelClass}>Name</label>
                <input
                  id="lead-name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={status === "submitting"}
                  className={fieldClass}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lead-email" className={labelClass}>Email</label>
                <input
                  id="lead-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={status === "submitting"}
                  className={fieldClass}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lead-company" className={labelClass}>Company <span className="normal-case tracking-normal font-medium">(optional)</span></label>
                <input
                  id="lead-company"
                  type="text"
                  placeholder="Business or institution"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  disabled={status === "submitting"}
                  className={fieldClass}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lead-phone" className={labelClass}>Phone <span className="normal-case tracking-normal font-medium">(optional)</span></label>
                <input
                  id="lead-phone"
                  type="tel"
                  placeholder="+91"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={status === "submitting"}
                  className={fieldClass}
                />
              </div>
            </div>

            <div className="space-y-2 relative">
              <label htmlFor="lead-stage" className={labelClass}>Where is your business today?</label>
              <svg className="absolute right-6 bottom-5 w-4 h-4 text-muted pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
              <select
                id="lead-stage"
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                disabled={status === "submitting"}
                className={`${fieldClass} appearance-none ${stage ? "" : "text-muted"}`}
              >
                <option value="">Select a stage (optional)</option>
                {stages.map((option) => (
                  <option key={option} value={option} className="text-foreground bg-background">{option}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="lead-challenge" className={labelClass}>Tell us about your business</label>
              <textarea
                id="lead-challenge"
                placeholder="What are you trying to achieve, and what's getting in the way?"
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
                required
                disabled={status === "submitting"}
                rows={4}
                className={`${fieldClass} resize-none`}
              />
            </div>

            {/* Honeypot: hidden from people, filled in by bots, rejected by the leads script */}
            <input
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] h-px w-px opacity-0"
            />

            {status === "error" && (
              <p className="text-red-500 font-display text-sm font-semibold text-center">
                Something went wrong sending your request. Please try again, or email us at grow@dreamsvin.com.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full bg-accent text-white py-6 rounded-2xl font-display text-xl font-bold hover:scale-[0.99] transition-all active:scale-95 shadow-xl shadow-accent/20 disabled:opacity-50 disabled:hover:scale-100"
            >
              {status === "submitting" ? "Sending..." : "Book a Business Growth Consultation"}
            </button>
          </motion.form>
        )}

        <div className="pt-12 text-muted text-sm font-display font-medium">
          Prefer email? <a href="mailto:grow@dreamsvin.com" className="text-accent hover:underline">grow@dreamsvin.com</a>
        </div>
      </motion.div>
    </section>
  );
}
