"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Video, MapPin, Shield, ExternalLink } from "lucide-react";
import SubmitVideoForm from "./SubmitVideoForm";

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
  return (
    <main className="min-h-screen bg-[#0d0b09]">
      {/* Hero Section */}
      <motion.section
        {...fadeInUp}
        className="pt-16 pb-8 px-4 max-w-5xl mx-auto text-center"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          See the{" "}
          <span className="text-canyon-500">Impact</span>
        </h1>
        <p className="text-taupe-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Field footage from Big Bend National Park — one of America&apos;s last
          wild frontiers. See what a border wall would destroy.
        </p>
      </motion.section>

      {/* Border Wall Info */}
      <motion.section
        {...fadeInUp}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="pb-8 px-4 max-w-4xl mx-auto"
      >
        <div className="bg-taupe-950 border border-taupe-900 rounded-xl p-6 md:p-8">
          <h2 className="text-white text-lg font-semibold mb-3">
            What&apos;s happening at Big Bend?
          </h2>
          <p className="text-taupe-400 text-sm leading-relaxed mb-3">
            The Trump Administration is pushing to build a border wall through
            the Big Bend region of West Texas — a remote stretch of the
            Rio Grande surrounded by hundreds of thousands of acres of
            protected wilderness. Big Bend National Park, Big Bend Ranch State
            Park, and the surrounding Chihuahuan Desert are home to
            irreplaceable wildlife corridors, endangered species, and some of the
            most pristine dark skies in North America. A wall here would be
            environmentally destructive, astronomically expensive, and
            strategically unnecessary in one of the most naturally fortified and
            least-crossed sections of the entire border.
          </p>
          <a
            href="https://www.nobigbendwall.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-canyon-500 hover:text-canyon-400 text-sm font-medium transition-colors"
          >
            Learn more at nobigbendwall.com
            <ExternalLink size={14} />
          </a>
        </div>
      </motion.section>

      {/* Info Strip */}
      <motion.section
        {...fadeInUp}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="pb-8 px-4 max-w-4xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-taupe-950 border border-taupe-900 rounded-xl p-5 flex items-center gap-4">
            <div className="p-2.5 bg-canyon-600/10 rounded-lg">
              <Video className="text-canyon-500" size={24} />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">6 field videos</p>
              <p className="text-taupe-500 text-sm">Recorded on location</p>
            </div>
          </div>
          <div className="bg-taupe-950 border border-taupe-900 rounded-xl p-5 flex items-center gap-4">
            <div className="p-2.5 bg-canyon-600/10 rounded-lg">
              <MapPin className="text-canyon-500" size={24} />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">
                GPS-tagged locations
              </p>
              <p className="text-taupe-500 text-sm">Exact coordinates</p>
            </div>
          </div>
          <div className="bg-taupe-950 border border-taupe-900 rounded-xl p-5 flex items-center gap-4">
            <div className="p-2.5 bg-canyon-600/10 rounded-lg">
              <Shield className="text-canyon-500" size={24} />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">
                800K+ acres at risk
              </p>
              <p className="text-taupe-500 text-sm">Protected lands threatened</p>
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
        <p className="text-taupe-500 text-sm">
          Tap any marker on the map to view video footage from that
          location. Pinch to zoom.
        </p>
      </motion.section>

      {/* Submit Your Video */}
      <motion.section
        {...fadeInUp}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="pb-20 px-4 max-w-2xl mx-auto"
      >
        <div className="bg-taupe-950 border border-taupe-900 rounded-xl p-6 md:p-8">
          <h2 className="text-white text-2xl font-bold mb-2">
            Have footage from the region?
          </h2>
          <p className="text-taupe-400 text-sm leading-relaxed mb-6">
            If you&apos;ve recorded video in or around Big Bend, we&apos;d love
            to see it. Upload your footage below and our team will review it. If
            selected, your video will be GPS-tagged and added to the map. We may
            also reach out with follow-up questions.
          </p>
          <SubmitVideoForm />
        </div>
      </motion.section>
    </main>
  );
}
