"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, Trail } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { useStore } from "@/store/useStore";

// Colors - website brand palette
const LIGHT_BLUE = "#D7EFFF";
const SAGE_GREEN = "#AEB8A0";
const DARK_BURGUNDY = "#351E28";
const LIME_YELLOW = "#E9F056";
const CORAL_ORANGE = "#FF5C34";

// Floating particles that react to mouse and scroll
function ParticleField() {
  const points = useRef<THREE.Points>(null);
  const mousePosition = useStore((state) => state.mousePosition);
  const scroll = useStore((state) => state.scroll);

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

    // Particles spread out as user scrolls
    const scrollScale = 1 + scroll * 2;
    points.current.scale.setScalar(scrollScale);

    // Rotation speeds up slightly with scroll
    const rotationSpeed = 1 + scroll * 0.5;
    points.current.rotation.y = time * 0.05 * rotationSpeed + mousePosition.x * 0.5;
    points.current.rotation.x = Math.sin(time * 0.03) * 0.1 + mousePosition.y * 0.3;

    // Particles drift upward as you scroll
    points.current.position.y = scroll * 2;
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
        color={LIME_YELLOW}
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Premium glass sphere
function GlassSphere() {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const scroll = useStore((state) => state.scroll);
  const mousePosition = useStore((state) => state.mousePosition);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;

    // Smooth mouse following - reduced influence as user scrolls
    const mouseInfluence = 1 - scroll * 0.7;
    const targetX = mousePosition.x * 0.6 * mouseInfluence;
    const targetY = mousePosition.y * 0.4 * mouseInfluence;

    groupRef.current.rotation.x += (targetY * 0.3 - groupRef.current.rotation.x) * 0.02;
    groupRef.current.rotation.y += (targetX * 0.5 + time * 0.1 - groupRef.current.rotation.y) * 0.02;

    // Sphere drifts down and back as user scrolls (creates depth)
    const scrollPosX = targetX * 0.3 + Math.sin(scroll * Math.PI) * 0.5;
    const scrollPosY = Math.sin(time * 0.5) * 0.15 + targetY * 0.2 - scroll * 1.5;
    const scrollPosZ = -scroll * 2; // Push back into scene

    groupRef.current.position.x += (scrollPosX - groupRef.current.position.x) * 0.03;
    groupRef.current.position.y += (scrollPosY - groupRef.current.position.y) * 0.03;
    groupRef.current.position.z += (scrollPosZ - groupRef.current.position.z) * 0.02;

    // Scale grows slightly as camera zooms out to maintain visual presence
    const baseScale = 2.0 + scroll * 0.8;
    groupRef.current.scale.setScalar(baseScale);

    if (innerRef.current) {
      // Core spins faster as you scroll
      const spinSpeed = 1 + scroll * 2;
      innerRef.current.rotation.x = time * 0.3 * spinSpeed;
      innerRef.current.rotation.y = time * 0.4 * spinSpeed;
    }

    if (glowRef.current) {
      // Glow pulses more intensely as you scroll
      const pulseIntensity = 0.05 + scroll * 0.1;
      glowRef.current.scale.setScalar(1.8 + Math.sin(time * 2) * pulseIntensity);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef}>
        {/* Inner glowing core - coral orange */}
        <mesh ref={innerRef} scale={0.35}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial
            color={CORAL_ORANGE}
            emissive={CORAL_ORANGE}
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>

        {/* Main glass sphere - light blue tint */}
        <mesh scale={1.2}>
          <sphereGeometry args={[1, 128, 128]} />
          <meshPhysicalMaterial
            color={LIGHT_BLUE}
            roughness={0.05}
            metalness={0.1}
            transmission={0.95}
            thickness={0.5}
            ior={1.5}
            transparent
          />
        </mesh>

        {/* Outer fresnel glow - lime yellow */}
        <mesh ref={glowRef} scale={1.8}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshBasicMaterial
            color={LIME_YELLOW}
            transparent
            opacity={0.08}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Soft ambient glow - sage green */}
        <mesh scale={2.2}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial
            color={SAGE_GREEN}
            transparent
            opacity={0.05}
            side={THREE.BackSide}
          />
        </mesh>
      </group>
    </Float>
  );
}

// Orbiting light orbs with trails - using full color palette
function OrbitingOrbs() {
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useStore((state) => state.scroll);
  const mousePosition = useStore((state) => state.mousePosition);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;

    // Orbits expand as user scrolls
    const scrollScale = 1 + scroll * 1.8;
    groupRef.current.scale.setScalar(scrollScale);

    // Rotation speeds up with scroll
    const rotationSpeed = 1 + scroll * 0.5;
    groupRef.current.rotation.y = time * 0.3 * rotationSpeed + mousePosition.x * 0.5;
    groupRef.current.rotation.x = Math.sin(time * 0.2) * 0.3 + mousePosition.y * 0.3 + scroll * 0.5;
  });

  const orbs = [
    { angle: 0, radius: 2.5, speed: 1, color: CORAL_ORANGE, size: 0.08 },
    { angle: Math.PI * 0.5, radius: 2.8, speed: 0.8, color: LIME_YELLOW, size: 0.07 },
    { angle: Math.PI, radius: 2.3, speed: 1.2, color: LIGHT_BLUE, size: 0.06 },
    { angle: Math.PI * 1.5, radius: 2.6, speed: 0.9, color: SAGE_GREEN, size: 0.05 },
  ];

  return (
    <group ref={groupRef}>
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

// Multiple orbital rings with brand colors
function OrbitalRings() {
  const ring1Ref = useRef<THREE.Points>(null);
  const ring2Ref = useRef<THREE.Points>(null);
  const ring3Ref = useRef<THREE.Points>(null);
  const mousePosition = useStore((state) => state.mousePosition);
  const scroll = useStore((state) => state.scroll);

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
  const ring3Positions = useMemo(() => createRingPositions(80, 3.8), []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    // Rings expand outward as user scrolls
    const scrollScale = 1 + scroll * 1.5;

    if (ring1Ref.current) {
      ring1Ref.current.rotation.y = time * 0.2 + mousePosition.x * 0.3;
      ring1Ref.current.rotation.x = 0.5 + mousePosition.y * 0.2 + scroll * 0.5;
      ring1Ref.current.scale.setScalar(scrollScale);
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -time * 0.15 + mousePosition.x * 0.2;
      ring2Ref.current.rotation.z = time * 0.1 + scroll * 0.3;
      ring2Ref.current.scale.setScalar(scrollScale * 1.1);
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = time * 0.1 + mousePosition.x * 0.15;
      ring3Ref.current.rotation.x = -0.3 + mousePosition.y * 0.15 + scroll * 0.4;
      ring3Ref.current.scale.setScalar(scrollScale * 1.2);
    }
  });

  return (
    <group>
      {/* Inner ring - coral orange */}
      <points ref={ring1Ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[ring1Positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.05} color={CORAL_ORANGE} transparent opacity={0.9} sizeAttenuation blending={THREE.AdditiveBlending} />
      </points>
      {/* Middle ring - light blue */}
      <points ref={ring2Ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[ring2Positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.04} color={LIGHT_BLUE} transparent opacity={0.7} sizeAttenuation blending={THREE.AdditiveBlending} />
      </points>
      {/* Outer ring - sage green */}
      <points ref={ring3Ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[ring3Positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.03} color={SAGE_GREEN} transparent opacity={0.5} sizeAttenuation blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
}

// Camera controller with dramatic scroll zoom and return animation
function CameraController() {
  const { camera } = useThree();
  const scroll = useStore((state) => state.scroll);
  const mousePosition = useStore((state) => state.mousePosition);
  const isReturning = useStore((state) => state.isReturning);
  const returnProgress = useStore((state) => state.returnProgress);
  const introProgress = useStore((state) => state.introProgress);
  const isIntroComplete = useStore((state) => state.isIntroComplete);
  const targetPos = useRef({ x: 0, y: 0, z: 0.8 }); // Start very close
  const initialRotation = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // During intro animation - dramatic pull-back from inside the sphere
    if (!isIntroComplete) {
      // Intro: camera starts at z=0.8 (inside/very close) and pulls back to z=3
      const introEased = 1 - Math.pow(1 - introProgress, 3); // Ease out cubic
      const introZ = 0.8 + introEased * 2.2; // 0.8 -> 3.0

      // Slight spiral during intro
      const spiralAngle = introProgress * Math.PI * 0.5;
      const introX = Math.sin(spiralAngle) * 0.3 * (1 - introProgress);
      const introY = Math.cos(spiralAngle) * 0.2 * (1 - introProgress);

      targetPos.current.x = introX;
      targetPos.current.y = introY;
      targetPos.current.z = introZ;

      camera.position.set(
        targetPos.current.x,
        targetPos.current.y,
        targetPos.current.z
      );

      // Slight rotation during intro
      camera.lookAt(0, 0, 0);
      return;
    }

    // Normal behavior after intro completes
    let effectiveScroll = scroll;
    let interpolationSpeed = 0.025;

    if (isReturning) {
      effectiveScroll = 1 - returnProgress;
      interpolationSpeed = 0.08;

      const spiralIntensity = Math.sin(returnProgress * Math.PI) * 0.5;
      targetPos.current.x += Math.sin(time * 3) * spiralIntensity * 0.1;
    }

    // Dramatic zoom: starts close (z=3), zooms out far (z=14) as you scroll
    const scrollEased = Math.pow(effectiveScroll, 0.8);
    const targetZ = 3 + scrollEased * 11;

    // Vertical movement: camera rises slightly as you scroll
    const targetY = mousePosition.y * 0.3 + effectiveScroll * 2;

    // Horizontal follows mouse more at close range, less when zoomed out
    const mouseInfluence = 1 - effectiveScroll * 0.5;
    const targetX = mousePosition.x * 0.5 * mouseInfluence;

    // Smooth interpolation
    targetPos.current.x += (targetX - targetPos.current.x) * 0.04;
    targetPos.current.y += (targetY - targetPos.current.y) * 0.03;
    targetPos.current.z += (targetZ - targetPos.current.z) * interpolationSpeed;

    camera.position.set(
      targetPos.current.x,
      targetPos.current.y,
      targetPos.current.z
    );

    // Look slightly above center as we zoom out
    camera.lookAt(0, effectiveScroll * 0.5, 0);
  });

  return null;
}

// Post-processing effects
function Effects() {
  return (
    <EffectComposer>
      <Bloom
        intensity={1.2}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <Vignette offset={0.4} darkness={0.8} />
    </EffectComposer>
  );
}

// Main scene with brand colors
function Scene() {
  return (
    <>
      <color attach="background" args={[DARK_BURGUNDY]} />
      <fog attach="fog" args={[DARK_BURGUNDY, 8, 25]} />

      {/* Subtle ambient */}
      <ambientLight intensity={0.1} />

      {/* Key lights using brand colors */}
      <pointLight position={[5, 5, 5]} intensity={1.5} color={CORAL_ORANGE} distance={25} />
      <pointLight position={[-5, -3, 5]} intensity={1.2} color={LIGHT_BLUE} distance={20} />
      <pointLight position={[0, 5, -5]} intensity={1} color={LIME_YELLOW} distance={20} />
      <pointLight position={[-3, 0, 8]} intensity={0.8} color={SAGE_GREEN} distance={15} />

      {/* Rim light */}
      <pointLight position={[3, 0, -5]} intensity={0.6} color={LIGHT_BLUE} distance={15} />

      <CameraController />
      <GlassSphere />
      <OrbitingOrbs />
      <OrbitalRings />
      <ParticleField />

      {/* Sparkles with brand colors */}
      <Sparkles count={80} scale={12} size={1.5} speed={0.3} opacity={0.5} color={LIME_YELLOW} />
      <Sparkles count={60} scale={14} size={1.2} speed={0.25} opacity={0.4} color={CORAL_ORANGE} />
      <Sparkles count={50} scale={16} size={1} speed={0.2} opacity={0.3} color={LIGHT_BLUE} />

      <Effects />
    </>
  );
}

export default function Experience() {
  const setLoaded = useStore((state) => state.setLoaded);

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        preserveDrawingBuffer: true,
      }}
      onCreated={() => {
        setLoaded(true);
      }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        backgroundColor: DARK_BURGUNDY,
      }}
    >
      <Scene />
    </Canvas>
  );
}
