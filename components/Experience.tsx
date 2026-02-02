"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Environment, Sparkles, MeshDistortMaterial, Trail } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { useStore } from "@/store/useStore";

// Pre-generated random data for floating shapes (module level to satisfy lint)
const FLOATING_SHAPES_DATA = Array.from({ length: 12 }, (_, i) => {
  const seed1 = Math.sin(i * 12.9898) * 43758.5453;
  const seed2 = Math.sin(i * 78.233) * 43758.5453;
  const seed3 = Math.sin(i * 45.164) * 43758.5453;
  const seed4 = Math.sin(i * 93.989) * 43758.5453;
  const seed5 = Math.sin(i * 67.345) * 43758.5453;
  const seed6 = Math.sin(i * 23.456) * 43758.5453;

  const rand1 = seed1 - Math.floor(seed1);
  const rand2 = seed2 - Math.floor(seed2);
  const rand3 = seed3 - Math.floor(seed3);
  const rand4 = seed4 - Math.floor(seed4);
  const rand5 = seed5 - Math.floor(seed5);
  const rand6 = seed6 - Math.floor(seed6);

  return {
    position: [
      (rand1 - 0.5) * 14,
      (rand2 - 0.5) * 8,
      (rand3 - 0.5) * 14 - 4,
    ] as [number, number, number],
    scale: 0.15 + rand4 * 0.35,
    speed: 0.3 + rand5 * 0.7,
    rotationSpeed: 0.1 + rand6 * 0.4,
    colorIndex: i % 3,
  };
});

// Pre-generated particle ring positions - INCREASED COUNT
const PARTICLE_COUNT = 1500;
const PARTICLE_POSITIONS = (() => {
  const pos = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
    const seed1 = Math.sin(i * 12.9898 + 1.0) * 43758.5453;
    const seed2 = Math.sin(i * 78.233 + 2.0) * 43758.5453;
    const rand1 = seed1 - Math.floor(seed1);
    const rand2 = seed2 - Math.floor(seed2);

    const radius = 3.5 + rand1 * 2;
    pos[i * 3] = Math.cos(angle) * radius;
    pos[i * 3 + 1] = (rand2 - 0.5) * 3;
    pos[i * 3 + 2] = Math.sin(angle) * radius;
  }
  return pos;
})();

// Secondary outer particle ring
const OUTER_PARTICLE_COUNT = 800;
const OUTER_PARTICLE_POSITIONS = (() => {
  const pos = new Float32Array(OUTER_PARTICLE_COUNT * 3);
  for (let i = 0; i < OUTER_PARTICLE_COUNT; i++) {
    const angle = (i / OUTER_PARTICLE_COUNT) * Math.PI * 2;
    const seed1 = Math.sin(i * 34.567 + 3.0) * 43758.5453;
    const seed2 = Math.sin(i * 56.789 + 4.0) * 43758.5453;
    const rand1 = seed1 - Math.floor(seed1);
    const rand2 = seed2 - Math.floor(seed2);

    const radius = 6 + rand1 * 3;
    pos[i * 3] = Math.cos(angle) * radius;
    pos[i * 3 + 1] = (rand2 - 0.5) * 4;
    pos[i * 3 + 2] = Math.sin(angle) * radius;
  }
  return pos;
})();

// Floating dust particles
const DUST_COUNT = 600;
const DUST_POSITIONS = (() => {
  const pos = new Float32Array(DUST_COUNT * 3);
  for (let i = 0; i < DUST_COUNT; i++) {
    const seed1 = Math.sin(i * 98.765 + 5.0) * 43758.5453;
    const seed2 = Math.sin(i * 43.210 + 6.0) * 43758.5453;
    const seed3 = Math.sin(i * 21.098 + 7.0) * 43758.5453;
    const rand1 = seed1 - Math.floor(seed1);
    const rand2 = seed2 - Math.floor(seed2);
    const rand3 = seed3 - Math.floor(seed3);

    pos[i * 3] = (rand1 - 0.5) * 20;
    pos[i * 3 + 1] = (rand2 - 0.5) * 15;
    pos[i * 3 + 2] = (rand3 - 0.5) * 20 - 5;
  }
  return pos;
})();

// Central morphing blob with enhanced glow
function MorphingBlob() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const scroll = useStore((state) => state.scroll);
  const mousePosition = useStore((state) => state.mousePosition);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    // Rotation
    meshRef.current.rotation.x = time * 0.1 + scroll * Math.PI * 0.3;
    meshRef.current.rotation.y = time * 0.15 + mousePosition.x * 0.5;

    // Scale based on scroll
    const baseScale = 2.2 - scroll * 0.6;
    meshRef.current.scale.setScalar(baseScale);

    // Position
    meshRef.current.position.x = mousePosition.x * 0.5;
    meshRef.current.position.y = mousePosition.y * 0.3 + Math.sin(time * 0.5) * 0.2;

    // Glow follows main blob
    if (glowRef.current) {
      glowRef.current.position.copy(meshRef.current.position);
      glowRef.current.rotation.copy(meshRef.current.rotation);
      glowRef.current.scale.setScalar(baseScale * 1.15);
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
      <group>
        {/* Main blob */}
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1, 4]} />
          <MeshDistortMaterial
            color="#f59e0b"
            attach="material"
            distort={0.5}
            speed={3}
            roughness={0.1}
            metalness={0.9}
            emissive="#f59e0b"
            emissiveIntensity={0.4}
          />
        </mesh>
        {/* Outer glow layer */}
        <mesh ref={glowRef}>
          <icosahedronGeometry args={[1, 4]} />
          <MeshDistortMaterial
            color="#ff6b00"
            attach="material"
            distort={0.6}
            speed={2}
            roughness={0.3}
            metalness={0.5}
            transparent
            opacity={0.15}
            emissive="#ff6b00"
            emissiveIntensity={0.8}
          />
        </mesh>
      </group>
    </Float>
  );
}

// Orbiting light orbs
function OrbitingOrbs() {
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useStore((state) => state.scroll);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    groupRef.current.rotation.y = time * 0.3;
    groupRef.current.rotation.x = Math.sin(time * 0.2) * 0.2 + scroll * 0.5;
  });

  const orbs = [
    { angle: 0, radius: 3.5, speed: 1, color: "#f59e0b", size: 0.12 },
    { angle: Math.PI * 0.66, radius: 3.8, speed: 0.8, color: "#3b82f6", size: 0.1 },
    { angle: Math.PI * 1.33, radius: 3.3, speed: 1.2, color: "#8b5cf6", size: 0.08 },
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

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime * speed;
    const currentAngle = angle + time;
    meshRef.current.position.x = Math.cos(currentAngle) * radius;
    meshRef.current.position.z = Math.sin(currentAngle) * radius;
    meshRef.current.position.y = Math.sin(time * 2 + index) * 0.5;
  });

  return (
    <Trail
      width={0.5}
      length={8}
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

// Individual organic floating shape with its own distortion
function OrganicShape({
  position,
  scale,
  speed,
  rotationSpeed,
  colorIndex
}: {
  position: [number, number, number];
  scale: number;
  speed: number;
  rotationSpeed: number;
  colorIndex: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const colors = ["#3b82f6", "#8b5cf6", "#f59e0b"];
  const color = colors[colorIndex];

  // Vary distortion amount per shape
  const distortAmount = 0.3 + (colorIndex * 0.15);
  const distortSpeed = 1.5 + (speed * 2);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    // Organic floating movement
    meshRef.current.position.x = position[0] + Math.sin(time * speed * 0.5 + colorIndex) * 0.3;
    meshRef.current.position.y = position[1] + Math.sin(time * speed + colorIndex * 2) * 0.8;
    meshRef.current.position.z = position[2] + Math.cos(time * speed * 0.3 + colorIndex) * 0.2;

    // Gentle rotation
    meshRef.current.rotation.x = time * rotationSpeed * 0.5;
    meshRef.current.rotation.y = time * rotationSpeed * 0.3;
    meshRef.current.rotation.z = Math.sin(time * rotationSpeed) * 0.2;

    // Subtle breathing scale
    const breathe = 1 + Math.sin(time * speed * 1.5) * 0.1;
    meshRef.current.scale.setScalar(scale * breathe);
  });

  return (
    <Float speed={speed * 2} rotationIntensity={0.3} floatIntensity={0.4}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 3]} />
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distortAmount}
          speed={distortSpeed}
          roughness={0.15}
          metalness={0.85}
          emissive={color}
          emissiveIntensity={0.6}
          transparent
          opacity={0.9}
        />
      </mesh>
    </Float>
  );
}

// Enhanced floating shapes - now organic blobs
function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useStore((state) => state.scroll);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = scroll * Math.PI * 0.3;
  });

  return (
    <group ref={groupRef}>
      {FLOATING_SHAPES_DATA.map((shape, i) => (
        <OrganicShape
          key={i}
          position={shape.position}
          scale={shape.scale}
          speed={shape.speed}
          rotationSpeed={shape.rotationSpeed}
          colorIndex={shape.colorIndex}
        />
      ))}
    </group>
  );
}

// Main particle ring with enhanced glow
function ParticleRing() {
  const pointsRef = useRef<THREE.Points>(null);
  const scroll = useStore((state) => state.scroll);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.elapsedTime;
    pointsRef.current.rotation.y = time * 0.15 + scroll * Math.PI;
    pointsRef.current.rotation.x = scroll * 0.3;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={PARTICLE_POSITIONS}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#f59e0b"
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Outer particle ring
function OuterParticleRing() {
  const pointsRef = useRef<THREE.Points>(null);
  const scroll = useStore((state) => state.scroll);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.elapsedTime;
    pointsRef.current.rotation.y = -time * 0.08 + scroll * Math.PI * 0.5;
    pointsRef.current.rotation.z = time * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={OUTER_PARTICLE_COUNT}
          array={OUTER_PARTICLE_POSITIONS}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#3b82f6"
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Floating dust
function FloatingDust() {
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.elapsedTime;
    pointsRef.current.rotation.y = time * 0.02;
    pointsRef.current.position.y = Math.sin(time * 0.1) * 0.5;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={DUST_COUNT}
          array={DUST_POSITIONS}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#ffffff"
        transparent
        opacity={0.3}
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
  const targetPos = useRef({ x: 0, y: 0, z: 8 });

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    const targetZ = 8 + scroll * 5;
    const targetY = 1 + scroll * 2;
    const targetX = mousePosition.x * 2;

    targetPos.current.x += (targetX - targetPos.current.x) * 0.02;
    targetPos.current.y += (targetY - targetPos.current.y) * 0.02;
    targetPos.current.z += (targetZ - targetPos.current.z) * 0.02;

    camera.position.set(
      targetPos.current.x + Math.sin(time * 0.2) * 0.15,
      targetPos.current.y + Math.cos(time * 0.3) * 0.15,
      targetPos.current.z
    );

    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Post-processing effects
function Effects() {
  return (
    <EffectComposer>
      <Bloom
        intensity={1.5}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <Vignette offset={0.3} darkness={0.7} />
    </EffectComposer>
  );
}

// Main scene
function Scene() {
  return (
    <>
      <color attach="background" args={["#030305"]} />
      <fog attach="fog" args={["#030305", 8, 25]} />

      <Suspense fallback={null}>
        <Environment preset="night" />
      </Suspense>

      {/* Enhanced Lighting */}
      <ambientLight intensity={0.15} />
      <pointLight position={[10, 10, 5]} intensity={3} color="#f59e0b" distance={30} />
      <pointLight position={[-10, -5, -5]} intensity={2} color="#3b82f6" distance={25} />
      <pointLight position={[0, -10, 0]} intensity={1.5} color="#8b5cf6" distance={20} />
      <pointLight position={[5, 5, -10]} intensity={1} color="#ec4899" distance={20} />
      <spotLight
        position={[0, 20, 0]}
        angle={0.4}
        penumbra={1}
        intensity={2}
        color="#ffffff"
        distance={40}
      />

      <CameraController />
      <MorphingBlob />
      <OrbitingOrbs />
      <FloatingShapes />
      <ParticleRing />
      <OuterParticleRing />
      <FloatingDust />

      {/* Multiple sparkle layers */}
      <Sparkles
        count={200}
        scale={18}
        size={2}
        speed={0.4}
        opacity={0.8}
        color="#f59e0b"
      />
      <Sparkles
        count={150}
        scale={20}
        size={1.5}
        speed={0.3}
        opacity={0.6}
        color="#3b82f6"
      />
      <Sparkles
        count={100}
        scale={15}
        size={1}
        speed={0.5}
        opacity={0.5}
        color="#8b5cf6"
      />

      <Effects />
    </>
  );
}

export default function Experience() {
  const setLoaded = useStore((state) => state.setLoaded);

  return (
    <Canvas
      camera={{ position: [0, 1, 8], fov: 50 }}
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
        backgroundColor: "#030305",
      }}
    >
      <Scene />
    </Canvas>
  );
}
