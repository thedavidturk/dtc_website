"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, Float } from "@react-three/drei";
import * as THREE from "three";
import { useStore } from "@/store/useStore";

const DEEP_SPACE = "#0a0908";
const PERSIMMON = "#FF7F6B";
const NEO_MINT = "#A8E6CF";
const TEAL = "#2F6364";
const CREAM = "#F9F5F0";

function MorphingBlob() {
  const meshRef = useRef<THREE.Mesh>(null);
  const scroll = useStore((state) => state.scroll);
  const mousePosition = useStore((state) => state.mousePosition);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    meshRef.current.rotation.y = time * 0.15;
    meshRef.current.rotation.x = Math.sin(time * 0.1) * 0.2;
    const mouseInfluence = 1 - scroll * 0.7;
    meshRef.current.position.x = mousePosition.x * 0.5 * mouseInfluence;
    meshRef.current.position.y = mousePosition.y * 0.4 * mouseInfluence;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <MeshDistortMaterial
          color={PERSIMMON}
          emissive={PERSIMMON}
          emissiveIntensity={0.3}
          roughness={0.2}
          metalness={0.1}
          distort={0.4}
          speed={2}
        />
      </Sphere>
    </Float>
  );
}

function InnerCore() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = -state.clock.elapsedTime * 0.3;
  });

  return (
    <Sphere ref={meshRef} args={[0.5, 32, 32]}>
      <meshBasicMaterial color={NEO_MINT} transparent opacity={0.6} />
    </Sphere>
  );
}

function OrbitBlob({ distance, size, speed, offset, color, index }: any) {
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
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
    </Sphere>
  );
}

function OrbitingBlobs() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <group ref={groupRef}>
      <OrbitBlob distance={2.2} size={0.15} speed={0.4} offset={0} color={NEO_MINT} index={0} />
      <OrbitBlob distance={2.5} size={0.1} speed={-0.3} offset={Math.PI * 0.7} color={TEAL} index={1} />
      <OrbitBlob distance={2.3} size={0.12} speed={0.35} offset={Math.PI * 1.4} color={CREAM} index={2} />
    </group>
  );
}

function CameraController() {
  const { camera } = useThree();
  const scroll = useStore((state) => state.scroll);
  const mousePosition = useStore((state) => state.mousePosition);
  const targetPos = useRef({ x: 0, y: 0, z: 5 });

  useFrame(() => {
    const targetZ = 5 + scroll * 4;
    const mouseInfluence = 1 - scroll * 0.6;
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

export default function Experience() {
  const setLoaded = useStore((state) => state.setLoaded);

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: DEEP_SPACE,
      }}
      onCreated={() => setLoaded(true)}
    >
      <color attach="background" args={[DEEP_SPACE]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1} color={PERSIMMON} />
      <pointLight position={[-5, -3, 3]} intensity={0.5} color={NEO_MINT} />
      <CameraController />
      <MorphingBlob />
      <InnerCore />
      <OrbitingBlobs />
    </Canvas>
  );
}
