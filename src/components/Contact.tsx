import React, { useState } from "react";
import Logo from "./Logo";
import { motion } from 'framer-motion';
import { supabase } from "../lib/supabase";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [challenge, setChallenge] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !challenge) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      // Step 1: Try inserting with 'challenge' column (matching new schema)
      let { error } = await supabase
        .from('leads')
        .insert([
          {
            name,
            email,
            challenge,
          }
        ]);

      // Step 2: If there's an error and it's a schema/column mismatch, fallback to 'message'
      if (error && (error.message?.includes("column") || error.code === "PGRST204")) {
        console.warn("Schema mismatch on 'challenge' column. Retrying with 'message' column...");
        const retryResult = await supabase
          .from('leads')
          .insert([
            {
              name,
              email,
              message: challenge,
            }
          ]);
        error = retryResult.error;
      }

      // Step 3: If that also fails, try with just name and email to preserve the lead
      if (error && (error.message?.includes("column") || error.code === "PGRST204")) {
        console.warn("Schema mismatch on 'message' column. Retrying with only name and email...");
        const finalResult = await supabase
          .from('leads')
          .insert([
            {
              name,
              email,
            }
          ]);
        error = finalResult.error;
      }

      if (error) {
        throw error;
      }

      setStatus("success");
      setName("");
      setEmail("");
      setChallenge("");
    } catch (err) {
      console.error("Supabase insert error:", err);
      setStatus("error");
      const message =
        typeof err === "object" && err !== null && "message" in err && typeof err.message === "string"
          ? err.message
          : "";
      setErrorMessage(message || "Failed to submit your audit request. Please try again or reach out via email.");
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
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold">Ready to Build a Brand <span className="text-accent">People Remember?</span></h2>
          <p className="text-muted text-base sm:text-xl/7 max-w-[600px] mx-auto leading-relaxed">
            Book your complimentary Growth Audit. Walk away with actionable insights, even if we never work together.
          </p>
        </div>

        {status === "success" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface/50 border border-gold/30 p-8 sm:p-12 rounded-[32px] sm:rounded-[40px] text-center space-y-4"
          >
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-accent">Audit Request Received</h3>
            <p className="text-foreground/80 text-sm sm:text-base max-w-[500px] mx-auto">
              Thank you for applying. We will review your brand details and reach out within 24 hours to schedule your session.
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block font-display text-sm font-bold text-muted uppercase tracking-widest ml-1">Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={status === "submitting"}
                  className="w-full bg-background/50 border border-white/5 rounded-2xl px-6 py-4 focus:border-accent outline-hidden transition-all disabled:opacity-50"
                />
              </div>
              <div className="space-y-2">
                <label className="block font-display text-sm font-bold text-muted uppercase tracking-widest ml-1">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={status === "submitting"}
                  className="w-full bg-background/50 border border-white/5 rounded-2xl px-6 py-4 focus:border-accent outline-hidden transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-display text-sm font-bold text-muted uppercase tracking-widest ml-1">Tell us about your business</label>
              <textarea
                placeholder="What's the biggest growth challenge you're facing right now?"
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
                required
                disabled={status === "submitting"}
                rows={4}
                className="w-full bg-background/50 border border-white/5 rounded-2xl px-6 py-4 focus:border-accent outline-hidden transition-all resize-none disabled:opacity-50"
              />
            </div>

            {status === "error" && (
              <p className="text-red-500 font-display text-sm font-semibold text-center">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full bg-accent text-white py-6 rounded-2xl font-display text-xl font-bold hover:scale-[0.99] transition-all active:scale-95 shadow-xl shadow-accent/20 disabled:opacity-50 disabled:hover:scale-100"
            >
              {status === "submitting" ? "Submitting Request..." : "Book My Growth Audit"}
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
