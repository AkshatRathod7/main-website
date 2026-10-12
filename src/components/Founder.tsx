import { motion } from 'framer-motion';

export default function Founder() {
  return (
    <section className="py-20 sm:py-28 px-6 sm:px-[8vw]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-[1100px] mx-auto"
      >
        {/* Section Header */}
        <div className="text-center mb-14 sm:mb-20">
          <p className="font-display text-[11px] sm:text-[13px] font-bold tracking-[0.3em] text-muted uppercase mb-4">
            The Story Behind DreamSVin
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
            Why DreamSVin Exists
          </h2>
        </div>

        {/* Founder Story Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-surface/50 border border-white/5 p-8 sm:p-12 md:p-16 rounded-[32px] sm:rounded-[40px]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Image Column */}
            <div className="lg:col-span-4 flex justify-center lg:justify-start">
              <div className="relative group overflow-hidden rounded-2xl border border-white/10 max-w-[280px] sm:max-w-[320px] lg:max-w-none w-full aspect-9/16 shadow-2xl">
                <img 
                  src="/isha.jpg" 
                  alt="Isha Vijay Ostwal at World Economic Forum" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-60 pointer-events-none" />
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-8 space-y-6 sm:space-y-8">
              {/* Founder Identity */}
              <div>
                <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
                  Isha Vijay Ostwal
                </h3>
                <p className="text-accent font-display text-sm sm:text-base font-semibold tracking-wide">
                  Entrepreneur · Growth Consultant · Execution Partner · Career Strategist · Speaker
                </p>
              </div>

              {/* The Narrative */}
              <div className="space-y-6 sm:space-y-8 text-foreground/80 leading-relaxed text-sm sm:text-base/6 md:text-lg/7">
                <p>
                  Most founders don't have a strategy problem. They have an execution problem. They know what needs to happen. They just don't have the team, the systems, or the bandwidth to make it happen consistently.
                </p>
                <p>
                  That's why DreamSVin was created. Not as another agency selling deliverables, but as an <span className="text-foreground font-semibold">execution partner</span> that embeds with founder-led brands and turns strategy into measurable outcomes.
                </p>
                <p>
                  Isha built DreamSVin from the belief that great businesses don't grow because they market more. They grow because they <span className="text-foreground font-semibold">execute better</span>. As Chief Everything Officer, she leads a team that doesn't just advise. It builds, ships, and scales alongside every partner.
                </p>
                <p>
                  Her approach is shaped by real-world execution across multiple domains, including co-founding Ragandha Lifecare Pvt. Ltd., developing organizational strategy, and guiding careers and companies from idea to scale. With a foundation from MIT-WPU and advanced training in Strategic Marketing & AI from Master's Union and Schbang Academy, she bridges the gap between vision and velocity.
                </p>
                <p>
                  Beyond DreamSVin, Isha serves as National Co-Convenor at JITO Incubation & Innovation Foundation, mentors founders as part of the Mercedes-Benz BeVisioneers program, and contributes as a Global Shaper with the World Economic Forum. She advises WISE, SNDT University, and the Government of Maharashtra on education and innovation.
                </p>
                <p>
                  With a patent in healthcare innovation, 50+ speaking engagements, 1,000+ individuals mentored, recognition by Dainik Punyanagari, and experience leading 350+ NCC cadets as Cadet Captain. Her work is proof of one principle: <span className="text-foreground font-semibold">execution compounds</span>.
                </p>
              </div>

              {/* Closing Statement */}
              <div className="pt-8 sm:pt-10 border-t border-white/5">
                <p className="font-display text-base sm:text-xl/7 md:text-2xl/8 text-gold font-bold leading-relaxed">
                  Whether you're building a company, a career, or an idea that matters, DreamSVin exists to help you move from potential to performance.
                </p>
              </div>

              {/* Tagline */}
              <p className="font-display text-sm sm:text-base text-muted font-semibold tracking-wide">
                Helping companies, communities, and creators turn ideas into execution and grow 10×.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
