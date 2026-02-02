"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { siteContent } from "@/data/siteContent";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
};

function CaseStudyCard({
  study,
  index,
}: {
  study: (typeof siteContent.proof.caseStudies)[0];
  index: number;
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
      className="relative p-8 rounded-2xl bg-[var(--background-card)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-all"
    >
      {/* Metric highlight */}
      <div className="mb-6">
        <span className="text-4xl font-bold text-[var(--accent)]">{study.metric}</span>
        <span className="block text-sm text-[var(--foreground-subtle)] mt-1">
          {study.metricLabel}
        </span>
      </div>

      <h3 className="text-lg font-semibold mb-3">{study.title}</h3>
      <p className="text-[var(--foreground-muted)] leading-relaxed">{study.description}</p>
    </motion.div>
  );
}

function WorkGalleryModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { workGallery } = siteContent.proof;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 z-50 bg-[var(--background-elevated)] rounded-2xl border border-[var(--border)] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
              <h3 className="text-xl font-semibold">Selected Work</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[var(--background-card)] rounded-lg transition-colors"
                aria-label="Close gallery"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Gallery grid */}
            <div className="flex-1 overflow-auto p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {workGallery.items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="aspect-video relative rounded-lg overflow-hidden bg-[var(--background-card)] border border-[var(--border)] group cursor-pointer"
                  >
                    {/* Placeholder gradient */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(135deg, var(--accent-muted) 0%, var(--slate-dark) 100%)`,
                      }}
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-sm font-medium">{item.title}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function Proof() {
  const { proof } = siteContent;
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const headerRef = useRef(null);
  const logosRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });
  const isLogosInView = useInView(logosRef, { once: true, margin: "-100px" });

  return (
    <section id={proof.sectionId} className="py-24 md:py-32">
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{proof.headline}</h2>
          <p className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto">
            {proof.subhead}
          </p>
        </motion.div>

        {/* Trusted By */}
        <motion.div
          ref={logosRef}
          initial="initial"
          animate={isLogosInView ? "animate" : "initial"}
          variants={fadeInUp}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <p className="text-sm text-[var(--foreground-subtle)] text-center mb-6">
            {proof.trustedBy.label}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {proof.trustedBy.logos.map((logo, index) => (
              <div
                key={index}
                className="w-24 h-8 bg-[var(--foreground-subtle)]/20 rounded flex items-center justify-center"
              >
                <span className="text-xs text-[var(--foreground-subtle)]">{logo.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Case Studies */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {proof.caseStudies.map((study, index) => (
            <CaseStudyCard key={index} study={study} index={index} />
          ))}
        </div>

        {/* View Work Button */}
        <div className="text-center">
          <button
            onClick={() => setIsGalleryOpen(true)}
            className="px-6 py-3 border border-[var(--border)] text-[var(--foreground)] rounded-lg hover:border-[var(--border-hover)] hover:bg-[var(--background-elevated)] transition-all"
          >
            {proof.workGallery.buttonLabel}
          </button>
        </div>
      </div>

      {/* Gallery Modal */}
      <WorkGalleryModal isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} />
    </section>
  );
}
