"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, Trail, Environment, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import MagneticButton from "./MagneticButton";
import { Project } from "./ProjectDetail";

// Immersive 3D Video Player Component
function CinematicVideoPlayer({ videoUrl, title, color }: { videoUrl: string; title: string; color: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const embedUrl = videoUrl.includes('youtube.com/watch?v=')
    ? videoUrl.replace('watch?v=', 'embed/') + '?autoplay=1&rel=0'
    : videoUrl.includes('youtu.be/')
    ? videoUrl.replace('youtu.be/', 'youtube.com/embed/') + '?autoplay=1&rel=0'
    : videoUrl.includes('vimeo.com/')
    ? videoUrl.replace('vimeo.com/', 'player.vimeo.com/video/') + '?autoplay=1'
    : videoUrl;

  const getYouTubeThumbnail = () => {
    const match = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    return match ? `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg` : null;
  };

  const thumbnail = getYouTubeThumbnail();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  // Orbiting particles data
  const orbitingParticles = useMemo(() =>
    [...Array(8)].map((_, i) => ({
      angle: (i / 8) * Math.PI * 2,
      radius: 52 + (i % 2) * 4,
      speed: 0.5 + Math.random() * 0.5,
      size: 3 + Math.random() * 3,
    })), []
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: -10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: 0.35, duration: 0.6 }}
      className="mb-12"
      style={{ perspective: '1200px' }}
    >
      <motion.div
        ref={containerRef}
        className="relative aspect-video"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setMousePos({ x: 0, y: 0 }); }}
        animate={{
          rotateY: mousePos.x * 8,
          rotateX: -mousePos.y * 8,
        }}
        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Outer glow layer - furthest back */}
        <motion.div
          className="absolute -inset-8 rounded-3xl pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${color}20 0%, transparent 70%)`,
            transform: 'translateZ(-60px)',
            filter: 'blur(20px)',
          }}
          animate={{
            opacity: isHovered ? 1 : 0.5,
            scale: isHovered ? 1.05 : 1,
          }}
        />

        {/* Deep glass layer */}
        <motion.div
          className="absolute -inset-4 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${color}10 0%, transparent 50%, ${color}08 100%)`,
            border: `1px solid ${color}15`,
            transform: 'translateZ(-40px)',
            backdropFilter: 'blur(8px)',
          }}
        />

        {/* Middle glass layer */}
        <motion.div
          className="absolute -inset-2 rounded-2xl"
          style={{
            background: `linear-gradient(145deg, rgba(255,255,255,0.03) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)`,
            border: '1px solid rgba(255,255,255,0.08)',
            transform: 'translateZ(-20px)',
          }}
        />

        {/* Animated energy border */}
        <div className="absolute -inset-[2px] rounded-2xl overflow-hidden" style={{ transform: 'translateZ(-5px)' }}>
          <motion.div
            className="absolute inset-0"
            style={{
              background: `conic-gradient(from 0deg, ${color}, transparent, ${color}80, transparent, ${color})`,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />
          <div className="absolute inset-[1px] rounded-2xl bg-[#351E28]" />
        </div>

        {/* Main video container */}
        <div
          className="relative w-full h-full rounded-xl overflow-hidden"
          style={{
            transform: 'translateZ(0px)',
            boxShadow: `0 25px 50px -12px ${color}30, 0 0 0 1px rgba(255,255,255,0.1)`,
          }}
        >
          {!isPlaying ? (
            <>
              {/* Thumbnail */}
              {thumbnail && (
                <motion.img
                  src={thumbnail}
                  alt={`${title} preview`}
                  className="absolute inset-0 w-full h-full object-cover"
                  animate={{ scale: isHovered ? 1.05 : 1 }}
                  transition={{ duration: 0.6 }}
                />
              )}

              {/* Holographic overlay */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(135deg, ${color}15 0%, transparent 40%, transparent 60%, ${color}10 100%)`,
                }}
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              {/* Chromatic aberration edge effect */}
              <div
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{
                  boxShadow: `inset 3px 0 10px ${color}40, inset -3px 0 10px #D7EFFF40`,
                }}
              />

              {/* Scan lines */}
              <div
                className="absolute inset-0 pointer-events-none opacity-10"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)',
                }}
              />

              {/* Animated grid overlay */}
              <motion.div
                className="absolute inset-0 pointer-events-none opacity-5"
                style={{
                  backgroundImage: `linear-gradient(${color}40 1px, transparent 1px), linear-gradient(90deg, ${color}40 1px, transparent 1px)`,
                  backgroundSize: '40px 40px',
                }}
                animate={{
                  backgroundPosition: ['0px 0px', '40px 40px'],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              />

              {/* Corner brackets with glow */}
              {[
                { pos: 'top-3 left-3', path: 'M0 16 L0 0 L16 0' },
                { pos: 'top-3 right-3', path: 'M0 0 L16 0 L16 16' },
                { pos: 'bottom-3 left-3', path: 'M0 0 L0 16 L16 16' },
                { pos: 'bottom-3 right-3', path: 'M0 16 L16 16 L16 0' },
              ].map((corner, i) => (
                <svg key={i} className={`absolute ${corner.pos} w-6 h-6`} viewBox="0 0 16 16">
                  <motion.path
                    d={corner.path}
                    fill="none"
                    stroke={color}
                    strokeWidth="1.5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.6 }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                    style={{ filter: `drop-shadow(0 0 4px ${color})` }}
                  />
                </svg>
              ))}

              {/* Play button */}
              <motion.button
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 flex items-center justify-center cursor-pointer z-20"
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="relative"
                  animate={{
                    scale: isHovered ? 1.1 : 1,
                    rotateY: mousePos.x * -15,
                    rotateX: mousePos.y * 15,
                  }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Multiple pulse rings */}
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 rounded-full border"
                      style={{ borderColor: color }}
                      animate={{
                        scale: [1, 2, 2],
                        opacity: [0.4, 0, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.6,
                      }}
                    />
                  ))}

                  {/* Inner glow sphere */}
                  <motion.div
                    className="absolute inset-2 rounded-full"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${color}60, ${color}20)`,
                      filter: 'blur(8px)',
                    }}
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />

                  {/* Glass play button */}
                  <div
                    className="relative w-24 h-24 rounded-full flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)`,
                      border: `2px solid ${color}`,
                      boxShadow: `
                        0 0 40px ${color}50,
                        inset 0 0 30px ${color}20,
                        0 8px 32px rgba(0,0,0,0.4)
                      `,
                      backdropFilter: 'blur(12px)',
                    }}
                  >
                    {/* Play icon with depth */}
                    <motion.div
                      style={{ transform: 'translateZ(10px)' }}
                      animate={{ x: isHovered ? 3 : 0 }}
                    >
                      <svg width="36" height="36" viewBox="0 0 24 24" fill={color}>
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.button>

              {/* Bottom HUD */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 p-4"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Animated status indicator */}
                    <div className="relative">
                      <motion.div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: color }}
                        animate={{
                          boxShadow: [`0 0 0px ${color}`, `0 0 10px ${color}`, `0 0 0px ${color}`]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: color }}
                        animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    </div>
                    <span className="text-white/50 text-sm font-medium">Ready</span>
                  </div>

                  {/* Waveform visualization */}
                  <div className="flex items-center gap-[2px] h-4">
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-[2px] rounded-full"
                        style={{ backgroundColor: color }}
                        animate={{
                          height: ['30%', '100%', '30%'],
                          opacity: [0.3, 0.7, 0.3],
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.08,
                        }}
                      />
                    ))}
                  </div>

                  <span className="text-white/30 text-xs tracking-widest uppercase">Play Film</span>
                </div>
              </motion.div>
            </>
          ) : (
            <iframe
              src={embedUrl}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={`${title} video`}
            />
          )}
        </div>

        {/* Orbiting particles - 3D positioned */}
        {!isPlaying && orbitingParticles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: i % 2 === 0 ? color : '#D7EFFF',
              boxShadow: `0 0 ${particle.size * 2}px ${i % 2 === 0 ? color : '#D7EFFF'}`,
              left: '50%',
              top: '50%',
              transform: `translateZ(${20 + i * 5}px)`,
            }}
            animate={{
              x: [
                Math.cos(particle.angle) * particle.radius + '%',
                Math.cos(particle.angle + Math.PI * 2) * particle.radius + '%',
              ],
              y: [
                Math.sin(particle.angle) * particle.radius + '%',
                Math.sin(particle.angle + Math.PI * 2) * particle.radius + '%',
              ],
              opacity: isHovered ? [0.4, 0.8, 0.4] : 0.3,
            }}
            transition={{
              x: { duration: 8 / particle.speed, repeat: Infinity, ease: 'linear' },
              y: { duration: 8 / particle.speed, repeat: Infinity, ease: 'linear' },
              opacity: { duration: 2, repeat: Infinity },
            }}
          />
        ))}

        {/* Floating data points */}
        {!isPlaying && isHovered && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`float-${i}`}
                className="absolute text-[10px] font-mono pointer-events-none"
                style={{
                  color: `${color}80`,
                  left: `${10 + i * 20}%`,
                  transform: 'translateZ(30px)',
                }}
                initial={{ opacity: 0, y: 20, top: '100%' }}
                animate={{
                  opacity: [0, 0.6, 0],
                  y: [20, -100],
                  top: ['100%', '0%'],
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.4,
                  repeat: Infinity,
                }}
              >
                {['▲', '◆', '●', '■', '★'][i]}
              </motion.div>
            ))}
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

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
          args={[positions, 3]}
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

// Premium glass sphere with smooth surface
function ProjectSphere({ color1, color2 }: { color1: string; color2: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;

    // Smooth mouse following
    const targetX = mouseX * 0.6;
    const targetY = mouseY * 0.4;

    groupRef.current.rotation.x += (targetY * 0.3 - groupRef.current.rotation.x) * 0.02;
    groupRef.current.rotation.y += (targetX * 0.5 + time * 0.1 - groupRef.current.rotation.y) * 0.02;
    groupRef.current.position.x += (targetX * 0.3 - groupRef.current.position.x) * 0.03;
    groupRef.current.position.y += (Math.sin(time * 0.5) * 0.15 + targetY * 0.2 - groupRef.current.position.y) * 0.03;

    if (innerRef.current) {
      innerRef.current.rotation.x = time * 0.3;
      innerRef.current.rotation.y = time * 0.4;
    }

    if (glowRef.current) {
      glowRef.current.scale.setScalar(1.8 + Math.sin(time * 2) * 0.05);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef} position={[2.5, 0, -1]}>
        {/* Inner glowing core */}
        <mesh ref={innerRef} scale={0.35}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial
            color={color2}
            emissive={color2}
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>

        {/* Main glass sphere */}
        <mesh scale={1.2}>
          <sphereGeometry args={[1, 128, 128]} />
          <MeshTransmissionMaterial
            backside
            samples={16}
            thickness={0.5}
            chromaticAberration={0.1}
            anisotropy={0.3}
            distortion={0.2}
            distortionScale={0.2}
            temporalDistortion={0.1}
            transmission={0.95}
            roughness={0.05}
            ior={1.5}
            color={color1}
          />
        </mesh>

        {/* Outer fresnel glow */}
        <mesh ref={glowRef} scale={1.8}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshBasicMaterial
            color={color2}
            transparent
            opacity={0.08}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Soft ambient glow */}
        <mesh scale={2.2}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial
            color={color1}
            transparent
            opacity={0.04}
            side={THREE.BackSide}
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
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime * speed;
    const currentAngle = angle + time;
    meshRef.current.position.x = Math.cos(currentAngle) * radius;
    meshRef.current.position.z = Math.sin(currentAngle) * radius;
    meshRef.current.position.y = Math.sin(time * 2 + index) * 0.4;

    if (glowRef.current) {
      glowRef.current.position.copy(meshRef.current.position);
    }
  });

  return (
    <>
      <Trail
        width={0.3}
        length={8}
        color={color}
        attenuation={(t) => t * t * t}
      >
        <mesh ref={meshRef}>
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive={color}
            emissiveIntensity={3}
            toneMapped={false}
          />
        </mesh>
      </Trail>
      {/* Soft glow around orb */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[size * 3, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
        />
      </mesh>
    </>
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
          <bufferAttribute attach="attributes-position" args={[ring1Positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.05} color={color1} transparent opacity={0.9} sizeAttenuation blending={THREE.AdditiveBlending} />
      </points>
      <points ref={ring2Ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[ring2Positions, 3]} />
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

// Brand colors
const LIGHT_BLUE = "#D7EFFF";
const SAGE_GREEN = "#AEB8A0";
const DARK_BURGUNDY = "#351E28";
const LIME_YELLOW = "#E9F056";
const CORAL_ORANGE = "#FF5C34";

// Helper to get secondary color for a primary color
function getSecondaryColor(color: string): string {
  if (color === LIGHT_BLUE) return SAGE_GREEN;
  if (color === SAGE_GREEN) return LIGHT_BLUE;
  if (color === LIME_YELLOW) return CORAL_ORANGE;
  if (color === CORAL_ORANGE) return LIME_YELLOW;
  return SAGE_GREEN;
}

// 3D Scene
function ModalScene({ color }: { color: string }) {
  const colors = useMemo(() => {
    return { primary: color, secondary: getSecondaryColor(color) };
  }, [color]);

  return (
    <>
      <color attach="background" args={[DARK_BURGUNDY]} />
      <fog attach="fog" args={[DARK_BURGUNDY, 6, 20]} />

      {/* Environment for reflections */}
      <Environment preset="night" />

      {/* Subtle ambient */}
      <ambientLight intensity={0.15} />

      {/* Key lights */}
      <pointLight position={[5, 5, 5]} intensity={2} color={colors.primary} distance={25} />
      <pointLight position={[-5, -3, 5]} intensity={1.5} color={colors.secondary} distance={20} />
      <pointLight position={[0, 3, 8]} intensity={0.8} color={LIGHT_BLUE} distance={15} />

      {/* Rim light */}
      <pointLight position={[3, 0, -5]} intensity={1} color={colors.secondary} distance={15} />

      <InteractiveCamera />
      <ProjectSphere color1={colors.primary} color2={colors.secondary} />
      <OrbitingOrbs color1={colors.primary} color2={colors.secondary} />
      <OrbitalRings color1={colors.primary} color2={colors.secondary} />
      <ParticleField color={colors.secondary} />

      <Sparkles count={100} scale={12} size={1.5} speed={0.3} opacity={0.5} color={colors.primary} />
      <Sparkles count={60} scale={14} size={1} speed={0.2} opacity={0.3} color={colors.secondary} />
    </>
  );
}

interface ProjectModal3DProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal3D({ project, onClose }: ProjectModal3DProps) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [project, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {project && (
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
              <ModalScene color={project.color} />
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
                {/* Category badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-4"
                >
                  <span
                    className="inline-block px-4 py-1.5 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: project.color }}
                  >
                    {project.category}
                  </span>
                </motion.div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.6 }}
                  className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
                >
                  {project.title}
                </motion.h1>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="text-xl text-white/70 mb-8 leading-relaxed max-w-2xl"
                >
                  {project.description}
                </motion.p>

                {/* Tags */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap gap-2 mb-12"
                >
                  {project.tags.map((tag, i) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.35 + i * 0.05 }}
                      className="px-4 py-2 rounded-full text-sm border border-white/20 text-white/60 backdrop-blur-sm"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </motion.div>

                {/* Cinematic Video Embed */}
                {project.videoUrl && (
                  <CinematicVideoPlayer
                    videoUrl={project.videoUrl}
                    title={project.title}
                    color={project.color}
                  />
                )}

                {/* Challenge & Solution */}
                {(project.challenge || project.solution) && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid md:grid-cols-2 gap-6 mb-12"
                  >
                    {project.challenge && (
                      <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-3 h-3 rounded-full bg-[#FF5C34]" />
                          <h3 className="text-lg font-semibold text-white">The Challenge</h3>
                        </div>
                        <p className="text-white/50 leading-relaxed">{project.challenge}</p>
                      </div>
                    )}
                    {project.solution && (
                      <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-3 h-3 rounded-full bg-[#AEB8A0]" />
                          <h3 className="text-lg font-semibold text-white">Our Solution</h3>
                        </div>
                        <p className="text-white/50 leading-relaxed">{project.solution}</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Process Steps */}
                {project.processSteps && project.processSteps.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="mb-12"
                  >
                    <h3 className="text-lg font-semibold text-white mb-6">Our Process</h3>
                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10" />
                      <div className="space-y-4">
                        {project.processSteps.map((step, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            className="relative pl-12"
                          >
                            {/* Timeline dot */}
                            <div
                              className="absolute left-2 top-1.5 w-4 h-4 rounded-full border-2 border-white/20"
                              style={{ backgroundColor: project.color }}
                            />
                            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
                              <span className="text-xs text-white/30 uppercase tracking-wider">Phase {i + 1}</span>
                              <h4 className="text-white font-medium mt-1">{step.phase}</h4>
                              <p className="text-white/50 text-sm mt-1">{step.description}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Results */}
                {project.results && project.results.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mb-12"
                  >
                    <h3 className="text-lg font-semibold text-white mb-6">Results</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {project.results.map((result, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: 0.55 + i * 0.1 }}
                          className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center group hover:bg-white/10 transition-colors"
                        >
                          <div
                            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity blur-xl"
                            style={{ backgroundColor: project.color }}
                          />
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.7 + i * 0.1, type: "spring", stiffness: 200 }}
                            className="relative text-3xl md:text-4xl font-bold block mb-2"
                            style={{ color: project.color }}
                          >
                            {result.metric}
                          </motion.span>
                          <span className="relative text-white/40 text-sm">{result.label}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Deliverables & Tools */}
                {(project.deliverables || project.tools) && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                    className="grid md:grid-cols-2 gap-6 mb-12"
                  >
                    {project.deliverables && project.deliverables.length > 0 && (
                      <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-4">Deliverables</h3>
                        <ul className="space-y-2">
                          {project.deliverables.map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-white/50 text-sm">
                              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: project.color }} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {project.tools && project.tools.length > 0 && (
                      <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-4">Tools & Tech</h3>
                        <div className="flex flex-wrap gap-2">
                          {project.tools.map((tool, i) => (
                            <span
                              key={i}
                              className="px-3 py-1.5 rounded-full text-xs bg-white/5 border border-white/10 text-white/50"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Testimonial */}
                {project.testimonial && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="relative p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 mb-12"
                  >
                    <div
                      className="absolute top-0 left-0 w-1 h-full rounded-l-2xl"
                      style={{ backgroundColor: project.color }}
                    />
                    <svg className="w-10 h-10 text-white/10 mb-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <p className="text-white/70 text-lg italic leading-relaxed mb-6">
                      {project.testimonial.quote}
                    </p>
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                      <div>
                        <p className="text-white font-medium">{project.testimonial.author}</p>
                        <p className="text-white/40 text-sm">{project.testimonial.role}</p>
                      </div>
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
                    className="flex-1 py-4 px-8 rounded-full text-white font-semibold text-center hover:shadow-lg hover:shadow-[#FF5C34]/25 transition-shadow"
                    style={{ backgroundColor: project.color }}
                    strength={0.2}
                  >
                    Start a Similar Project
                  </MagneticButton>
                  <MagneticButton
                    onClick={onClose}
                    className="flex-1 py-4 px-8 border border-white/20 rounded-full text-white font-medium text-center hover:bg-white/10 backdrop-blur-sm transition-all"
                    strength={0.2}
                  >
                    Back to Projects
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
