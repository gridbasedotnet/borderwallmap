"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, ArrowRight, CheckCircle } from "lucide-react";
import { getSupabase } from "@/lib/supabase";

const DELAY_MS = 4_000; // 4 seconds
const DISMISSED_KEY = "email_cta_dismissed";

export default function EmailCTA() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Use localStorage so dismiss persists across tabs but not forever —
    // cleared when the user clears browser data.
    if (localStorage.getItem(DISMISSED_KEY)) return;

    const timer = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = useCallback(() => {
    setVisible(false);
    localStorage.setItem(DISMISSED_KEY, "1");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      const { error: dbError } = await getSupabase()
        .from("petitions")
        .insert({ email: trimmed });

      if (dbError) {
        if (dbError.code === "23505") {
          // duplicate — treat as success
          setSubmitted(true);
        } else {
          console.error("[EmailCTA] Supabase error:", dbError);
          if (dbError.code === "42P01") {
            setError("Email list isn't set up yet. Please try again later.");
          } else if (dbError.message?.toLowerCase().includes("row-level security") || dbError.code === "42501") {
            setError("Submission blocked by database policy. Please contact support.");
          } else {
            setError(`Error: ${dbError.message || "Something went wrong."}`);
          }
        }
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      console.error("[EmailCTA] Unexpected error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: "spring", damping: 26, stiffness: 300 }}
          className="fixed left-3 right-3 sm:left-auto sm:right-6 z-[9000] sm:max-w-sm"
          style={{ bottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}
        >
          <div className="glass-strong glass-glow rounded-2xl p-5 relative">
            {/* Close */}
            <button
              onClick={dismiss}
              className="absolute top-2.5 right-2.5 text-taupe-500 hover:text-white transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label="Dismiss"
            >
              <X size={18} />
            </button>

            {!submitted ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-canyon-600/15 rounded-lg">
                    <Mail className="text-canyon-400" size={16} />
                  </div>
                  <h3 className="text-white font-semibold text-sm">
                    Stay Informed
                  </h3>
                </div>

                <p className="text-taupe-400 text-xs leading-relaxed mb-3">
                  Get updates on the fight to protect Big Bend from a border
                  wall.
                </p>

                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    autoCapitalize="off"
                    autoCorrect="off"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="your@email.com"
                    required
                    className="flex-1 min-w-0 px-3 py-2.5 min-h-[44px] rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-taupe-600 text-base focus:outline-none focus:border-canyon-600/40 focus:ring-1 focus:ring-canyon-600/20 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 min-h-[44px] glass glass-glow-canyon bg-canyon-600/20 hover:bg-canyon-600/30 active:bg-canyon-600/30 disabled:opacity-50 text-white rounded-xl transition-all flex items-center justify-center"
                    aria-label="Subscribe"
                  >
                    {submitting ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <ArrowRight size={18} />
                    )}
                  </button>
                </form>

                {error && (
                  <p className="text-red-400 text-xs mt-2">{error}</p>
                )}
              </>
            ) : (
              <div className="pr-6">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="text-green-400" size={20} />
                  <h3 className="text-white font-semibold text-sm">
                    Thank you!
                  </h3>
                </div>

                <p className="text-taupe-300 text-xs leading-relaxed mb-2">
                  You&apos;re signed up. We&apos;ll keep you posted on the
                  fight to protect Big Bend.
                </p>

                <p className="text-taupe-400 text-xs leading-relaxed">
                  To make sure our emails reach you, add{" "}
                  <span className="text-canyon-400 font-medium">
                    hello@nobigbendwall.com
                  </span>{" "}
                  to your contacts so we don&apos;t end up in spam.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
