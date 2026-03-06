"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="border-t border-white/[0.06] py-8 px-4"
    >
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-3">
        <p className="text-taupe-400 text-sm">
          <span className="font-bold text-white">NO BIG BEND</span>{" "}
          <span className="font-bold text-canyon-500">WALL</span>
        </p>
        <a
          href="https://www.defendbigbend.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-taupe-500 hover:text-canyon-400 active:text-canyon-400 text-xs transition-colors min-h-[44px]"
        >
          defendbigbend.com
          <ExternalLink size={12} />
        </a>
        <div className="flex items-center gap-4">
          <Link
            href="/privacy"
            className="text-taupe-600 hover:text-taupe-400 text-xs transition-colors"
          >
            Privacy Policy
          </Link>
          <span className="text-taupe-700 text-xs">|</span>
          <Link
            href="/terms"
            className="text-taupe-600 hover:text-taupe-400 text-xs transition-colors"
          >
            Terms of Service
          </Link>
        </div>
        <p className="text-taupe-600 text-xs">
          Designed by{" "}
          <a
            href="https://intelstrategies.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-taupe-500 hover:text-taupe-400 active:text-taupe-400 transition-colors"
          >
            Intel Strategies LLC
          </a>
        </p>
      </div>
    </motion.footer>
  );
}
