import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';

const situations = [
  {
    title: 'Starting something new',
    desc: 'You have the idea and the ambition, and need the right foundation before you invest in growth.',
  },
  {
    title: 'Due for a revamp',
    desc: "Your business is established, but the way it is positioned, organised or run no longer works.",
  },
  {
    title: 'Not reaching the right people',
    desc: "You're struggling to attract the right customers, students or partners, consistently.",
  },
  {
    title: 'Growing faster than your systems',
    desc: 'You have momentum, and now need stronger systems, new markets and a team to take it further.',
  },
];

export default function Problem() {
  return (
    <section className="py-20 sm:py-28 px-6 sm:px-[8vw]">
      <SectionHeading
        eyebrow="Where Are You Today?"
        title={<>Your Business Has Potential. Let's Find What's <span className="text-accent">Holding It Back.</span></>}
        intro="Your business may not need more marketing. It may need the right diagnosis."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-[1100px] mx-auto">
        {situations.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-surface/50 border border-white/5 p-7 sm:p-10 rounded-[32px] sm:rounded-[40px] hover:border-accent/20 transition-all"
          >
            <h3 className="font-display text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{item.title}</h3>
            <p className="text-muted leading-relaxed text-sm sm:text-base/7">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-14 sm:mt-20 text-center font-display text-lg sm:text-2xl md:text-3xl font-bold max-w-[900px] mx-auto leading-snug"
      >
        Different businesses. Different challenges.{' '}
        <span className="text-gold">One approach: understand the problem, build the plan and execute it.</span>
      </motion.p>
    </section>
  );
}
