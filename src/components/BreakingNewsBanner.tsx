"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6 },
};

export default function BreakingNewsBanner() {
  return (
    <motion.section
      {...fadeInUp}
      className="relative z-10 pt-8 sm:pt-12 pb-4 px-4 max-w-3xl mx-auto text-center"
    >
      <span className="inline-block px-3 py-1 mb-4 text-xs font-bold uppercase tracking-widest text-red-400 border border-red-500/40 rounded-full bg-red-500/10">
        Breaking
      </span>

      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-snug mb-4">
        CBP has removed 2 planned wall projects from its border map —{" "}
        <span className="text-canyon-400">the Alpine Primary Wall (BBT-4)</span>{" "}
        and{" "}
        <span className="text-canyon-400">
          the Alpine/Sanderson/Comstock Primary Wall (BBT-5)
        </span>
        , both in Texas — and reduced the planned scope of 2 others in San Diego
        and El Centro, California.
      </h2>

      <p className="text-taupe-300 text-sm sm:text-base max-w-xl mx-auto mb-6 leading-relaxed">
        This is progress, but there&apos;s more work to do. We have to keep the
        pressure on.
      </p>

      <a
        href="https://defendbigbend.com"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] glass glass-glow-canyon bg-canyon-600/20 hover:bg-canyon-600/30 active:bg-canyon-600/40 text-white rounded-xl transition-all text-sm sm:text-base font-semibold"
      >
        Take Action
        <ExternalLink size={16} />
      </a>
    </motion.section>
  );
}
