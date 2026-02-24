"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { useMemo } from "react";

const TEXT = "NO AL MURO";
const LINE_COUNT = 12;
const REPEATS = 8; // how many times the text repeats per line

function generateLines() {
  const lines = [];
  for (let i = 0; i < LINE_COUNT; i++) {
    // Random duration between 25s and 60s for varied speeds
    const duration = 25 + Math.random() * 35;
    // Random initial offset so they don't all start aligned
    const offset = -(Math.random() * 100);
    lines.push({ id: i, duration, offset });
  }
  return lines;
}

export default function ScrollingMarquee() {
  const { scrollYProgress } = useScroll();
  // Fade out as user scrolls down the page
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.6, 0.2, 0.2, 0.6]);

  const lines = useMemo(() => generateLines(), []);
  const repeated = Array.from({ length: REPEATS }, () => TEXT).join("\u2003\u2003");

  return (
    <motion.div
      style={{ opacity }}
      className="marquee-container"
      aria-hidden="true"
    >
      {lines.map((line) => (
        <div key={line.id} className="marquee-line">
          <div
            className="marquee-track"
            style={{
              animationDuration: `${line.duration}s`,
              transform: `translateX(${line.offset}%)`,
            }}
          >
            <span>{repeated}</span>
            <span>{repeated}</span>
          </div>
        </div>
      ))}
    </motion.div>
  );
}
