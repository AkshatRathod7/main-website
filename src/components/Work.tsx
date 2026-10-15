import { useState } from 'react';
import type { Variants } from 'framer-motion';
import { motion, AnimatePresence } from 'framer-motion';

const cases = [
  {
    category: 'event',
    title: 'OCEANMAN GOA',
    logo: '/logos/ocean man.jpg',
    pill: 'EVENT IP',
    before: 'Before: A bold concept with no execution infrastructure, zero partnerships, no digital presence, and no scale plan.',
    after: 'What Changed: DreamSVin built the execution engine, securing venue partnerships with Taj Hotels, aligning sponsors like Evocus, and scaling the event to 600+ participants.',
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
    before: 'Before: A single community run with no infrastructure to grow beyond one edition.',
    after: 'What Changed: DreamSVin executed end-to-end, securing Red Bull & Fitbit partnerships, coordinating 200+ volunteers, and building a repeatable system for 10,000+ participants.',
    metrics: [
      { label: 'PARTICIPANTS', value: '10K+' },
      { label: 'VOLUNTEERS', value: '200+' }
    ]
  },
  {
    category: 'brand',
    title: 'EUREKA FORBES',
    logo: '/logos/eurekaforbes.jpg',
    pill: 'BRAND POSITIONING',
    before: 'Before: A 40-year legacy brand with digital blind spots that prevented them from seeing what was not working.',
    after: 'What Changed: DreamSVin identified 12+ digital gaps, executed an ORA strategy with Schbang, and gave a heritage brand modern growth infrastructure.',
    metrics: [
      { label: 'LEGACY', value: '40YR' },
      { label: 'GAPS FIXED', value: '12+' }
    ]
  },
  {
    category: 'brand',
    title: 'SUPREME BHAGAR',
    logo: '/logos/supremm.jpg',
    pill: 'BRAND POSITIONING',
    before: 'Before: Strong offline presence but invisible online, lacking a content system and digital strategy.',
    after: 'What Changed: DreamSVin built a complete digital execution system, activating 25+ UGC creators, completing a full brand overhaul, and translating real-world engagement into online authority.',
    metrics: [
      { label: 'UGC CREATORS', value: '25+' },
      { label: 'DIGITAL OVERHAUL', value: '100%' }
    ]
  },
  {
    category: 'founder',
    title: 'PRUSTLR',
    logo: '/logos/prustlr.jpg',
    pill: 'FOUNDER GROWTH',
    before: 'Before: A strong product with no system to turn it into revenue, meaning strategy existed only on paper.',
    after: 'What Changed: DreamSVin built a 3-month execution roadmap and integrated a content-to-revenue engine that turned ideas into measurable outcomes.',
    metrics: [
      { label: 'ROADMAP', value: '3MO' },
      { label: 'ENGINE', value: 'C2R' }
    ]
  },
  {
    category: 'creator',
    title: 'MEHER ON MONEY',
    logo: '/logos/meheronmoney.jpg',
    pill: 'CREATORS',
    before: 'Before: Growth had flatlined at 184K, where posting more content was no longer moving the needle.',
    after: 'What Changed: DreamSVin repositioned the content strategy and built a compounding organic system that broke through the plateau to 200K+ followers.',
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
    before: 'Before: A Mumbai-only community with no playbook to expand beyond one city.',
    after: 'What Changed: DreamSVin built the community scaling playbook, enabling systematic expansion to Mumbai, Pune, Delhi, and Bangalore with a repeatable launch system.',
    metrics: [
      { label: 'CITIES', value: '4' },
      { label: 'PLAYBOOK', value: 'DONE' }
    ]
  }
];

const filters = [
  { id: 'all', label: 'ALL' },
  { id: 'event', label: 'EVENT IPs' },
  { id: 'brand', label: 'BRAND POSITIONING' },
  { id: 'founder', label: 'FOUNDER GROWTH' },
  { id: 'creator', label: 'CREATORS' },
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
            <p className="font-display text-[11px] sm:text-[13px] font-bold tracking-[0.3em] text-muted uppercase mb-4">
              Our Work
            </p>
            <h2 className="font-display text-[34px] sm:text-[60px] md:text-[80px] font-bold leading-none mb-3 sm:mb-6">
              Real Work.<br />Real <span className="text-accent">Impact.</span>
            </h2>
            <p className="text-muted text-sm sm:text-lg max-w-[520px]">
              Different businesses. Different challenges. Here's what changed when strategy met execution.
            </p>
          </div>

          {/* Filter row */}
          <div
            className="flex gap-5 sm:gap-6 font-display text-[11px] sm:text-[13px] font-semibold tracking-wide overflow-x-auto pb-1 scrollbar-none"
            style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
          >
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`shrink-0 transition-all duration-300 pb-1 ${
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
