import Logo from "./Logo";
import { motion } from 'framer-motion';

export default function Contact() {
  return (
    <section className="min-h-screen pt-40 flex flex-col items-center px-[8vw] pb-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-[800px] w-full text-center space-y-12"
      >
        <div className="space-y-6">
          <Logo size="custom" className="text-6xl md:text-8xl" />
          <h2 className="font-display text-4xl md:text-5xl font-bold">Ready to build your <span className="text-accent">growth engine?</span></h2>
          <p className="text-muted text-xl max-w-[600px] mx-auto leading-relaxed">
            We're currently accepting 2 more partners for the next quarter. Tell us about your project.
          </p>
        </div>

        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-surface/50 border border-white/5 p-8 md:p-12 rounded-[40px] space-y-8 text-left"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block font-display text-sm font-bold text-muted uppercase tracking-widest ml-1">Name</label>
              <input
                type="text"
                placeholder="Name"
                required
                className="w-full bg-background/50 border border-white/5 rounded-2xl px-6 py-4 focus:border-accent outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block font-display text-sm font-bold text-muted uppercase tracking-widest ml-1">Email</label>
              <input
                type="email"
                placeholder="your email id"
                required
                className="w-full bg-background/50 border border-white/5 rounded-2xl px-6 py-4 focus:border-accent outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-display text-sm font-bold text-muted uppercase tracking-widest ml-1">What are you building?</label>
            <textarea
              placeholder="Tell us about your brand/community goals..."
              required
              rows={4}
              className="w-full bg-background/50 border border-white/5 rounded-2xl px-6 py-4 focus:border-accent outline-none transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-accent text-white py-6 rounded-2xl font-display text-xl font-bold hover:scale-[0.99] transition-all active:scale-95 shadow-xl shadow-accent/20"
          >
            Send Inquiry
          </button>
        </motion.form>

        <div className="pt-12 text-muted text-sm font-display font-medium">
          Reach out directly: <a href="mailto:grow@dreamsvin.com" className="text-accent hover:underline">grow@dreamsvin.com</a>
        </div>
      </motion.div>
    </section>
  );
}
