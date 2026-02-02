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

function ScrollProgressBar() {
  const scroll = useStore((state) => state.scroll);
  const isLoaded = useStore((state) => state.isLoaded);

  // Don't show until loaded
  if (!isLoaded) return null;

  // Calculate color based on scroll position (brand color journey)
  const getProgressColor = () => {
    if (scroll < 0.25) return "#FF7F6B"; // Persimmon Pop - Hero
    if (scroll < 0.5) return "#2F6364";  // Transformative Teal - Capabilities
    if (scroll < 0.75) return "#A8E6CF"; // Neo-Mint - Projects
    return "#E3D3C5";                     // Sandstone - Contact
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-[60] h-1 bg-white/5"
    >
      <motion.div
        className="h-full origin-left"
        style={{
          backgroundColor: getProgressColor(),
          width: `${scroll * 100}%`,
          boxShadow: `0 0 20px ${getProgressColor()}40`,
        }}
        transition={{ duration: 0.1 }}
      />
    </motion.div>
  );
}

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
                  ? "#FF7F6B"
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
        className="absolute inset-0 bg-[#4A3B33]/80 backdrop-blur-md"
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
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#FF7F6B] group-hover:w-full transition-all duration-300" />
            </MagneticButton>
          ))}
        </div>

        <MagneticButton
          onClick={() => setContactOpen(true)}
          className="px-4 py-2 md:px-6 md:py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-xs md:text-sm text-white hover:bg-white/20 hover:border-[#FF7F6B]/50 transition-all"
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
        className="absolute inset-0 bg-[#4A3B33]"
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
          <span className="text-[#2F6364] text-6xl md:text-8xl font-bold tracking-tighter">
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
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-[#2F6364]/50 to-[#2F6364]" />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-2 h-2 rounded-full bg-[#2F6364]"
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
  const setShowreelOpen = useStore((state) => state.setShowreelOpen);

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
          <span className="text-[#FF7F6B] text-xs font-medium tracking-[0.4em] uppercase mb-6 inline-block border-b border-[#FF7F6B]/30 pb-1">
            Creative Studio
          </span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[0.9] tracking-[-0.03em] mb-8 overflow-hidden">
          <motion.span
            className="block text-[#2F6364]"
            style={{
              opacity: Math.min(1, revealProgress * 1.5),
              transform: `translateY(${(1 - Math.min(1, revealProgress * 1.5)) * 60}px)`
            }}
          >
            We build
          </motion.span>
          <motion.span
            className="block text-[#FF7F6B] italic"
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
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
            AI-powered strategy, story, and production for brands
            that <span className="text-white/80 font-medium italic">refuse to blend in.</span>
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
            { value: "50+", label: "PROJECTS" },
            { value: "60%", label: "FASTER" },
            { value: "3x", label: "CONCEPTS" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#2F6364] block tracking-tight">{stat.value}</span>
              <span className="text-[10px] sm:text-xs text-white/40 tracking-[0.2em] font-medium">{stat.label}</span>
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
            className="px-6 py-3 sm:px-8 sm:py-4 bg-[#FF7F6B] rounded-full text-white text-sm sm:text-base font-semibold hover:shadow-lg hover:shadow-[#FF7F6B]/25 transition-shadow"
            strength={0.3}
          >
            Start a Project
          </MagneticButton>
          <MagneticButton
            onClick={() => setShowreelOpen(true)}
            className="group px-6 py-3 sm:px-8 sm:py-4 border border-white/20 rounded-full text-white text-sm sm:text-base font-medium hover:bg-white/10 hover:border-white/40 transition-all flex items-center gap-2"
            strength={0.3}
            cursorType="play"
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-[#FF7F6B] transition-colors">
              <svg width="8" height="10" viewBox="0 0 8 10" fill="currentColor" className="ml-0.5">
                <path d="M0 0v10l8-5z" />
              </svg>
            </span>
            Watch Showreel
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
                className="px-3 py-1.5 sm:px-4 sm:py-2 border border-white/10 rounded-full text-[10px] sm:text-xs text-white/40 tracking-wide hover:border-[#FF7F6B]/30 hover:text-white/60 transition-all cursor-default"
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
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#4A3B33] to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#4A3B33] to-transparent z-10" />

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
    color: "#FF7F6B",
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
    color: "#A8E6CF",
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
    color: "#2F6364",
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
    color: "#E3D3C5",
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
          <span className="text-[#E3D3C5] text-[10px] sm:text-xs font-medium tracking-[0.3em] uppercase mb-3 block">Services</span>
          <TextReveal
            as="h2"
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white uppercase tracking-tight"
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
                  data-card
                  data-cursor="view"
                  data-cursor-text="Explore"
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
              data-card
              data-cursor="view"
              data-cursor-text="Explore"
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
    color: "#A8E6CF",
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
    color: "#2F6364",
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
    color: "#FF7F6B",
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
    color: "#E3D3C5",
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
      color: "#A8E6CF",
    },
    {
      phase: "Ideation",
      traditional: "Limited concepts due to time",
      aiPowered: "100+ concepts explored rapidly",
      icon: "💡",
      color: "#2F6364",
    },
    {
      phase: "Prototyping",
      traditional: "Expensive test shoots",
      aiPowered: "AI-generated previews first",
      icon: "🎬",
      color: "#FF7F6B",
    },
    {
      phase: "Production",
      traditional: "Fixed deliverables",
      aiPowered: "Iterate until perfect",
      icon: "✨",
      color: "#E3D3C5",
    },
  ];

  return (
    <ContentSection scrollStart={0.42} scrollEnd={0.52}>
      <div className="px-4 sm:px-6 max-w-5xl w-full overflow-y-auto max-h-[80vh]">
        <motion.div className="text-center mb-6 sm:mb-12">
          <motion.p
            className="text-[#2F6364] text-[10px] sm:text-xs font-medium tracking-[0.3em] uppercase mb-2 sm:mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            The DT+C Difference
          </motion.p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2 sm:mb-4 tracking-tight">
            <TextReveal type="words" stagger={0.05}>
              AI-Augmented
            </TextReveal>{" "}
            <span className="italic text-[#2F6364]">
              <TextReveal type="words" stagger={0.05} delay={0.15}>
                Creative
              </TextReveal>
            </span>
          </h2>
          <FadeReveal delay={0.2}>
            <p className="text-sm sm:text-base text-white/50 max-w-2xl mx-auto px-4 font-light leading-relaxed">
              We don&apos;t replace creativity with AI—<span className="text-white/70 font-medium">we multiply it.</span> Our workflow lets us explore
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
                    <span className="text-[#2F6364] text-[10px] sm:text-xs mt-0.5 font-semibold">NEW</span>
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
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#FF7F6B] block">
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
            className="text-[#FF7F6B] text-[10px] sm:text-xs font-medium tracking-[0.3em] uppercase mb-2 sm:mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            Selected Work
          </motion.p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            <TextReveal type="words" stagger={0.05}>
              Projects that
            </TextReveal>{" "}
            <span className="italic underline decoration-[#FF7F6B] decoration-2 underline-offset-4">
              <TextReveal type="words" stagger={0.05} delay={0.15}>
                move the needle
              </TextReveal>
            </span>
          </h2>
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
                  data-card
                  data-cursor="view"
                  data-cursor-text="View"
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
              data-card
              data-cursor="view"
              data-cursor-text="View"
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
                        className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#FF7F6B]/50 group-hover:bg-[#FF7F6B]/10 transition-all flex-shrink-0 ml-2"
                        whileHover={{ scale: 1.1, rotate: 45 }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-white/50 group-hover:text-[#FF7F6B] transition-colors"
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
        <span className="text-[#A8E6CF] text-[10px] sm:text-xs font-medium tracking-[0.3em] uppercase mb-3 block">Our Process</span>
        <TextReveal
          as="h2"
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2 sm:mb-4 uppercase tracking-tight"
          type="words"
          stagger={0.05}
        >
          How we work
        </TextReveal>
        <FadeReveal delay={0.2} className="mb-8 sm:mb-16">
          <p className="text-white/50 text-sm sm:text-lg font-light italic">
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
                className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#FF7F6B] block mb-2 sm:mb-4 tracking-tighter font-mono"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {step.num}
              </motion.span>
              <h3 className="text-base sm:text-xl font-bold text-white mb-1 sm:mb-2 group-hover:text-[#FF7F6B] transition-colors uppercase tracking-wide">
                {step.title}
              </h3>
              <p className="text-white/40 text-xs sm:text-sm font-light">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <FadeReveal delay={0.6} className="mt-8 sm:mt-16">
          <div className="inline-block px-4 py-2 sm:px-6 sm:py-3 border border-white/10 rounded-full hover:border-[#FF7F6B]/30 transition-colors">
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
        <span className="text-[#2F6364] text-[10px] sm:text-xs font-medium tracking-[0.3em] uppercase mb-4 block">Let&apos;s Talk</span>
        <h2 className="text-2xl sm:text-4xl md:text-6xl font-extrabold text-white mb-4 sm:mb-6 tracking-tight">
          <TextReveal type="words" stagger={0.04}>
            Ready to build
          </TextReveal>
          <br />
          <TextReveal type="words" stagger={0.04} delay={0.2}>
            something
          </TextReveal>{" "}
          <span className="text-[#FF7F6B] italic">
            <TextReveal type="words" stagger={0.04} delay={0.4}>
              extraordinary?
            </TextReveal>
          </span>
        </h2>
        <FadeReveal delay={0.5} className="mb-6 sm:mb-10">
          <p className="text-sm sm:text-lg text-white/50 font-light">
            One strategy call can replace <span className="text-white/70 font-medium underline decoration-[#FF7F6B]/50 underline-offset-2">months</span> of trial and error.
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
            className="px-6 py-3 sm:px-8 sm:py-4 bg-[#FF7F6B] rounded-full text-black text-sm sm:text-base font-bold uppercase tracking-wide hover:shadow-lg hover:shadow-[#FF7F6B]/25 transition-shadow"
            strength={0.3}
          >
            Book a Strategy Call
          </MagneticButton>
          <MagneticButton
            as="a"
            href="mailto:david@davidturkcreative.com"
            className="px-6 py-3 sm:px-8 sm:py-4 border border-white/20 rounded-full text-white text-sm sm:text-base font-medium tracking-wide hover:bg-white/10 hover:border-white/40 transition-all inline-flex items-center justify-center"
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

// Closing section that appears at the very end
function ClosingSection({ onRestart }: { onRestart: () => void }) {
  const scroll = useStore((state) => state.scroll);
  const isReturning = useStore((state) => state.isReturning);

  // Only show when near the end (scroll > 0.92)
  const showClosing = scroll > 0.92 && !isReturning;
  const closingOpacity = Math.min(1, (scroll - 0.92) / 0.06);

  if (!showClosing) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[48] flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: closingOpacity }}
    >
      {/* Vignette overlay */}
      <div
        className="absolute inset-0 bg-[#4A3B33]"
        style={{ opacity: closingOpacity * 0.6 }}
      />

      {/* Restart prompt */}
      <motion.div
        className="relative z-10 text-center pointer-events-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.p
          className="text-white/40 text-xs tracking-[0.3em] uppercase mb-6"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          End of journey
        </motion.p>

        <motion.button
          onClick={onRestart}
          className="group relative px-8 py-4 rounded-full overflow-hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Button background with glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF7F6B] via-[#2F6364] to-[#FF7F6B] opacity-80 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF7F6B] via-[#2F6364] to-[#FF7F6B] blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />

          {/* Button content */}
          <span className="relative flex items-center gap-3 text-black font-bold uppercase tracking-wide">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="rotate-180"
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
            Restart Journey
          </span>
        </motion.button>

        <motion.p
          className="mt-8 text-white/30 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Experience the void once more
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

// Return animation overlay
function ReturnAnimation() {
  const isReturning = useStore((state) => state.isReturning);
  const returnProgress = useStore((state) => state.returnProgress);

  if (!isReturning) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[60] pointer-events-none flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Radial warp effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, transparent ${(1 - returnProgress) * 100}%, #4A3B33 ${(1 - returnProgress) * 100 + 20}%)`,
        }}
      />

      {/* Center glow during return */}
      <motion.div
        className="w-32 h-32 rounded-full"
        style={{
          background: `radial-gradient(circle, #FF7F6B 0%, #2F6364 50%, transparent 70%)`,
          opacity: returnProgress,
          transform: `scale(${1 + returnProgress * 2})`,
          filter: `blur(${returnProgress * 20}px)`,
        }}
      />

      {/* Logo flash at the end */}
      {returnProgress > 0.8 && (
        <motion.span
          className="absolute text-[#2F6364] text-6xl md:text-8xl font-bold tracking-tighter"
          initial={{ opacity: 0, scale: 1.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          DT+C
        </motion.span>
      )}
    </motion.div>
  );
}

function ContactModal() {
  const isContactOpen = useStore((state) => state.isContactOpen);
  const setContactOpen = useStore((state) => state.setContactOpen);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setContactOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [setContactOpen]);

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus("submitting");

    try {
      const response = await fetch("https://formspree.io/f/meezzwjl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: `New inquiry from ${formData.name} - DT+C Website`,
        }),
      });

      if (response.ok) {
        setStatus("success");
        setTimeout(() => {
          setFormData({ name: "", email: "", message: "" });
          setStatus("idle");
          setContactOpen(false);
        }, 2000);
      } else {
        throw new Error("Failed");
      }
    } catch {
      setStatus("error");
    }
  };

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
            onClick={(e) => e.stopPropagation()}
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

            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <p className="text-white text-lg font-medium">Message sent!</p>
                <p className="text-white/50 text-sm mt-1">We&apos;ll be in touch soon.</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF7F6B] transition-colors"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF7F6B] transition-colors"
                />
                <textarea
                  placeholder="Tell us about your project..."
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF7F6B] resize-none transition-colors"
                />
                {status === "error" && (
                  <p className="text-red-400 text-sm">Something went wrong. Please try again.</p>
                )}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={status === "submitting" || !formData.name || !formData.email || !formData.message}
                  className="w-full py-4 bg-[#FF7F6B] rounded-lg text-black font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {status === "submitting" ? (
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    "Send Message"
                  )}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4 my-2">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-white/30 text-sm">or</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* Calendly link */}
                <a
                  href="https://calendly.com/david-davidturkcreative/meeting-with-david-turk-creative"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 border border-white/20 rounded-lg text-white font-semibold hover:bg-white/5 hover:border-white/40 transition-all flex items-center justify-center gap-2"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Book a Call Instead
                </a>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Showreel video URL - replace with your actual showreel
const SHOWREEL_URL = "https://www.youtube.com/embed/pNLW1Tx5IAE?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1";

function ShowreelModal() {
  const isShowreelOpen = useStore((state) => state.isShowreelOpen);
  const setShowreelOpen = useStore((state) => state.setShowreelOpen);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowreelOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [setShowreelOpen]);

  useEffect(() => {
    if (isShowreelOpen) {
      setIsLoading(true);
    }
  }, [isShowreelOpen]);

  return (
    <AnimatePresence>
      {isShowreelOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
        >
          {/* Cinematic letterbox bars */}
          <div className="absolute top-0 left-0 right-0 h-[8%] bg-black z-10" />
          <div className="absolute bottom-0 left-0 right-0 h-[8%] bg-black z-10" />

          {/* Close button */}
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => setShowreelOpen(false)}
            className="absolute top-6 right-6 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:border-white/40 transition-all group"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:rotate-90 transition-transform">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </motion.button>

          {/* Title overlay */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-[12%] left-8 z-20"
          >
            <span className="text-white/40 text-xs font-medium tracking-[0.3em] uppercase">DT+C</span>
            <h3 className="text-white text-xl sm:text-2xl font-bold tracking-tight">Showreel 2024</h3>
          </motion.div>

          {/* Loading state */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-5">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-12 h-12 border-2 border-white/20 border-t-[#FF7F6B] rounded-full"
              />
            </div>
          )}

          {/* Video container with cinematic frame */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="relative w-full h-full max-w-[90vw] max-h-[84vh] mx-auto"
            style={{ aspectRatio: "16/9" }}
          >
            {/* Outer glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[#FF7F6B]/20 via-[#2F6364]/10 to-[#FF7F6B]/20 blur-2xl opacity-50" />

            {/* Video frame */}
            <div className="relative w-full h-full rounded-lg overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
              <iframe
                src={SHOWREEL_URL}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={() => setIsLoading(false)}
              />
            </div>

            {/* Corner accents */}
            <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-[#FF7F6B]/50" />
            <div className="absolute -top-2 -right-2 w-8 h-8 border-r-2 border-t-2 border-[#FF7F6B]/50" />
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-l-2 border-b-2 border-[#FF7F6B]/50" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-[#FF7F6B]/50" />
          </motion.div>

          {/* Skip hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/30 text-xs tracking-wide z-20"
          >
            Press ESC to close
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function LoadingScreen() {
  const isLoaded = useStore((state) => state.isLoaded);
  const introProgress = useStore((state) => state.introProgress);
  const setIntroProgress = useStore((state) => state.setIntroProgress);
  const isIntroComplete = useStore((state) => state.isIntroComplete);
  const setIntroComplete = useStore((state) => state.setIntroComplete);
  const [phase, setPhase] = useState<"waiting" | "animating" | "done">("waiting");

  useEffect(() => {
    if (!isLoaded) return;

    // Three.js is ready, start the intro animation
    setPhase("animating");

    // Animate intro progress over 2.5 seconds
    const duration = 2500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);

      setIntroProgress(progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Intro complete
        setTimeout(() => {
          setIntroComplete(true);
          setPhase("done");
        }, 300);
      }
    };

    // Small delay before starting camera animation
    setTimeout(() => {
      requestAnimationFrame(animate);
    }, 500);
  }, [isLoaded, setIntroProgress, setIntroComplete]);

  // Calculate overlay opacity - fades out as intro progresses
  const overlayOpacity = phase === "waiting" ? 1 : Math.max(0, 1 - introProgress * 1.5);
  const logoOpacity = phase === "waiting" ? 1 : Math.max(0, 1 - introProgress * 2);

  if (phase === "done") return null;

  return (
    <motion.div
      className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center"
      style={{ opacity: overlayOpacity }}
    >
      {/* Semi-transparent overlay that reveals the 3D scene */}
      <motion.div
        className="absolute inset-0 bg-[#4A3B33]"
        style={{ opacity: phase === "waiting" ? 1 : 0.85 - introProgress * 0.85 }}
      />

      {/* Vignette effect */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, rgba(53, 30, 40, ${0.8 - introProgress * 0.8}) 100%)`,
        }}
      />

      {/* Logo content */}
      <motion.div
        className="relative z-10 text-center"
        style={{ opacity: logoOpacity }}
        initial={{ scale: 1 }}
        animate={{ scale: phase === "animating" ? 1.1 : 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        {/* Glowing backdrop for logo */}
        <motion.div
          className="absolute inset-0 -m-20 rounded-full bg-[#FF7F6B]"
          style={{ filter: "blur(80px)", opacity: 0.3 - introProgress * 0.3 }}
        />

        {/* Logo */}
        <motion.div className="relative mb-4">
          <div className="flex items-center justify-center gap-1">
            {["D", "T", "+", "C"].map((letter, i) => (
              <motion.span
                key={i}
                className={`text-6xl sm:text-7xl md:text-8xl font-bold ${
                  letter === "+" ? "text-[#FF7F6B]" : "text-white"
                }`}
                initial={{ opacity: 0, y: 30, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  delay: 0.1 + i * 0.1,
                  duration: 0.6,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
                style={{
                  textShadow: letter === "+" ? "0 0 40px rgba(255, 92, 52, 0.5)" : "none",
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-white/60 text-sm sm:text-base tracking-[0.25em] uppercase"
        >
          AI-Powered Creative
        </motion.p>

        {/* Animated line */}
        <motion.div
          className="mt-8 mx-auto h-px bg-gradient-to-r from-transparent via-[#FF7F6B] to-transparent"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 200, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        />

        {/* "Entering" text */}
        {phase === "animating" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-white/30 text-xs tracking-[0.3em] uppercase"
          >
            Entering Experience
          </motion.p>
        )}
      </motion.div>

      {/* Scan lines effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)",
        }}
      />
    </motion.div>
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
      className="fixed inset-0 pointer-events-none z-[2] bg-[#4A3B33]"
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
          className="fixed bottom-6 right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FF7F6B] text-white shadow-lg shadow-[#FF7F6B]/25 flex items-center justify-center hover:bg-[#ff7a5a] active:scale-95 transition-all"
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
  const setReturning = useStore((state) => state.setReturning);
  const setReturnProgress = useStore((state) => state.setReturnProgress);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCapability, setSelectedCapability] = useState<Capability | null>(null);

  const scrollToPosition = useCallback((position: number) => {
    if (!lenisRef.current || !containerRef.current) return;
    const scrollHeight = containerRef.current.scrollHeight - window.innerHeight;
    lenisRef.current.scrollTo(position * scrollHeight, { duration: 1.5 });
  }, []);

  // Restart journey with animated return
  const handleRestart = useCallback(() => {
    setReturning(true);
    setReturnProgress(0);

    // Animate the return progress over 2 seconds
    const duration = 2000;
    const startTime = Date.now();

    const animateReturn = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Eased progress for smooth animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setReturnProgress(easedProgress);

      // Also animate scroll position back to 0
      const currentScroll = 1 - easedProgress;
      setScroll(currentScroll);

      if (progress < 1) {
        requestAnimationFrame(animateReturn);
      } else {
        // Animation complete - reset everything
        setTimeout(() => {
          setReturning(false);
          setReturnProgress(0);
          // Physically scroll to top
          if (lenisRef.current) {
            lenisRef.current.scrollTo(0, { immediate: true });
          }
        }, 300);
      }
    };

    requestAnimationFrame(animateReturn);
  }, [setReturning, setReturnProgress, setScroll]);

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
      <ScrollProgressBar />
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
      <ClosingSection onRestart={handleRestart} />
      <ReturnAnimation />

      <ContactModal />
      <ShowreelModal />
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
