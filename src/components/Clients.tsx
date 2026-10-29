import { useState, useRef } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';

// --- DATA ---

// Each client shows its logo from /public/logos when `logo` is set.
// Clients without a logo file yet show as a name card in the same style.
// To add a logo later: drop the file into public/logos and set `logo` to its filename.
type Client = { name: string; logo?: string };

const BrandLogos: Client[] = [
  { name: 'Analogy Design', logo: 'analogy design.jpg' },
  { name: 'Bandma', logo: 'bandmaindia.jpg' },
  { name: 'Culture Circle', logo: 'culturecircle.jpg' },
  { name: 'Estoquie', logo: 'estoquie.jpg' },
  { name: 'Eureka Forbes', logo: 'eurekaforbes.jpg' },
  { name: 'Mumbai 10K Challenge', logo: 'mumbai 10k challenge.jpg' },
  { name: 'Redefined', logo: 'redefined.png' },
  { name: 'Rise Global', logo: 'rise global.jpg' },
  { name: 'Supremm Bhagar', logo: 'supremm.jpg' },
  { name: 'Pickle Paloza', logo: 'pickle paloza.jpg' },
  { name: 'Here Comes The Bride', logo: 'hctb.jpg' },
  { name: 'Prustlr', logo: 'prustlr.jpg' },
  { name: 'Oceanman Goa', logo: 'ocean man.jpg' },
  { name: 'SNJB' },
  { name: 'Spectratix Pharma' },
  { name: 'Mengo' },
  { name: 'Yogsadhak' },
  { name: 'Audex' },
  { name: 'Ekoham Holistic Wellness' },
  { name: 'Entrelogy Business School' },
  { name: 'Resurgence' },
];

const PersonalBrandLogos: Client[] = [
  { name: 'House of Ekketa', logo: 'house of ekketa.jpg' },
  { name: 'Jainam Jain', logo: 'jainam.jpg' },
  { name: 'Ironman Kapil Arora', logo: 'ironmankapil arora.jpg' },
  { name: 'Meher On Money', logo: 'meheronmoney.jpg' },
  { name: 'Transform with Purva', logo: 'transformwithpurva.jpg' },
  { name: 'Will Power Star', logo: 'willpowerstar.jpg' },
  { name: 'With Love Hitay', logo: 'withlovehitay.jpg' },
  { name: 'Dhaval Upendrakumar' },
  { name: 'Karishma Rathod' },
  { name: 'CA Priyanshi' },
  { name: 'Meghna Dharamsey' },
  { name: 'Priya Jain' },
  { name: 'Chandani Academy' },
];

type TabType = 'brands' | 'personal';

// --- LOGO ROW: single seamless marquee ---

function LogoRow({ logos }: { logos: Client[] }) {
  const doubled = [...logos, ...logos];
  const duration = logos.length * 4;
  const controls = useAnimationControls();

  // Drag-to-scroll state
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const startAutoScroll = () =>
    controls.start({ x: ['0%', '-50%'], transition: { duration, ease: 'linear', repeat: Infinity } });

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX;
    if (containerRef.current) scrollLeft.current = containerRef.current.scrollLeft;
    controls.stop();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const dx = e.pageX - startX.current;
    containerRef.current.scrollLeft = scrollLeft.current - dx;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    startAutoScroll();
  };

  return (
    <div
      ref={containerRef}
      className="overflow-x-auto scrollbar-none w-full"
      style={{ cursor: isDragging.current ? 'grabbing' : 'grab', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => { isDragging.current = false; startAutoScroll(); }}
      onMouseEnter={() => controls.stop()}
    >
      <motion.div
        animate={controls}
        initial={{ x: '0%' }}
        onViewportEnter={() => startAutoScroll()}
        className="flex gap-6 items-center"
        style={{ willChange: 'transform', width: 'max-content' }}
      >
        {doubled.map((client, index) => (
          <div key={`${client.name}-${index}`} className="shrink-0 group">
            <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs p-3 sm:p-4 transition-all duration-500 group-hover:border-white/30 group-hover:bg-white/10 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-black/40">
              {client.logo ? (
                <img
                  src={`/logos/${client.logo}`}
                  alt={client.name}
                  className="h-14 sm:h-20 md:h-24 w-auto object-contain max-w-[140px] sm:max-w-[180px] md:max-w-[200px] grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                  draggable={false}
                />
              ) : (
                <div
                  role="img"
                  aria-label={client.name}
                  className="h-14 sm:h-20 md:h-24 w-20 sm:w-28 md:w-32 flex items-center justify-center px-1 text-center font-display font-bold uppercase tracking-[0.08em] leading-tight text-[8px] sm:text-[10px] md:text-xs break-words text-white/50 group-hover:text-white transition-colors duration-500 select-none"
                >
                  {client.name}
                </div>
              )}
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
    { id: 'brands', label: 'Brands & Businesses' },
    { id: 'personal', label: 'Founders & Leaders' },
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
          Businesses, brands and leaders
          <br className="hidden sm:block" />
          {' '}that chose to <span className="text-gold">build with us</span>
        </motion.h2>

        {/* Tab Switcher */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-1 p-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-xs"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative px-6 sm:px-8 py-2.5 rounded-full text-sm sm:text-base font-semibold transition-colors duration-300 focus:outline-hidden"
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
          <div className="absolute inset-y-0 left-0 w-32 sm:w-48 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 sm:w-48 bg-linear-to-l from-background to-transparent z-10 pointer-events-none" />

          <LogoRow logos={logos} />
        </motion.div>
      </AnimatePresence>

      {/* Drag hint */}
      <div className="text-center mt-5">
        <span className="inline-flex items-center gap-2 text-muted/50 text-[11px] tracking-widest uppercase font-medium select-none">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 9l-3 3 3 3"/><path d="M19 9l3 3-3 3"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
          drag to explore
        </span>
      </div>

      {/* Footer count */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="text-center mt-8 sm:mt-10"
      >
        <span className="text-muted text-xs sm:text-sm tracking-widest uppercase font-medium">
          50+ founders and brands trust DreamSVin as their growth team
        </span>
      </motion.div>
    </section>
  );
}
