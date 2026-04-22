import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- DATA ---

const BrandLogos = [
  'analogy design.jpg',
  'bandmaindia.jpg',
  'culturecircle.jpg',
  'estoquie.jpg',
  'eurekaforbes.jpg',
  'mumbai 10k challenge.jpg',
  'redefined.png',
  'rise global.jpg',
  'supremm.jpg',
  'pickle paloza.jpg',
  'hctb.jpg',
  'prustlr.jpg',
  'ocean man.jpg',
];

const PersonalBrandLogos = [
  'house of ekketa.jpg',
  'jainam.jpg',
  'coach sachin thakur.jpg',
  'ironmankapil arora.jpg',
  'meheronmoney.jpg',
  'transformwithpurva.jpg',
  'willpowerstar.jpg',
  'withlovehitay.jpg',
];

type TabType = 'brands' | 'personal';

// --- LOGO ROW: single seamless marquee ---

function LogoRow({ logos }: { logos: string[] }) {
  // Double the list so we can seamlessly loop: translate from 0% → -50%
  const doubled = [...logos, ...logos];
  const duration = logos.length * 4; // seconds per full pass

  return (
    <div className="flex overflow-hidden w-full">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          duration,
          ease: 'linear',
          repeat: Infinity,
        }}
        className="flex gap-6 items-center"
        style={{ willChange: 'transform' }}
      >
        {doubled.map((logo, index) => (
          <div
            key={`${logo}-${index}`}
            className="flex-shrink-0 group"
          >
            <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-3 sm:p-4 transition-all duration-500 group-hover:border-white/30 group-hover:bg-white/10 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-black/40">
              <img
                src={`/logos/${logo}`}
                alt={logo.replace(/\.(jpg|png)$/, '')}
                className="h-14 sm:h-20 md:h-24 w-auto object-contain max-w-[140px] sm:max-w-[180px] md:max-w-[200px] grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
              />
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// --- MAIN COMPONENT ---

export default function Clients() {
  const [activeTab, setActiveTab] = useState<TabType>('brands');

  const tabs: { id: TabType; label: string }[] = [
    { id: 'brands', label: 'Brands' },
    { id: 'personal', label: 'Personal Brands' },
  ];

  const logos = activeTab === 'brands' ? BrandLogos : PersonalBrandLogos;

  return (
    <section className="py-20 sm:py-28 bg-background overflow-hidden relative">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="px-6 sm:px-[8vw] mb-12 sm:mb-16 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-[11px] sm:text-[13px] font-bold tracking-[0.3em] text-muted uppercase mb-4"
        >
          Trusted By
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display text-2xl sm:text-4xl font-bold text-foreground mb-10"
        >
          We work with India's{' '}
          <span className="text-gold">Top 0.1%</span>
          <br className="hidden sm:block" />
          {' '}for their Overall Growth
        </motion.h2>

        {/* Tab Switcher */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-1 p-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative px-6 sm:px-8 py-2.5 rounded-full text-sm sm:text-base font-semibold transition-colors duration-300 focus:outline-none"
              style={{ color: activeTab === tab.id ? '#000' : 'rgba(255,255,255,0.5)' }}
            >
              {activeTab === tab.id && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-full bg-gold"
                  style={{ zIndex: -1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              {tab.label}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Single Logo Row */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="relative"
        >
          {/* Gradient Masks */}
          <div className="absolute inset-y-0 left-0 w-32 sm:w-48 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 sm:w-48 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <LogoRow logos={logos} />
        </motion.div>
      </AnimatePresence>

      {/* Footer count */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="text-center mt-14 sm:mt-16"
      >
        <span className="text-muted text-xs sm:text-sm tracking-widest uppercase font-medium">
          50+ Brands &amp; Creators and counting
        </span>
      </motion.div>
    </section>
  );
}
