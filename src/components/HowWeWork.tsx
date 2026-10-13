import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';

const sprint = [
  {
    id: '01',
    days: 'Days 1–15',
    title: 'Diagnose',
    desc: 'We study your business, customers and goals to find the gaps, leakages and missed opportunities.',
    outcome: 'Business audit and priority opportunities',
  },
  {
    id: '02',
    days: 'Days 16–30',
    title: 'Plan',
    desc: 'We agree on what matters most and turn it into a 90-day roadmap with milestones and clear ownership.',
    outcome: '90-day roadmap and first improvements',
  },
  {
    id: '03',
    days: 'Days 31–60',
    title: 'Execute',
    desc: 'We work alongside your team, bring in the right specialists and get the agreed work done.',
    outcome: 'Initiatives implemented, progress tracked',
  },
  {
    id: '04',
    days: 'Days 61–90',
    title: 'Optimise',
    desc: "We review what's working, strengthen the systems and plan the next stage of growth.",
    outcome: 'Results review and next-stage plan',
  },
];

export default function HowWeWork() {
  return (
    <section className="py-20 sm:py-28 px-6 sm:px-[8vw]">
      <SectionHeading
        eyebrow="How We Work · The 90-Day Growth Sprint"
        title={<>From Business Challenges to <span className="text-accent">Action in 90 Days.</span></>}
        intro="No endless planning. No disconnected execution. A clear plan, real work and measurable progress, every 90 days."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {sprint.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="relative bg-surface/50 border border-white/5 p-7 sm:p-10 rounded-[32px] sm:rounded-[40px] hover:border-accent/20 transition-all flex flex-col"
          >
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent/10 text-accent font-bold text-sm">
                {step.id}
              </div>
              <span className="font-display text-[11px] sm:text-xs font-bold tracking-widest uppercase text-gold">
                {step.days}
              </span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold mb-4">{step.title}</h3>
            <p className="text-muted leading-relaxed text-sm sm:text-base/7 mb-6 sm:mb-8 flex-1">{step.desc}</p>
            <div className="pt-6 border-t border-white/5 flex items-start gap-3 text-sm font-semibold">
              <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-2"></div>
              {step.outcome}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-10 sm:mt-14 text-center space-y-3"
      >
        <p className="font-display text-lg sm:text-2xl font-bold">
          Then <span className="text-gold">review, improve and repeat.</span> Every sprint builds the foundation for the next.
        </p>
        <p className="text-muted text-xs sm:text-sm">
          Timelines are indicative and adapted to the scope of each engagement.
        </p>
      </motion.div>
    </section>
  );
}
