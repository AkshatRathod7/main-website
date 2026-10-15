import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';

const stages = [
  {
    id: '01',
    title: 'Foundation',
    subtitle: 'Build or Rebuild',
    promise: 'Build it right before you grow it big.',
    desc: 'For new businesses getting started, and established organisations rethinking what no longer works.',
    items: ['Business research & customer understanding', 'Business model, offers & pricing', 'Positioning & brand identity', 'Go-to-market planning', 'Processes, SOPs & operating systems'],
  },
  {
    id: '02',
    title: 'Growth',
    subtitle: 'Attract, Convert & Retain',
    promise: 'Turn visibility into demand, and demand into business.',
    desc: 'Once the foundations are in place, we help you reach the right people and turn attention into real opportunities.',
    items: ['Content, community & collaborations', 'Marketing & customer acquisition', 'Lead generation & sales funnels', 'Founder & brand positioning', 'Partnerships & retention'],
  },
  {
    id: '03',
    title: 'Scale',
    subtitle: 'Expand & Systemise',
    promise: 'Build beyond your current capacity and market.',
    desc: 'For growing businesses preparing for their next stage, with repeatable systems and new opportunities.',
    items: ['Repeatable growth systems & automation', 'New revenue channels', 'Strategic alliances', 'Market-entry & expansion planning', 'Specialist execution support'],
  },
];

export default function Stages() {
  return (
    <section className="py-20 sm:py-28 px-6 sm:px-[8vw]">
      <SectionHeading
        eyebrow="What We Do"
        title={<>Whatever Stage You're At, We Help You <span className="text-accent">Move Forward.</span></>}
        intro="Foundation, Growth and Scale is how we look at every business. You start wherever you need to."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {stages.map((stage, index) => (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-surface/50 border border-white/5 p-7 sm:p-10 rounded-[32px] sm:rounded-[40px] hover:border-accent/20 transition-all flex flex-col"
          >
            <div className="flex items-baseline gap-4 mb-2">
              <span className="font-display text-sm font-bold text-accent">{stage.id}</span>
              <h3 className="font-display text-3xl sm:text-4xl font-bold">{stage.title}</h3>
            </div>
            <p className="font-display text-[11px] sm:text-xs font-bold tracking-widest uppercase text-muted mb-6 sm:mb-8">
              {stage.subtitle}
            </p>
            <p className="font-display text-lg sm:text-xl font-bold text-gold mb-4 leading-snug">{stage.promise}</p>
            <p className="text-muted leading-relaxed text-sm sm:text-base/7 mb-6 sm:mb-8">{stage.desc}</p>
            <ul className="space-y-3">
              {stage.items.map(item => (
                <li key={item} className="flex items-start gap-3 text-sm font-semibold">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-2"></div>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-10 sm:mt-14 text-center text-muted text-sm sm:text-base max-w-[700px] mx-auto"
      >
        Foundation doesn't always mean starting from zero, and Growth doesn't always mean social media.
      </motion.p>
    </section>
  );
}
