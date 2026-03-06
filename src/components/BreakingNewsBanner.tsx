"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink } from "lucide-react";

const BeforeAfterMaps = dynamic(() => import("./BeforeAfterMaps"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[16/9] sm:aspect-[2/1] rounded-xl glass animate-pulse" />
  ),
});

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6 },
};

type Region = "texas" | "california";

export default function BreakingNewsBanner() {
  const [region, setRegion] = useState<Region>("texas");

  return (
    <motion.section
      {...fadeInUp}
      className="relative z-10 pt-6 sm:pt-10 pb-2 px-4 max-w-5xl mx-auto"
    >
      {/* Compact header */}
      <div className="flex items-center gap-3 mb-3">
        <span className="flex-shrink-0 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-red-400 border border-red-500/40 rounded-full bg-red-500/10">
          Breaking
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-red-500/20 to-transparent" />
      </div>

      {/* Two-column layout: text left, maps right */}
      <div className="flex flex-col lg:flex-row gap-5 lg:gap-8">
        {/* Left: text content */}
        <div className="lg:w-[45%] flex flex-col justify-center">
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-white leading-snug mb-3">
            CBP has removed 2 planned wall projects from its border map
            {" — "}
            <span className="text-canyon-400">
              the Alpine Primary Wall (BBT-4)
            </span>
            {" and "}
            <span className="text-canyon-400">
              the Alpine/Sanderson/Comstock Primary Wall (BBT-5)
            </span>
            , both in Texas — and reduced the planned scope of 2 others in San
            Diego and El Centro, California.
          </h2>

          <p className="text-taupe-400 text-sm leading-relaxed mb-4">
            This is progress, but there&apos;s more work to do. We have to keep
            the pressure on.
          </p>

          <a
            href="https://defendbigbend.com"
            target="_blank"
            rel="noopener noreferrer"
            className="self-start inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] glass glass-glow-canyon bg-canyon-600/20 hover:bg-canyon-600/30 active:bg-canyon-600/40 text-white rounded-xl transition-all text-sm font-semibold"
          >
            Take Action
            <ExternalLink size={14} />
          </a>
        </div>

        {/* Right: before/after maps */}
        <div className="lg:w-[55%] flex flex-col gap-2">
          {/* Region tabs */}
          <div className="flex gap-1 self-start">
            {(
              [
                { key: "texas", label: "Texas (BBT-4 & BBT-5)" },
                { key: "california", label: "California (SDC & ELC)" },
              ] as const
            ).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setRegion(key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  region === key
                    ? "bg-canyon-600/30 text-white border border-canyon-500/30"
                    : "text-taupe-400 hover:text-white border border-transparent"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Map area */}
          <div className="rounded-xl overflow-hidden glass glass-glow">
            <AnimatePresence mode="wait">
              <motion.div
                key={region}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <BeforeAfterMaps region={region} />
              </motion.div>
            </AnimatePresence>
          </div>

          <p className="text-taupe-500 text-[10px] text-center">
            Drag the slider to compare. Orange dashed = planned wall routes.
          </p>
        </div>
      </div>
    </motion.section>
  );
}
