import { motion } from 'framer-motion';

export default function Framework() {
  return (
    <div className="pt-20 sm:pt-40 space-y-16 sm:space-y-32">
      {/* We Believe — Philosophy Section */}
      <section className="py-20 sm:py-40 text-center relative overflow-hidden bg-surface/30">
        <div className="absolute inset-0 bg-accent/5 blur-[100px] rounded-full translate-y-1/2"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 px-6 sm:px-[8vw] max-w-[800px] mx-auto"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold mb-10 sm:mb-16">
            We Believe
          </h2>
          <div className="space-y-6 sm:space-y-8">
            <p className="font-display text-base sm:text-xl/7 md:text-2xl/8 text-muted leading-relaxed">
              Most businesses don't struggle because they have bad products.
              <br />
              <span className="text-foreground font-semibold">They struggle because people don't remember them.</span>
            </p>
            <p className="font-display text-base sm:text-xl/7 md:text-2xl/8 text-muted leading-relaxed">
              Great brands aren't built through more content.
              <br />
              <span className="text-foreground font-semibold">They're built through clear positioning, consistent execution, and meaningful relationships.</span>
            </p>
            <p className="font-display text-lg sm:text-2xl md:text-3xl text-gold font-bold">
              That's what DreamSVin exists to build.
            </p>
          </div>
        </motion.div>
      </section>

      {/* The DreamSVin Growth Engine — 5-Step Framework */}
      <section className="px-6 sm:px-[8vw]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14 sm:mb-24"
        >
          <h2 className="font-display text-4xl sm:text-5xl md:text-8xl font-bold mb-4 sm:mb-6">The DreamSVin Growth Engine</h2>
          <p className="text-muted text-base sm:text-xl max-w-[600px] mx-auto">Our proprietary framework for building brands people remember.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
          {[
            {
              id: '01',
              title: 'Discover',
              desc: 'Understand the founder, business, audience, and opportunity before making a single move.',
              items: ['Founder & Business Audit', 'Market & Audience Analysis', 'Opportunity Mapping'],
              accent: 'bg-accent/10 text-accent'
            },
            {
              id: '02',
              title: 'Position',
              desc: 'Create differentiation that people remember. Become the obvious choice in your category.',
              items: ['Brand Positioning', 'Category Design', 'Messaging Architecture'],
              accent: 'bg-accent/10 text-accent'
            },
            {
              id: '03',
              title: 'Build',
              desc: 'Develop systems, content, partnerships, and execution plans that create real business momentum.',
              items: ['Content Systems', 'Partnership Development', 'Execution Playbooks'],
              accent: 'bg-accent/10 text-accent'
            },
            {
              id: '04',
              title: 'Amplify',
              desc: 'Increase visibility, authority, and trust through strategic distribution and thought leadership.',
              items: ['Thought Leadership', 'Community Building', 'Strategic Distribution'],
              accent: 'bg-accent/10 text-accent'
            },
            {
              id: '05',
              title: 'Scale',
              desc: 'Repeat what works. Build sustainable growth systems that compound over time.',
              items: ['Growth Systems', 'Revenue Architecture', 'Long-term Momentum'],
              accent: 'bg-accent/10 text-accent'
            }
          ].map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-surface/50 border border-white/5 p-7 sm:p-10 rounded-[32px] sm:rounded-[40px] hover:border-accent/20 transition-all group"
            >
              <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full ${item.accent} font-bold mb-6 sm:mb-8 text-sm`}>
                {item.id}
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">{item.title}</h3>
              <p className="text-muted leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base/6">{item.desc}</p>
              <ul className="space-y-3">
                {item.items.map(i => (
                  <li key={i} className="flex items-center gap-3 text-sm font-semibold">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0"></div>
                    {i}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
