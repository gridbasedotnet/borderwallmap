"use client";

import { useEffect, useCallback, useState } from "react";
import { X, AlertTriangle, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ImpactVideo, getFullVideoUrl } from "@/lib/supabase";

interface VideoModalProps {
  video: ImpactVideo | null;
  onClose: () => void;
}

export default function VideoModal({ video, onClose }: VideoModalProps) {
  const [hasError, setHasError] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (video) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [video, handleKeyDown]);

  useEffect(() => {
    setHasError(false);
  }, [video]);

  if (!video) return null;

  const fullUrl = getFullVideoUrl(video.video_url);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="relative w-full sm:max-w-4xl sm:mx-4"
        >
          {/* Header with title and close */}
          <div className="flex items-center justify-between px-4 py-3 sm:px-0 sm:pb-3">
            <h2 className="text-white text-base sm:text-xl font-semibold truncate pr-4">
              {video.title}
            </h2>
            <button
              onClick={onClose}
              className="glass text-white hover:text-white active:text-white transition-colors shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full"
              aria-label="Close video"
            >
              <X size={22} />
            </button>
          </div>

          {hasError ? (
            <div className="glass-strong glass-glow rounded-t-2xl sm:rounded-2xl p-6 sm:p-12 flex flex-col items-center gap-4 text-center">
              <AlertTriangle size={40} className="text-canyon-500" />
              <p className="text-white text-base font-medium">
                Video unavailable
              </p>
              <p className="text-taupe-400 text-sm max-w-md">
                This video could not be loaded. It may still be processing or
                temporarily unavailable.
              </p>
              <a
                href={fullUrl}
                download
                className="mt-2 inline-flex items-center gap-2 px-5 py-3 min-h-[44px] glass glass-glow-canyon bg-canyon-600/20 hover:bg-canyon-600/30 active:bg-canyon-600/30 text-white rounded-xl transition-all text-sm"
              >
                <Download size={16} />
                Download Video
              </a>
            </div>
          ) : (
            <div className="sm:rounded-2xl overflow-hidden glass-glow">
              <video
                controls
                autoPlay
                playsInline
                className="w-full max-h-[70vh] sm:max-h-[75vh] bg-black"
                onError={() => setHasError(true)}
              >
                <source src={fullUrl} type="video/mp4" />
                <source src={fullUrl} type="video/quicktime" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {/* Prominent close button below content — always visible */}
          <div className="flex justify-center px-4 py-4 sm:pt-4 sm:pb-0">
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-6 py-3 min-h-[48px] glass text-white rounded-full text-sm font-medium transition-colors hover:bg-white/10 active:bg-white/10"
            >
              <X size={18} />
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
