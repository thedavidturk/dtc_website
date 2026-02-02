"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { siteContent } from "@/data/siteContent";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
};

export default function Fit() {
  const { fit } = siteContent;
  const headerRef = useRef(null);
  const goodFitRef = useRef(null);
  const notFitRef = useRef(null);

  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });
  const isGoodFitInView = useInView(goodFitRef, { once: true, margin: "-100px" });
  const isNotFitInView = useInView(notFitRef, { once: true, margin: "-100px" });

  return (
    <section id={fit.sectionId} className="py-24 md:py-32 bg-[var(--background-elevated)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial="initial"
          animate={isHeaderInView ? "animate" : "initial"}
          variants={fadeInUp}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{fit.headline}</h2>
          <p className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto">
            {fit.subhead}
          </p>
        </motion.div>

        {/* Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Good Fit */}
          <motion.div
            ref={goodFitRef}
            initial="initial"
            animate={isGoodFitInView ? "animate" : "initial"}
            variants={fadeInUp}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="p-8 rounded-2xl bg-[var(--accent-muted)] border border-[var(--accent)]/30"
          >
            <h3 className="text-xl font-semibold mb-6 text-[var(--accent)]">
              {fit.goodFit.title}
            </h3>
            <ul className="space-y-4">
              {fit.goodFit.items.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-[var(--accent)] flex-shrink-0 mt-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-[var(--foreground-muted)]">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Not a Fit */}
          <motion.div
            ref={notFitRef}
            initial="initial"
            animate={isNotFitInView ? "animate" : "initial"}
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="p-8 rounded-2xl bg-[var(--background-card)] border border-[var(--border)]"
          >
            <h3 className="text-xl font-semibold mb-6 text-[var(--foreground-subtle)]">
              {fit.notFit.title}
            </h3>
            <ul className="space-y-4">
              {fit.notFit.items.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-[var(--foreground-subtle)] flex-shrink-0 mt-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-[var(--foreground-subtle)]">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
