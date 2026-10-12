import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "We stopped managing three different agencies because DreamSVin became our growth team. Their execution gave us clarity, momentum, and measurable business growth.",
    name: "Founder",
    company: "D2C Wellness Brand",
  },
  {
    quote: "Before DreamSVin, we had a strategy deck collecting dust. They turned it into a 90-day execution plan, and we hit our revenue target in 60.",
    name: "CEO",
    company: "Health-Tech Startup",
  },
  {
    quote: "DreamSVin didn't just build our content; they built the system. We went from inconsistent posting to a content engine that generates leads while we sleep.",
    name: "Founder & Creator",
    company: "Fitness Coaching Business",
  },
  {
    quote: "What sets DreamSVin apart is they don't disappear after the pitch. They stayed, built, iterated, and delivered. That's rare in this industry.",
    name: "Co-Founder",
    company: "Early-Stage Startup",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 sm:py-28 px-6 sm:px-[8vw]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14 sm:mb-20"
      >
        <p className="font-display text-[11px] sm:text-[13px] font-bold tracking-[0.3em] text-muted uppercase mb-4">
          From Our Partners
        </p>
        <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold">
          What Founders Say
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-[1000px] mx-auto">
        {testimonials.map((t, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-surface/50 border border-white/5 p-7 sm:p-10 rounded-[32px] sm:rounded-[40px] hover:border-accent/20 transition-all group"
          >
            <div className="text-accent text-3xl font-bold mb-4 leading-none">"</div>
            <p className="text-foreground/80 leading-relaxed text-sm sm:text-base/6 mb-6 sm:mb-8">
              {t.quote}
            </p>
            <div className="pt-6 border-t border-white/5">
              <p className="font-display text-sm font-bold text-foreground">{t.name}</p>
              <p className="font-display text-xs text-muted uppercase tracking-widest mt-1">{t.company}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
