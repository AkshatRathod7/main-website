import { motion } from 'framer-motion';

export default function Framework() {
  return (
    <div className="pt-40 space-y-32">
      <section className="px-[8vw]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="font-display text-5xl md:text-8xl font-bold mb-6">The 3 Pillars</h2>
          <p className="text-muted text-xl max-w-[600px] mx-auto">Our proven framework for engineering sustainable growth.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              className="bg-surface/50 border border-white/5 p-10 rounded-[40px] hover:border-accent/20 transition-all group"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${item.accent} font-bold mb-8`}>
                {item.id}
              </div>
              <h3 className="font-display text-3xl font-bold mb-6">{item.title}</h3>
              <p className="text-muted leading-relaxed mb-8">{item.desc}</p>
              <ul className="space-y-3">
                {item.items.map(i => (
                  <li key={i} className="flex items-center gap-3 text-sm font-semibold">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                    {i}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-40 text-center relative overflow-hidden bg-surface/30">
        <div className="absolute inset-0 bg-accent/5 blur-[100px] rounded-full translate-y-1/2"></div>
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-4xl md:text-6xl font-bold mb-20 relative z-10"
        >
          Integration Engine
        </motion.h2>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative h-[400px] w-full max-w-[400px] mx-auto z-10"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 text-accent font-display font-bold text-xl">CONTENT</div>
          <div className="absolute bottom-0 left-0 text-accent font-display font-bold text-xl">COLLABORATION</div>
          <div className="absolute bottom-0 right-0 text-accent font-display font-bold text-xl">COMMUNITY</div>
          <svg width="400" height="400" className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
            <line x1="200" y1="50" x2="60" y2="340" stroke="currentColor" className="text-accent" strokeWidth="2" strokeDasharray="8 4" />
            <line x1="200" y1="50" x2="340" y2="340" stroke="currentColor" className="text-accent" strokeWidth="2" strokeDasharray="8 4" />
            <line x1="60" y1="340" x2="340" y2="340" stroke="currentColor" className="text-accent" strokeWidth="2" strokeDasharray="8 4" />
          </svg>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-accent/20 blur-2xl rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display font-black text-4xl text-white">DSV</div>
        </motion.div>
      </section>
    </div>
  );
}
