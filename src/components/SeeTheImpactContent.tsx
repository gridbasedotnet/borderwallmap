"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { Info, Upload } from "lucide-react";
import InfoModal from "./InfoModal";
import ScrollingMarquee from "./ScrollingMarquee";
import { useGyroscope } from "@/hooks/useGyroscope";

const ImpactMapClient = dynamic(() => import("./ImpactMapClient"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[65vh] min-h-[350px] max-h-[600px] rounded-2xl glass animate-pulse" />
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
  const gyro = useGyroscope();

  // Subtle parallax offsets driven by device tilt
  const mapShift = gyro.supported
    ? {
        transform: `translate3d(${gyro.x * 6}px, ${gyro.y * 6}px, 0) rotateY(${gyro.x * 1.5}deg) rotateX(${-gyro.y * 1.5}deg)`,
      }
    : undefined;

  const uiShift = gyro.supported
    ? {
        transform: `translate3d(${gyro.x * 3}px, ${gyro.y * 3}px, 0)`,
      }
    : undefined;

  return (
    <main className="relative min-h-screen bg-[#0d0b09]">
      <ScrollingMarquee />

      {/* Hero */}
      <motion.section
        {...fadeInUp}
        className="relative z-10 pt-8 sm:pt-12 pb-3 px-4 max-w-5xl mx-auto text-center"
        style={uiShift}
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1.5">
          See the{" "}
          <span className="text-canyon-500">Impact</span>
        </h1>
        <p className="text-taupe-400 text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          Field footage from Big Bend National Park. See what a border wall
          would destroy.
        </p>
      </motion.section>

      {/* Action Bar */}
      <motion.section
        {...fadeInUp}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="relative z-10 pb-3 px-4 max-w-5xl mx-auto flex items-center justify-between"
        style={uiShift}
      >
        <button
          onClick={() => setInfoOpen(true)}
          className="flex items-center gap-1.5 text-taupe-400 hover:text-white active:text-white transition-colors text-sm min-h-[44px] px-2 -ml-2"
          aria-label="About this project"
        >
          <Info size={20} />
          <span className="hidden sm:inline">About this project</span>
        </button>
        <Link
          href="/submit"
          className="flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] glass glass-glow-canyon bg-canyon-600/20 hover:bg-canyon-600/30 active:bg-canyon-600/30 text-white rounded-xl transition-all text-sm font-medium"
        >
          <Upload size={15} />
          Submit Video
        </Link>
      </motion.section>

      {/* Map */}
      <motion.section
        {...fadeInUp}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative z-10 pb-3 px-3 sm:px-4 max-w-5xl mx-auto"
      >
        <div className="map-float-wrapper" style={mapShift}>
          <ImpactMapClient />
        </div>
      </motion.section>

      {/* Instructions */}
      <motion.div
        {...fadeInUp}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="relative z-10 pb-6 px-4 max-w-5xl mx-auto text-center"
        style={uiShift}
      >
        <p className="text-taupe-500 text-xs">
          Tap any marker to view video footage from that location. Pinch to zoom.
        </p>
      </motion.div>

      <InfoModal open={infoOpen} onClose={() => setInfoOpen(false)} />
    </main>
  );
}
