import { motion } from 'framer-motion';

const Row1Logos = [
  'analogy design.jpg',
  'bandmaindia.jpg',
  'coach sachin thakur.jpg',
  'culturecircle.jpg',
  'estoquie.jpg',
  'eurekaforbes.jpg',
  'hctb.jpg',
  'house of ekketa.jpg',
  'ironmankapil arora.jpg',
  'jainam.jpg',
];

const Row2Logos = [
  'meheronmoney.jpg',
  'mumbai 10k challenge.jpg',
  'ocean man.jpg',
  'redefined.png',
  'prustlr.jpg',
  'rise global.jpg',
  'supremm.jpg',
  'transformwithpurva.jpg',
  'willpowerstar.jpg',
  'withlovehitay.jpg',
];

export default function Clients() {
  return (
    <section className="py-20 sm:py-24 bg-background overflow-hidden relative">
      <div className="px-6 sm:px-[8vw] mb-10 sm:mb-12">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="font-display text-[14px] font-bold tracking-[0.2em] text-muted uppercase"
        >
          WORKED WITH 50+ BRANDS & CREATORS
        </motion.h2>
      </div>

      <div className="relative flex flex-col gap-8">
        {/* Gradient Masks */}
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

        <LogoRow logos={Row1Logos} direction="left" />
        <LogoRow logos={Row2Logos} direction="right" />
      </div>
    </section>
  );
}

function LogoRow({ logos, direction = "left" }: { logos: string[], direction?: "left" | "right" }) {
  // Triple the logos for seamless loop
  const duplicatedLogos = [...logos, ...logos, ...logos];

  return (
    <div className="flex overflow-hidden">
      <motion.div
        animate={{
          x: direction === "left" ? ["0%", "-33.33%"] : ["-33.33%", "0%"]
        }}
        transition={{
          duration: logos.length * 3,
          ease: "linear",
          repeat: Infinity,
        }}
        className="flex gap-16 items-center px-8"
      >
        {duplicatedLogos.map((logo, index) => (
          <div 
            key={`${logo}-${index}`} 
            className="flex-shrink-0 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
          >
            <img 
              src={`/logos/${logo}`} 
              alt="Logo" 
              className="h-8 sm:h-10 md:h-14 w-auto object-contain max-w-[120px] sm:max-w-[200px]"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
