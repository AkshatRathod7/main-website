import { useState } from 'react';
import type { Variants } from 'framer-motion';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

type CaseItem = {
  category: string;
  title: string;
  logo?: string;
  pill: string;
  before?: string;
  after: string;
  metrics: { label: string; value: string }[];
  helped?: string[];
};

// "helped" is the expandable "How we helped" list on each card.
// Source: DreamSVin Client Testimonials slide content (Oct 2026).
// Points marked * in that doc are unconfirmed and are left out until approved.
const cases: CaseItem[] = [
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
    ],
    helped: [
      'Positioned Goa as a premium sports destination, not just a venue',
      'Built the full event strategy from scratch',
      'Brought in high-credibility sponsors including Taj and Evocus',
      'Designed the complete athlete experience journey',
      'Managed end-to-end event execution',
      'Created brand and media assets to scale the event as an IP'
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
    title: 'SUPREMM BHAGAR',
    logo: '/logos/supremm.jpg',
    pill: 'BRAND POSITIONING',
    before: 'Before: Strong offline presence but invisible online, lacking a content system and digital strategy.',
    after: 'What Changed: DreamSVin built a complete digital execution system, activating 25+ UGC creators, completing a full brand overhaul, and translating real-world engagement into online authority.',
    metrics: [
      { label: 'UGC CREATORS', value: '25+' },
      { label: 'DIGITAL OVERHAUL', value: '100%' }
    ],
    helped: [
      'Grew their page from scratch',
      'Ran influencer marketing campaigns',
      'Managed social media end to end',
      'Drove end-to-end growth'
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
    ],
    helped: [
      'Built the brand and content strategy',
      'Produced high-impact reels and creatives',
      'Handled professional video editing',
      'Managed social media end to end',
      'Created a standout ad creative for the brand',
      'Delivered consistent, on-brand execution every month'
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
    ],
    helped: [
      'Wrote scripts built for viral reach',
      'Crafted scroll-stopping hooks',
      'Took her content from stagnant to viral',
      'Landed a brand collaboration with upGrad'
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
  },
  {
    category: 'founder',
    title: 'DHAVAL UPENDRAKUMAR',
    logo: '/logos/dhaval upendrakumar.jpg',
    pill: 'FOUNDER GROWTH',
    after: 'What Changed: DreamSVin took ownership of Dhaval\'s personal brand growth end to end, running the full Content, Collaboration and Community framework.',
    metrics: [
      { label: 'FRAMEWORK', value: '3C' }
    ],
    helped: [
      'Drove complete end-to-end growth of his personal brand',
      'Built a content strategy with purpose behind every post',
      'Created brand collaborations that opened new doors',
      'Built an engaged community around his work',
      'Implemented our 3C framework: Content, Collaboration, Community',
      'Took full ownership of his online growth journey'
    ]
  },
  {
    category: 'brand',
    title: 'SNJB',
    logo: '/logos/snjb.jpg',
    pill: 'BRAND POSITIONING',
    after: 'What Changed: DreamSVin rebuilt the brand of a 100-year-old institution for its centenary, from a new logo and visual system to the tagline and online growth.',
    metrics: [
      { label: 'EST.', value: '1928' },
      { label: 'LEGACY', value: '100YR' }
    ],
    helped: [
      'Completely revamped online branding and identity',
      'Designed a new logo inspired by knowledge and learning',
      'Created the colour palette and typography system',
      'Designed the "100 Years Legacy" centenary emblems',
      'Brought the tagline to life: Vision through Knowledge. Life through Character.',
      'Drove online growth with our 3C framework'
    ]
  },
  {
    category: 'founder',
    title: 'MENGO',
    logo: '/logos/mengo.png',
    pill: 'FOUNDER GROWTH',
    after: 'What Changed: DreamSVin partnered with 14-year-old founder Jainam Jain to build Mengo, an AI co-founder, from the first idea to launch.',
    metrics: [
      { label: 'FOUNDER AGE', value: '14' }
    ],
    helped: [
      'Helped build Mengo, a high-grade AI co-founder, from scratch',
      'Ran in-depth strategy calls with founder Jainam Jain',
      'Shaped the brand and growth plan for Mengo',
      'Provided end-to-end support across content and execution',
      'Partnered at every step, from idea to launch'
    ]
  },
  {
    category: 'business',
    title: 'BANDMA',
    logo: '/logos/bandmaindia.jpg',
    pill: 'BUSINESS GROWTH',
    after: 'What Changed: DreamSVin worked across the whole business, from consultation and operating systems to AI adoption and a stronger online presence.',
    metrics: [],
    helped: [
      'Delivered end-to-end business consultation',
      'Strengthened their digital presence',
      'Built systems and SOPs for smoother operations',
      'Integrated AI into their day-to-day business',
      'Planned and executed their growth strategy',
      'Transformed the business online and behind the scenes'
    ]
  },
  {
    category: 'community',
    title: 'SPECTRATIX PHARMA',
    logo: '/logos/spectratix.jpg',
    pill: 'COMMUNITY',
    after: 'What Changed: DreamSVin built PharmaGyan Academy and a complete ecosystem around the Spectratix brand, from the LMS and website to the founders\' growth plan.',
    metrics: [],
    helped: [
      'Built PharmaGyan Academy from scratch with a complete LMS',
      'Developed and launched the full website',
      'Built and positioned the Spectratix brand',
      'Created the founders\' company growth plan',
      'Built an engaged community around the brand',
      'Ran the complete 3C framework: Content, Collaboration, Community'
    ]
  },
  {
    category: 'creator',
    title: 'KARISHMA RATHOD',
    logo: '/logos/karishma rathod.jpg',
    pill: 'CREATORS',
    before: 'Before: Starting from zero followers.',
    after: 'What Changed: DreamSVin grew her account to 15K followers and turned it into a business, with a website, offers and lead generation.',
    metrics: [
      { label: 'FOLLOWERS', value: '15K' },
      { label: 'STARTED AT', value: '0' }
    ],
    helped: [
      'Grew her account from 0 to 15K followers',
      'Built her content strategy, scripts and hooks',
      'Handled video editing and posting',
      'Designed and built her website (karishmarathod.com)',
      'Created her offers',
      'Set up lead generation'
    ]
  },
  {
    category: 'creator',
    title: 'CA PRIYANSHI',
    logo: '/logos/ca priyanshi.jpg',
    pill: 'CREATORS',
    after: 'What Changed: DreamSVin built a fast-growth content strategy that took her account to 10K followers in two weeks.',
    metrics: [
      { label: 'FOLLOWERS', value: '10K' },
      { label: 'TIMEFRAME', value: '2 WKS' }
    ],
    helped: [
      'Grew her account to 10K followers in just 2 weeks',
      'Built a fast-growth content strategy',
      'Provided ongoing content support'
    ]
  },
  {
    category: 'creator',
    title: 'MEGHNA DHARAMSEY',
    logo: '/logos/meghna dharamsey.jpg',
    pill: 'CREATORS',
    before: 'Before: 2K followers.',
    after: 'What Changed: DreamSVin grew her to 7K followers with fully organic growth and helped her launch her own product.',
    metrics: [
      { label: 'FOLLOWERS', value: '7K' },
      { label: 'ORGANIC', value: '100%' }
    ],
    helped: [
      'Grew her from 2K to 7K organic followers',
      'Built her community from the ground up',
      'Built her own product',
      'Planned her content strategy',
      'Focused on 100% organic, real-audience growth'
    ]
  },
  {
    category: 'creator',
    title: 'PRIYA JAIN',
    logo: '/logos/priya jain.jpg',
    pill: 'CREATORS',
    after: 'What Changed: DreamSVin built her brand from the ground up, from the logo and identity to her content and her own product.',
    metrics: [],
    helped: [
      'Provided done-with-you, end-to-end support',
      'Wrote her content scripts',
      'Handled professional video editing',
      'Built her own product',
      'Designed her logo',
      'Created her complete brand identity'
    ]
  },
  {
    category: 'creator',
    title: 'CHANDNI\'S ACADEMY',
    logo: '/logos/chandnis academy.jpg',
    pill: 'CREATORS',
    before: 'Before: Teaching offline only.',
    after: 'What Changed: DreamSVin moved her teaching fully online and built a brand that brings in leads and business.',
    metrics: [],
    helped: [
      'Moved her from offline teaching to fully online',
      'Built her online brand from scratch',
      'Grew her online presence',
      'Brought in more leads',
      'Converted her online presence into more business'
    ]
  },
  {
    category: 'brand',
    title: 'YOGSADHAK',
    logo: '/logos/yogsadhak.jpg',
    pill: 'BRAND POSITIONING',
    before: 'Before: A yoga teacher with a page that had stopped getting views.',
    after: 'What Changed: DreamSVin repositioned the business around pregnancy coaching, rebranded it and brought the page back to life.',
    metrics: [
      { label: 'VIEWS ON ONE REEL', value: '169K' }
    ],
    helped: [
      'Repositioned from yoga teacher to pregnancy coach',
      'Completely rebranded the business',
      'Built their product',
      'Handled content end to end',
      'Revived a dead page to 169K views on one reel',
      'Sharpened niche targeting and grew followers'
    ]
  },
  {
    category: 'business',
    title: 'AUDEX',
    logo: '/logos/audex.jpg',
    pill: 'BUSINESS GROWTH',
    after: 'What Changed: DreamSVin rebranded Audex end to end and built an automated lead generation system behind it.',
    metrics: [],
    helped: [
      'Rebranded the company end to end',
      'Built an automated lead generation system',
      'Built their online presence from scratch',
      'Created brand assets and creatives'
    ]
  },
  {
    category: 'brand',
    title: 'EKOHAM HOLISTIC WELLNESS',
    logo: '/logos/ekoham.jpg',
    pill: 'BRAND POSITIONING',
    after: 'What Changed: DreamSVin rebranded Ekoham and grew its presence online and offline through events like the Wellness Weekend Reset.',
    metrics: [],
    helped: [
      'Hosted events including the Wellness Weekend Reset',
      'Created content for social media',
      'Completely rebranded the business',
      'Built a strong offline presence',
      'Helped grow their customer base'
    ]
  },
  {
    category: 'event',
    title: 'WILL POWER STAR',
    logo: '/logos/willpowerstar.jpg',
    pill: 'EVENT IP',
    after: 'What Changed: DreamSVin co-hosted AI events with Will Power Star, taking the brand offline and into the room with its audience.',
    metrics: [],
    helped: [
      'Co-hosted AI events together',
      'Created offline marketing exposure',
      'Built real-world connections with the audience'
    ]
  },
  {
    category: 'event',
    title: 'ENTRELOGY BUSINESS SCHOOL',
    logo: '/logos/entrelogy.jpg',
    pill: 'EVENT IP',
    after: 'What Changed: DreamSVin hosted an ice bath plunge event for Entrelogy students, built to raise visibility and drive admissions.',
    metrics: [],
    helped: [
      'Hosted and managed the event for students',
      'Created a memorable student experience',
      'Boosted student visibility',
      'Helped drive more admissions'
    ]
  },
  {
    category: 'business',
    title: 'RESURGENCE',
    logo: '/logos/resurgence.jpg',
    pill: 'BUSINESS GROWTH',
    after: 'What Changed: DreamSVin delivered the Resurgence website end to end, from development to launch.',
    metrics: []
  }
];

const filters = [
  { id: 'all', label: 'ALL' },
  { id: 'event', label: 'EVENT IPs' },
  { id: 'brand', label: 'BRAND POSITIONING' },
  { id: 'founder', label: 'FOUNDER GROWTH' },
  { id: 'business', label: 'BUSINESS GROWTH' },
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

function CaseCard({ item }: { item: CaseItem }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className="group relative bg-surface/50 border border-white/5 rounded-3xl p-6 sm:p-8 overflow-hidden hover:bg-surface transition-all duration-500 hover:border-accent/20 h-full flex flex-col"
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
        {item.before && <p className="text-muted text-sm italic">{item.before}</p>}
        <p className="text-foreground/80 leading-relaxed text-sm">{item.after}</p>
      </div>

      {item.helped && item.helped.length > 0 && (
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            aria-expanded={open}
            className="flex items-center gap-2 font-display text-[11px] font-bold tracking-widest uppercase text-accent hover:text-foreground transition-colors"
          >
            How we helped
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence initial={false}>
            {open && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                {item.helped.map(point => (
                  <li key={point} className="flex gap-3 text-sm text-foreground/75 leading-relaxed pt-3 first:pt-4">
                    <span className="mt-[9px] h-1 w-1 rounded-full bg-accent shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      )}

      {item.metrics.length > 0 && (
        <div className="flex gap-8 pt-6 border-t border-white/5">
          {item.metrics.map(metric => (
            <div key={metric.label}>
              <span className="block font-display text-2xl font-bold text-accent">{metric.value}</span>
              <span className="block font-display text-[10px] text-muted uppercase font-bold tracking-widest">{metric.label}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
