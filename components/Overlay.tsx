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
import Card3D from "./Card3D";
import { Capability } from "./CapabilityDetail";
import CapabilityModal3D from "./CapabilityModal3D";

function ScrollIndicator() {
  const scroll = useStore((state) => state.scroll);

  const sections = [
    { label: "Home", position: 0 },
    { label: "Services", position: 0.12 },
    { label: "Work", position: 0.35 },
    { label: "Process", position: 0.58 },
    { label: "Contact", position: 0.82 },
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
                  ? "rgb(245, 158, 11)"
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
    { label: "Services", position: 0.12 },
    { label: "Work", position: 0.35 },
    { label: "Process", position: 0.58 },
    { label: "Contact", position: 0.82 },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-6"
    >
      <motion.div
        className="absolute inset-0 bg-[#030305]/80 backdrop-blur-md"
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
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-500 group-hover:w-full transition-all duration-300" />
            </MagneticButton>
          ))}
        </div>

        <MagneticButton
          onClick={() => setContactOpen(true)}
          className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm text-white hover:bg-white/20 hover:border-amber-500/50 transition-all"
          strength={0.25}
        >
          Start a Project
        </MagneticButton>
      </div>
    </motion.nav>
  );
}

function HeroSection() {
  const scroll = useStore((state) => state.scroll);
  const setContactOpen = useStore((state) => state.setContactOpen);
  const opacity = Math.max(0, 1 - scroll * 5);
  const scale = 1 - scroll * 0.2;

  if (opacity < 0.01) return null;

  return (
    <motion.section
      className="fixed inset-0 flex items-center justify-center pointer-events-none z-30"
      style={{ opacity }}
    >
      <motion.div
        className="text-center px-6 max-w-4xl"
        style={{ scale }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-amber-500 text-sm tracking-[0.3em] uppercase mb-6 inline-block">
            Creative Studio
          </span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.9] tracking-tight mb-8">
          <TextReveal delay={0.5} stagger={0.04} type="words" className="block">
            We build
          </TextReveal>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500">
            <TextReveal delay={0.7} stagger={0.04} type="words" className="block">
              creative systems
            </TextReveal>
          </span>
        </h1>

        <FadeReveal delay={0.9} className="mb-12">
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto">
            AI-powered strategy, story, and production for brands
            that refuse to blend in.
          </p>
        </FadeReveal>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center pointer-events-auto"
        >
          <MagneticButton
            onClick={() => setContactOpen(true)}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-black font-semibold hover:shadow-lg hover:shadow-amber-500/25 transition-shadow"
            strength={0.3}
          >
            Start a Project
          </MagneticButton>
          <MagneticButton
            className="px-8 py-4 border border-white/20 rounded-full text-white font-medium hover:bg-white/10 hover:border-white/40 transition-all"
            strength={0.3}
          >
            View Our Work
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="flex flex-wrap justify-center gap-3 mt-12"
        >
          {["AI Strategy", "Video Production", "Brand Systems", "Rapid Prototyping"].map(
            (tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3 + i * 0.1 }}
                className="px-4 py-2 border border-white/10 rounded-full text-xs text-white/40 tracking-wide hover:border-amber-500/30 hover:text-white/60 transition-all cursor-default"
              >
                {tag}
              </motion.span>
            )
          )}
        </motion.div>
      </motion.div>

      {/* Scroll prompt */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-white/30 tracking-widest uppercase">
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-5 h-8 border border-white/20 rounded-full flex items-start justify-center p-1"
        >
          <motion.div className="w-1 h-2 bg-white/40 rounded-full" />
        </motion.div>
      </motion.div>
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
    gradient: "from-amber-500 to-orange-500",
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
    gradient: "from-blue-500 to-cyan-400",
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
    gradient: "from-purple-500 to-pink-500",
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
    gradient: "from-emerald-500 to-teal-400",
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
    <ContentSection scrollStart={0.06} scrollEnd={0.28}>
      <div className="px-6 max-w-6xl w-full" style={{ perspective: "1200px" }}>
        <div className="text-center mb-12">
          <TextReveal
            as="h2"
            className="text-3xl md:text-4xl font-bold text-white"
            type="words"
            stagger={0.05}
          >
            What we do
          </TextReveal>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pointer-events-auto">
          {CAPABILITIES.map((cap, i) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 30, rotateX: -10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Card3D
                onClick={() => onCapabilityClick(cap)}
                glowColor={cap.gradient.includes("amber") ? "rgba(245, 158, 11, 0.4)" :
                          cap.gradient.includes("blue") ? "rgba(59, 130, 246, 0.4)" :
                          cap.gradient.includes("purple") ? "rgba(168, 85, 247, 0.4)" :
                          "rgba(16, 185, 129, 0.4)"}
                className="h-full"
              >
                <div className="p-8 h-full border border-white/10 rounded-2xl bg-zinc-900/80 backdrop-blur-sm group">
                  {/* Gradient accent line */}
                  <div className={`absolute top-0 left-8 right-8 h-px bg-gradient-to-r ${cap.gradient} opacity-50`} />

                  {/* Icon */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cap.gradient} flex items-center justify-center text-2xl font-bold text-white shadow-lg`}>
                      {cap.icon}
                    </div>
                    <div className={`h-px flex-1 bg-gradient-to-r ${cap.gradient} opacity-20`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-all">
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
              </Card3D>
            </motion.div>
          ))}
        </div>
      </div>
    </ContentSection>
  );
}

const PROJECTS: Project[] = [
  {
    title: "Luminary Health",
    category: "Brand Identity + Video",
    description: "Complete brand system and launch campaign for a wellness startup disrupting the longevity space.",
    gradient: "from-blue-500 to-cyan-400",
    tags: ["Strategy", "Video", "Brand"],
    challenge: "Luminary needed to stand out in a crowded wellness market while communicating complex longevity science in an accessible way.",
    solution: "We developed a visual language that balances scientific credibility with aspirational lifestyle imagery, supported by AI-generated content variations for rapid A/B testing.",
    results: [
      { metric: "340%", label: "Brand awareness lift" },
      { metric: "2.1M", label: "Video views in 30 days" },
      { metric: "45%", label: "Lower CAC vs. industry" },
    ],
    testimonial: {
      quote: "DT+C didn't just give us a brand—they gave us a system that scales. Our content velocity tripled without sacrificing quality.",
      author: "Sarah Chen",
      role: "CEO, Luminary Health"
    }
  },
  {
    title: "Neon Collective",
    category: "AI-Enhanced Production",
    description: "Music video production using AI workflows, cutting post-production time by 60%.",
    gradient: "from-purple-500 to-pink-500",
    tags: ["AI", "Video", "Motion"],
    challenge: "The artist wanted a visually stunning music video but had a fraction of a typical production budget and an aggressive timeline.",
    solution: "We integrated AI tools throughout the production pipeline—from storyboard generation to VFX compositing—creating a hybrid workflow that maximized creative output.",
    results: [
      { metric: "60%", label: "Faster post-production" },
      { metric: "5M+", label: "YouTube views" },
      { metric: "$80K", label: "Saved vs. traditional" },
    ],
    testimonial: {
      quote: "They showed us that AI isn't about replacing creativity—it's about amplifying it. The final product exceeded what we thought was possible.",
      author: "Marcus Webb",
      role: "Artist Manager"
    }
  },
  {
    title: "Atlas Ventures",
    category: "Pitch System",
    description: "Investment deck and visual identity that helped close a $12M Series A.",
    gradient: "from-amber-500 to-orange-500",
    tags: ["Pitch Deck", "Brand", "Strategy"],
    challenge: "Atlas had strong fundamentals but their deck wasn't conveying their differentiated approach to climate tech investing.",
    solution: "We rebuilt their narrative from the ground up, creating a modular pitch system with data visualizations that told a compelling story at every stage of the investor conversation.",
    results: [
      { metric: "$12M", label: "Series A closed" },
      { metric: "3 weeks", label: "From brief to close" },
      { metric: "89%", label: "Meeting-to-next-step rate" },
    ],
    testimonial: {
      quote: "The deck paid for itself 1000x over. Every investor commented on how clear and compelling our story was.",
      author: "James Morrison",
      role: "Managing Partner, Atlas"
    }
  },
  {
    title: "Meridian Studios",
    category: "Content Engine",
    description: "Scalable content system producing 40+ branded assets per month with AI assistance.",
    gradient: "from-emerald-500 to-teal-400",
    tags: ["AI", "Systems", "Content"],
    challenge: "Meridian was drowning in content requests from multiple brands but couldn't afford to scale their team proportionally.",
    solution: "We designed and implemented a content production system with AI-assisted ideation, templated design systems, and automated quality checks—all managed through a custom dashboard.",
    results: [
      { metric: "40+", label: "Assets per month" },
      { metric: "4x", label: "Output increase" },
      { metric: "0", label: "Additional headcount" },
    ],
    testimonial: {
      quote: "We went from reactive to proactive. Now we're pitching content ideas to clients instead of just filling orders.",
      author: "Lisa Park",
      role: "Creative Director, Meridian"
    }
  },
];

function ProjectsSection({ onProjectClick }: { onProjectClick: (project: Project) => void }) {
  return (
    <ContentSection scrollStart={0.28} scrollEnd={0.52}>
      <div className="px-6 max-w-6xl w-full">
        <motion.div className="text-center mb-12">
          <motion.p
            className="text-amber-500 text-sm tracking-[0.2em] uppercase mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            Selected Work
          </motion.p>
          <TextReveal
            as="h2"
            className="text-3xl md:text-5xl font-bold text-white"
            type="words"
            stagger={0.05}
          >
            Projects that move the needle
          </TextReveal>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pointer-events-auto">
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.title}
              onClick={() => onProjectClick(project)}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              data-cursor
              data-cursor-text="View"
            >
              {/* Gradient background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
              />

              {/* Content */}
              <div className="relative p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-white/40 text-sm mb-1">{project.category}</p>
                    <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/60 transition-all">
                      {project.title}
                    </h3>
                  </div>
                  <motion.div
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-amber-500/50 group-hover:bg-amber-500/10 transition-all"
                    whileHover={{ scale: 1.1, rotate: 45 }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-white/50 group-hover:text-amber-500 transition-colors"
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

              {/* Bottom gradient line */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
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
    <ContentSection scrollStart={0.52} scrollEnd={0.72}>
      <div className="px-6 max-w-5xl text-center">
        <TextReveal
          as="h2"
          className="text-3xl md:text-4xl font-bold text-white mb-4"
          type="words"
          stagger={0.05}
        >
          How we work
        </TextReveal>
        <FadeReveal delay={0.2} className="mb-16">
          <p className="text-white/50 text-lg">
            A proven process that delivers results
          </p>
        </FadeReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              className="text-center group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              <motion.span
                className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500 block mb-4"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {step.num}
              </motion.span>
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-amber-500 transition-colors">
                {step.title}
              </h3>
              <p className="text-white/40 text-sm">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <FadeReveal delay={0.6} className="mt-16">
          <div className="inline-block px-6 py-3 border border-white/10 rounded-full hover:border-amber-500/30 transition-colors">
            <span className="text-white/60 italic">We&apos;re a partner, not a vendor.</span>
          </div>
        </FadeReveal>
      </div>
    </ContentSection>
  );
}

function CTASection() {
  const setContactOpen = useStore((state) => state.setContactOpen);

  return (
    <ContentSection scrollStart={0.76} scrollEnd={1}>
      <div className="px-6 text-center max-w-3xl pointer-events-auto">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
          <TextReveal type="words" stagger={0.04}>
            Ready to build
          </TextReveal>
          <br />
          <TextReveal type="words" stagger={0.04} delay={0.2}>
            something
          </TextReveal>{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-rose-500">
            <TextReveal type="words" stagger={0.04} delay={0.4}>
              extraordinary?
            </TextReveal>
          </span>
        </h2>
        <FadeReveal delay={0.5} className="mb-10">
          <p className="text-lg text-white/50">
            One strategy call can replace months of trial and error.
          </p>
        </FadeReveal>
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <MagneticButton
            onClick={() => setContactOpen(true)}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-black font-semibold hover:shadow-lg hover:shadow-amber-500/25 transition-shadow"
            strength={0.3}
          >
            Book a Strategy Call
          </MagneticButton>
          <MagneticButton
            as="a"
            href="mailto:david@davidturkcreative.com"
            className="px-8 py-4 border border-white/20 rounded-full text-white font-medium hover:bg-white/10 hover:border-white/40 transition-all inline-flex items-center justify-center"
            strength={0.3}
          >
            Email Me
          </MagneticButton>
        </motion.div>

        <motion.div
          className="mt-20 text-sm text-white/30"
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
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500 transition-colors"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500 transition-colors"
              />
              <textarea
                placeholder="Tell us about your project..."
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500 resize-none transition-colors"
              />
              <MagneticButton
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg text-black font-semibold hover:opacity-90 transition-opacity"
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
          className="fixed inset-0 bg-[#030305] z-[200] flex items-center justify-center"
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
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
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
  const dimOpacity = Math.min(0.6, Math.max(0, (scroll - 0.05) * 0.8));

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[2] bg-[#030305]"
      style={{ opacity: dimOpacity }}
    />
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

    const lenis = new Lenis({
      wrapper: container,
      content: container.firstChild as HTMLElement,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
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

      <div
        ref={containerRef}
        className="fixed inset-0 overflow-y-auto z-20"
      >
        <div className="h-[500vh]" />
      </div>

      <HeroSection />
      <CapabilitiesSection onCapabilityClick={setSelectedCapability} />
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
