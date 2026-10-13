import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';

const engine = [
  { title: 'Content', tagline: 'Get discovered', desc: 'Become visible and discoverable to the people who matter to your business.' },
  { title: 'Community', tagline: 'Build trust', desc: 'Build relationships, credibility and long-term engagement around what you do.' },
  { title: 'Collaborations', tagline: 'Unlock reach', desc: 'Partner with the right people and organisations to open new audiences and opportunities.' },
];

export default function GrowthEngine() {
  return (
    <section className="py-20 sm:py-40 relative overflow-hidden bg-surface/30">
      <div className="absolute inset-0 bg-accent/5 blur-[100px] rounded-full translate-y-1/2 pointer-events-none"></div>

      <div className="relative z-10 px-6 sm:px-[8vw]">
        <SectionHeading
          eyebrow="Our Growth Engine · Content, Community, Collaborations"
          title={<>Build a Business That Attracts Opportunities, <span className="text-accent">Not Just Chases Them.</span></>}
          intro="Once the foundations are in place, our Content, Community and Collaborations approach helps you move from push to pull."
        />

        {/* Push → Pull */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-[1000px] mx-auto mb-14 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="border border-white/5 p-7 sm:p-10 rounded-[32px] sm:rounded-[40px]"
          >
            <p className="font-display text-[11px] sm:text-xs font-bold tracking-widest uppercase text-muted mb-3">From push</p>
            <h3 className="font-display text-xl sm:text-2xl font-bold mb-3 text-foreground/70">Constantly chasing business</h3>
            <p className="text-muted text-sm sm:text-base/7">Cold outreach, inconsistent leads, repetitive selling and growth that depends on the founder pushing every day.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-surface/60 border border-gold/30 p-7 sm:p-10 rounded-[32px] sm:rounded-[40px]"
          >
            <p className="font-display text-[11px] sm:text-xs font-bold tracking-widest uppercase text-gold mb-3">To pull</p>
            <h3 className="font-display text-xl sm:text-2xl font-bold mb-3">A business people seek out</h3>
            <p className="text-foreground/80 text-sm sm:text-base/7">Inbound enquiries, referrals, trusted authority, stronger relationships and opportunities that come to you.</p>
          </motion.div>
        </div>

        {/* The three Cs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {engine.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-surface/50 border border-white/5 p-7 sm:p-10 rounded-[32px] sm:rounded-[40px] hover:border-accent/20 transition-all text-center"
            >
              <h3 className="font-display text-2xl sm:text-3xl font-bold mb-2">{item.title}</h3>
              <p className="font-display text-sm font-bold tracking-widest uppercase text-gold mb-4 sm:mb-6">{item.tagline}</p>
              <p className="text-muted leading-relaxed text-sm sm:text-base/7">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 sm:mt-14 text-center text-muted text-sm sm:text-base max-w-[700px] mx-auto"
        >
          Push to pull doesn't mean giving up on sales. It means building enough trust, reach and relationships that growth stops depending on constant chasing.
        </motion.p>
      </div>
    </section>
  );
}
