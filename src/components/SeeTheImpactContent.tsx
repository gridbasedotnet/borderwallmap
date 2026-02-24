"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { Info, Upload } from "lucide-react";
import InfoModal from "./InfoModal";

const ImpactMapClient = dynamic(() => import("./ImpactMapClient"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] md:h-[600px] rounded-xl bg-taupe-950 animate-pulse" />
  ),
});

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6 },
};

export default function SeeTheImpactContent() {
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#0d0b09]">
      {/* Hero */}
      <motion.section
        {...fadeInUp}
        className="pt-12 pb-4 px-4 max-w-5xl mx-auto text-center"
      >
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
          See the{" "}
          <span className="text-canyon-500">Impact</span>
        </h1>
        <p className="text-taupe-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          Field footage from Big Bend National Park. See what a border wall
          would destroy.
        </p>
      </motion.section>

      {/* Action Bar */}
      <motion.section
        {...fadeInUp}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="pb-4 px-4 max-w-5xl mx-auto flex items-center justify-between"
      >
        <button
          onClick={() => setInfoOpen(true)}
          className="flex items-center gap-1.5 text-taupe-400 hover:text-white transition-colors text-sm"
          aria-label="About this project"
        >
          <Info size={18} />
          <span className="hidden sm:inline">About this project</span>
        </button>
        <Link
          href="/submit"
          className="flex items-center gap-1.5 px-4 py-2 bg-canyon-600 hover:bg-canyon-500 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <Upload size={15} />
          Submit Video
        </Link>
      </motion.section>

      {/* Map */}
      <motion.section
        {...fadeInUp}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="pb-3 px-4 max-w-5xl mx-auto"
      >
        <ImpactMapClient />
      </motion.section>

      {/* Instructions */}
      <motion.div
        {...fadeInUp}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="pb-8 px-4 max-w-5xl mx-auto text-center"
      >
        <p className="text-taupe-500 text-xs">
          Tap any marker to view video footage from that location. Pinch to zoom.
        </p>
      </motion.div>

      <InfoModal open={infoOpen} onClose={() => setInfoOpen(false)} />
    </main>
  );
}
