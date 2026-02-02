"use client";

import { useRef, useEffect, useState, useSyncExternalStore } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

// Generate particle data outside of component to avoid impure function calls during render
function generateParticleData(particleCount: number) {
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const accentColor = new THREE.Color("#FF7F6B");
  const slateColor = new THREE.Color("#E3D3C5");

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;

    // Distribute particles in a sphere
    const radius = 3 + Math.random() * 2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);

    // Mix colors
    const mixFactor = Math.random();
    const color = accentColor.clone().lerp(slateColor, mixFactor);
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
  }

  return { positions, colors };
}

// Pre-generate particle data
const PARTICLE_COUNT = 150;
const particleData = generateParticleData(PARTICLE_COUNT);

function AbstractShape({ scrollProgress }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  const scale = Math.min(viewport.width, viewport.height) * 0.35;

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;

    // Subtle rotation influenced by scroll
    meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.2 + scrollProgress * 0.5;
    meshRef.current.rotation.y = time * 0.15 + scrollProgress * 0.3;
    meshRef.current.rotation.z = Math.cos(time * 0.2) * 0.1;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={scale}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color="#FF7F6B"
          emissive="#FF7F6B"
          emissiveIntensity={0.15}
          roughness={0.4}
          metalness={0.8}
          distort={0.3 + scrollProgress * 0.1}
          speed={2}
          transparent
          opacity={0.85}
        />
      </mesh>
    </Float>
  );
}

function ParticleField({ scrollProgress }: { scrollProgress: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const { viewport } = useThree();

  // Set up geometry attributes
  useEffect(() => {
    if (!geometryRef.current) return;

    geometryRef.current.setAttribute(
      "position",
      new THREE.BufferAttribute(particleData.positions, 3)
    );
    geometryRef.current.setAttribute(
      "color",
      new THREE.BufferAttribute(particleData.colors, 3)
    );
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.elapsedTime;
    pointsRef.current.rotation.y = time * 0.05 + scrollProgress * 0.2;
    pointsRef.current.rotation.x = scrollProgress * 0.1;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geometryRef} />
      <pointsMaterial
        size={0.03 * Math.min(viewport.width, viewport.height)}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function Scene({ scrollProgress }: { scrollProgress: number }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, -5, -5]} intensity={0.4} color="#E3D3C5" />

      <AbstractShape scrollProgress={scrollProgress} />
      <ParticleField scrollProgress={scrollProgress} />
    </>
  );
}

// Fallback gradient component
function FallbackGradient() {
  return (
    <div
      className="absolute inset-0 opacity-60"
      style={{
        background:
          "radial-gradient(ellipse at 70% 30%, rgba(245, 158, 11, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 30% 70%, rgba(100, 116, 139, 0.1) 0%, transparent 50%)",
      }}
    />
  );
}

// External store for render capability detection
function subscribeToRenderCapability(callback: () => void) {
  // Listen for media query and resize changes
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const handleChange = () => callback();

  mediaQuery.addEventListener("change", handleChange);
  window.addEventListener("resize", handleChange);

  return () => {
    mediaQuery.removeEventListener("change", handleChange);
    window.removeEventListener("resize", handleChange);
  };
}

function getSnapshot() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const isMobile = window.innerWidth < 768;
  return !prefersReducedMotion && !isMobile;
}

function getServerSnapshot() {
  // Default to false on server to show fallback
  return false;
}

export default function CreativeEngine() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use useSyncExternalStore for render capability detection
  const shouldRender = useSyncExternalStore(
    subscribeToRenderCapability,
    getSnapshot,
    getServerSnapshot
  );

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const progress = Math.min(scrollY / windowHeight, 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection observer to pause when offscreen
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Fallback gradient for mobile/reduced motion/SSR
  if (!shouldRender) {
    return <FallbackGradient />;
  }

  return (
    <div ref={containerRef} className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
        frameloop={isVisible ? "always" : "never"}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
