import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';

const capabilities = [
  { title: 'Business Building', desc: 'From idea validation to business models, offerings, pricing and launch.' },
  { title: 'Company Revamps', desc: 'Business audits, repositioning, and restructuring of brand and growth systems.' },
  { title: 'Business Strategy', desc: 'Market research, competitor analysis, opportunities and business roadmaps.' },
  { title: 'Brand Transformation', desc: 'Brand identity, architecture, positioning, communication and perception.' },
  { title: 'Marketing & Visibility', desc: 'Digital marketing, social media, SEO, campaigns and founder branding.' },
  { title: 'Lead & Revenue Growth', desc: 'Acquisition funnels, lead generation, conversion and retention.' },
  { title: 'Community Building', desc: 'Customer communities, membership models, engagement and ecosystems.' },
  { title: 'Strategic Collaborations', desc: 'Partnerships, alliances, events and distribution opportunities.' },
  { title: 'Business Operations', desc: 'SOPs, processes, dashboards, accountability and execution management.' },
  { title: 'Technology & Systems', desc: 'Website planning, automation, digital systems and specialist coordination.' },
  { title: 'Business Expansion', desc: 'New geographies, customer segments, markets and revenue channels.' },
];

export default function Capabilities() {
  return (
    <section className="py-20 sm:py-28 px-6 sm:px-[8vw]">
      <SectionHeading
        eyebrow="Capabilities"
        title={<>The Expertise You Need. <span className="text-accent">At the Stage You Need It.</span></>}
        intro="One partner across the business, so you don't have to manage five separate agencies and consultants."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {capabilities.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
            className="bg-surface/50 border border-white/5 p-6 sm:p-8 rounded-3xl hover:border-accent/20 transition-all"
          >
            <h3 className="font-display text-lg sm:text-xl font-bold mb-3">{item.title}</h3>
            <p className="text-muted leading-relaxed text-sm">{item.desc}</p>
          </motion.div>
        ))}
        <motion.a
          href="#contact"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.24 }}
          className="bg-gold/10 border border-gold/30 p-6 sm:p-8 rounded-3xl hover:bg-gold/15 transition-all flex flex-col justify-between"
        >
          <h3 className="font-display text-lg sm:text-xl font-bold mb-3 text-gold">Not sure what you need?</h3>
          <p className="text-foreground/80 leading-relaxed text-sm">That's what the diagnosis is for. Tell us about your business →</p>
        </motion.a>
      </div>
    </section>
  );
}
