"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

interface LiquidGlassProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  onClick?: () => void;
}

export default function LiquidGlass({
  children,
  className = "",
  glowColor = "rgba(255, 92, 52, 0.3)",
  onClick,
}: LiquidGlassProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setMousePosition({ x: 0.5, y: 0.5 });
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      {/* Liquid glass reflection layer */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        animate={{
          background: isHovered
            ? `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 25%, transparent 50%)`
            : "transparent",
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      />

      {/* Liquid distortion effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        animate={{
          background: isHovered
            ? `radial-gradient(ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, ${glowColor} 0%, transparent 60%)`
            : "transparent",
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />

      {/* Glass edge highlight */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10 rounded-[inherit]"
        animate={{
          boxShadow: isHovered
            ? `inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.1), 0 0 30px ${glowColor}`
            : "inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.05)",
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Liquid ripple on hover */}
      {isHovered && (
        <motion.div
          className="absolute pointer-events-none z-10 rounded-full"
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            left: `${mousePosition.x * 100}%`,
            top: `${mousePosition.y * 100}%`,
            width: 100,
            height: 100,
            marginLeft: -50,
            marginTop: -50,
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-0">{children}</div>
    </motion.div>
  );
}
