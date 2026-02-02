"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sphere } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { useStore } from "@/store/useStore";

// Colors
const COCOA_BROWN = "#4A3B33";
const DEEP_SPACE = "#1a1412";
const PERSIMMON = "#FF7F6B";
const NEO_MINT = "#A8E6CF";
const TEAL = "#2F6364";
const CREAM = "#F9F5F0";

// The Creative Spark - the central hero element
// Represents the seed of an idea that grows into something bigger
function CreativeSpark() {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const scroll = useStore((state) => state.scroll);
  const mousePosition = useStore((state) => state.mousePosition);
  const hoveredCard = useStore((state) => state.hoveredCard);

  useFrame((state) => {
    if (!groupRef.current || !coreRef.current) return;
    const time = state.clock.elapsedTime;

    // Gentle breathing animation
    const breathe = 1 + Math.sin(time * 0.8) * 0.05;
    coreRef.current.scale.setScalar(breathe);

    // Subtle mouse follow (less when scrolled)
    const mouseInfluence = 1 - scroll * 0.8;
    groupRef.current.position.x = mousePosition.x * 0.3 * mouseInfluence;
    groupRef.current.position.y = mousePosition.y * 0.2 * mouseInfluence;

    // Core rotation
    coreRef.current.rotation.y = time * 0.1;
    coreRef.current.rotation.x = Math.sin(time * 0.15) * 0.1;

    // Ring rotation
    if (ringRef.current) {
      ringRef.current.rotation.z = time * 0.2;
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(time * 0.1) * 0.1;
    }

    // Glow pulse
    if (glowRef.current) {
      const glowPulse = 1.5 + Math.sin(time * 1.5) * 0.2;
      glowRef.current.scale.setScalar(glowPulse);
    }
  });

  // Color responds to card hover
  const sparkColor = hoveredCard.color || PERSIMMON;

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
      <group ref={groupRef}>
        {/* The core spark */}
        <Sphere ref={coreRef} args={[0.5, 64, 64]}>
          <meshStandardMaterial
            color={sparkColor}
            emissive={sparkColor}
            emissiveIntensity={3}
            toneMapped={false}
          />
        </Sphere>

        {/* Inner glow */}
        <Sphere ref={glowRef} args={[0.8, 32, 32]}>
          <meshBasicMaterial
            color={sparkColor}
            transparent
            opacity={0.15}
            side={THREE.BackSide}
          />
        </Sphere>

        {/* Subtle orbit ring */}
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.2, 0.008, 16, 100]} />
          <meshBasicMaterial
            color={NEO_MINT}
            transparent
            opacity={0.4}
          />
        </mesh>

        {/* Outer glow layers */}
        <Sphere args={[1.5, 32, 32]}>
          <meshBasicMaterial
            color={sparkColor}
            transparent
            opacity={0.05}
            side={THREE.BackSide}
          />
        </Sphere>
      </group>
    </Float>
  );
}

// Distant stars - simple, subtle background
function Stars() {
  const starsRef = useRef<THREE.Points>(null);
  const scroll = useStore((state) => state.scroll);

  const starCount = 200;

  const positions = useMemo(() => {
    const pos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      // Spread stars in a sphere around the scene
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 15 + Math.random() * 25;

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi) - 20;
    }
    return pos;
  }, []);

  const sizes = useMemo(() => {
    const s = new Float32Array(starCount);
    for (let i = 0; i < starCount; i++) {
      s[i] = 0.5 + Math.random() * 1.5;
    }
    return s;
  }, []);

  useFrame((state) => {
    if (!starsRef.current) return;
    const time = state.clock.elapsedTime;

    // Very slow rotation
    starsRef.current.rotation.y = time * 0.005;
    starsRef.current.rotation.x = time * 0.002;

    // Stars become more visible as you scroll (zoom out to see universe)
    const starOpacity = 0.3 + scroll * 0.5;
    (starsRef.current.material as THREE.PointsMaterial).opacity = starOpacity;
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color={CREAM}
        transparent
        opacity={0.3}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// A few distant "planets" or larger creative nodes
function DistantNodes() {
  const scroll = useStore((state) => state.scroll);

  const nodes = useMemo(() => [
    { position: [-8, 4, -15] as [number, number, number], size: 0.3, color: NEO_MINT },
    { position: [10, -3, -20] as [number, number, number], size: 0.25, color: TEAL },
    { position: [-12, -5, -25] as [number, number, number], size: 0.4, color: PERSIMMON },
    { position: [6, 6, -18] as [number, number, number], size: 0.2, color: CREAM },
  ], []);

  return (
    <group>
      {nodes.map((node, i) => (
        <DistantNode key={i} {...node} index={i} scroll={scroll} />
      ))}
    </group>
  );
}

function DistantNode({ position, size, color, index, scroll }: {
  position: [number, number, number];
  size: number;
  color: string;
  index: number;
  scroll: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    // Gentle float
    meshRef.current.position.y = position[1] + Math.sin(time * 0.3 + index) * 0.3;

    // Fade in as you scroll (discover more of the universe)
    const opacity = Math.min(1, scroll * 2);
    (meshRef.current.material as THREE.MeshBasicMaterial).opacity = opacity * 0.6;
  });

  return (
    <Sphere ref={meshRef} args={[size, 16, 16]} position={position}>
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0}
      />
    </Sphere>
  );
}

// Subtle connecting lines between nodes (representing creative connections)
function ConnectionLines() {
  const lineRef = useRef<THREE.Line>(null);
  const scroll = useStore((state) => state.scroll);

  const geometry = useMemo(() => {
    // Create a few subtle connection paths
    const pts = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-4, 2, -8),
      new THREE.Vector3(-8, 4, -15),
    ];
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  const material = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: NEO_MINT,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useFrame(() => {
    if (!lineRef.current) return;
    // Lines fade in as you scroll
    const opacity = Math.min(0.2, scroll * 0.4);
    (lineRef.current.material as THREE.LineBasicMaterial).opacity = opacity;
  });

  const line = useMemo(() => new THREE.Line(geometry, material), [geometry, material]);

  return <primitive ref={lineRef} object={line} />;
}

// Camera controller - the zoom out journey
function CameraController() {
  const { camera } = useThree();
  const scroll = useStore((state) => state.scroll);
  const mousePosition = useStore((state) => state.mousePosition);
  const isReturning = useStore((state) => state.isReturning);
  const returnProgress = useStore((state) => state.returnProgress);
  const targetPos = useRef({ x: 0, y: 0, z: 3 });

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    let effectiveScroll = scroll;
    let interpolationSpeed = 0.015;

    if (isReturning) {
      effectiveScroll = 1 - returnProgress;
      interpolationSpeed = 0.05;
    }

    // THE JOURNEY: Start close (z=3), zoom out to (z=12)
    // This creates the "discovering the universe" effect
    const scrollEased = Math.pow(effectiveScroll, 0.6);
    const targetZ = 3 + scrollEased * 9;

    // Subtle mouse parallax (less as you zoom out)
    const mouseInfluence = 1 - effectiveScroll * 0.7;
    const targetX = mousePosition.x * 0.5 * mouseInfluence + Math.sin(time * 0.1) * 0.05;
    const targetY = mousePosition.y * 0.3 * mouseInfluence + Math.cos(time * 0.08) * 0.03;

    // Smooth interpolation
    targetPos.current.x += (targetX - targetPos.current.x) * 0.02;
    targetPos.current.y += (targetY - targetPos.current.y) * 0.02;
    targetPos.current.z += (targetZ - targetPos.current.z) * interpolationSpeed;

    camera.position.set(targetPos.current.x, targetPos.current.y, targetPos.current.z);
    camera.lookAt(0, 0, -5);
  });

  return null;
}

// Minimal post-processing
function Effects() {
  return (
    <EffectComposer>
      <Bloom
        intensity={1.2}
        luminanceThreshold={0.3}
        luminanceSmoothing={0.9}
        mipmapBlur
        radius={0.4}
      />
      <Vignette offset={0.35} darkness={0.6} />
    </EffectComposer>
  );
}

// Main scene
function Scene() {
  return (
    <>
      <color attach="background" args={[DEEP_SPACE]} />
      <fog attach="fog" args={[DEEP_SPACE, 10, 40]} />

      {/* Minimal ambient light */}
      <ambientLight intensity={0.05} />

      {/* Key light on the spark */}
      <pointLight position={[3, 3, 5]} intensity={1} color={PERSIMMON} distance={20} />
      <pointLight position={[-3, -2, 3]} intensity={0.5} color={NEO_MINT} distance={15} />

      <CameraController />

      {/* The hero element - the creative spark */}
      <CreativeSpark />

      {/* Background elements - subtle, discovered as you scroll */}
      <Stars />
      <DistantNodes />
      <ConnectionLines />

      <Effects />
    </>
  );
}

export default function Experience() {
  const setLoaded = useStore((state) => state.setLoaded);

  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 50 }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
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
        backgroundColor: DEEP_SPACE,
      }}
    >
      <Scene />
    </Canvas>
  );
}
