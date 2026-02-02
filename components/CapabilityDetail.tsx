"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MagneticButton from "./MagneticButton";

export interface Capability {
  title: string;
  description: string;
  icon: string;
  gradient: string;
  services: string[];
  details?: {
    overview: string;
    benefits: string[];
    tools?: string[];
    deliverables?: string[];
  };
}

interface CapabilityDetailProps {
  capability: Capability | null;
  onClose: () => void;
  onContact: () => void;
}

export default function CapabilityDetail({
  capability,
  onClose,
  onContact,
}: CapabilityDetailProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (capability) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [capability, onClose]);

  return (
    <AnimatePresence>
      {capability && (
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

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[151] overflow-y-auto"
            onClick={onClose}
          >
            <div className="min-h-full flex items-center justify-center p-4 md:p-8">
              <motion.div
                initial={{ scale: 0.9, y: 40, opacity: 0, rotateX: 10 }}
                animate={{ scale: 1, y: 0, opacity: 1, rotateX: 0 }}
                exit={{ scale: 0.95, y: 20, opacity: 0 }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 300,
                }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-3xl bg-zinc-900/95 rounded-3xl border border-white/10 overflow-hidden backdrop-blur-xl"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Animated gradient border */}
                <div className="absolute inset-0 rounded-3xl p-px overflow-hidden">
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-r ${capability.gradient}`}
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{
                      opacity: 0.5,
                      filter: "blur(20px)",
                    }}
                  />
                </div>

                {/* Content container */}
                <div className="relative bg-zinc-900/90 m-px rounded-3xl">
                  {/* Header */}
                  <div className="relative p-8 pb-0">
                    {/* Close button */}
                    <motion.button
                      onClick={onClose}
                      className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all z-10"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      data-cursor
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </motion.button>

                    {/* Icon and Title */}
                    <div className="flex items-start gap-6">
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                        className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${capability.gradient} flex items-center justify-center text-4xl font-bold text-white shadow-lg`}
                      >
                        {capability.icon}
                      </motion.div>
                      <div className="flex-1 pt-2">
                        <motion.h2
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 }}
                          className="text-2xl md:text-3xl font-bold text-white mb-2"
                        >
                          {capability.title}
                        </motion.h2>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="text-white/50"
                        >
                          {capability.description}
                        </motion.p>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-8 space-y-8">
                    {/* Overview */}
                    {capability.details?.overview && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                      >
                        <h3 className="text-lg font-semibold text-white mb-3">Overview</h3>
                        <p className="text-white/60 leading-relaxed">{capability.details.overview}</p>
                      </motion.div>
                    )}

                    {/* Services Grid */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className="text-lg font-semibold text-white mb-4">What&apos;s Included</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {capability.services.map((service, i) => (
                          <motion.div
                            key={service}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.35 + i * 0.05 }}
                            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                          >
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${capability.gradient}`} />
                            <span className="text-white/70 text-sm">{service}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Benefits */}
                    {capability.details?.benefits && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <h3 className="text-lg font-semibold text-white mb-4">Why It Matters</h3>
                        <div className="space-y-3">
                          {capability.details.benefits.map((benefit, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.45 + i * 0.05 }}
                              className="flex items-start gap-3"
                            >
                              <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-white/60 text-sm">{benefit}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Tools */}
                    {capability.details?.tools && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <h3 className="text-lg font-semibold text-white mb-3">Tools & Technology</h3>
                        <div className="flex flex-wrap gap-2">
                          {capability.details.tools.map((tool, i) => (
                            <motion.span
                              key={tool}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.55 + i * 0.03 }}
                              className="px-3 py-1.5 text-xs rounded-full bg-white/5 border border-white/10 text-white/50"
                            >
                              {tool}
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* CTA */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="flex flex-col sm:flex-row gap-4 pt-4"
                    >
                      <MagneticButton
                        onClick={() => {
                          onClose();
                          onContact();
                        }}
                        className={`flex-1 py-4 bg-gradient-to-r ${capability.gradient} rounded-xl text-white font-semibold text-center hover:opacity-90 transition-opacity`}
                        strength={0.15}
                      >
                        Discuss This Service
                      </MagneticButton>
                      <MagneticButton
                        onClick={onClose}
                        className="flex-1 py-4 border border-white/20 rounded-xl text-white font-medium text-center hover:bg-white/5 transition-colors"
                        strength={0.15}
                      >
                        Back to Services
                      </MagneticButton>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
