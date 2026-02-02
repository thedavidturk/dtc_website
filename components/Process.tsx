"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { siteContent } from "@/data/siteContent";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
};

function ProcessStep({
  step,
  index,
  totalSteps,
}: {
  step: (typeof siteContent.process.steps)[0];
  index: number;
  totalSteps: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={isInView ? "animate" : "initial"}
      variants={fadeInUp}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Connector line */}
      {index < totalSteps - 1 && (
        <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-gradient-to-r from-[var(--accent)]/50 to-[var(--border)]" />
      )}

      <div className="relative flex flex-col items-center text-center">
        {/* Step number */}
        <div className="w-16 h-16 rounded-full bg-[var(--accent-muted)] border border-[var(--accent)]/30 flex items-center justify-center mb-6">
          <span className="text-lg font-bold text-[var(--accent)]">{step.number}</span>
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
        <p className="text-[var(--foreground-muted)] leading-relaxed max-w-xs">
          {step.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function Process() {
  const { process } = siteContent;
  const headerRef = useRef(null);
  const taglineRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });
  const isTaglineInView = useInView(taglineRef, { once: true, margin: "-100px" });

  return (
    <section id={process.sectionId} className="py-24 md:py-32 bg-[var(--background-elevated)]">
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{process.headline}</h2>
          <p className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto">
            {process.subhead}
          </p>
        </motion.div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {process.steps.map((step, index) => (
            <ProcessStep
              key={index}
              step={step}
              index={index}
              totalSteps={process.steps.length}
            />
          ))}
        </div>

        {/* Tagline */}
        <motion.div
          ref={taglineRef}
          initial="initial"
          animate={isTaglineInView ? "animate" : "initial"}
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <p className="inline-block px-6 py-3 bg-[var(--background-card)] border border-[var(--border)] rounded-full text-[var(--foreground-muted)] italic">
            {process.tagline}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
