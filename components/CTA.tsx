"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { siteContent } from "@/data/siteContent";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
};

interface CTAProps {
  onContactClick: () => void;
}

export default function CTA({ onContactClick }: CTAProps) {
  const { cta } = siteContent;
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section id={cta.sectionId} className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={sectionRef}
          initial="initial"
          animate={isInView ? "animate" : "initial"}
          variants={fadeInUp}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Background gradient */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 30% 50%, rgba(245, 158, 11, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 50%, rgba(100, 116, 139, 0.1) 0%, transparent 50%)",
            }}
          />
          <div className="absolute inset-0 bg-[var(--background-card)]" />

          {/* Content */}
          <div className="relative px-8 py-16 md:px-16 md:py-24 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {cta.headline}
            </h2>
            <p className="text-lg md:text-xl text-[var(--foreground-muted)] mb-10 max-w-2xl mx-auto">
              {cta.subhead}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onContactClick}
                className="px-8 py-4 bg-[var(--accent)] text-[var(--background)] font-medium rounded-lg hover:bg-[var(--accent-hover)] transition-all hover:scale-[1.02] active:scale-[0.98] min-w-[200px]"
              >
                {cta.primaryCta.label}
              </button>
              <a
                href={cta.secondaryCta.href}
                className="px-8 py-4 border border-[var(--border)] text-[var(--foreground)] font-medium rounded-lg hover:border-[var(--border-hover)] hover:bg-[var(--background-elevated)] transition-all min-w-[200px] text-center"
              >
                {cta.secondaryCta.label}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
