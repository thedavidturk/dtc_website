"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { siteContent } from "@/data/siteContent";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
};

function PillarCard({
  pillar,
  index,
}: {
  pillar: (typeof siteContent.pillars.items)[0];
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
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative p-8 rounded-2xl border transition-all duration-300 ${
        pillar.isAnchor
          ? "bg-[var(--accent-muted)] border-[var(--accent)]/30 md:col-span-2 lg:col-span-2"
          : "bg-[var(--background-card)] border-[var(--border)] hover:border-[var(--border-hover)] hover:bg-[var(--background-elevated)]"
      }`}
    >
      {/* Anchor indicator */}
      {pillar.isAnchor && (
        <div className="absolute top-4 right-4 px-3 py-1 text-xs font-medium text-[var(--accent)] bg-[var(--accent)]/10 rounded-full">
          Core Pillar
        </div>
      )}

      <h3 className={`text-xl font-semibold mb-4 ${pillar.isAnchor ? "text-[var(--accent)]" : "text-[var(--foreground)]"}`}>
        {pillar.title}
      </h3>

      <p className="text-[var(--foreground-muted)] mb-6 leading-relaxed">
        {pillar.description}
      </p>

      <ul className="space-y-2">
        {pillar.services.map((service, serviceIndex) => (
          <li
            key={serviceIndex}
            className="flex items-start gap-2 text-sm text-[var(--foreground-subtle)]"
          >
            <span className={`mt-1.5 w-1 h-1 rounded-full flex-shrink-0 ${pillar.isAnchor ? "bg-[var(--accent)]" : "bg-[var(--slate)]"}`} />
            {service}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function Pillars() {
  const { pillars } = siteContent;
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section id={pillars.sectionId} className="py-24 md:py-32">
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{pillars.headline}</h2>
          <p className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto">
            {pillars.subhead}
          </p>
        </motion.div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.items.map((pillar, index) => (
            <PillarCard key={index} pillar={pillar} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
