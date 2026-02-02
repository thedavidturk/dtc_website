"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MagneticButton from "./MagneticButton";

export interface Project {
  title: string;
  category: string;
  description: string;
  gradient: string;
  tags: string[];
  // Extended details
  challenge?: string;
  solution?: string;
  results?: { metric: string; label: string }[];
  testimonial?: { quote: string; author: string; role: string };
}

interface ProjectDetailProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[150]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[151] overflow-y-auto"
            onClick={onClose}
          >
            <div className="min-h-full flex items-center justify-center p-4 md:p-8">
              {/* Modal Content */}
              <motion.div
                initial={{ scale: 0.9, y: 40, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 20, opacity: 0 }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 300,
                  opacity: { duration: 0.2 }
                }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-4xl bg-zinc-900 rounded-3xl border border-white/10 overflow-hidden"
              >
                {/* Gradient Header */}
                <div className={`relative h-48 md:h-64 bg-gradient-to-br ${project.gradient}`}>
                  <div className="absolute inset-0 bg-black/30" />

                  {/* Close Button */}
                  <motion.button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/50 transition-colors z-10"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    data-cursor
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </motion.button>

                  {/* Header Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-white/70 text-sm mb-2"
                    >
                      {project.category}
                    </motion.p>
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="text-3xl md:text-4xl font-bold text-white"
                    >
                      {project.title}
                    </motion.h2>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 space-y-8">
                  {/* Tags */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap gap-2"
                  >
                    {project.tags.map((tag, i) => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.25 + i * 0.05 }}
                        className="px-4 py-1.5 text-sm rounded-full border border-white/20 text-white/70"
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </motion.div>

                  {/* Overview */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-lg font-semibold text-white mb-3">Overview</h3>
                    <p className="text-white/60 leading-relaxed">{project.description}</p>
                  </motion.div>

                  {/* Challenge & Solution */}
                  {(project.challenge || project.solution) && (
                    <div className="grid md:grid-cols-2 gap-6">
                      {project.challenge && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.35 }}
                          className="p-5 rounded-xl bg-white/5 border border-white/10"
                        >
                          <h4 className="text-amber-500 font-semibold mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            The Challenge
                          </h4>
                          <p className="text-white/50 text-sm leading-relaxed">{project.challenge}</p>
                        </motion.div>
                      )}
                      {project.solution && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                          className="p-5 rounded-xl bg-white/5 border border-white/10"
                        >
                          <h4 className="text-emerald-500 font-semibold mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Our Solution
                          </h4>
                          <p className="text-white/50 text-sm leading-relaxed">{project.solution}</p>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Results */}
                  {project.results && project.results.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 }}
                    >
                      <h3 className="text-lg font-semibold text-white mb-4">Results</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {project.results.map((result, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            className="text-center p-4 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10"
                          >
                            <motion.span
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.6 + i * 0.1 }}
                              className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${project.gradient} bg-clip-text text-transparent block mb-1`}
                            >
                              {result.metric}
                            </motion.span>
                            <span className="text-white/40 text-sm">{result.label}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Testimonial */}
                  {project.testimonial && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="relative p-6 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10"
                    >
                      <span className="absolute -top-3 left-6 text-5xl text-white/10">&quot;</span>
                      <p className="text-white/70 italic leading-relaxed mb-4 pl-4">
                        {project.testimonial.quote}
                      </p>
                      <div className="flex items-center gap-3 pl-4">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${project.gradient}`} />
                        <div>
                          <p className="text-white font-medium text-sm">{project.testimonial.author}</p>
                          <p className="text-white/40 text-xs">{project.testimonial.role}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* CTA */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex flex-col sm:flex-row gap-4 pt-4"
                  >
                    <MagneticButton
                      className={`flex-1 py-4 bg-gradient-to-r ${project.gradient} rounded-xl text-white font-semibold text-center hover:opacity-90 transition-opacity`}
                      strength={0.15}
                    >
                      Start a Similar Project
                    </MagneticButton>
                    <MagneticButton
                      onClick={onClose}
                      className="flex-1 py-4 border border-white/20 rounded-xl text-white font-medium text-center hover:bg-white/5 transition-colors"
                      strength={0.15}
                    >
                      Back to Projects
                    </MagneticButton>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
