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
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl mx-4"
        >
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 text-gray-400 hover:text-white transition-colors z-10"
            aria-label="Close video"
          >
            <X size={32} />
          </button>

          <h2 className="text-white text-xl font-semibold mb-4">
            {video.title}
          </h2>

          {hasError ? (
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-12 flex flex-col items-center gap-4 text-center">
              <AlertTriangle size={48} className="text-canyon-500" />
              <p className="text-white text-lg font-medium">
                Video unavailable
              </p>
              <p className="text-gray-400 text-sm max-w-md">
                This video could not be loaded. It may still be processing or
                temporarily unavailable.
              </p>
              <a
                href={fullUrl}
                download
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-canyon-700 hover:bg-canyon-600 text-white rounded-lg transition-colors text-sm"
              >
                <Download size={16} />
                Download Video
              </a>
            </div>
          ) : (
            <div className="bg-black rounded-xl overflow-hidden">
              <video
                controls
                autoPlay
                playsInline
                className="w-full max-h-[75vh]"
                onError={() => setHasError(true)}
              >
                <source src={fullUrl} type="video/mp4" />
                <source src={fullUrl} type="video/quicktime" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
