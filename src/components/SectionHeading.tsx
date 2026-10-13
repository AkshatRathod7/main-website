import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
}

export default function SectionHeading({ eyebrow, title, intro }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-14 sm:mb-20"
    >
      <p className="font-display text-[11px] sm:text-[13px] font-bold tracking-[0.3em] text-muted uppercase mb-4">
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 max-w-[1000px] mx-auto leading-tight">
        {title}
      </h2>
      {intro && (
        <p className="text-muted text-base sm:text-xl/8 max-w-[720px] mx-auto">
          {intro}
        </p>
      )}
    </motion.div>
  );
}
