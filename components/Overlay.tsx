"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import Lenis from "@studio-freight/lenis";
import MagneticButton from "./MagneticButton";
import TextReveal, { FadeReveal } from "./TextReveal";
import CustomCursor from "./CustomCursor";
import { Project } from "./ProjectDetail";
import ProjectModal3D from "./ProjectModal3D";
import LiquidGlass from "./LiquidGlass";
import { Capability } from "./CapabilityDetail";
import CapabilityModal3D from "./CapabilityModal3D";

function ScrollIndicator() {
  const scroll = useStore((state) => state.scroll);

  const sections = [
    { label: "Home", position: 0 },
    { label: "Services", position: 0.34 },
    { label: "Work", position: 0.56 },
    { label: "Process", position: 0.67 },
    { label: "Contact", position: 0.86 },
  ];

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3">
      {sections.map((section, i) => (
        <motion.div
          key={i}
          className="flex items-center gap-2 cursor-pointer group"
          whileHover={{ x: -5 }}
          data-cursor
        >
          <span className="text-xs text-white/0 group-hover:text-white/50 transition-colors">
            {section.label}
          </span>
          <motion.div
            className="w-2 h-2 rounded-full border border-white/30"
            animate={{
              scale: Math.abs(scroll - section.position) < 0.15 ? 1.5 : 1,
              backgroundColor:
                Math.abs(scroll - section.position) < 0.15
                  ? "#FF5C34"
                  : "transparent",
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      ))}
    </div>
  );
}

function Navigation({ onNavigate }: { onNavigate: (position: number) => void }) {
  const setContactOpen = useStore((state) => state.setContactOpen);
  const scroll = useStore((state) => state.scroll);

  const navItems = [
    { label: "Services", position: 0.34 },
    { label: "Work", position: 0.56 },
    { label: "Process", position: 0.67 },
    { label: "Contact", position: 0.86 },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-6"
    >
      <motion.div
        className="absolute inset-0 bg-[#351E28]/80 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: scroll > 0.05 ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      <div className="relative flex items-center justify-between">
        <MagneticButton
          onClick={() => onNavigate(0)}
          className="text-2xl font-bold tracking-tighter text-white"
          strength={0.2}
        >
          DT+C
        </MagneticButton>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <MagneticButton
              key={item.label}
              onClick={() => onNavigate(item.position)}
              className="text-sm text-white/60 hover:text-white transition-colors relative group"
              strength={0.15}
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#FF5C34] group-hover:w-full transition-all duration-300" />
            </MagneticButton>
          ))}
        </div>

        <MagneticButton
          onClick={() => setContactOpen(true)}
          className="px-4 py-2 md:px-6 md:py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-xs md:text-sm text-white hover:bg-white/20 hover:border-[#FF5C34]/50 transition-all"
          strength={0.25}
        >
          <span className="hidden sm:inline">Start a Project</span>
          <span className="sm:hidden">Contact</span>
        </MagneticButton>
      </div>
    </motion.nav>
  );
}

// Opening cinematic intro
function IntroSection() {
  const scroll = useStore((state) => state.scroll);
  const isLoaded = useStore((state) => state.isLoaded);

  // Intro fades out as user scrolls (0 to 0.08 scroll range)
  const introProgress = Math.min(1, scroll / 0.08);
  const introOpacity = Math.max(0, 1 - introProgress);

  if (!isLoaded || introOpacity < 0.01) return null;

  return (
    <motion.section
      className="fixed inset-0 z-[45] flex items-center justify-center pointer-events-none"
      style={{ opacity: introOpacity }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      {/* Dark vignette overlay */}
      <div
        className="absolute inset-0 bg-[#351E28]"
        style={{ opacity: 0.85 - introProgress * 0.5 }}
      />

      {/* Centered scroll prompt */}
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-8"
        >
          <span className="text-[#E9F056] text-6xl md:text-8xl font-bold tracking-tighter">
            DT+C
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-white/40 text-sm tracking-[0.3em] uppercase mb-12"
        >
          Scroll to begin
        </motion.p>

        {/* Animated scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex flex-col items-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-[#E9F056]/50 to-[#E9F056]" />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-2 h-2 rounded-full bg-[#E9F056]"
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}

function HeroSection() {
  const scroll = useStore((state) => state.scroll);
  const setContactOpen = useStore((state) => state.setContactOpen);

  // Hero appears after intro and stays longer
  const revealStart = 0.05;
  const revealEnd = 0.15;
  const fadeStart = 0.22;
  const fadeEnd = 0.32;

  let opacity = 0;
  let revealProgress = 0;

  if (scroll < revealStart) {
    opacity = 0;
  } else if (scroll < revealEnd) {
    revealProgress = (scroll - revealStart) / (revealEnd - revealStart);
    opacity = revealProgress;
  } else if (scroll < fadeStart) {
    opacity = 1;
    revealProgress = 1;
  } else if (scroll < fadeEnd) {
    opacity = 1 - (scroll - fadeStart) / (fadeEnd - fadeStart);
    revealProgress = 1;
  } else {
    opacity = 0;
  }

  const scale = 1 - Math.max(0, scroll - fadeStart) * 0.3;

  if (opacity < 0.01) return null;

  return (
    <motion.section
      className="fixed inset-0 flex items-center justify-center pointer-events-none z-[42]"
      style={{ opacity }}
    >
      <motion.div
        className="text-center px-6 max-w-4xl"
        style={{ scale }}
      >
        <motion.div
          style={{
            opacity: revealProgress,
            transform: `translateY(${(1 - revealProgress) * 30}px)`
          }}
        >
          <span className="text-[#FF5C34] text-sm tracking-[0.3em] uppercase mb-6 inline-block">
            Creative Studio
          </span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight mb-8 overflow-hidden">
          <motion.span
            className="block text-[#E9F056]"
            style={{
              opacity: Math.min(1, revealProgress * 1.5),
              transform: `translateY(${(1 - Math.min(1, revealProgress * 1.5)) * 60}px)`
            }}
          >
            We build
          </motion.span>
          <motion.span
            className="block text-[#FF5C34]"
            style={{
              opacity: Math.min(1, Math.max(0, revealProgress - 0.3) * 1.8),
              transform: `translateY(${(1 - Math.min(1, Math.max(0, revealProgress - 0.3) * 1.8)) * 60}px)`
            }}
          >
            creative systems
          </motion.span>
        </h1>

        <motion.div
          style={{
            opacity: Math.min(1, Math.max(0, revealProgress - 0.5) * 2.5),
            transform: `translateY(${(1 - Math.min(1, Math.max(0, revealProgress - 0.5) * 2.5)) * 30}px)`
          }}
          className="mb-8"
        >
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto">
            AI-powered strategy, story, and production for brands
            that refuse to blend in.
          </p>
        </motion.div>

        {/* Hero Stats - Hidden on very small screens */}
        <motion.div
          style={{
            opacity: Math.min(1, Math.max(0, revealProgress - 0.55) * 2.5),
            transform: `translateY(${(1 - Math.min(1, Math.max(0, revealProgress - 0.55) * 2.5)) * 20}px)`
          }}
          className="hidden sm:flex justify-center gap-6 md:gap-12 mb-8 md:mb-10"
        >
          {[
            { value: "50+", label: "Projects" },
            { value: "60%", label: "Faster" },
            { value: "3x", label: "Concepts" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <span className="text-xl sm:text-2xl md:text-3xl font-bold text-[#E9F056] block">{stat.value}</span>
              <span className="text-[10px] sm:text-xs text-white/40">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          style={{
            opacity: Math.min(1, Math.max(0, revealProgress - 0.7) * 3.5),
            transform: `translateY(${(1 - Math.min(1, Math.max(0, revealProgress - 0.7) * 3.5)) * 20}px)`
          }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pointer-events-auto px-4"
        >
          <MagneticButton
            onClick={() => setContactOpen(true)}
            className="px-6 py-3 sm:px-8 sm:py-4 bg-[#FF5C34] rounded-full text-white text-sm sm:text-base font-semibold hover:shadow-lg hover:shadow-[#FF5C34]/25 transition-shadow"
            strength={0.3}
          >
            Start a Project
          </MagneticButton>
          <MagneticButton
            className="px-6 py-3 sm:px-8 sm:py-4 border border-white/20 rounded-full text-white text-sm sm:text-base font-medium hover:bg-white/10 hover:border-white/40 transition-all"
            strength={0.3}
          >
            View Our Work
          </MagneticButton>
        </motion.div>

        <motion.div
          style={{
            opacity: Math.min(1, Math.max(0, revealProgress - 0.8) * 5),
          }}
          className="hidden sm:flex flex-wrap justify-center gap-2 sm:gap-3 mt-6 sm:mt-8 px-4"
        >
          {["AI Strategy", "Video Production", "Brand Systems", "Rapid Prototyping"].map(
            (tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 sm:px-4 sm:py-2 border border-white/10 rounded-full text-[10px] sm:text-xs text-white/40 tracking-wide hover:border-[#FF5C34]/30 hover:text-white/60 transition-all cursor-default"
              >
                {tag}
              </span>
            )
          )}
        </motion.div>

        {/* Client Logo Marquee - Hidden on mobile */}
        <motion.div
          style={{
            opacity: Math.min(1, Math.max(0, revealProgress - 0.85) * 6),
          }}
          className="hidden md:block mt-16 w-full max-w-3xl mx-auto"
        >
          <p className="text-xs text-white/30 text-center mb-4 tracking-widest uppercase">Trusted by</p>
          <div className="relative overflow-hidden">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#351E28] to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#351E28] to-transparent z-10" />

            {/* Scrolling logos */}
            <motion.div
              className="flex gap-12 items-center"
              animate={{ x: [0, -600] }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            >
              {/* Logo placeholders - replace src with your actual logo files */}
              {[
                { name: "New Era", width: "80px" },
                { name: "SeaWorld", width: "100px" },
                { name: "United Parks", width: "90px" },
                { name: "Meridian", width: "85px" },
                { name: "New Era", width: "80px" },
                { name: "SeaWorld", width: "100px" },
                { name: "United Parks", width: "90px" },
                { name: "Meridian", width: "85px" },
              ].map((client, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 h-8 flex items-center justify-center text-white/30 font-semibold text-sm tracking-wide"
                  style={{ minWidth: client.width }}
                >
                  {/* Replace this div with <img src="/logos/client-name.svg" alt={client.name} className="h-6 w-auto opacity-40 hover:opacity-70 transition-opacity" /> */}
                  {client.name}
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll prompt - only shows when hero is fully revealed */}
      {revealProgress >= 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-white/30 tracking-widest uppercase">
            Continue scrolling
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-5 h-8 border border-white/20 rounded-full flex items-start justify-center p-1"
          >
            <motion.div className="w-1 h-2 bg-white/40 rounded-full" />
          </motion.div>
        </motion.div>
      )}
    </motion.section>
  );
}

function ContentSection({
  scrollStart,
  scrollEnd,
  children,
}: {
  scrollStart: number;
  scrollEnd: number;
  children: React.ReactNode;
}) {
  const scroll = useStore((state) => state.scroll);

  const progress = (scroll - scrollStart) / (scrollEnd - scrollStart);
  const isVisible = scroll >= scrollStart - 0.05 && scroll <= scrollEnd + 0.05;

  let opacity = 0;
  if (isVisible) {
    if (progress < 0.3) {
      opacity = progress / 0.3;
    } else if (progress > 0.7) {
      opacity = (1 - progress) / 0.3;
    } else {
      opacity = 1;
    }
  }

  if (opacity < 0.01) return null;

  return (
    <motion.section
      className="fixed inset-0 flex items-center justify-center pointer-events-none z-30"
      style={{ opacity }}
    >
      {children}
    </motion.section>
  );
}

const CAPABILITIES: Capability[] = [
  {
    title: "AI Creative Strategy",
    description: "Research-driven ideation and systems design that amplifies your creative output",
    icon: "01",
    color: "#FF5C34",
    services: [
      "AI-driven ideation & concept development",
      "Deep research & marketing intelligence",
      "Creative testing strategy",
      "AI workflow design",
      "Tool selection & integration",
      "Team training & enablement",
    ],
    details: {
      overview: "We don't just use AI—we architect intelligent creative systems. From ideation to execution, we design workflows that multiply your team's output while maintaining creative quality and brand consistency.",
      benefits: [
        "10x faster concept generation without sacrificing quality",
        "Data-informed creative decisions, not guesswork",
        "Scalable systems that grow with your needs",
        "Future-proof workflows as AI tools evolve",
      ],
      tools: ["ChatGPT", "Claude", "Midjourney", "Runway", "ElevenLabs", "Custom APIs"],
    },
  },
  {
    title: "Story & Pre-Production",
    description: "Pitch decks, storyboards, and concept validation before expensive production",
    icon: "02",
    color: "#D7EFFF",
    services: [
      "Strategy-first pitch decks",
      "Brand & campaign storytelling",
      "Storyboards & animatics",
      "Previs & concept validation",
      "Pre-production de-risking",
      "Script development",
    ],
    details: {
      overview: "The best productions start with bulletproof pre-production. We use AI-accelerated workflows to explore more concepts, validate ideas faster, and de-risk your investment before cameras roll.",
      benefits: [
        "See your vision before committing budget",
        "Test multiple directions in parallel",
        "Align stakeholders with vivid previsualization",
        "Reduce production surprises and overruns",
      ],
      tools: ["Midjourney", "Runway", "Premiere Pro", "After Effects", "Figma"],
    },
  },
  {
    title: "AI-Enhanced Production",
    description: "Video, animation, and photography accelerated by intelligent workflows",
    icon: "03",
    color: "#E9F056",
    services: [
      "Video production",
      "Advanced animation (2D/3D/hybrid)",
      "Brand photography",
      "Virtual production & AI environments",
      "AI-accelerated post pipelines",
      "Color grading & finishing",
    ],
    details: {
      overview: "Production that moves at the speed of ideas. We blend traditional craft with AI acceleration to deliver broadcast-quality work in a fraction of the time—without cutting corners.",
      benefits: [
        "60% faster post-production timelines",
        "More iterations within the same budget",
        "Consistent quality across high-volume projects",
        "Access to visual styles previously cost-prohibitive",
      ],
      tools: ["Runway Gen-3", "Pika", "After Effects", "DaVinci Resolve", "Unreal Engine"],
    },
  },
  {
    title: "Motion & Visual Systems",
    description: "Scalable brand worlds and design systems that maintain consistency",
    icon: "04",
    color: "#AEB8A0",
    services: [
      "Motion systems for ads & social",
      "Brand worlds & visual universes",
      "Scalable visual language",
      "Campaign continuity",
      "Template systems",
      "Asset libraries",
    ],
    details: {
      overview: "One-off assets don't scale. We build visual systems—modular, templated, and AI-ready—that let your team produce on-brand content at volume without bottlenecking creative.",
      benefits: [
        "Consistent brand expression across all touchpoints",
        "Empower internal teams to self-serve",
        "Reduce creative bottlenecks",
        "Faster campaign launches",
      ],
      tools: ["After Effects", "Figma", "Lottie", "Rive", "Cinema 4D"],
    },
  },
];

function CapabilitiesSection({ onCapabilityClick }: { onCapabilityClick: (cap: Capability) => void }) {
  return (
    <ContentSection scrollStart={0.28} scrollEnd={0.40}>
      <div className="w-full" style={{ perspective: "1200px" }}>
        <div className="text-center mb-6 sm:mb-12 px-4 sm:px-6">
          <TextReveal
            as="h2"
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white"
            type="words"
            stagger={0.05}
          >
            What we do
          </TextReveal>
        </div>

        {/* Mobile: Horizontal scroll carousel */}
        <div className="md:hidden pointer-events-auto">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 pb-4 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
            {CAPABILITIES.map((cap, i) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex-shrink-0 w-[85vw] snap-center"
              >
                <div
                  onClick={() => onCapabilityClick(cap)}
                  className="p-5 h-full border border-white/10 rounded-2xl bg-zinc-900/80 backdrop-blur-sm relative active:scale-[0.98] transition-transform"
                >
                  {/* Accent line */}
                  <div
                    className="absolute top-0 left-5 right-5 h-px opacity-50"
                    style={{ backgroundColor: cap.color }}
                  />

                  {/* Icon */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-lg"
                      style={{ backgroundColor: cap.color }}
                    >
                      {cap.icon}
                    </div>
                    <div
                      className="h-px flex-1 opacity-20"
                      style={{ backgroundColor: cap.color }}
                    />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {cap.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed mb-3">
                    {cap.description}
                  </p>

                  {/* Service preview tags */}
                  <div className="flex flex-wrap gap-2">
                    {cap.services.slice(0, 3).map((service) => (
                      <span
                        key={service}
                        className="px-2 py-1 text-xs rounded-md bg-white/5 text-white/40 border border-white/5"
                      >
                        {service.split(" ").slice(0, 2).join(" ")}
                      </span>
                    ))}
                  </div>

                  {/* Tap indicator */}
                  <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/50">
                      <path d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {/* Scroll indicator */}
          <div className="flex justify-center gap-1.5 mt-3">
            {CAPABILITIES.map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20" />
            ))}
          </div>
          <p className="text-center text-white/30 text-xs mt-2">Swipe to explore</p>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden md:grid md:grid-cols-2 gap-6 pointer-events-auto px-6 max-w-6xl mx-auto">
          {CAPABILITIES.map((cap, i) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 30, rotateX: -10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <LiquidGlass
                onClick={() => onCapabilityClick(cap)}
                glowColor={`${cap.color}66`}
                className="h-full rounded-2xl"
              >
                <div className="p-8 h-full border border-white/10 rounded-2xl bg-zinc-900/80 backdrop-blur-sm group">
                  {/* Accent line */}
                  <div
                    className="absolute top-0 left-8 right-8 h-px opacity-50"
                    style={{ backgroundColor: cap.color }}
                  />

                  {/* Icon */}
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold text-white shadow-lg"
                      style={{ backgroundColor: cap.color }}
                    >
                      {cap.icon}
                    </div>
                    <div
                      className="h-px flex-1 opacity-20"
                      style={{ backgroundColor: cap.color }}
                    />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-3 transition-all">
                    {cap.title}
                  </h3>
                  <p className="text-white/50 leading-relaxed mb-4 group-hover:text-white/70 transition-colors">
                    {cap.description}
                  </p>

                  {/* Service preview tags */}
                  <div className="flex flex-wrap gap-2">
                    {cap.services.slice(0, 3).map((service) => (
                      <span
                        key={service}
                        className="px-2 py-1 text-xs rounded-md bg-white/5 text-white/40 border border-white/5"
                      >
                        {service.split(" ").slice(0, 2).join(" ")}
                      </span>
                    ))}
                    {cap.services.length > 3 && (
                      <span className="px-2 py-1 text-xs rounded-md bg-white/5 text-white/40 border border-white/5">
                        +{cap.services.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Hover arrow */}
                  <motion.div
                    className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ scale: 1.1 }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/70">
                      <path d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </motion.div>
                </div>
              </LiquidGlass>
            </motion.div>
          ))}
        </div>
      </div>
    </ContentSection>
  );
}

const PROJECTS: Project[] = [
  {
    title: "New Era Cap",
    category: "Virtual Production + 3D Animation",
    description: "Space-themed 'Out of This World' campaign featuring immersive 3D environments and cinematic product showcases.",
    color: "#D7EFFF",
    tags: ["3D Animation", "VFX", "Unreal Engine"],
    challenge: "Create a visually stunning campaign that differentiates New Era in a competitive market while conveying the excitement of space exploration.",
    solution: "Built immersive space environments in Unreal Engine 5 featuring planets, stars, and galaxies. Combined 3D animation with live model photography and cinematic post-production for multi-platform deployment.",
    results: [
      { metric: "UE5", label: "Virtual Production" },
      { metric: "Multi", label: "Platform Campaign" },
      { metric: "3D", label: "Product Showcase" },
    ],
    processSteps: [
      { phase: "Discovery", description: "Explored space themes and New Era's brand positioning to define visual language" },
      { phase: "Concept", description: "AI-generated mood boards and initial environment concepts in hours, not weeks" },
      { phase: "Previs", description: "Built low-fidelity UE5 environments to test compositions before full production" },
      { phase: "Production", description: "Created final environments, product animations, and post-production pipeline" },
    ],
    tools: ["Unreal Engine 5", "Cinema 4D", "After Effects", "DaVinci Resolve"],
    deliverables: ["Hero campaign video", "Product showcase animations", "Social media cuts", "Key art visuals"],
  },
  {
    title: "SeaWorld Orlando",
    category: "Cinematic Campaign",
    description: "SEAQuest announcement campaign featuring a theatrical teaser trailer and hero visuals for the new dark ride attraction.",
    color: "#E9F056",
    tags: ["Unreal Engine", "Trailer", "VFX"],
    videoUrl: "https://www.youtube.com/watch?v=pNLW1Tx5IAE",
    challenge: "United Parks needed a cinematic teaser trailer and hero visuals to generate excitement across digital platforms while maintaining tight production deadlines.",
    solution: "Built immersive deep-sea environments in Unreal Engine, crafted a 30-second theatrical-style trailer, and developed hero visuals using AI-assisted enhancements. All assets optimized for multiple aspect ratios.",
    results: [
      { metric: "30", label: "Day turnaround" },
      { metric: "3", label: "Platform formats" },
      { metric: "30s", label: "Cinematic trailer" },
    ],
    processSteps: [
      { phase: "Brief", description: "Rapid alignment on tone, audience, and platform requirements" },
      { phase: "Design", description: "AI-assisted deep-sea environment exploration and creature concepting" },
      { phase: "Build", description: "Unreal Engine environment construction with real-time iteration" },
      { phase: "Deliver", description: "Final renders, color grade, and multi-format exports" },
    ],
    tools: ["Unreal Engine 5", "After Effects", "Midjourney", "DaVinci Resolve"],
    deliverables: ["30-second teaser trailer", "Hero key art", "Instagram/TikTok formats", "Digital billboard assets"],
  },
  {
    title: "New Era Sprouted",
    category: "Digital Animation + Virtual Production",
    description: "Immersive campaign for New Era's 'Sprouted' collection featuring lush 3D environments and cinematic product storytelling.",
    color: "#FF5C34",
    tags: ["Unreal Engine", "3D Animation", "VFX"],
    challenge: "Create a visually stunning campaign that would stand out in a crowded marketplace while conveying wonder in a foliage-filled world.",
    solution: "Built immersive environments in Unreal Engine 5—forests, mushroom hilltops, cityscapes—with carefully crafted visuals and audio to highlight product features through cinematic storytelling.",
    results: [
      { metric: "UE5", label: "Environment Design" },
      { metric: "3D", label: "Product Animation" },
      { metric: "Full", label: "Post-Production" },
    ],
    processSteps: [
      { phase: "Research", description: "Nature-inspired visual research and collection theme alignment" },
      { phase: "Worldbuild", description: "Created distinct environment zones: forest floor, mushroom peaks, urban garden" },
      { phase: "Animate", description: "Product reveals and transitions designed for maximum visual impact" },
      { phase: "Polish", description: "Color grading, sound design, and platform optimization" },
    ],
    tools: ["Unreal Engine 5", "Cinema 4D", "Houdini", "After Effects"],
    deliverables: ["Hero campaign film", "Product reveal animations", "Behind-the-scenes content", "Social cuts"],
  },
  {
    title: "Meridian Studios",
    category: "Content Engine",
    description: "Scalable content system producing 40+ branded assets per month with AI assistance.",
    color: "#AEB8A0",
    tags: ["AI", "Systems", "Content"],
    challenge: "Meridian was drowning in content requests from multiple brands but couldn't afford to scale their team proportionally.",
    solution: "We designed and implemented a content production system with AI-assisted ideation, templated design systems, and automated quality checks—all managed through a custom dashboard.",
    results: [
      { metric: "40+", label: "Assets per month" },
      { metric: "4x", label: "Output increase" },
      { metric: "0", label: "Additional headcount" },
    ],
    processSteps: [
      { phase: "Audit", description: "Analyzed existing workflows and identified automation opportunities" },
      { phase: "Design", description: "Created modular template systems and AI-assisted ideation tools" },
      { phase: "Build", description: "Developed custom dashboard for request management and QA" },
      { phase: "Train", description: "Enabled team to self-serve with documented processes" },
    ],
    tools: ["Figma", "After Effects", "ChatGPT", "Custom API integrations"],
    deliverables: ["Template system", "AI ideation toolkit", "Production dashboard", "Team training"],
    testimonial: {
      quote: "We went from reactive to proactive. Now we're pitching content ideas to clients instead of just filling orders.",
      author: "Lisa Park",
      role: "Creative Director, Meridian"
    }
  },
];

function AIDifferentiatorSection() {
  const workflowSteps = [
    {
      phase: "Research",
      traditional: "Weeks of manual research",
      aiPowered: "Deep AI analysis in hours",
      icon: "🔍",
      color: "#D7EFFF",
    },
    {
      phase: "Ideation",
      traditional: "Limited concepts due to time",
      aiPowered: "100+ concepts explored rapidly",
      icon: "💡",
      color: "#E9F056",
    },
    {
      phase: "Prototyping",
      traditional: "Expensive test shoots",
      aiPowered: "AI-generated previews first",
      icon: "🎬",
      color: "#FF5C34",
    },
    {
      phase: "Production",
      traditional: "Fixed deliverables",
      aiPowered: "Iterate until perfect",
      icon: "✨",
      color: "#AEB8A0",
    },
  ];

  return (
    <ContentSection scrollStart={0.42} scrollEnd={0.52}>
      <div className="px-4 sm:px-6 max-w-5xl w-full overflow-y-auto max-h-[80vh]">
        <motion.div className="text-center mb-6 sm:mb-12">
          <motion.p
            className="text-[#E9F056] text-xs sm:text-sm tracking-[0.2em] uppercase mb-2 sm:mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            The DT+C Difference
          </motion.p>
          <TextReveal
            as="h2"
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4"
            type="words"
            stagger={0.05}
          >
            AI-Augmented Creative
          </TextReveal>
          <FadeReveal delay={0.2}>
            <p className="text-sm sm:text-base text-white/50 max-w-2xl mx-auto px-4">
              We don&apos;t replace creativity with AI—we multiply it. Our workflow lets us explore
              more ideas, iterate faster, and deliver higher quality at a fraction of traditional timelines.
            </p>
          </FadeReveal>
        </motion.div>

        {/* Workflow Comparison - 2 columns on mobile, 4 on large screens */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pointer-events-auto pb-4">
          {workflowSteps.map((step, i) => (
            <motion.div
              key={step.phase}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative group"
            >
              <div className="p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-zinc-900/80 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all h-full">
                {/* Icon */}
                <div
                  className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center text-lg sm:text-2xl mb-2 sm:mb-4"
                  style={{ backgroundColor: `${step.color}20` }}
                >
                  {step.icon}
                </div>

                {/* Phase */}
                <h3 className="text-sm sm:text-lg font-semibold text-white mb-2 sm:mb-4">
                  {step.phase}
                </h3>

                {/* Comparison */}
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-start gap-1 sm:gap-2">
                    <span className="text-white/30 text-[10px] sm:text-xs mt-0.5">OLD</span>
                    <span className="text-white/40 text-[10px] sm:text-sm line-through">{step.traditional}</span>
                  </div>
                  <div className="flex items-start gap-1 sm:gap-2">
                    <span className="text-[#E9F056] text-[10px] sm:text-xs mt-0.5 font-semibold">NEW</span>
                    <span className="text-white/70 text-[10px] sm:text-sm">{step.aiPowered}</span>
                  </div>
                </div>

                {/* Accent line */}
                <div
                  className="absolute bottom-0 left-3 right-3 sm:left-4 sm:right-4 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: step.color }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 sm:mt-12 flex justify-center gap-6 sm:gap-8 md:gap-16"
        >
          {[
            { value: "60%", label: "Faster" },
            { value: "3x", label: "Concepts" },
            { value: "0", label: "Compromise" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#FF5C34] block">
                {stat.value}
              </span>
              <span className="text-white/40 text-[10px] sm:text-sm">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </ContentSection>
  );
}

function ProjectsSection({ onProjectClick }: { onProjectClick: (project: Project) => void }) {
  return (
    <ContentSection scrollStart={0.50} scrollEnd={0.62}>
      <div className="w-full">
        <motion.div className="text-center mb-6 sm:mb-12 px-4 sm:px-6">
          <motion.p
            className="text-[#FF5C34] text-xs sm:text-sm tracking-[0.2em] uppercase mb-2 sm:mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            Selected Work
          </motion.p>
          <TextReveal
            as="h2"
            className="text-2xl sm:text-3xl md:text-5xl font-bold text-white"
            type="words"
            stagger={0.05}
          >
            Projects that move the needle
          </TextReveal>
        </motion.div>

        {/* Mobile: Horizontal scroll carousel */}
        <div className="md:hidden pointer-events-auto">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 pb-4 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
            {PROJECTS.map((project, i) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex-shrink-0 w-[85vw] snap-center"
              >
                <div
                  onClick={() => onProjectClick(project)}
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm active:scale-[0.98] transition-transform"
                >
                  {/* Content */}
                  <div className="relative p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-white/40 text-xs mb-1">{project.category}</p>
                        <h3 className="text-xl font-bold text-white">
                          {project.title}
                        </h3>
                      </div>
                      <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0 ml-2">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-white/50"
                        >
                          <path d="M7 17L17 7M17 7H7M17 7V17" />
                        </svg>
                      </div>
                    </div>

                    <p className="text-sm text-white/50 leading-relaxed mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-[10px] rounded-full border border-white/10 text-white/40"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom accent line */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1"
                    style={{ backgroundColor: project.color }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
          {/* Scroll indicator */}
          <div className="flex justify-center gap-1.5 mt-3">
            {PROJECTS.map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20" />
            ))}
          </div>
          <p className="text-center text-white/30 text-xs mt-2">Swipe to explore</p>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden md:grid md:grid-cols-2 gap-6 pointer-events-auto px-6 max-w-6xl mx-auto">
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <LiquidGlass
                onClick={() => onProjectClick(project)}
                glowColor={`${project.color}66`}
                className="rounded-2xl"
              >
                <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                  {/* Content */}
                  <div className="relative p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <p className="text-white/40 text-sm mb-1">{project.category}</p>
                        <h3 className="text-2xl font-bold text-white transition-all">
                          {project.title}
                        </h3>
                      </div>
                      <motion.div
                        className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#FF5C34]/50 group-hover:bg-[#FF5C34]/10 transition-all flex-shrink-0 ml-2"
                        whileHover={{ scale: 1.1, rotate: 45 }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-white/50 group-hover:text-[#FF5C34] transition-colors"
                        >
                          <path d="M7 17L17 7M17 7H7M17 7V17" />
                        </svg>
                      </motion.div>
                    </div>

                    <p className="text-white/50 leading-relaxed mb-6 group-hover:text-white/70 transition-colors">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-xs rounded-full border border-white/10 text-white/40 group-hover:border-white/20 group-hover:text-white/60 transition-all"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom accent line */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: project.color }}
                  />
                </div>
              </LiquidGlass>
            </motion.div>
          ))}
        </div>
      </div>
    </ContentSection>
  );
}

function ProcessSection() {
  const steps = [
    { num: "01", title: "Discover", desc: "Research & strategy" },
    { num: "02", title: "Prototype", desc: "Concepts & validation" },
    { num: "03", title: "Produce", desc: "Create & refine" },
    { num: "04", title: "Scale", desc: "Systems & iteration" },
  ];

  return (
    <ContentSection scrollStart={0.60} scrollEnd={0.75}>
      <div className="px-4 sm:px-6 max-w-5xl text-center">
        <TextReveal
          as="h2"
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4"
          type="words"
          stagger={0.05}
        >
          How we work
        </TextReveal>
        <FadeReveal delay={0.2} className="mb-8 sm:mb-16">
          <p className="text-white/50 text-sm sm:text-lg">
            A proven process that delivers results
          </p>
        </FadeReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              className="text-center group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              <motion.span
                className="text-3xl sm:text-5xl md:text-6xl font-bold text-[#FF5C34] block mb-2 sm:mb-4"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {step.num}
              </motion.span>
              <h3 className="text-base sm:text-xl font-semibold text-white mb-1 sm:mb-2 group-hover:text-[#FF5C34] transition-colors">
                {step.title}
              </h3>
              <p className="text-white/40 text-xs sm:text-sm">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <FadeReveal delay={0.6} className="mt-8 sm:mt-16">
          <div className="inline-block px-4 py-2 sm:px-6 sm:py-3 border border-white/10 rounded-full hover:border-[#FF5C34]/30 transition-colors">
            <span className="text-white/60 italic text-sm sm:text-base">We&apos;re a partner, not a vendor.</span>
          </div>
        </FadeReveal>
      </div>
    </ContentSection>
  );
}

function CTASection() {
  const setContactOpen = useStore((state) => state.setContactOpen);

  return (
    <ContentSection scrollStart={0.73} scrollEnd={1}>
      <div className="px-4 sm:px-6 text-center max-w-3xl pointer-events-auto">
        <h2 className="text-2xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6">
          <TextReveal type="words" stagger={0.04}>
            Ready to build
          </TextReveal>
          <br />
          <TextReveal type="words" stagger={0.04} delay={0.2}>
            something
          </TextReveal>{" "}
          <span className="text-[#FF5C34]">
            <TextReveal type="words" stagger={0.04} delay={0.4}>
              extraordinary?
            </TextReveal>
          </span>
        </h2>
        <FadeReveal delay={0.5} className="mb-6 sm:mb-10">
          <p className="text-sm sm:text-lg text-white/50">
            One strategy call can replace months of trial and error.
          </p>
        </FadeReveal>
        <motion.div
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <MagneticButton
            onClick={() => setContactOpen(true)}
            className="px-6 py-3 sm:px-8 sm:py-4 bg-[#FF5C34] rounded-full text-black text-sm sm:text-base font-semibold hover:shadow-lg hover:shadow-[#FF5C34]/25 transition-shadow"
            strength={0.3}
          >
            Book a Strategy Call
          </MagneticButton>
          <MagneticButton
            as="a"
            href="mailto:david@davidturkcreative.com"
            className="px-6 py-3 sm:px-8 sm:py-4 border border-white/20 rounded-full text-white text-sm sm:text-base font-medium hover:bg-white/10 hover:border-white/40 transition-all inline-flex items-center justify-center"
            strength={0.3}
          >
            Email Me
          </MagneticButton>
        </motion.div>

        <motion.div
          className="mt-12 sm:mt-20 text-xs sm:text-sm text-white/30"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Miami-based · Working globally · © {new Date().getFullYear()} David Turk Creative
        </motion.div>
      </div>
    </ContentSection>
  );
}

function ContactModal() {
  const isContactOpen = useStore((state) => state.isContactOpen);
  const setContactOpen = useStore((state) => state.setContactOpen);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setContactOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [setContactOpen]);

  return (
    <AnimatePresence>
      {isContactOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setContactOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg mx-4 p-8 bg-zinc-900 border border-white/10 rounded-2xl z-[101]"
          >
            <button
              onClick={() => setContactOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white p-2 transition-colors"
              data-cursor
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-2xl font-bold text-white mb-2">Let&apos;s talk</h3>
            <p className="text-white/50 mb-8">Tell us about your project</p>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="Name"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF5C34] transition-colors"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF5C34] transition-colors"
              />
              <textarea
                placeholder="Tell us about your project..."
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF5C34] resize-none transition-colors"
              />
              <MagneticButton
                className="w-full py-4 bg-[#FF5C34] rounded-lg text-black font-semibold hover:opacity-90 transition-opacity"
                strength={0.15}
              >
                Send Message
              </MagneticButton>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function LoadingScreen() {
  const isLoaded = useStore((state) => state.isLoaded);
  const setLoaded = useStore((state) => state.setLoaded);

  useEffect(() => {
    const timeout = setTimeout(() => setLoaded(true), 5000);
    return () => clearTimeout(timeout);
  }, [setLoaded]);

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="fixed inset-0 bg-[#351E28] z-[200] flex items-center justify-center"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-8"
            >
              <motion.span
                className="text-4xl font-bold text-white"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                DT+C
              </motion.span>
            </motion.div>
            <motion.div
              className="w-48 h-0.5 bg-white/10 rounded-full overflow-hidden"
            >
              <motion.div
                className="h-full bg-[#FF5C34]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function BackgroundDimmer() {
  const scroll = useStore((state) => state.scroll);

  // Dim more during hero section (0.05 to 0.32)
  let dimOpacity = 0;

  if (scroll < 0.05) {
    // During intro - slight dim
    dimOpacity = scroll * 4; // 0 to 0.2
  } else if (scroll < 0.32) {
    // During hero - strong dim for readability
    dimOpacity = 0.75;
  } else {
    // After hero - gradual return
    dimOpacity = Math.max(0.5, 0.75 - (scroll - 0.32) * 0.5);
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[2] bg-[#351E28]"
      style={{ opacity: dimOpacity }}
    />
  );
}

function ScrollToTopButton({ onScrollToTop }: { onScrollToTop: () => void }) {
  const scroll = useStore((state) => state.scroll);
  const isVisible = scroll > 0.15;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={onScrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FF5C34] text-white shadow-lg shadow-[#FF5C34]/25 flex items-center justify-center hover:bg-[#ff7a5a] active:scale-95 transition-all"
          aria-label="Scroll to top"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export default function Overlay() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const setScroll = useStore((state) => state.setScroll);
  const setMousePosition = useStore((state) => state.setMousePosition);
  const setContactOpen = useStore((state) => state.setContactOpen);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCapability, setSelectedCapability] = useState<Capability | null>(null);

  const scrollToPosition = useCallback((position: number) => {
    if (!lenisRef.current || !containerRef.current) return;
    const scrollHeight = containerRef.current.scrollHeight - window.innerHeight;
    lenisRef.current.scrollTo(position * scrollHeight, { duration: 1.5 });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;

    const lenis = new Lenis({
      wrapper: container,
      content: container.firstChild as HTMLElement,
      duration: isMobile ? 1.2 : 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: isMobile ? 0.4 : 0.6,
      touchMultiplier: isMobile ? 2 : 1.2,
    });

    lenisRef.current = lenis;

    lenis.on("scroll", ({ progress }: { progress: number }) => {
      setScroll(Math.max(0, Math.min(1, progress)));
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [setScroll]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePosition(x, y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [setMousePosition]);

  return (
    <>
      <CustomCursor />
      <LoadingScreen />
      <BackgroundDimmer />
      <Navigation onNavigate={scrollToPosition} />
      <ScrollIndicator />
      <ScrollToTopButton onScrollToTop={() => scrollToPosition(0)} />

      <div
        ref={containerRef}
        className="fixed inset-0 overflow-y-auto z-20"
      >
        {/* Taller scroll area on mobile for better section separation */}
        <div className="h-[800vh] md:h-[500vh]" />
      </div>

      <IntroSection />
      <HeroSection />
      <CapabilitiesSection onCapabilityClick={setSelectedCapability} />
      <AIDifferentiatorSection />
      <ProjectsSection onProjectClick={setSelectedProject} />
      <ProcessSection />
      <CTASection />

      <ContactModal />
      <ProjectModal3D
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
      <CapabilityModal3D
        capability={selectedCapability}
        onClose={() => setSelectedCapability(null)}
        onContact={() => setContactOpen(true)}
      />
    </>
  );
}
