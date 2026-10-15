import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';

const reasons = [
  { title: 'We see the bigger picture', desc: 'We look beyond a single marketing problem to understand the business behind it.' },
  { title: 'We build around your priorities', desc: 'No unnecessary services and no one-size-fits-all packages.' },
  { title: 'We bring the right people together', desc: 'Specialists and execution capability matched to what your business actually needs.' },
  { title: 'We stay involved', desc: 'From planning and implementation to regular reviews, progress tracking and course corrections.' },
  { title: 'We think beyond the next milestone', desc: "Every sprint strengthens your business's ability to keep growing." },
];

export default function WhyDreamSVin() {
  return (
    <section className="py-20 sm:py-28 px-6 sm:px-[8vw]">
      <SectionHeading
        eyebrow="Why DreamSVin"
        title={<>We Bring Strategy and Execution <span className="text-accent">Together.</span></>}
      />

      <div className="max-w-[1000px] mx-auto divide-y divide-white/5 border-y border-white/5">
        {reasons.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-8 py-6 sm:py-8"
          >
            <h3 className="md:col-span-5 font-display text-lg sm:text-2xl font-bold">{item.title}</h3>
            <p className="md:col-span-7 text-muted leading-relaxed text-sm sm:text-base/7">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Global ambition */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-16 sm:mt-24 max-w-[1100px] mx-auto bg-surface/50 border border-gold/20 p-8 sm:p-12 md:p-16 rounded-[32px] sm:rounded-[40px] text-center"
      >
        <p className="font-display text-[11px] sm:text-[13px] font-bold tracking-[0.3em] text-gold uppercase mb-4">
          Build Locally. Compete Globally.
        </p>
        <h3 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold mb-6">Built for Growth Beyond Boundaries.</h3>
        <p className="text-muted text-base sm:text-xl/8 max-w-[720px] mx-auto">
          Whether your next opportunity is a new city, a new customer segment, a national market or another country, we help you evaluate it, plan it and take the next steps.
        </p>
      </motion.div>
    </section>
  );
}
