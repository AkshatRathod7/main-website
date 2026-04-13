import { motion } from "framer-motion";
import Logo from "./Logo";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center items-center px-[8vw] pt-40 pb-20 overflow-hidden text-center">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-[1200px] z-10"
      >
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-[clamp(48px,8vw,120px)] leading-[1.1] font-bold tracking-tight mb-12"
        >
          We don't chase<br />
          <span className="text-gold underline decoration-gold/50 underline-offset-8">growth.</span><br />
          We <span className="opacity-80">design it.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-[800px] mx-auto font-display text-xl md:text-2xl text-muted leading-relaxed mb-16"
        >
          A growth acceleration company building scalable systems<br className="hidden md:block" />
          for founders, brands & creators. No hacks. Just engineered growth.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-32"
        >
          <a href="#contact" className="px-10 py-5 bg-gold text-black font-bold rounded-full hover:scale-105 transition-transform active:scale-95 shadow-xl shadow-gold/20">
            Start a Project
          </a>
          <a href="#work" className="px-10 py-5 border border-gold/30 text-gold rounded-full hover:bg-gold/5 transition-colors">
            View Work
          </a>
        </motion.div>

        {/* The Scroll Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-20 pt-20 w-full"
        >
            <p className="font-display text-3xl md:text-5xl font-bold opacity-30">Hence, the world needs</p>
            <div className="mt-8 flex justify-center opacity-80 scale-150">
                <Logo size="lg" />
            </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
