import { motion } from 'framer-motion';

export default function Framework() {
  return (
    <div className="pt-20 sm:pt-40 space-y-16 sm:space-y-32">
      <section className="px-6 sm:px-[8vw]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14 sm:mb-24"
        >
          <h2 className="font-display text-4xl sm:text-5xl md:text-8xl font-bold mb-4 sm:mb-6">The 3 Pillars</h2>
          <p className="text-muted text-base sm:text-xl max-w-[600px] mx-auto">Our proven framework for engineering sustainable growth.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              id: '01',
              title: 'Content',
              desc: "We don't build 'social media presence.' We build media infrastructure that works 24/7 to qualify leads.",
              items: ['C2R Architecture', 'Short-form Distribution', 'Positioning Overhauls'],
              accent: 'bg-accent/10 text-accent'
            },
            {
              id: '02',
              title: 'Collaboration',
              desc: 'Borrowing trust is faster than building it. We align brands with high-integrity creators for a halo effect.',
              items: ['Creator IP Strategy', 'Partnership Networking', 'B2B Ecosystems'],
              accent: 'bg-accent/10 text-accent'
            },
            {
              id: '03',
              title: 'Community',
              desc: 'The only way to win in a high-CAC world is to never lose a customer. Communities turn users into advocates.',
              items: ['Ecosystem Design', 'Retention Systems', 'Founder-led Groups'],
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
              <p className="text-muted leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base">{item.desc}</p>
              <ul className="space-y-3">
                {item.items.map(i => (
                  <li key={i} className="flex items-center gap-3 text-sm font-semibold">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0"></div>
                    {i}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 sm:py-40 text-center relative overflow-hidden bg-surface/30">
        <div className="absolute inset-0 bg-accent/5 blur-[100px] rounded-full translate-y-1/2"></div>
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-3xl sm:text-4xl md:text-6xl font-bold mb-10 sm:mb-20 relative z-10 px-6"
        >
          Integration Engine
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative w-full max-w-[340px] sm:max-w-[420px] mx-auto z-10 px-2"
        >
          {/* Fully responsive SVG triangle — labels sit inside the viewBox */}
          <svg
            viewBox="0 0 400 420"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            {/* glow */}
            <circle cx="200" cy="220" r="60" fill="rgba(180,140,60,0.12)" filter="url(#blur)" />
            <defs>
              <filter id="blur"><feGaussianBlur stdDeviation="18" /></filter>
            </defs>

            {/* triangle lines */}
            <line x1="200" y1="55" x2="55" y2="345" stroke="#b8860b" strokeWidth="2" strokeDasharray="8 4" opacity="0.5" />
            <line x1="200" y1="55" x2="345" y2="345" stroke="#b8860b" strokeWidth="2" strokeDasharray="8 4" opacity="0.5" />
            <line x1="55" y1="345" x2="345" y2="345" stroke="#b8860b" strokeWidth="2" strokeDasharray="8 4" opacity="0.5" />

            {/* Labels */}
            <text x="200" y="30" textAnchor="middle" fontFamily="Outfit, sans-serif" fontWeight="700" fontSize="20" fill="#c9a84c" letterSpacing="2">CONTENT</text>
            <text x="200" y="225" textAnchor="middle" fontFamily="Outfit, sans-serif" fontWeight="900" fontSize="36" fill="white">DSV</text>
            <text x="28" y="398" textAnchor="start" fontFamily="Outfit, sans-serif" fontWeight="700" fontSize="16" fill="#c9a84c" letterSpacing="1">COLLABORATION</text>
            <text x="372" y="398" textAnchor="end" fontFamily="Outfit, sans-serif" fontWeight="700" fontSize="16" fill="#c9a84c" letterSpacing="1">COMMUNITY</text>
          </svg>
        </motion.div>
      </section>
    </div>
  );
}
