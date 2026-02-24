"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Video, MapPin, Mountain } from "lucide-react";

const ImpactMapClient = dynamic(() => import("./ImpactMapClient"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] md:h-[600px] rounded-xl bg-gray-900 animate-pulse" />
  ),
});

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6 },
};

export default function SeeTheImpactContent() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <motion.section
        {...fadeInUp}
        className="pt-16 pb-8 px-4 max-w-5xl mx-auto text-center"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          See the{" "}
          <span className="text-canyon-700">Impact</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Field footage from Big Bend National Park — one of America&apos;s last
          wild frontiers. See what a border wall would destroy.
        </p>
      </motion.section>

      {/* Info Strip */}
      <motion.section
        {...fadeInUp}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="pb-8 px-4 max-w-4xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-5 flex items-center gap-4">
            <div className="p-2.5 bg-canyon-700/10 rounded-lg">
              <Video className="text-canyon-700" size={24} />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">6 field videos</p>
              <p className="text-gray-500 text-sm">Recorded on location</p>
            </div>
          </div>
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-5 flex items-center gap-4">
            <div className="p-2.5 bg-canyon-700/10 rounded-lg">
              <MapPin className="text-canyon-700" size={24} />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">
                GPS exact coordinates
              </p>
              <p className="text-gray-500 text-sm">Pinpointed locations</p>
            </div>
          </div>
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-5 flex items-center gap-4">
            <div className="p-2.5 bg-canyon-700/10 rounded-lg">
              <Mountain className="text-canyon-700" size={24} />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">
                100+ mi wilderness
              </p>
              <p className="text-gray-500 text-sm">Documented by foot</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Map Section */}
      <motion.section
        {...fadeInUp}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="pb-6 px-4 max-w-5xl mx-auto"
      >
        <ImpactMapClient />
      </motion.section>

      {/* Instructions */}
      <motion.section
        {...fadeInUp}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="pb-16 px-4 max-w-5xl mx-auto text-center"
      >
        <p className="text-gray-500 text-sm">
          Tap any red marker on the map to view video footage from that
          location. Pinch to zoom.
        </p>
      </motion.section>
    </main>
  );
}
