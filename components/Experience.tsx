"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import {
  Environment,
  MeshDistortMaterial,
  Sphere,
  Float,
  MeshTransmissionMaterial
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

// Simplex noise implementation for organic movement
const NOISE_SEED = 42;
class SimplexNoise {
  private perm: number[] = [];

  constructor(seed: number = Math.random()) {
    const p = [];
    for (let i = 0; i < 256; i++) p[i] = i;

    let n: number;
    let q: number;
    for (let i = 255; i > 0; i--) {
      seed = (seed * 16807) % 2147483647;
      n = seed % (i + 1);
      q = p[i];
      p[i] = p[n];
      p[n] = q;
    }

    for (let i = 0; i < 512; i++) {
      this.perm[i] = p[i & 255];
    }
  }

  noise3D(x: number, y: number, z: number): number {
    const F3 = 1.0 / 3.0;
    const G3 = 1.0 / 6.0;

    const s = (x + y + z) * F3;
    const i = Math.floor(x + s);
    const j = Math.floor(y + s);
    const k = Math.floor(z + s);

    const t = (i + j + k) * G3;
    const X0 = i - t;
    const Y0 = j - t;
    const Z0 = k - t;
    const x0 = x - X0;
    const y0 = y - Y0;
    const z0 = z - Z0;

    let i1: number, j1: number, k1: number;
    let i2: number, j2: number, k2: number;

    if (x0 >= y0) {
      if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
      else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
      else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
    } else {
      if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
      else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
      else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
    }

    const x1 = x0 - i1 + G3;
    const y1 = y0 - j1 + G3;
    const z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2.0 * G3;
    const y2 = y0 - j2 + 2.0 * G3;
    const z2 = z0 - k2 + 2.0 * G3;
    const x3 = x0 - 1.0 + 3.0 * G3;
    const y3 = y0 - 1.0 + 3.0 * G3;
    const z3 = z0 - 1.0 + 3.0 * G3;

    const ii = i & 255;
    const jj = j & 255;
    const kk = k & 255;

    const grad3 = [
      [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
      [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
      [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
    ];

    const dot = (g: number[], x: number, y: number, z: number) => g[0] * x + g[1] * y + g[2] * z;

    let n0 = 0, n1 = 0, n2 = 0, n3 = 0;

    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    if (t0 >= 0) {
      const gi0 = this.perm[ii + this.perm[jj + this.perm[kk]]] % 12;
      t0 *= t0;
      n0 = t0 * t0 * dot(grad3[gi0], x0, y0, z0);
    }

    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    if (t1 >= 0) {
      const gi1 = this.perm[ii + i1 + this.perm[jj + j1 + this.perm[kk + k1]]] % 12;
      t1 *= t1;
      n1 = t1 * t1 * dot(grad3[gi1], x1, y1, z1);
    }

    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    if (t2 >= 0) {
      const gi2 = this.perm[ii + i2 + this.perm[jj + j2 + this.perm[kk + k2]]] % 12;
      t2 *= t2;
      n2 = t2 * t2 * dot(grad3[gi2], x2, y2, z2);
    }

    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
    if (t3 >= 0) {
      const gi3 = this.perm[ii + 1 + this.perm[jj + 1 + this.perm[kk + 1]]] % 12;
      t3 *= t3;
      n3 = t3 * t3 * dot(grad3[gi3], x3, y3, z3);
    }

    return 32.0 * (n0 + n1 + n2 + n3);
  }
}

const noise = new SimplexNoise(NOISE_SEED);

// The main morphing blob - inspired by Blobmixer
function MorphingBlob() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const scroll = useStore((state) => state.scroll);
  const mousePosition = useStore((state) => state.mousePosition);
  const hoveredCard = useStore((state) => state.hoveredCard);

  // Store original positions for displacement
  const originalPositions = useRef<Float32Array | null>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    const geometry = meshRef.current.geometry as THREE.SphereGeometry;

    // Initialize original positions on first frame
    if (!originalPositions.current) {
      originalPositions.current = new Float32Array(
        geometry.attributes.position.array.length
      );
      originalPositions.current.set(geometry.attributes.position.array);
    }

    const positions = geometry.attributes.position.array as Float32Array;
    const normals = geometry.attributes.normal.array as Float32Array;

    // Displacement parameters - vary with scroll
    const noiseScale = 1.2 + scroll * 0.3;
    const noiseSpeed = 0.3;
    const displacement = 0.25 + Math.sin(time * 0.5) * 0.08;

    // Apply noise-based vertex displacement
    for (let i = 0; i < positions.length; i += 3) {
      const ox = originalPositions.current[i];
      const oy = originalPositions.current[i + 1];
      const oz = originalPositions.current[i + 2];

      // Calculate noise value for this vertex
      const noiseValue = noise.noise3D(
        ox * noiseScale + time * noiseSpeed,
        oy * noiseScale + time * noiseSpeed * 0.8,
        oz * noiseScale + time * noiseSpeed * 0.6
      );

      // Get original normal direction
      const nx = normals[i];
      const ny = normals[i + 1];
      const nz = normals[i + 2];

      // Displace vertex along normal
      const d = noiseValue * displacement;
      positions[i] = ox + nx * d;
      positions[i + 1] = oy + ny * d;
      positions[i + 2] = oz + nz * d;
    }

    // Mark for update
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals(); // Recalculate normals for proper lighting

    // Rotation
    meshRef.current.rotation.y = time * 0.1;
    meshRef.current.rotation.x = Math.sin(time * 0.15) * 0.2;

    // Mouse influence on position
    const mouseInfluence = 1 - scroll * 0.8;
    meshRef.current.position.x = mousePosition.x * 0.4 * mouseInfluence;
    meshRef.current.position.y = mousePosition.y * 0.3 * mouseInfluence;

    // Update material color based on hover
    if (materialRef.current) {
      const targetColor = new THREE.Color(hoveredCard.color || PERSIMMON);
      materialRef.current.color.lerp(targetColor, 0.05);
      materialRef.current.emissive.lerp(targetColor, 0.05);
    }
  });

  const initialColor = hoveredCard.color || PERSIMMON;

  return (
    <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 128, 128]} />
        <meshPhysicalMaterial
          ref={materialRef}
          color={initialColor}
          emissive={initialColor}
          emissiveIntensity={0.15}
          roughness={0.1}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transmission={0.3}
          thickness={0.5}
          ior={1.5}
          envMapIntensity={2}
          iridescence={0.3}
          iridescenceIOR={1.3}
          sheen={0.5}
          sheenRoughness={0.5}
          sheenColor={NEO_MINT}
        />
      </mesh>
    </Float>
  );
}

// Secondary smaller blobs that orbit around
function OrbitingBlobs() {
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useStore((state) => state.scroll);

  const blobs = useMemo(() => [
    { distance: 2.5, size: 0.15, speed: 0.5, offset: 0, color: NEO_MINT },
    { distance: 3, size: 0.1, speed: -0.3, offset: Math.PI * 0.7, color: TEAL },
    { distance: 2.8, size: 0.12, speed: 0.4, offset: Math.PI * 1.4, color: CREAM },
  ], []);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
  });

  return (
    <group ref={groupRef}>
      {blobs.map((blob, i) => (
        <OrbitingBlob key={i} {...blob} index={i} scroll={scroll} />
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
  scroll
}: {
  distance: number;
  size: number;
  speed: number;
  offset: number;
  color: string;
  index: number;
  scroll: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    // Orbit around center
    const angle = time * speed + offset;
    meshRef.current.position.x = Math.cos(angle) * distance;
    meshRef.current.position.z = Math.sin(angle) * distance;
    meshRef.current.position.y = Math.sin(time * 0.5 + index) * 0.5;

    // Gentle pulse
    const pulse = 1 + Math.sin(time * 2 + index) * 0.1;
    meshRef.current.scale.setScalar(pulse);

    // Fade based on scroll
    const opacity = Math.max(0.3, 1 - scroll * 0.5);
    (meshRef.current.material as THREE.MeshPhysicalMaterial).opacity = opacity;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshPhysicalMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        roughness={0.2}
        metalness={0}
        clearcoat={1}
        transmission={0.5}
        transparent
        opacity={1}
      />
    </mesh>
  );
}

// Ambient particles
function AmbientParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const scroll = useStore((state) => state.scroll);

  const count = 150;

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const radius = 3 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      vel[i * 3] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }

    return { positions: pos, velocities: vel };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.elapsedTime;

    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      posArray[i * 3] += velocities[i * 3] + Math.sin(time + i) * 0.001;
      posArray[i * 3 + 1] += velocities[i * 3 + 1] + Math.cos(time + i) * 0.001;
      posArray[i * 3 + 2] += velocities[i * 3 + 2];

      // Keep particles in bounds
      const dist = Math.sqrt(
        posArray[i * 3] ** 2 +
        posArray[i * 3 + 1] ** 2 +
        posArray[i * 3 + 2] ** 2
      );

      if (dist > 12 || dist < 2) {
        velocities[i * 3] *= -1;
        velocities[i * 3 + 1] *= -1;
        velocities[i * 3 + 2] *= -1;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y = time * 0.02;

    // Fade based on scroll
    (pointsRef.current.material as THREE.PointsMaterial).opacity = 0.4 + scroll * 0.3;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color={CREAM}
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
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

    // Camera journey
    const scrollEased = Math.pow(effectiveScroll, 0.5);
    const targetZ = 4 + scrollEased * 6;

    // Mouse parallax
    const mouseInfluence = 1 - effectiveScroll * 0.6;
    const targetX = mousePosition.x * 0.8 * mouseInfluence + Math.sin(time * 0.1) * 0.1;
    const targetY = mousePosition.y * 0.5 * mouseInfluence + Math.cos(time * 0.08) * 0.05;

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
        intensity={0.8}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        mipmapBlur
        radius={0.6}
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
      <fog attach="fog" args={[DEEP_SPACE, 8, 25]} />

      {/* Environment for PBR reflections */}
      <Environment preset="night" />

      {/* Lighting */}
      <ambientLight intensity={0.1} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.5}
        color="#ffffff"
      />
      <pointLight
        position={[3, 2, 4]}
        intensity={2}
        color={PERSIMMON}
        distance={15}
      />
      <pointLight
        position={[-3, -1, 3]}
        intensity={1}
        color={NEO_MINT}
        distance={12}
      />
      <pointLight
        position={[0, -3, 2]}
        intensity={0.5}
        color={TEAL}
        distance={10}
      />

      <CameraController />

      {/* The hero blob */}
      <MorphingBlob />

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
        zIndex: 1,
        backgroundColor: DEEP_SPACE,
      }}
    >
      <Scene />
    </Canvas>
  );
}
