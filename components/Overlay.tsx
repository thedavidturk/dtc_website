"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";

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
      <div className="flex items-center justify-between">
        <motion.button
          onClick={() => onNavigate(0)}
          className="text-2xl font-bold tracking-tighter text-white"
          whileHover={{ scale: 1.05 }}
        >
          DT+C
        </motion.button>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <motion.button
              key={item.label}
              onClick={() => onNavigate(item.position)}
              className="text-sm text-white/60 hover:text-white transition-colors"
              whileHover={{ y: -2 }}
            >
              {item.label}
            </motion.button>
          ))}
        </div>

        <motion.button
          onClick={() => setContactOpen(true)}
          className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm text-white hover:bg-white/20 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start a Project
        </motion.button>
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
      className="fixed inset-0 flex items-center justify-center pointer-events-none z-10"
      style={{ opacity }}
    >
      <motion.div
        className="text-center px-6 max-w-4xl"
        style={{ scale }}
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-amber-500 text-sm tracking-[0.3em] uppercase mb-6"
        >
          Creative Studio
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.9] tracking-tight mb-8"
        >
          We build
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500">
            creative systems
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12"
        >
          AI-powered strategy, story, and production for brands
          that refuse to blend in.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center pointer-events-auto"
        >
          <motion.button
            onClick={() => setContactOpen(true)}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-black font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start a Project
          </motion.button>
          <motion.button
            className="px-8 py-4 border border-white/20 rounded-full text-white font-medium hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Our Work
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="flex flex-wrap justify-center gap-3 mt-12"
        >
          {["AI Strategy", "Video Production", "Brand Systems", "Rapid Prototyping"].map(
            (tag) => (
              <span
                key={tag}
                className="px-4 py-2 border border-white/10 rounded-full text-xs text-white/40 tracking-wide"
              >
                {tag}
              </span>
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
      className="fixed inset-0 flex items-center justify-center pointer-events-none z-10"
      style={{ opacity }}
    >
      {children}
    </motion.section>
  );
}

function CapabilitiesSection() {
  const capabilities = [
    {
      title: "AI Creative Strategy",
      desc: "Research-driven ideation and systems design that amplifies your creative output",
      icon: "✦"
    },
    {
      title: "Story & Pre-Production",
      desc: "Pitch decks, storyboards, and concept validation before expensive production",
      icon: "◆"
    },
    {
      title: "AI-Enhanced Production",
      desc: "Video, animation, and photography accelerated by intelligent workflows",
      icon: "●"
    },
    {
      title: "Motion & Visual Systems",
      desc: "Scalable brand worlds and design systems that maintain consistency",
      icon: "▲"
    },
  ];

  return (
    <ContentSection scrollStart={0.06} scrollEnd={0.28}>
      <div className="px-6 max-w-6xl w-full">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-white mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          What we do
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {capabilities.map((cap, i) => (
            <motion.div
              key={i}
              className="p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm hover:border-amber-500/30 transition-colors group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="text-2xl mb-4 block text-amber-500">{cap.icon}</span>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-amber-500 transition-colors">
                {cap.title}
              </h3>
              <p className="text-white/50 leading-relaxed">{cap.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </ContentSection>
  );
}

function ProjectsSection() {
  const projects = [
    {
      title: "Luminary Health",
      category: "Brand Identity + Video",
      description: "Complete brand system and launch campaign for a wellness startup disrupting the longevity space.",
      gradient: "from-blue-500 to-cyan-400",
      tags: ["Strategy", "Video", "Brand"],
    },
    {
      title: "Neon Collective",
      category: "AI-Enhanced Production",
      description: "Music video production using AI workflows, cutting post-production time by 60%.",
      gradient: "from-purple-500 to-pink-500",
      tags: ["AI", "Video", "Motion"],
    },
    {
      title: "Atlas Ventures",
      category: "Pitch System",
      description: "Investment deck and visual identity that helped close a $12M Series A.",
      gradient: "from-amber-500 to-orange-500",
      tags: ["Pitch Deck", "Brand", "Strategy"],
    },
    {
      title: "Meridian Studios",
      category: "Content Engine",
      description: "Scalable content system producing 40+ branded assets per month with AI assistance.",
      gradient: "from-emerald-500 to-teal-400",
      tags: ["AI", "Systems", "Content"],
    },
  ];

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
          <motion.h2
            className="text-3xl md:text-5xl font-bold text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            Projects that move the needle
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
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
                    whileHover={{ scale: 1.1 }}
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

                <p className="text-white/50 leading-relaxed mb-6">
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
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          How we work
        </motion.h2>
        <motion.p
          className="text-white/50 mb-16 text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          A proven process that delivers results
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              <span className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500 block mb-4">
                {step.num}
              </span>
              <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-white/40 text-sm">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 inline-block px-6 py-3 border border-white/10 rounded-full"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <span className="text-white/60 italic">We&apos;re a partner, not a vendor.</span>
        </motion.div>
      </div>
    </ContentSection>
  );
}

function CTASection() {
  const setContactOpen = useStore((state) => state.setContactOpen);

  return (
    <ContentSection scrollStart={0.76} scrollEnd={1}>
      <div className="px-6 text-center max-w-3xl pointer-events-auto">
        <motion.h2
          className="text-4xl md:text-6xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          Ready to build
          <br />
          something{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-rose-500">
            extraordinary?
          </span>
        </motion.h2>
        <motion.p
          className="text-lg text-white/50 mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          One strategy call can replace months of trial and error.
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={() => setContactOpen(true)}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-black font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Book a Strategy Call
          </motion.button>
          <motion.a
            href="mailto:david@davidturkcreative.com"
            className="px-8 py-4 border border-white/20 rounded-full text-white font-medium hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Email Me
          </motion.a>
        </motion.div>

        <motion.div
          className="mt-20 text-sm text-white/30"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
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
              className="absolute top-4 right-4 text-white/50 hover:text-white p-2"
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
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg text-black font-semibold hover:opacity-90 transition-opacity"
              >
                Send Message
              </button>
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

  // Fallback timeout in case 3D never signals ready
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
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="w-12 h-12 border-2 border-amber-500/20 border-t-amber-500 rounded-full mx-auto mb-4"
            />
            <p className="text-white/30 text-sm">Loading experience...</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function BackgroundDimmer() {
  const scroll = useStore((state) => state.scroll);

  // Start dimming after hero section, max out around 60% opacity
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
  const setScroll = useStore((state) => state.setScroll);
  const setMousePosition = useStore((state) => state.setMousePosition);

  const scrollToPosition = useCallback((position: number) => {
    if (!containerRef.current) return;
    const scrollHeight = containerRef.current.scrollHeight - window.innerHeight;
    containerRef.current.scrollTo({
      top: position * scrollHeight,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollHeight = container.scrollHeight - window.innerHeight;
      const progress = container.scrollTop / scrollHeight;
      setScroll(Math.max(0, Math.min(1, progress)));
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
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
      <LoadingScreen />
      <BackgroundDimmer />
      <Navigation onNavigate={scrollToPosition} />
      <ScrollIndicator />

      <div
        ref={containerRef}
        className="fixed inset-0 overflow-y-auto z-20"
        style={{ scrollBehavior: "smooth" }}
      >
        <div className="h-[500vh]" />
      </div>

      <HeroSection />
      <CapabilitiesSection />
      <ProjectsSection />
      <ProcessSection />
      <CTASection />

      <ContactModal />
    </>
  );
}
