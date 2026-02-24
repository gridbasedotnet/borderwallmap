"use client";

import { useEffect, useCallback } from "react";
import { X, ExternalLink, Video, MapPin, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InfoModalProps {
  open: boolean;
  onClose: () => void;
}

export default function InfoModal({ open, onClose }: InfoModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, handleKeyDown]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9998] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="relative w-full sm:max-w-lg sm:mx-4 bg-taupe-950 border-t sm:border border-taupe-900 rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 md:p-8 max-h-[85vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-taupe-400 hover:text-white active:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Close"
            >
              <X size={22} />
            </button>

            <h2 className="text-white text-xl font-bold mb-4">
              What&apos;s happening at Big Bend?
            </h2>

            <p className="text-taupe-400 text-sm leading-relaxed mb-4">
              The Trump Administration is pushing to build a border wall through
              the Big Bend region of West Texas, a remote stretch of the
              Rio Grande surrounded by hundreds of thousands of acres of
              protected wilderness. Big Bend National Park, Big Bend Ranch State
              Park, and the surrounding Chihuahuan Desert are home to
              irreplaceable wildlife corridors, endangered species, and some of the
              most pristine dark skies in North America.
            </p>

            <p className="text-taupe-400 text-sm leading-relaxed mb-6">
              A wall here would be environmentally destructive, astronomically
              expensive, and strategically unnecessary in one of the most
              naturally fortified and least crossed sections of the entire border.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-canyon-600/10 rounded-lg">
                  <Video className="text-canyon-500" size={18} />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">6 field videos</p>
                  <p className="text-taupe-500 text-xs">Recorded on location</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-canyon-600/10 rounded-lg">
                  <MapPin className="text-canyon-500" size={18} />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">GPS tagged locations</p>
                  <p className="text-taupe-500 text-xs">Exact coordinates</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-canyon-600/10 rounded-lg">
                  <Shield className="text-canyon-500" size={18} />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">800K+ acres at risk</p>
                  <p className="text-taupe-500 text-xs">Protected lands threatened</p>
                </div>
              </div>
            </div>

            <a
              href="https://www.nobigbendwall.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-canyon-500 hover:text-canyon-400 active:text-canyon-400 text-sm font-medium transition-colors min-h-[44px]"
            >
              Learn more at nobigbendwall.com
              <ExternalLink size={14} />
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
