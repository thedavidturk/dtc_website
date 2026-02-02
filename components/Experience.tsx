"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  MeshDistortMaterial,
  Sphere,
  Float,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { useStore } from "@/store/useStore";

// Colors
const DEEP_SPACE = "#0a0908";
const PERSIMMON = "#FF7F6B";
const NEO_MINT = "#A8E6CF";
const TEAL = "#2F6364";
const CREAM = "#F9F5F0";

// The main morphing blob - using MeshDistortMaterial for stable distortion
function MorphingBlob() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);
  const scroll = useStore((state) => state.scroll);
  const mousePosition = useStore((state) => state.mousePosition);
  const hoveredCard = useStore((state) => state.hoveredCard);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    // Rotation
    meshRef.current.rotation.y = time * 0.15;
    meshRef.current.rotation.x = Math.sin(time * 0.1) * 0.2;

    // Mouse influence on position
    const mouseInfluence = 1 - scroll * 0.8;
    meshRef.current.position.x = mousePosition.x * 0.5 * mouseInfluence;
    meshRef.current.position.y = mousePosition.y * 0.4 * mouseInfluence;

    // Breathing scale
    const breathe = 1 + Math.sin(time * 0.5) * 0.05;
    meshRef.current.scale.setScalar(breathe);

    // Update material color based on hover
    if (materialRef.current) {
      const targetColor = new THREE.Color(hoveredCard.color || PERSIMMON);
      materialRef.current.color.lerp(targetColor, 0.05);
    }
  });

  // Distortion amount varies slightly with scroll
  const distort = 0.4 + scroll * 0.1;

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <MeshDistortMaterial
          ref={materialRef}
          color={hoveredCard.color || PERSIMMON}
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0}
          metalness={0.1}
          roughness={0.1}
          distort={distort}
          speed={2}
        />
      </Sphere>
    </Float>
  );
}

// Glass-like inner blob
function InnerBlob() {
  const meshRef = useRef<THREE.Mesh>(null);
  const scroll = useStore((state) => state.scroll);
  const hoveredCard = useStore((state) => state.hoveredCard);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    meshRef.current.rotation.y = -time * 0.2;
    meshRef.current.rotation.z = Math.sin(time * 0.15) * 0.3;

    // Pulse
    const pulse = 0.6 + Math.sin(time * 0.8) * 0.05;
    meshRef.current.scale.setScalar(pulse);
  });

  return (
    <Sphere ref={meshRef} args={[0.6, 32, 32]}>
      <MeshDistortMaterial
        color={hoveredCard.color || NEO_MINT}
        envMapIntensity={2}
        clearcoat={1}
        clearcoatRoughness={0.1}
        metalness={0}
        roughness={0}
        transparent
        opacity={0.6}
        distort={0.3}
        speed={3}
      />
    </Sphere>
  );
}

// Secondary smaller blobs that orbit around
function OrbitingBlobs() {
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useStore((state) => state.scroll);

  const blobs = useMemo(() => [
    { distance: 2.2, size: 0.18, speed: 0.4, offset: 0, color: NEO_MINT, yOffset: 0 },
    { distance: 2.6, size: 0.12, speed: -0.3, offset: Math.PI * 0.7, color: TEAL, yOffset: 0.3 },
    { distance: 2.4, size: 0.15, speed: 0.35, offset: Math.PI * 1.4, color: CREAM, yOffset: -0.2 },
  ], []);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  // Fade out orbiting blobs as user scrolls
  const opacity = Math.max(0.2, 1 - scroll * 0.8);

  return (
    <group ref={groupRef}>
      {blobs.map((blob, i) => (
        <OrbitingBlob key={i} {...blob} index={i} opacity={opacity} />
      ))}
    </group>
  );
}

function OrbitingBlob({
  distance,
  size,
  speed,
  offset,
  color,
  index,
  yOffset,
  opacity
}: {
  distance: number;
  size: number;
  speed: number;
  offset: number;
  color: string;
  index: number;
  yOffset: number;
  opacity: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    // Orbit around center
    const angle = time * speed + offset;
    meshRef.current.position.x = Math.cos(angle) * distance;
    meshRef.current.position.z = Math.sin(angle) * distance;
    meshRef.current.position.y = yOffset + Math.sin(time * 0.5 + index) * 0.3;

    // Gentle rotation
    meshRef.current.rotation.y = time * 0.5;
    meshRef.current.rotation.x = time * 0.3;
  });

  return (
    <Sphere ref={meshRef} args={[size, 24, 24]}>
      <MeshDistortMaterial
        color={color}
        envMapIntensity={1.5}
        clearcoat={1}
        clearcoatRoughness={0.2}
        metalness={0}
        roughness={0.2}
        transparent
        opacity={opacity}
        distort={0.2}
        speed={4}
      />
    </Sphere>
  );
}

// Ambient particles
function AmbientParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const scroll = useStore((state) => state.scroll);

  const count = 100;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const radius = 4 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }

    return pos;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.elapsedTime;

    pointsRef.current.rotation.y = time * 0.02;
    pointsRef.current.rotation.x = time * 0.01;

    // Fade based on scroll
    (pointsRef.current.material as THREE.PointsMaterial).opacity = 0.3 + scroll * 0.4;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color={CREAM}
        transparent
        opacity={0.3}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Outer glow ring
function GlowRing() {
  const ringRef = useRef<THREE.Mesh>(null);
  const scroll = useStore((state) => state.scroll);
  const hoveredCard = useStore((state) => state.hoveredCard);

  useFrame((state) => {
    if (!ringRef.current) return;
    const time = state.clock.elapsedTime;

    ringRef.current.rotation.x = Math.PI / 2 + Math.sin(time * 0.2) * 0.1;
    ringRef.current.rotation.z = time * 0.1;

    // Scale based on scroll
    const scale = 1.8 + scroll * 0.3;
    ringRef.current.scale.setScalar(scale);
  });

  const ringColor = hoveredCard.color || NEO_MINT;

  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[1, 0.01, 16, 100]} />
      <meshBasicMaterial
        color={ringColor}
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// Camera controller
function CameraController() {
  const { camera } = useThree();
  const scroll = useStore((state) => state.scroll);
  const mousePosition = useStore((state) => state.mousePosition);
  const isReturning = useStore((state) => state.isReturning);
  const returnProgress = useStore((state) => state.returnProgress);
  const targetPos = useRef({ x: 0, y: 0, z: 4 });

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    let effectiveScroll = scroll;
    let interpolationSpeed = 0.02;

    if (isReturning) {
      effectiveScroll = 1 - returnProgress;
      interpolationSpeed = 0.05;
    }

    // Camera journey - zoom out as user scrolls
    const scrollEased = Math.pow(effectiveScroll, 0.5);
    const targetZ = 4 + scrollEased * 5;

    // Mouse parallax (reduces as you scroll)
    const mouseInfluence = 1 - effectiveScroll * 0.7;
    const targetX = mousePosition.x * 0.6 * mouseInfluence + Math.sin(time * 0.1) * 0.08;
    const targetY = mousePosition.y * 0.4 * mouseInfluence + Math.cos(time * 0.08) * 0.05;

    // Smooth interpolation
    targetPos.current.x += (targetX - targetPos.current.x) * 0.03;
    targetPos.current.y += (targetY - targetPos.current.y) * 0.03;
    targetPos.current.z += (targetZ - targetPos.current.z) * interpolationSpeed;

    camera.position.set(targetPos.current.x, targetPos.current.y, targetPos.current.z);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Post-processing effects
function Effects() {
  return (
    <EffectComposer>
      <Bloom
        intensity={0.6}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        mipmapBlur
        radius={0.5}
      />
      <Vignette offset={0.3} darkness={0.5} />
    </EffectComposer>
  );
}

// Main scene
function Scene() {
  return (
    <>
      <color attach="background" args={[DEEP_SPACE]} />
      <fog attach="fog" args={[DEEP_SPACE, 6, 20]} />

      {/* Environment for PBR reflections */}
      <Environment preset="night" />

      {/* Lighting */}
      <ambientLight intensity={0.15} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.4}
        color="#ffffff"
      />
      <pointLight
        position={[3, 2, 4]}
        intensity={1.5}
        color={PERSIMMON}
        distance={12}
      />
      <pointLight
        position={[-3, -1, 3]}
        intensity={0.8}
        color={NEO_MINT}
        distance={10}
      />
      <pointLight
        position={[0, -3, 2]}
        intensity={0.4}
        color={TEAL}
        distance={8}
      />

      <CameraController />

      {/* The hero blob */}
      <MorphingBlob />

      {/* Inner glass blob */}
      <InnerBlob />

      {/* Glow ring */}
      <GlowRing />

      {/* Orbiting smaller blobs */}
      <OrbitingBlobs />

      {/* Background particles */}
      <AmbientParticles />

      <Effects />
    </>
  );
}

export default function Experience() {
  const setLoaded = useStore((state) => state.setLoaded);

  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 50 }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
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
        zIndex: 5,
        backgroundColor: DEEP_SPACE,
      }}
    >
      <Scene />
    </Canvas>
  );
}
