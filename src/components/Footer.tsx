"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="border-t border-gray-800 py-8 px-4"
    >
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-gray-400 text-sm">
          <span className="font-bold text-white">NO BIG BEND</span>{" "}
          <span className="font-bold text-canyon-700">WALL</span>
        </p>
      </div>
    </motion.footer>
  );
}
