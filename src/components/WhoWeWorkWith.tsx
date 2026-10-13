import { motion } from 'framer-motion';

const categories = [
  {
    title: 'Founders & Startups',
    people: ['First-Time Founders', 'Early-Stage Startups', 'D2C Brands', 'Service Businesses'],
  },
  {
    title: 'Established Businesses',
    people: ['Founder-Led Companies', 'Family Businesses', 'Businesses Due for a Revamp', 'Wellness & Lifestyle Brands'],
  },
  {
    title: 'Institutions',
    people: ['Colleges & Universities', 'Schools & Education Groups', 'Associations', 'Non-Profits'],
  },
  {
    title: 'Leaders & Experts',
    people: ['CEOs & CXOs', 'Business Unit Heads', 'Creators & Educators', 'Thought Leaders & Speakers'],
  },
];

export default function WhoWeWorkWith() {
  return (
    <section className="py-20 sm:py-28 px-6 sm:px-[8vw]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14 sm:mb-20"
      >
        <p className="font-display text-[11px] sm:text-[13px] font-bold tracking-[0.3em] text-muted uppercase mb-4">
          Who We Partner With
        </p>
        <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
          Built for Ambitious Businesses at Every Stage
        </h2>
        <p className="text-muted text-base sm:text-xl max-w-[700px] mx-auto">
          From a startup founder to a college owner or a CXO: we work with people who are ready to build, fix or grow something that matters, and ready to execute.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8">
        {categories.map((cat, index) => (
          <motion.div
            key={cat.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-surface/50 border border-white/5 p-7 sm:p-10 rounded-[32px] sm:rounded-[40px] hover:border-accent/20 transition-all group"
          >
            <h3 className="font-display text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-accent">
              {cat.title}
            </h3>
            <ul className="space-y-4">
              {cat.people.map((person) => (
                <li key={person} className="flex items-center gap-3 text-sm sm:text-base font-semibold text-foreground/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0"></div>
                  {person}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
