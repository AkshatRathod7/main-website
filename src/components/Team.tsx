import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';

const roles = [
  { title: 'Strategy', role: 'Like your Chief Strategy Officer', desc: 'Direction, priorities and the big decisions: what to fix, what to build and what to do first.' },
  { title: 'Growth', role: 'Like your Chief Growth Officer', desc: 'Demand, channels, partnerships and new opportunities to grow revenue and reach.' },
  { title: 'Execution', role: 'Your growth team', desc: 'Implementation, specialists and accountability, so the plan actually gets done.' },
];

const expertise = ['Business', 'Brand', 'Marketing', 'Technology', 'Partnerships', 'Operations'];

export default function Team() {
  return (
    <section className="py-20 sm:py-28 px-6 sm:px-[8vw]">
      <SectionHeading
        eyebrow="Your Extended Team"
        title={<>Your Business Needs More Than Advice. It Needs People Who <span className="text-accent">Get Things Done.</span></>}
        intro="Think of us as your strategy and growth team, without having to build one from scratch. You bring the business and the ambition. We bring the thinking, the right experts and the execution."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-[1100px] mx-auto">
        {roles.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-surface/50 border border-white/5 p-7 sm:p-10 rounded-[32px] sm:rounded-[40px] hover:border-accent/20 transition-all"
          >
            <h3 className="font-display text-2xl sm:text-3xl font-bold mb-2">{item.title}</h3>
            <p className="font-display text-sm font-bold text-gold mb-4 sm:mb-6">{item.role}</p>
            <p className="text-muted leading-relaxed text-sm sm:text-base/7">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 sm:mt-16 text-center"
      >
        <p className="font-display text-[11px] sm:text-[13px] font-bold tracking-[0.3em] text-muted uppercase mb-6">
          Experts on board, as your business needs them
        </p>
        <div className="flex flex-wrap justify-center gap-3 max-w-[800px] mx-auto mb-10">
          {expertise.map(area => (
            <span key={area} className="px-5 py-2 rounded-full border border-white/10 bg-white/5 font-display text-sm font-semibold">
              {area}
            </span>
          ))}
        </div>
        <p className="font-display text-lg sm:text-2xl font-bold max-w-[800px] mx-auto leading-snug">
          One strategic direction. One coordinated roadmap.{' '}
          <span className="text-gold">The right experts working towards your goals.</span>
        </p>
      </motion.div>
    </section>
  );
}
