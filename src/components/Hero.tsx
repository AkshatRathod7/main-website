import { motion } from "framer-motion";
import Logo from "./Logo";

export default function Hero() {
  return (
    <section className="relative min-h-svh flex flex-col justify-center items-center px-6 sm:px-[8vw] pt-28 sm:pt-40 pb-16 sm:pb-20 overflow-hidden text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-[1200px] z-10 w-full"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-[11px] sm:text-[13px] font-bold tracking-[0.3em] text-muted uppercase mb-6 sm:mb-8"
        >
          Business Strategy · Growth · Execution
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-[clamp(36px,7.5vw,104px)] leading-[1.08] font-bold tracking-tight mb-8 sm:mb-12"
        >
          Your Business <span className="text-gold">Architects</span>.
          <br />
          Your Growth <span className="text-gold">Partners</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-[720px] mx-auto font-display text-base sm:text-xl/7 md:text-2xl/9 text-muted leading-relaxed mb-10 sm:mb-16 px-2"
        >
          We help businesses build, grow and scale. Whether you're starting from scratch, revamping an established business or ready to expand, we find what's holding you back, build a focused 90-day plan and work alongside you to execute it.
          <br /><br />
          <span className="text-foreground font-semibold">We don't just make the plan. We help execute it.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-20 sm:mb-32"
        >
          <a href="#contact" className="w-full sm:w-auto px-10 py-5 bg-gold text-black font-bold rounded-full hover:scale-105 transition-transform active:scale-95 shadow-xl shadow-gold/20">
            Let's Build Your Next 90 Days
          </a>
          <a href="#how" className="w-full sm:w-auto px-10 py-5 border border-gold/30 text-gold rounded-full hover:bg-gold/5 transition-colors">
            See How We Work
          </a>
        </motion.div>

        {/* The Scroll Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-10 sm:mt-20 pt-10 sm:pt-20 w-full"
        >
          <p className="font-display text-xl sm:text-3xl md:text-5xl font-bold opacity-30 tracking-wide">
            Foundation <span className="text-gold">/</span> Growth <span className="text-gold">/</span> Scale
          </p>
          <div className="mt-6 sm:mt-8 flex justify-center opacity-80">
            <Logo size="lg" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
