import { useState } from 'react';
import Logo from "./Logo";
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const { error } = await supabase
        .from('leads')
        .insert([{ name, email, message }]);

      if (error) throw error;

      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');

      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err: unknown) {
      setStatus('error');
      setErrorMessage(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      );
      // Reset error after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
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
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold">Ready to build your <span className="text-accent">growth engine?</span></h2>
          <p className="text-muted text-base sm:text-xl max-w-[600px] mx-auto leading-relaxed">
            We're currently accepting 2 more partners for the next quarter. Tell us about your project.
          </p>
        </div>

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
                placeholder="Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={status === 'submitting'}
                className="w-full bg-background/50 border border-white/5 rounded-2xl px-6 py-4 focus:border-accent outline-none transition-all disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label className="block font-display text-sm font-bold text-muted uppercase tracking-widest ml-1">Email</label>
              <input
                type="email"
                placeholder="your email id"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'submitting'}
                className="w-full bg-background/50 border border-white/5 rounded-2xl px-6 py-4 focus:border-accent outline-none transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-display text-sm font-bold text-muted uppercase tracking-widest ml-1">What are you building?</label>
            <textarea
              placeholder="Tell us about your brand/community goals..."
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={status === 'submitting'}
              className="w-full bg-background/50 border border-white/5 rounded-2xl px-6 py-4 focus:border-accent outline-none transition-all resize-none disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full bg-accent text-white py-6 rounded-2xl font-display text-xl font-bold hover:scale-[0.99] transition-all active:scale-95 shadow-xl shadow-accent/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {status === 'submitting' ? (
              <span className="inline-flex items-center gap-3">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Sending...
              </span>
            ) : 'Send Inquiry'}
          </button>

          {/* Status feedback */}
          <AnimatePresence>
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center py-4 px-6 rounded-2xl bg-green-500/10 border border-green-500/20"
              >
                <p className="text-green-400 font-display font-bold text-lg">🎉 Inquiry sent successfully!</p>
                <p className="text-green-400/70 text-sm mt-1">We'll get back to you within 24 hours.</p>
              </motion.div>
            )}
            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center py-4 px-6 rounded-2xl bg-red-500/10 border border-red-500/20"
              >
                <p className="text-red-400 font-display font-bold">Failed to send inquiry</p>
                <p className="text-red-400/70 text-sm mt-1">{errorMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>

        <div className="pt-12 text-muted text-sm font-display font-medium">
          Reach out directly: <a href="mailto:grow@dreamsvin.com" className="text-accent hover:underline">grow@dreamsvin.com</a>
        </div>
      </motion.div>
    </section>
  );
}

