"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { siteContent } from "@/data/siteContent";

// Lazy load the 3D component
const CreativeEngine = dynamic(() => import("./CreativeEngine"), {
  ssr: false,
  loading: () => (
    <div
      className="absolute inset-0 opacity-60"
      style={{
        background:
          "radial-gradient(ellipse at 70% 30%, rgba(245, 158, 11, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 30% 70%, rgba(100, 116, 139, 0.1) 0%, transparent 50%)",
      }}
    />
  ),
});

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

interface HeroProps {
  onContactClick: () => void;
}

export default function Hero({ onContactClick }: HeroProps) {
  const { hero } = siteContent;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <CreativeEngine />
      </div>

      {/* Gradient overlays for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)] via-[var(--background)]/80 to-transparent z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-[var(--background)]/50 z-[1]" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-32">
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="max-w-3xl"
        >
          {/* Headline */}
          <motion.h1
            variants={fadeInUp}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6"
          >
            {hero.headline}
          </motion.h1>

          {/* Subhead */}
          <motion.p
            variants={fadeInUp}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg md:text-xl text-[var(--foreground-muted)] leading-relaxed mb-8 max-w-2xl"
          >
            {hero.subhead}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-4 mb-12"
          >
            <button
              onClick={onContactClick}
              className="px-8 py-4 bg-[var(--accent)] text-[var(--background)] font-medium rounded-lg hover:bg-[var(--accent-hover)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {hero.primaryCta.label}
            </button>
            <a
              href={hero.secondaryCta.href}
              className="px-8 py-4 border border-[var(--border)] text-[var(--foreground)] font-medium rounded-lg hover:border-[var(--border-hover)] hover:bg-[var(--background-elevated)] transition-all text-center"
            >
              {hero.secondaryCta.label}
            </a>
          </motion.div>

          {/* Proof Bullets */}
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-6"
          >
            {hero.proofBullets.map((bullet, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                <span className="text-sm text-[var(--foreground-muted)]">
                  {bullet}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-[var(--foreground-subtle)] flex items-start justify-center p-2"
        >
          <motion.div className="w-1 h-2 rounded-full bg-[var(--foreground-subtle)]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
