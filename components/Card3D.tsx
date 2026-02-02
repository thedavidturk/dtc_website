"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  glowColor?: string;
}

export default function Card3D({
  children,
  className = "",
  onClick,
  glowColor = "rgba(245, 158, 11, 0.4)",
}: Card3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const glowX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative cursor-pointer ${className}`}
      whileTap={{ scale: 0.98 }}
      data-cursor
      data-cursor-text="Explore"
    >
      {/* Glow effect */}
      <motion.div
        className="absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${glowX} ${glowY}, ${glowColor}, transparent 50%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 pointer-events-none overflow-hidden"
        style={{ opacity: isHovered ? 1 : 0 }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 55%, transparent 60%)`,
            transform: `translateX(${isHovered ? "100%" : "-100%"})`,
            transition: "transform 0.6s ease-out",
          }}
        />
      </motion.div>

      {/* Card content with 3D lift */}
      <motion.div
        className="relative h-full"
        style={{
          transform: "translateZ(40px)",
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </motion.div>

      {/* Bottom reflection */}
      <motion.div
        className="absolute -bottom-4 left-4 right-4 h-8 rounded-2xl blur-xl pointer-events-none"
        style={{
          background: glowColor,
          opacity: isHovered ? 0.3 : 0,
          transition: "opacity 0.3s ease-out",
        }}
      />
    </motion.div>
  );
}
