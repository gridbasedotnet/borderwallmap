"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="border-t border-taupe-900 py-8 px-4"
    >
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-3">
        <p className="text-taupe-400 text-sm">
          <span className="font-bold text-white">NO BIG BEND</span>{" "}
          <span className="font-bold text-canyon-500">WALL</span>
        </p>
        <a
          href="https://www.nobigbendwall.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-taupe-500 hover:text-canyon-500 text-xs transition-colors"
        >
          nobigbendwall.com
          <ExternalLink size={12} />
        </a>
      </div>
    </motion.footer>
  );
}
