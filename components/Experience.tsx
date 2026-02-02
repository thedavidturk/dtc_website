"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, MeshWobbleMaterial, Sphere } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, DepthOfField } from "@react-three/postprocessing";
import * as THREE from "three";
import { useStore } from "@/store/useStore";

// Colors - brand palette
const CREAM = "#F9F5F0";
const COCOA_BROWN = "#4A3B33";
const TEAL = "#2F6364";
const PERSIMMON = "#FF7F6B";
const NEO_MINT = "#A8E6CF";

// Simplex noise approximation for organic movement
function noise3D(x: number, y: number, z: number): number {
  const p = (Math.sin(x * 1.2) * Math.cos(y * 0.9) + Math.sin(y * 1.1) * Math.cos(z * 0.8) + Math.sin(z * 1.3) * Math.cos(x * 0.7)) / 3;
  return p;
}

// Organic flowing particle system using instanced spheres
function OrganicParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const scroll = useStore((state) => state.scroll);
  const mousePosition = useStore((state) => state.mousePosition);

  const count = 150;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 3 + Math.random() * 8;

      temp.push({
        position: new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi) - 5
        ),
        scale: 0.02 + Math.random() * 0.06,
        speed: 0.2 + Math.random() * 0.5,
        offset: Math.random() * Math.PI * 2,
        color: new THREE.Color().setHSL(0.45 + Math.random() * 0.15, 0.6, 0.6),
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    particles.forEach((particle, i) => {
      const { position, scale, speed, offset } = particle;

      // Organic flowing motion using noise
      const noiseX = noise3D(position.x * 0.1 + time * speed * 0.3, position.y * 0.1, position.z * 0.1) * 2;
      const noiseY = noise3D(position.x * 0.1, position.y * 0.1 + time * speed * 0.3, position.z * 0.1) * 2;
      const noiseZ = noise3D(position.x * 0.1, position.y * 0.1, position.z * 0.1 + time * speed * 0.3) * 1;

      // Apply mouse influence
      const mouseInfluence = 1 - scroll * 0.5;
      const mx = mousePosition.x * mouseInfluence * 0.5;
      const my = mousePosition.y * mouseInfluence * 0.3;

      dummy.position.set(
        position.x + noiseX + mx + Math.sin(time * speed + offset) * 0.5,
        position.y + noiseY + my + Math.cos(time * speed * 0.7 + offset) * 0.3,
        position.z + noiseZ - scroll * 3
      );

      // Pulsing scale
      const pulseScale = scale * (1 + Math.sin(time * 2 + offset) * 0.3);
      dummy.scale.setScalar(pulseScale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.rotation.y = time * 0.02 + mousePosition.x * 0.2;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color={NEO_MINT}
        emissive={NEO_MINT}
        emissiveIntensity={2}
        transparent
        opacity={0.8}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

// Secondary warm particle system
function WarmParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const scroll = useStore((state) => state.scroll);

  const count = 100;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 10 - 8
        ),
        scale: 0.03 + Math.random() * 0.08,
        speed: 0.1 + Math.random() * 0.3,
        offset: Math.random() * Math.PI * 2,
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    particles.forEach((particle, i) => {
      const { position, scale, speed, offset } = particle;

      dummy.position.set(
        position.x + Math.sin(time * speed + offset) * 1.5,
        position.y + Math.cos(time * speed * 0.8 + offset) * 1,
        position.z + Math.sin(time * speed * 0.5) * 0.5 - scroll * 5
      );

      const pulseScale = scale * (1 + Math.sin(time * 3 + offset) * 0.2);
      dummy.scale.setScalar(pulseScale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshStandardMaterial
        color={PERSIMMON}
        emissive={PERSIMMON}
        emissiveIntensity={3}
        transparent
        opacity={0.7}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

// Complex 3D Nucleus with internal structure
function Nucleus() {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const innerRing1Ref = useRef<THREE.Mesh>(null);
  const innerRing2Ref = useRef<THREE.Mesh>(null);
  const innerRing3Ref = useRef<THREE.Mesh>(null);
  const scroll = useStore((state) => state.scroll);
  const mousePosition = useStore((state) => state.mousePosition);
  const hoveredCard = useStore((state) => state.hoveredCard);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;

    // Organic position
    const mouseInfluence = 1 - scroll * 0.6;
    groupRef.current.position.x = mousePosition.x * 0.8 * mouseInfluence + Math.sin(time * 0.3) * 0.2;
    groupRef.current.position.y = mousePosition.y * 0.5 * mouseInfluence + Math.cos(time * 0.4) * 0.15 - scroll * 2;
    groupRef.current.position.z = -scroll * 3;

    // Scale responds to scroll
    const baseScale = 1 + scroll * 0.5;
    groupRef.current.scale.setScalar(baseScale);

    // Core rotation
    if (coreRef.current) {
      coreRef.current.rotation.x = time * 0.2;
      coreRef.current.rotation.y = time * 0.3;
    }

    // Inner rings - different rotation axes for depth
    if (innerRing1Ref.current) {
      innerRing1Ref.current.rotation.x = time * 0.5;
      innerRing1Ref.current.rotation.z = time * 0.3;
    }
    if (innerRing2Ref.current) {
      innerRing2Ref.current.rotation.y = time * 0.4;
      innerRing2Ref.current.rotation.x = time * 0.2;
    }
    if (innerRing3Ref.current) {
      innerRing3Ref.current.rotation.z = time * 0.6;
      innerRing3Ref.current.rotation.y = -time * 0.25;
    }
  });

  // Dynamic color based on card hover
  const coreColor = hoveredCard.color || PERSIMMON;

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={groupRef}>
        {/* Central glowing core - distorted for organic feel */}
        <Sphere ref={coreRef} args={[0.8, 64, 64]}>
          <MeshDistortMaterial
            color={coreColor}
            emissive={coreColor}
            emissiveIntensity={4}
            distort={0.4}
            speed={3}
            toneMapped={false}
          />
        </Sphere>

        {/* Inner energy ring 1 */}
        <mesh ref={innerRing1Ref}>
          <torusGeometry args={[1.2, 0.02, 16, 100]} />
          <meshStandardMaterial
            color={NEO_MINT}
            emissive={NEO_MINT}
            emissiveIntensity={5}
            toneMapped={false}
          />
        </mesh>

        {/* Inner energy ring 2 - perpendicular */}
        <mesh ref={innerRing2Ref} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.4, 0.015, 16, 100]} />
          <meshStandardMaterial
            color={TEAL}
            emissive={TEAL}
            emissiveIntensity={4}
            toneMapped={false}
          />
        </mesh>

        {/* Inner energy ring 3 - angled */}
        <mesh ref={innerRing3Ref} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
          <torusGeometry args={[1.6, 0.01, 16, 100]} />
          <meshStandardMaterial
            color={PERSIMMON}
            emissive={PERSIMMON}
            emissiveIntensity={3}
            transparent
            opacity={0.8}
            toneMapped={false}
          />
        </mesh>

        {/* Outer glass shell */}
        <Sphere args={[2, 64, 64]}>
          <meshPhysicalMaterial
            color={CREAM}
            roughness={0}
            metalness={0.1}
            transmission={0.95}
            thickness={1.5}
            ior={1.5}
            transparent
            opacity={0.3}
          />
        </Sphere>

        {/* Outer glow layers */}
        <Sphere args={[2.3, 32, 32]}>
          <meshBasicMaterial
            color={coreColor}
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </Sphere>

        <Sphere args={[2.8, 32, 32]}>
          <meshBasicMaterial
            color={NEO_MINT}
            transparent
            opacity={0.05}
            side={THREE.BackSide}
          />
        </Sphere>
      </group>
    </Float>
  );
}

// Flowing energy ribbon
function EnergyRibbon({ color, radius, speed, tilt }: { color: string; radius: number; speed: number; tilt: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const scroll = useStore((state) => state.scroll);

  const curve = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 100; i++) {
      const t = (i / 100) * Math.PI * 2;
      const r = radius + Math.sin(t * 3) * 0.3;
      points.push(
        new THREE.Vector3(
          Math.cos(t) * r,
          Math.sin(t * 2) * 0.5 + Math.sin(t) * 0.3,
          Math.sin(t) * r
        )
      );
    }
    return new THREE.CatmullRomCurve3(points, true);
  }, [radius]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    meshRef.current.rotation.x = tilt + Math.sin(time * 0.2) * 0.1;
    meshRef.current.rotation.y = time * speed;
    meshRef.current.rotation.z = Math.cos(time * 0.3) * 0.05;

    const scale = 1 + scroll * 0.8;
    meshRef.current.scale.setScalar(scale);
    meshRef.current.position.z = -scroll * 2;
  });

  return (
    <mesh ref={meshRef}>
      <tubeGeometry args={[curve, 100, 0.02, 8, true]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={3}
        transparent
        opacity={0.6}
        toneMapped={false}
      />
    </mesh>
  );
}

// Floating orbs with organic wobble
function FloatingOrb({ position, color, size }: { position: [number, number, number]; color: string; size: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const scroll = useStore((state) => state.scroll);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    meshRef.current.position.x = position[0] + Math.sin(time * 0.5 + position[0]) * 0.5;
    meshRef.current.position.y = position[1] + Math.cos(time * 0.4 + position[1]) * 0.3;
    meshRef.current.position.z = position[2] - scroll * 4;
  });

  return (
    <Float speed={3} rotationIntensity={0.5} floatIntensity={0.8}>
      <Sphere ref={meshRef} args={[size, 32, 32]} position={position}>
        <MeshWobbleMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          factor={0.3}
          speed={2}
          transparent
          opacity={0.8}
          toneMapped={false}
        />
      </Sphere>
    </Float>
  );
}

// Depth particles - very small, creates atmosphere
function AtmosphereParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const scroll = useStore((state) => state.scroll);

  const count = 300;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 25 - 10
        ),
        scale: 0.01 + Math.random() * 0.02,
        speed: 0.05 + Math.random() * 0.1,
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    particles.forEach((particle, i) => {
      const { position, scale, speed } = particle;

      dummy.position.set(
        position.x + Math.sin(time * speed + i) * 0.3,
        position.y + Math.cos(time * speed * 0.7 + i) * 0.2,
        position.z - scroll * 8
      );

      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial
        color={CREAM}
        transparent
        opacity={0.4}
      />
    </instancedMesh>
  );
}

// Cursor following light with smooth movement
function CursorLight() {
  const lightRef = useRef<THREE.PointLight>(null);
  const mousePosition = useStore((state) => state.mousePosition);
  const hoveredCard = useStore((state) => state.hoveredCard);
  const targetPos = useRef({ x: 0, y: 0 });
  const currentColor = useRef(new THREE.Color(PERSIMMON));

  useFrame(() => {
    if (!lightRef.current) return;

    // Smooth follow
    targetPos.current.x += (mousePosition.x * 6 - targetPos.current.x) * 0.03;
    targetPos.current.y += (mousePosition.y * 4 - targetPos.current.y) * 0.03;

    lightRef.current.position.x = targetPos.current.x;
    lightRef.current.position.y = targetPos.current.y;
    lightRef.current.position.z = 5;

    // Color transition
    const targetColor = new THREE.Color(hoveredCard.color || PERSIMMON);
    currentColor.current.lerp(targetColor, 0.05);
    lightRef.current.color.copy(currentColor.current);

    // Intensity
    const targetIntensity = hoveredCard.color ? 10 : 4;
    lightRef.current.intensity += (targetIntensity - lightRef.current.intensity) * 0.1;
  });

  return (
    <pointLight
      ref={lightRef}
      intensity={4}
      color={PERSIMMON}
      distance={20}
      decay={2}
    />
  );
}

// Camera controller
function CameraController() {
  const { camera } = useThree();
  const scroll = useStore((state) => state.scroll);
  const mousePosition = useStore((state) => state.mousePosition);
  const isReturning = useStore((state) => state.isReturning);
  const returnProgress = useStore((state) => state.returnProgress);
  const targetPos = useRef({ x: 0, y: 0, z: 5 });

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    let effectiveScroll = scroll;
    let interpolationSpeed = 0.02;

    if (isReturning) {
      effectiveScroll = 1 - returnProgress;
      interpolationSpeed = 0.06;
    }

    // Camera movement
    const scrollEased = Math.pow(effectiveScroll, 0.7);
    const targetZ = 5 + scrollEased * 10;
    const targetY = mousePosition.y * 0.4 + effectiveScroll * 1.5 + Math.sin(time * 0.2) * 0.1;
    const mouseInfluence = 1 - effectiveScroll * 0.4;
    const targetX = mousePosition.x * 0.6 * mouseInfluence + Math.cos(time * 0.15) * 0.1;

    targetPos.current.x += (targetX - targetPos.current.x) * 0.03;
    targetPos.current.y += (targetY - targetPos.current.y) * 0.025;
    targetPos.current.z += (targetZ - targetPos.current.z) * interpolationSpeed;

    camera.position.set(targetPos.current.x, targetPos.current.y, targetPos.current.z);
    camera.lookAt(0, effectiveScroll * 0.3, -2);
  });

  return null;
}

// Post-processing
function Effects() {
  return (
    <EffectComposer>
      <Bloom
        intensity={1.8}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        mipmapBlur
        radius={0.6}
      />
      <DepthOfField
        focusDistance={0}
        focalLength={0.05}
        bokehScale={3}
        height={480}
      />
      <Vignette offset={0.3} darkness={0.5} />
    </EffectComposer>
  );
}

// Main scene
function Scene() {
  return (
    <>
      <color attach="background" args={[COCOA_BROWN]} />
      <fog attach="fog" args={[COCOA_BROWN, 8, 30]} />

      {/* Ambient and key lights */}
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 5]} intensity={2} color={PERSIMMON} distance={40} />
      <pointLight position={[-10, -5, 5]} intensity={1.5} color={NEO_MINT} distance={35} />
      <pointLight position={[0, 8, -5]} intensity={1.2} color={TEAL} distance={30} />
      <pointLight position={[5, -8, 3]} intensity={1} color={CREAM} distance={25} />

      <CursorLight />
      <CameraController />

      {/* Core elements */}
      <Nucleus />

      {/* Energy ribbons */}
      <EnergyRibbon color={NEO_MINT} radius={3} speed={0.15} tilt={0.3} />
      <EnergyRibbon color={TEAL} radius={4} speed={-0.1} tilt={-0.4} />
      <EnergyRibbon color={PERSIMMON} radius={5} speed={0.08} tilt={0.6} />

      {/* Floating orbs */}
      <FloatingOrb position={[-4, 2, -3]} color={PERSIMMON} size={0.3} />
      <FloatingOrb position={[5, -1, -5]} color={NEO_MINT} size={0.25} />
      <FloatingOrb position={[-3, -3, -4]} color={TEAL} size={0.2} />
      <FloatingOrb position={[4, 3, -6]} color={CREAM} size={0.15} />
      <FloatingOrb position={[-5, 0, -7]} color={PERSIMMON} size={0.2} />
      <FloatingOrb position={[2, -4, -5]} color={NEO_MINT} size={0.18} />

      {/* Particle systems */}
      <OrganicParticles />
      <WarmParticles />
      <AtmosphereParticles />

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
        backgroundColor: COCOA_BROWN,
      }}
    >
      <Scene />
    </Canvas>
  );
}
