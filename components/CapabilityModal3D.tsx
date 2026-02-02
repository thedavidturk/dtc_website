"use client";

import { useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles, Trail } from "@react-three/drei";
import * as THREE from "three";
import MagneticButton from "./MagneticButton";
import { Capability } from "./CapabilityDetail";

// Mouse position store for 3D interaction
let mouseX = 0;
let mouseY = 0;

// Floating particles that react to mouse
function ParticleField({ color }: { color: string }) {
  const points = useRef<THREE.Points>(null);

  const particleCount = 300;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!points.current) return;
    const time = state.clock.elapsedTime;
    points.current.rotation.y = time * 0.05 + mouseX * 0.5;
    points.current.rotation.x = Math.sin(time * 0.03) * 0.1 + mouseY * 0.3;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color={color}
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Interactive morphing blob
function CapabilityBlob({ color1, color2 }: { color1: string; color2: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    // React to mouse
    const targetX = mouseX * 0.8;
    const targetY = mouseY * 0.5;

    meshRef.current.rotation.x = time * 0.1 + targetY;
    meshRef.current.rotation.y = time * 0.15 + targetX;
    meshRef.current.position.x = targetX * 0.5;
    meshRef.current.position.y = Math.sin(time * 0.5) * 0.1 + targetY * 0.3;

    if (glowRef.current) {
      glowRef.current.rotation.copy(meshRef.current.rotation);
      glowRef.current.position.copy(meshRef.current.position);
    }

    if (innerRef.current) {
      innerRef.current.rotation.x = -time * 0.2;
      innerRef.current.rotation.y = -time * 0.25;
      innerRef.current.position.copy(meshRef.current.position);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group position={[2.5, 0, -1]}>
        {/* Inner core */}
        <mesh ref={innerRef} scale={0.5}>
          <icosahedronGeometry args={[1, 3]} />
          <meshStandardMaterial
            color={color2}
            emissive={color2}
            emissiveIntensity={1}
            toneMapped={false}
          />
        </mesh>

        {/* Main blob */}
        <mesh ref={meshRef} scale={1.3}>
          <icosahedronGeometry args={[1, 4]} />
          <MeshDistortMaterial
            color={color1}
            distort={0.5}
            speed={3}
            roughness={0.1}
            metalness={0.9}
            emissive={color1}
            emissiveIntensity={0.4}
          />
        </mesh>

        {/* Outer glow */}
        <mesh ref={glowRef} scale={1.6}>
          <icosahedronGeometry args={[1, 4]} />
          <MeshDistortMaterial
            color={color2}
            distort={0.6}
            speed={2}
            roughness={0.3}
            metalness={0.5}
            transparent
            opacity={0.12}
            emissive={color2}
            emissiveIntensity={0.6}
          />
        </mesh>
      </group>
    </Float>
  );
}

// Orbiting light orbs with trails
function OrbitingOrbs({ color1, color2 }: { color1: string; color2: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    groupRef.current.rotation.y = time * 0.3 + mouseX * 0.5;
    groupRef.current.rotation.x = Math.sin(time * 0.2) * 0.3 + mouseY * 0.3;
  });

  const orbs = [
    { angle: 0, radius: 2.5, speed: 1, color: color1, size: 0.08 },
    { angle: Math.PI * 0.66, radius: 2.8, speed: 0.8, color: color2, size: 0.06 },
    { angle: Math.PI * 1.33, radius: 2.3, speed: 1.2, color: color1, size: 0.05 },
  ];

  return (
    <group ref={groupRef} position={[2.5, 0, -1]}>
      {orbs.map((orb, i) => (
        <OrbWithTrail key={i} {...orb} index={i} />
      ))}
    </group>
  );
}

function OrbWithTrail({ angle, radius, speed, color, size, index }: {
  angle: number;
  radius: number;
  speed: number;
  color: string;
  size: number;
  index: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime * speed;
    const currentAngle = angle + time;
    meshRef.current.position.x = Math.cos(currentAngle) * radius;
    meshRef.current.position.z = Math.sin(currentAngle) * radius;
    meshRef.current.position.y = Math.sin(time * 2 + index) * 0.4;
  });

  return (
    <Trail
      width={0.4}
      length={6}
      color={color}
      attenuation={(t) => t * t}
    >
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
    </Trail>
  );
}

// Multiple orbital rings
function OrbitalRings({ color1, color2 }: { color1: string; color2: string }) {
  const ring1Ref = useRef<THREE.Points>(null);
  const ring2Ref = useRef<THREE.Points>(null);

  const createRingPositions = (count: number, baseRadius: number) => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = baseRadius + Math.random() * 0.3;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  };

  const ring1Positions = useMemo(() => createRingPositions(150, 2), []);
  const ring2Positions = useMemo(() => createRingPositions(100, 3), []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (ring1Ref.current) {
      ring1Ref.current.rotation.y = time * 0.2 + mouseX * 0.3;
      ring1Ref.current.rotation.x = 0.5 + mouseY * 0.2;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -time * 0.15 + mouseX * 0.2;
      ring2Ref.current.rotation.z = time * 0.1;
    }
  });

  return (
    <group position={[2.5, 0, -1]}>
      <points ref={ring1Ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={150} array={ring1Positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.05} color={color1} transparent opacity={0.9} sizeAttenuation blending={THREE.AdditiveBlending} />
      </points>
      <points ref={ring2Ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={100} array={ring2Positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.03} color={color2} transparent opacity={0.6} sizeAttenuation blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
}

// Camera that subtly follows mouse
function InteractiveCamera() {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 0.3 - camera.position.y) * 0.05;
    camera.lookAt(1, 0, 0);
  });

  return null;
}

// 3D Scene
function ModalScene({ gradient }: { gradient: string }) {
  const colors = useMemo(() => {
    if (gradient.includes("blue")) return { primary: "#3b82f6", secondary: "#22d3ee" };
    if (gradient.includes("purple")) return { primary: "#a855f7", secondary: "#ec4899" };
    if (gradient.includes("amber")) return { primary: "#f59e0b", secondary: "#f97316" };
    if (gradient.includes("emerald")) return { primary: "#10b981", secondary: "#2dd4bf" };
    return { primary: "#f59e0b", secondary: "#f97316" };
  }, [gradient]);

  return (
    <>
      <color attach="background" args={["#030305"]} />
      <fog attach="fog" args={["#030305", 5, 18]} />

      <ambientLight intensity={0.1} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color={colors.primary} distance={20} />
      <pointLight position={[-5, -5, 5]} intensity={1} color={colors.secondary} distance={15} />
      <pointLight position={[0, 0, 5]} intensity={0.5} color="#ffffff" distance={10} />

      <InteractiveCamera />
      <CapabilityBlob color1={colors.primary} color2={colors.secondary} />
      <OrbitingOrbs color1={colors.primary} color2={colors.secondary} />
      <OrbitalRings color1={colors.primary} color2={colors.secondary} />
      <ParticleField color={colors.secondary} />

      <Sparkles count={80} scale={10} size={2} speed={0.4} opacity={0.6} color={colors.primary} />
      <Sparkles count={50} scale={12} size={1.5} speed={0.3} opacity={0.4} color={colors.secondary} />
    </>
  );
}

interface CapabilityModal3DProps {
  capability: Capability | null;
  onClose: () => void;
  onContact: () => void;
}

export default function CapabilityModal3D({ capability, onClose, onContact }: CapabilityModal3DProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    if (capability) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [capability, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {capability && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[150]"
        >
          {/* 3D Background */}
          <div className="absolute inset-0">
            <Canvas
              camera={{ position: [0, 0, 5], fov: 50 }}
              dpr={[1, 2]}
              gl={{ antialias: true, alpha: true }}
            >
              <ModalScene gradient={capability.gradient} />
            </Canvas>
          </div>

          {/* Click-to-close overlay */}
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={handleBackdropClick}
          />

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

          {/* Close button - larger and more prominent */}
          <motion.button
            onClick={onClose}
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="fixed top-6 right-6 z-50 w-14 h-14 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white hover:bg-white/30 hover:scale-110 transition-all shadow-2xl"
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            data-cursor
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </motion.button>

          {/* Click anywhere hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/50 text-sm pointer-events-none"
          >
            Click anywhere or press ESC to close
          </motion.div>

          {/* Content */}
          <div className="relative z-10 h-full overflow-y-auto" onClick={handleBackdropClick}>
            <div className="min-h-full flex items-center">
              <div
                className="w-full max-w-3xl mx-auto px-6 py-20"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Icon badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="mb-6"
                >
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${capability.gradient} text-4xl font-bold text-white shadow-2xl`}>
                    {capability.icon}
                  </div>
                </motion.div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.6 }}
                  className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
                >
                  {capability.title}
                </motion.h1>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="text-xl text-white/70 mb-8 leading-relaxed max-w-2xl"
                >
                  {capability.description}
                </motion.p>

                {/* Overview */}
                {capability.details?.overview && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-12"
                  >
                    <p className="text-lg text-white/60 leading-relaxed">
                      {capability.details.overview}
                    </p>
                  </motion.div>
                )}

                {/* Services Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="mb-12"
                >
                  <h3 className="text-lg font-semibold text-white mb-6">What&apos;s Included</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {capability.services.map((service, i) => (
                      <motion.div
                        key={service}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.05 }}
                        className="flex items-center gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors group"
                      >
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${capability.gradient} group-hover:scale-150 transition-transform`} />
                        <span className="text-white/70">{service}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Benefits */}
                {capability.details?.benefits && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mb-12"
                  >
                    <h3 className="text-lg font-semibold text-white mb-6">Why It Matters</h3>
                    <div className="space-y-4">
                      {capability.details.benefits.map((benefit, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.55 + i * 0.05 }}
                          className="flex items-start gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10"
                        >
                          <div className={`flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br ${capability.gradient} flex items-center justify-center`}>
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-white/70 leading-relaxed">{benefit}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Tools */}
                {capability.details?.tools && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mb-12"
                  >
                    <h3 className="text-lg font-semibold text-white mb-4">Tools & Technology</h3>
                    <div className="flex flex-wrap gap-3">
                      {capability.details.tools.map((tool, i) => (
                        <motion.span
                          key={tool}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.65 + i * 0.03 }}
                          className="px-4 py-2 rounded-full text-sm border border-white/20 text-white/60 backdrop-blur-sm hover:bg-white/10 hover:text-white/80 transition-all"
                        >
                          {tool}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <MagneticButton
                    onClick={() => {
                      onClose();
                      onContact();
                    }}
                    className={`flex-1 py-4 px-8 bg-gradient-to-r ${capability.gradient} rounded-full text-white font-semibold text-center hover:shadow-lg hover:shadow-amber-500/25 transition-shadow`}
                    strength={0.2}
                  >
                    Discuss This Service
                  </MagneticButton>
                  <MagneticButton
                    onClick={onClose}
                    className="flex-1 py-4 px-8 border border-white/20 rounded-full text-white font-medium text-center hover:bg-white/10 backdrop-blur-sm transition-all"
                    strength={0.2}
                  >
                    Back to Services
                  </MagneticButton>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
