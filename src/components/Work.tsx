import { useState } from 'react';
import type { Variants } from 'framer-motion';
import { motion, AnimatePresence } from 'framer-motion';

const cases = [
  {
    category: 'event',
    title: 'OCEANMAN GOA',
    logo: '/logos/ocean man.jpg',
    pill: 'EVENT IP',
    before: 'Before: Launch Phase',
    after: 'After: Scaled to 600+ participants with partners like Taj Hotels & Evocus.',
    metrics: [
      { label: 'PARTICIPANTS', value: '600+' },
      { label: 'VENUE PARTNER', value: 'TAJ' }
    ]
  },
  {
    category: 'event',
    title: 'MUMBAI 10K',
    logo: '/logos/mumbai 10k challenge.jpg',
    pill: 'EVENT IP',
    before: 'Before: Single Run',
    after: 'After: 10,000+ participants, Red Bull & Fitbit partnerships, 200+ volunteers managed.',
    metrics: [
      { label: 'PARTICIPANTS', value: '10K+' },
      { label: 'VOLUNTEERS', value: '200+' }
    ]
  },
  {
    category: 'brand',
    title: 'EUREKA FORBES',
    logo: '/logos/eurekaforbes.jpg',
    pill: 'BRAND GROWTH',
    before: 'Before: Legacy Blindspots',
    after: 'After: 12+ digital gaps identified, ORA strategy implementation with Schbang.',
    metrics: [
      { label: 'LEGACY', value: '40YR' },
      { label: 'GAPS FIXED', value: '12+' }
    ]
  },
  {
    category: 'brand',
    title: 'SUPREME BHAGAR',
    logo: '/logos/supremm.jpg',
    pill: 'BRAND GROWTH',
    before: 'Before: Offline Focus',
    after: 'After: 25+ UGC creators, full digital overhaul, real-world engagement spikes.',
    metrics: [
      { label: 'UGC CREATORS', value: '25+' },
      { label: 'DIGITAL OVERHAUL', value: '100%' }
    ]
  },
  {
    category: 'founder',
    title: 'PRUSTLR',
    logo: '/logos/prustlr.jpg',
    pill: 'FOUNDER CONSULTING',
    before: 'Before: Product Only',
    after: 'After: 3-month roadmap, content-to-revenue engine integration.',
    metrics: [
      { label: 'ROADMAP', value: '3MO' },
      { label: 'STRATEGY', value: 'C2R' }
    ]
  },
  {
    category: 'creator',
    title: 'MEHER ON MONEY',
    logo: '/logos/meheronmoney.jpg',
    pill: 'CREATORS & COACHES',
    before: 'Before: Stagnant @ 184K',
    after: 'After: 200K+ followers, compounding organic growth established.',
    metrics: [
      { label: 'FOLLOWERS', value: '200K+' },
      { label: 'GROWTH', value: 'AUTO' }
    ]
  },
  {
    category: 'community',
    title: 'REDEFINED',
    logo: '/logos/redefined.png',
    pill: 'COMMUNITY',
    before: 'Before: Mumbai Local',
    after: 'After: Pan-India presence (Mumbai, Pune, Delhi, Bangalore).',
    metrics: [
      { label: 'CITIES', value: '4' },
      { label: 'PLAYBOOK', value: 'DONE' }
    ]
  },
  {
    category: 'creator',
    title: 'SACHIN THAKUR',
    logo: '/logos/coach sachin thakur.jpg',
    pill: 'CREATORS & COACHES',
    before: 'Before: English Coaching',
    after: 'After: Storytelling Coach, 3x revenue growth, premium positioning.',
    metrics: [
      { label: 'REVENUE', value: '3X' },
      { label: 'REBRAND', value: 'PREMIUM' }
    ]
  }
];

const filters = [
  { id: 'all', label: 'ALL' },
  { id: 'event', label: 'EVENT IPs' },
  { id: 'brand', label: 'BRAND GROWTH' },
  { id: 'founder', label: 'FOUNDER CONSULTING' },
  { id: 'creator', label: 'CREATORS & COACHES' },
  { id: 'community', label: 'COMMUNITIES' }
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07 }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } }
};

export default function Work() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredCases = cases.filter(c =>
    activeFilter === 'all' || c.category === activeFilter
  );

  return (
    <section className="pt-20 sm:pt-40 pb-16 sm:pb-20">
      <div className="px-6 sm:px-[8vw] mb-8 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <h2 className="font-display text-[34px] sm:text-[60px] md:text-[80px] font-bold leading-none mb-3 sm:mb-6">
              Selected <span className="text-accent">Cases</span>
            </h2>
            <p className="text-muted text-sm sm:text-lg max-w-[500px]">
              We've helped 50+ brands and founders scale their impact through strategic content and infrastructure.
            </p>
          </div>

          {/* Filter row */}
          <div
            className="flex gap-5 sm:gap-6 font-display text-[11px] sm:text-[13px] font-semibold tracking-wide overflow-x-auto pb-1 scrollbar-none"
            id="work"
            style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
          >
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex-shrink-0 transition-all duration-300 pb-1 ${
                  activeFilter === filter.id
                    ? 'text-accent border-b-2 border-accent'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Static responsive grid — all cards always visible */}
      <div className="px-6 sm:px-[8vw]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredCases.map((item) => (
              <motion.div
                key={item.title}
                variants={cardVariants}
                layout
              >
                <CaseCard item={item} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function CaseCard({ item }: { item: typeof cases[0] }) {
  return (
    <motion.div
      whileHover={{ scale: 0.98 }}
      className="group relative bg-surface/50 border border-white/5 rounded-3xl p-6 sm:p-8 overflow-hidden hover:bg-surface transition-all duration-500 hover:border-accent/20 cursor-pointer h-full flex flex-col"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 blur-2xl rounded-full -mr-12 -mt-12 group-hover:bg-accent/10 transition-colors" />

      <div className="flex justify-between items-start mb-8">
        <div className="px-4 py-1.5 bg-accent/10 text-accent rounded-full font-display text-[11px] font-bold">
          {item.pill}
        </div>
        {item.logo && (
          <img
            src={item.logo}
            alt={item.title}
            className="h-8 md:h-10 w-auto object-contain grayscale group-hover:grayscale-0 transition-all opacity-60 group-hover:opacity-100"
          />
        )}
      </div>

      <h3 className="font-display text-2xl font-bold mb-4 group-hover:text-accent transition-colors">
        {item.title}
      </h3>

      <div className="space-y-4 mb-8 flex-1">
        <p className="text-muted text-sm italic">{item.before}</p>
        <p className="text-foreground/80 leading-relaxed text-sm">{item.after}</p>
      </div>

      <div className="flex gap-8 pt-6 border-t border-white/5">
        {item.metrics.map(metric => (
          <div key={metric.label}>
            <span className="block font-display text-2xl font-bold text-accent">{metric.value}</span>
            <span className="block font-display text-[10px] text-muted uppercase font-bold tracking-widest">{metric.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
