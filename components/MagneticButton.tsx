"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  strength?: number;
  as?: "button" | "a";
  style?: React.CSSProperties;
  cursorType?: "click" | "play" | "view" | "drag" | "expand" | "link";
  cursorText?: string;
}

export default function MagneticButton({
  children,
  className = "",
  onClick,
  href,
  strength = 0.3,
  as = "button",
  style,
  cursorType,
  cursorText,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = (e.clientX - centerX) * strength;
    const distanceY = (e.clientY - centerY) * strength;

    setPosition({ x: distanceX, y: distanceY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const Component = as === "a" ? motion.a : motion.button;

  return (
    <Component
      ref={ref as React.RefObject<HTMLButtonElement & HTMLAnchorElement>}
      href={href}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 350, damping: 15, mass: 0.5 }}
      className={className}
      style={style}
      data-cursor={cursorType || true}
      data-cursor-text={cursorText}
    >
      <motion.span
        className="block"
        animate={{ x: position.x * 0.3, y: position.y * 0.3 }}
        transition={{ type: "spring", stiffness: 350, damping: 15, mass: 0.5 }}
      >
        {children}
      </motion.span>
    </Component>
  );
}
