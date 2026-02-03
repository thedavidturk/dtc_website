"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, Float, Environment } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { useStore } from "@/store/useStore";

const DEEP_SPACE = "#0a0908";
const PERSIMMON = "#FF7F6B";
const NEO_MINT = "#A8E6CF";
const TEAL = "#2F6364";
const CREAM = "#F9F5F0";

// Main morphing blob - Blobmixer inspired
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

    // Mouse follow
    const mouseInfluence = 1 - scroll * 0.7;
    meshRef.current.position.x = mousePosition.x * 0.5 * mouseInfluence;
    meshRef.current.position.y = mousePosition.y * 0.4 * mouseInfluence;

    // Breathing
    const breathe = 1 + Math.sin(time * 0.5) * 0.05;
    meshRef.current.scale.setScalar(breathe);

    // Color lerp on hover
    if (materialRef.current?.color) {
      const targetColor = new THREE.Color(hoveredCard.color || PERSIMMON);
      materialRef.current.color.lerp(targetColor, 0.05);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <MeshDistortMaterial
          ref={materialRef}
          color={PERSIMMON}
          emissive={PERSIMMON}
          emissiveIntensity={0.2}
          roughness={0.2}
          metalness={0.1}
          distort={0.4}
          speed={2}
        />
      </Sphere>
    </Float>
  );
}

// Inner glowing core
function InnerCore() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    meshRef.current.rotation.y = -time * 0.3;
    const pulse = 0.5 + Math.sin(time * 0.8) * 0.05;
    meshRef.current.scale.setScalar(pulse);
  });

  return (
    <Sphere ref={meshRef} args={[0.5, 32, 32]}>
      <meshBasicMaterial color={NEO_MINT} transparent opacity={0.6} />
    </Sphere>
  );
}

// Orbiting blobs
function OrbitingBlobs() {
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useStore((state) => state.scroll);

  const blobs = useMemo(() => [
    { distance: 2.2, size: 0.15, speed: 0.4, offset: 0, color: NEO_MINT },
    { distance: 2.5, size: 0.1, speed: -0.3, offset: Math.PI * 0.7, color: TEAL },
    { distance: 2.3, size: 0.12, speed: 0.35, offset: Math.PI * 1.4, color: CREAM },
  ], []);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <group ref={groupRef}>
      {blobs.map((blob, i) => (
        <OrbitBlob key={i} {...blob} index={i} scroll={scroll} />
      ))}
    </group>
  );
}

function OrbitBlob({ distance, size, speed, offset, color, index, scroll }: any) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    const angle = time * speed + offset;
    meshRef.current.position.x = Math.cos(angle) * distance;
    meshRef.current.position.z = Math.sin(angle) * distance;
    meshRef.current.position.y = Math.sin(time * 0.5 + index) * 0.3;
  });

  return (
    <Sphere ref={meshRef} args={[size, 16, 16]}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        transparent
        opacity={Math.max(0.4, 1 - scroll)}
      />
    </Sphere>
  );
}

// Particles
function Particles() {
  const pointsRef = useRef<THREE.Points>(null);
  const scroll = useStore((state) => state.scroll);

  const positions = useMemo(() => {
    const count = 80;
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
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
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
        opacity={0.3 + scroll * 0.3}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Camera
function CameraController() {
  const { camera } = useThree();
  const scroll = useStore((state) => state.scroll);
  const mousePosition = useStore((state) => state.mousePosition);
  const isReturning = useStore((state) => state.isReturning);
  const returnProgress = useStore((state) => state.returnProgress);
  const targetPos = useRef({ x: 0, y: 0, z: 5 });

  useFrame(() => {
    let effectiveScroll = isReturning ? 1 - returnProgress : scroll;
    const targetZ = 5 + effectiveScroll * 4;
    const mouseInfluence = 1 - effectiveScroll * 0.6;
    const targetX = mousePosition.x * 0.5 * mouseInfluence;
    const targetY = mousePosition.y * 0.3 * mouseInfluence;

    targetPos.current.x += (targetX - targetPos.current.x) * 0.03;
    targetPos.current.y += (targetY - targetPos.current.y) * 0.03;
    targetPos.current.z += (targetZ - targetPos.current.z) * 0.02;

    camera.position.set(targetPos.current.x, targetPos.current.y, targetPos.current.z);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function Effects() {
  return (
    <EffectComposer>
      <Bloom intensity={0.5} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
    </EffectComposer>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={[DEEP_SPACE]} />
      <fog attach="fog" args={[DEEP_SPACE, 8, 20]} />
      <Environment preset="night" />
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1} color={PERSIMMON} />
      <pointLight position={[-5, -3, 3]} intensity={0.5} color={NEO_MINT} />
      <CameraController />
      <MorphingBlob />
      <InnerCore />
      <OrbitingBlobs />
      <Particles />
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
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh" }}
      onCreated={() => setLoaded(true)}
    >
      <Scene />
    </Canvas>
  );
}
