"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";

type CursorState = "default" | "click" | "view" | "play" | "drag" | "expand" | "link";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorState, setCursorState] = useState<CursorState>("default");
  const [isClicking, setIsClicking] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Hide default cursor
    document.body.style.cursor = "none";

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Detect element types and set cursor state
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check for data attributes first (highest priority)
      const cursorElement = target.closest("[data-cursor]");
      if (cursorElement) {
        const cursorType = cursorElement.getAttribute("data-cursor");
        const text = cursorElement.getAttribute("data-cursor-text") || "";
        setCursorText(text);

        switch (cursorType) {
          case "play":
            setCursorState("play");
            return;
          case "view":
            setCursorState("view");
            return;
          case "drag":
            setCursorState("drag");
            return;
          case "expand":
            setCursorState("expand");
            return;
          case "link":
            setCursorState("link");
            return;
          default:
            setCursorState("click");
            return;
        }
      }

      // Check for video elements
      if (target.closest("video") || target.closest("iframe") || target.closest("[data-video]")) {
        setCursorState("play");
        setCursorText("");
        return;
      }

      // Check for project/capability cards
      if (target.closest("[data-card]")) {
        setCursorState("view");
        setCursorText("View");
        return;
      }

      // Check for horizontal scroll areas
      if (target.closest(".scrollbar-hide") || target.closest("[data-carousel]")) {
        setCursorState("drag");
        setCursorText("");
        return;
      }

      // Check for images
      if (target.closest("img") || target.closest("[data-image]")) {
        setCursorState("expand");
        setCursorText("");
        return;
      }

      // Check for buttons and links
      if (
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']")
      ) {
        setCursorState("click");
        setCursorText("");
        return;
      }

      // Default state
      setCursorState("default");
      setCursorText("");
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousemove", handleElementHover);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.body.style.cursor = "auto";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousemove", handleElementHover);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY]);

  // Don't render on touch devices
  if (typeof window !== "undefined" && "ontouchstart" in window) {
    return null;
  }

  const isExpanded = cursorState !== "default";

  // Get cursor size based on state
  const getCursorSize = () => {
    if (isClicking) return { width: 40, height: 40 };
    switch (cursorState) {
      case "play":
        return { width: 80, height: 80 };
      case "view":
        return { width: 90, height: 90 };
      case "drag":
        return { width: 70, height: 40 };
      case "expand":
        return { width: 60, height: 60 };
      case "click":
      case "link":
        return { width: 50, height: 50 };
      default:
        return { width: 12, height: 12 };
    }
  };

  const size = getCursorSize();

  // Get cursor color based on state
  const getCursorColor = () => {
    switch (cursorState) {
      case "play":
        return "bg-[#FF7F6B]";
      case "view":
        return "bg-[#2F6364]";
      case "drag":
        return "bg-[#E3D3C5]";
      case "expand":
        return "bg-[#A8E6CF]";
      case "click":
      case "link":
        return "bg-[#F9F5F0]";
      default:
        return "bg-[#F9F5F0]";
    }
  };

  return (
    <>
      {/* Main cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div
          className="relative -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
          animate={{
            width: size.width,
            height: size.height,
            opacity: isVisible ? 1 : 0,
            scale: isClicking ? 0.85 : 1,
          }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 300,
            opacity: { duration: 0.15 }
          }}
        >
          {/* Cursor background */}
          <motion.div
            className={`absolute inset-0 rounded-full ${getCursorColor()} ${
              cursorState === "drag" ? "rounded-[20px]" : ""
            }`}
            style={{
              mixBlendMode: cursorState === "default" ? "difference" : "normal",
            }}
            animate={{
              opacity: cursorState === "default" ? 1 : 0.95,
            }}
          />

          {/* Cursor content based on state */}
          <AnimatePresence mode="wait">
            {cursorState === "play" && (
              <motion.div
                key="play"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.15 }}
                className="relative z-10 flex items-center justify-center"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="black" className="ml-1">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </motion.div>
            )}

            {cursorState === "view" && (
              <motion.div
                key="view"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.15 }}
                className="relative z-10 flex flex-col items-center justify-center text-black"
              >
                <span className="text-xs font-bold uppercase tracking-wider">
                  {cursorText || "View"}
                </span>
              </motion.div>
            )}

            {cursorState === "drag" && (
              <motion.div
                key="drag"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.15 }}
                className="relative z-10 flex items-center justify-center gap-2 text-black"
              >
                <motion.svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  animate={{ x: [-2, 0, -2] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <path d="M19 12H5M5 12l4-4M5 12l4 4" />
                </motion.svg>
                <span className="text-[10px] font-bold uppercase tracking-wider">Drag</span>
                <motion.svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  animate={{ x: [2, 0, 2] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <path d="M5 12h14M19 12l-4-4M19 12l-4 4" />
                </motion.svg>
              </motion.div>
            )}

            {cursorState === "expand" && (
              <motion.div
                key="expand"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.15 }}
                className="relative z-10 flex items-center justify-center text-black"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </motion.div>
            )}

            {(cursorState === "click" || cursorState === "link") && (
              <motion.div
                key="click"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.15 }}
                className="relative z-10"
                style={{ mixBlendMode: "difference" }}
              >
                {cursorText ? (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-black">
                    {cursorText}
                  </span>
                ) : (
                  <motion.div
                    className="w-2 h-2 rounded-full bg-black"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Outer ring (only visible in default state) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div
          className="relative -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: isExpanded ? 0 : 1,
            opacity: isVisible ? (isExpanded ? 0 : 0.4) : 0,
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div className="w-10 h-10 rounded-full border border-white/60" />
        </motion.div>
      </motion.div>

      {/* Glow effect for play state */}
      {cursorState === "play" && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9997]"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
          }}
        >
          <motion.div
            className="relative -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-[#FF7F6B]"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.3, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            style={{ filter: "blur(20px)" }}
          />
        </motion.div>
      )}
    </>
  );
}
