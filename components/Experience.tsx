"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, Trail } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { useStore } from "@/store/useStore";

// Colors - new brand palette
const CREAM = "#F9F5F0";
const SANDSTONE = "#E3D3C5";
const COCOA_BROWN = "#4A3B33";
const TEAL = "#2F6364";
const PERSIMMON = "#FF7F6B";
const NEO_MINT = "#A8E6CF";

// Cursor-following light
function CursorLight() {
  const lightRef = useRef<THREE.PointLight>(null);
  const mousePosition = useStore((state) => state.mousePosition);
  const hoveredCard = useStore((state) => state.hoveredCard);
  const targetPos = useRef({ x: 0, y: 0 });
  const currentColor = useRef(new THREE.Color(PERSIMMON));
  const targetColor = useRef(new THREE.Color(PERSIMMON));

  useFrame(() => {
    if (!lightRef.current) return;

    // Smooth follow
    targetPos.current.x += (mousePosition.x * 5 - targetPos.current.x) * 0.05;
    targetPos.current.y += (mousePosition.y * 3 - targetPos.current.y) * 0.05;

    lightRef.current.position.x = targetPos.current.x;
    lightRef.current.position.y = targetPos.current.y;
    lightRef.current.position.z = 4;

    // React to card hover with color change
    if (hoveredCard.color) {
      targetColor.current.set(hoveredCard.color);
    } else {
      targetColor.current.set(PERSIMMON);
    }
    currentColor.current.lerp(targetColor.current, 0.08);
    lightRef.current.color.copy(currentColor.current);

    // Increase intensity when hovering
    const targetIntensity = hoveredCard.color ? 8 : 3;
    lightRef.current.intensity += (targetIntensity - lightRef.current.intensity) * 0.1;
  });

  return (
    <pointLight
      ref={lightRef}
      intensity={3}
      color={PERSIMMON}
      distance={15}
      decay={2}
    />
  );
}

// Card hover reactive element - creates a glowing orb that appears when hovering cards
function CardReactiveOrb() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const hoveredCard = useStore((state) => state.hoveredCard);
  const currentColor = useRef(new THREE.Color(PERSIMMON));
  const targetScale = useRef(0);
  const currentScale = useRef(0);

  useFrame((state) => {
    if (!meshRef.current || !glowRef.current) return;
    const time = state.clock.elapsedTime;

    // Target scale based on hover state
    targetScale.current = hoveredCard.color ? 1.5 : 0;
    currentScale.current += (targetScale.current - currentScale.current) * 0.1;

    meshRef.current.scale.setScalar(currentScale.current);
    glowRef.current.scale.setScalar(currentScale.current * 2);

    // Color transition
    if (hoveredCard.color) {
      currentColor.current.lerp(new THREE.Color(hoveredCard.color), 0.1);
    }

    // Pulsing animation
    const pulse = 1 + Math.sin(time * 3) * 0.1;
    meshRef.current.scale.multiplyScalar(pulse);

    // Rotation
    meshRef.current.rotation.y = time * 0.5;
    meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
  });

  return (
    <group position={[0, 0, 2]}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial
          color={currentColor.current}
          emissive={currentColor.current}
          emissiveIntensity={3}
          wireframe
          toneMapped={false}
        />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshBasicMaterial
          color={currentColor.current}
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// Reactive burst particles that explode on first scroll
function BurstParticles() {
  const points = useRef<THREE.Points>(null);
  const scroll = useStore((state) => state.scroll);
  const prevScroll = useRef(0);
  const burstTriggered = useRef(false);
  const burstProgress = useRef(0);
  const particleVelocities = useRef<Float32Array | null>(null);

  const particleCount = 500;

  const { positions, originalPositions } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const origPos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Start clustered near center
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.random() * 0.5;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      // Original positions (where they'll return to)
      origPos[i * 3] = (Math.random() - 0.5) * 8;
      origPos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      origPos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
    }

    return { positions: pos, originalPositions: origPos };
  }, []);

  // Initialize velocities
  useEffect(() => {
    const velocities = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = 0.5 + Math.random() * 1.5;

      velocities[i * 3] = speed * Math.sin(phi) * Math.cos(theta);
      velocities[i * 3 + 1] = speed * Math.sin(phi) * Math.sin(theta);
      velocities[i * 3 + 2] = speed * Math.cos(phi);
    }
    particleVelocities.current = velocities;
  }, []);

  useFrame((state, delta) => {
    if (!points.current || !particleVelocities.current) return;

    const geometry = points.current.geometry;
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;

    // Detect first scroll to trigger burst
    if (!burstTriggered.current && scroll > 0.01 && prevScroll.current < 0.01) {
      burstTriggered.current = true;
    }
    prevScroll.current = scroll;

    // Burst animation
    if (burstTriggered.current && burstProgress.current < 1) {
      burstProgress.current = Math.min(1, burstProgress.current + delta * 0.8);
    }

    const burst = burstProgress.current;
    const velocities = particleVelocities.current;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      if (burst < 0.5) {
        // Explosion phase
        const explosionPhase = burst * 2;
        const eased = 1 - Math.pow(1 - explosionPhase, 3);

        posArray[i3] = positions[i3] + velocities[i3] * eased * 3;
        posArray[i3 + 1] = positions[i3 + 1] + velocities[i3 + 1] * eased * 3;
        posArray[i3 + 2] = positions[i3 + 2] + velocities[i3 + 2] * eased * 3;
      } else {
        // Reform phase - lerp to original positions
        const reformPhase = (burst - 0.5) * 2;
        const eased = reformPhase * reformPhase * (3 - 2 * reformPhase);

        const explosionX = positions[i3] + velocities[i3] * 3;
        const explosionY = positions[i3 + 1] + velocities[i3 + 1] * 3;
        const explosionZ = positions[i3 + 2] + velocities[i3 + 2] * 3;

        posArray[i3] = explosionX + (originalPositions[i3] - explosionX) * eased;
        posArray[i3 + 1] = explosionY + (originalPositions[i3 + 1] - explosionY) * eased;
        posArray[i3 + 2] = explosionZ + (originalPositions[i3 + 2] - explosionZ) * eased;
      }
    }

    posAttr.needsUpdate = true;

    // After burst, continue normal animation
    if (burst >= 1) {
      const time = state.clock.elapsedTime;
      points.current.rotation.y = time * 0.02;
      points.current.rotation.x = Math.sin(time * 0.01) * 0.1;
    }
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
        size={0.06}
        color={NEO_MINT}
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

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

    const scrollScale = 1 + scroll * 2;
    points.current.scale.setScalar(scrollScale);

    const rotationSpeed = 1 + scroll * 0.5;
    points.current.rotation.y = time * 0.05 * rotationSpeed + mousePosition.x * 0.5;
    points.current.rotation.x = Math.sin(time * 0.03) * 0.1 + mousePosition.y * 0.3;

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
        size={0.08}
        color={PERSIMMON}
        transparent
        opacity={0.9}
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

    const mouseInfluence = 1 - scroll * 0.7;
    const targetX = mousePosition.x * 0.6 * mouseInfluence;
    const targetY = mousePosition.y * 0.4 * mouseInfluence;

    groupRef.current.rotation.x += (targetY * 0.3 - groupRef.current.rotation.x) * 0.02;
    groupRef.current.rotation.y += (targetX * 0.5 + time * 0.1 - groupRef.current.rotation.y) * 0.02;

    const scrollPosX = targetX * 0.3 + Math.sin(scroll * Math.PI) * 0.5;
    const scrollPosY = Math.sin(time * 0.5) * 0.15 + targetY * 0.2 - scroll * 1.5;
    const scrollPosZ = -scroll * 2;

    groupRef.current.position.x += (scrollPosX - groupRef.current.position.x) * 0.03;
    groupRef.current.position.y += (scrollPosY - groupRef.current.position.y) * 0.03;
    groupRef.current.position.z += (scrollPosZ - groupRef.current.position.z) * 0.02;

    const baseScale = 2.0 + scroll * 0.8;
    groupRef.current.scale.setScalar(baseScale);

    if (innerRef.current) {
      const spinSpeed = 1 + scroll * 2;
      innerRef.current.rotation.x = time * 0.3 * spinSpeed;
      innerRef.current.rotation.y = time * 0.4 * spinSpeed;
    }

    if (glowRef.current) {
      const pulseIntensity = 0.15 + scroll * 0.2;
      glowRef.current.scale.setScalar(1.8 + Math.sin(time * 2) * pulseIntensity);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef}>
        <mesh ref={innerRef} scale={0.4}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial
            color={PERSIMMON}
            emissive={PERSIMMON}
            emissiveIntensity={5}
            toneMapped={false}
          />
        </mesh>

        <mesh scale={0.55}>
          <sphereGeometry args={[1, 48, 48]} />
          <meshStandardMaterial
            color={TEAL}
            emissive={TEAL}
            emissiveIntensity={2}
            transparent
            opacity={0.6}
            toneMapped={false}
          />
        </mesh>

        <mesh scale={1.2}>
          <sphereGeometry args={[1, 128, 128]} />
          <meshPhysicalMaterial
            color={NEO_MINT}
            roughness={0.02}
            metalness={0.15}
            transmission={0.9}
            thickness={0.8}
            ior={1.6}
            transparent
            emissive={NEO_MINT}
            emissiveIntensity={0.3}
          />
        </mesh>

        <mesh scale={1.4}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshBasicMaterial
            color={PERSIMMON}
            transparent
            opacity={0.15}
            side={THREE.BackSide}
          />
        </mesh>

        <mesh ref={glowRef} scale={1.8}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshBasicMaterial
            color={TEAL}
            transparent
            opacity={0.2}
            side={THREE.BackSide}
          />
        </mesh>

        <mesh scale={2.4}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial
            color={NEO_MINT}
            transparent
            opacity={0.12}
            side={THREE.BackSide}
          />
        </mesh>

        <mesh scale={3}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial
            color={PERSIMMON}
            transparent
            opacity={0.05}
            side={THREE.BackSide}
          />
        </mesh>
      </group>
    </Float>
  );
}

// Orbiting light orbs with trails
function OrbitingOrbs() {
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useStore((state) => state.scroll);
  const mousePosition = useStore((state) => state.mousePosition);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;

    const scrollScale = 1 + scroll * 1.8;
    groupRef.current.scale.setScalar(scrollScale);

    const rotationSpeed = 1 + scroll * 0.5;
    groupRef.current.rotation.y = time * 0.3 * rotationSpeed + mousePosition.x * 0.5;
    groupRef.current.rotation.x = Math.sin(time * 0.2) * 0.3 + mousePosition.y * 0.3 + scroll * 0.5;
  });

  const orbs = [
    { angle: 0, radius: 2.5, speed: 1, color: PERSIMMON, size: 0.08 },
    { angle: Math.PI * 0.5, radius: 2.8, speed: 0.8, color: TEAL, size: 0.07 },
    { angle: Math.PI, radius: 2.3, speed: 1.2, color: NEO_MINT, size: 0.06 },
    { angle: Math.PI * 1.5, radius: 2.6, speed: 0.9, color: SANDSTONE, size: 0.05 },
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
        width={0.5}
        length={12}
        color={color}
        attenuation={(t) => t * t}
      >
        <mesh ref={meshRef}>
          <sphereGeometry args={[size * 1.5, 32, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive={color}
            emissiveIntensity={8}
            toneMapped={false}
          />
        </mesh>
      </Trail>
      <mesh ref={glowRef}>
        <sphereGeometry args={[size * 4, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.35}
        />
      </mesh>
    </>
  );
}

// Multiple orbital rings
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
      <points ref={ring1Ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[ring1Positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.1} color={PERSIMMON} transparent opacity={1} sizeAttenuation blending={THREE.AdditiveBlending} />
      </points>
      <points ref={ring2Ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[ring2Positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.08} color={NEO_MINT} transparent opacity={0.9} sizeAttenuation blending={THREE.AdditiveBlending} />
      </points>
      <points ref={ring3Ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[ring3Positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.06} color={TEAL} transparent opacity={0.8} sizeAttenuation blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
}

// Camera controller
function CameraController() {
  const { camera } = useThree();
  const scroll = useStore((state) => state.scroll);
  const mousePosition = useStore((state) => state.mousePosition);
  const isReturning = useStore((state) => state.isReturning);
  const returnProgress = useStore((state) => state.returnProgress);
  const introProgress = useStore((state) => state.introProgress);
  const isIntroComplete = useStore((state) => state.isIntroComplete);
  const targetPos = useRef({ x: 0, y: 0, z: 0.8 });

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (!isIntroComplete) {
      const introEased = 1 - Math.pow(1 - introProgress, 3);
      const introZ = 0.8 + introEased * 2.2;

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

      camera.lookAt(0, 0, 0);
      return;
    }

    let effectiveScroll = scroll;
    let interpolationSpeed = 0.025;

    if (isReturning) {
      effectiveScroll = 1 - returnProgress;
      interpolationSpeed = 0.08;

      const spiralIntensity = Math.sin(returnProgress * Math.PI) * 0.5;
      targetPos.current.x += Math.sin(time * 3) * spiralIntensity * 0.1;
    }

    const scrollEased = Math.pow(effectiveScroll, 0.8);
    const targetZ = 3 + scrollEased * 11;
    const targetY = mousePosition.y * 0.3 + effectiveScroll * 2;
    const mouseInfluence = 1 - effectiveScroll * 0.5;
    const targetX = mousePosition.x * 0.5 * mouseInfluence;

    targetPos.current.x += (targetX - targetPos.current.x) * 0.04;
    targetPos.current.y += (targetY - targetPos.current.y) * 0.03;
    targetPos.current.z += (targetZ - targetPos.current.z) * interpolationSpeed;

    camera.position.set(
      targetPos.current.x,
      targetPos.current.y,
      targetPos.current.z
    );

    camera.lookAt(0, effectiveScroll * 0.5, 0);
  });

  return null;
}

// Post-processing effects
function DynamicEffects() {
  return (
    <EffectComposer>
      <Bloom
        intensity={2.5}
        luminanceThreshold={0.1}
        luminanceSmoothing={0.95}
        mipmapBlur
        radius={0.8}
      />
      <Vignette offset={0.3} darkness={0.6} />
    </EffectComposer>
  );
}

// Main scene
function Scene() {
  return (
    <>
      <color attach="background" args={[COCOA_BROWN]} />
      <fog attach="fog" args={[COCOA_BROWN, 12, 35]} />

      <ambientLight intensity={0.15} />

      <pointLight position={[5, 5, 5]} intensity={3} color={PERSIMMON} distance={30} />
      <pointLight position={[-5, -3, 5]} intensity={2.5} color={NEO_MINT} distance={25} />
      <pointLight position={[0, 5, -5]} intensity={2} color={TEAL} distance={25} />
      <pointLight position={[-3, 0, 8]} intensity={1.5} color={CREAM} distance={20} />

      <pointLight position={[0, 0, 3]} intensity={2} color={PERSIMMON} distance={15} />
      <pointLight position={[3, 3, 0]} intensity={1.5} color={NEO_MINT} distance={18} />
      <pointLight position={[-3, -2, 2]} intensity={1.5} color={TEAL} distance={18} />

      <pointLight position={[3, 0, -5]} intensity={1.2} color={NEO_MINT} distance={20} />
      <pointLight position={[-3, 0, -5]} intensity={1} color={PERSIMMON} distance={20} />

      <CursorLight />
      <CameraController />
      <CardReactiveOrb />
      <GlassSphere />
      <OrbitingOrbs />
      <OrbitalRings />
      <ParticleField />
      <BurstParticles />

      <Sparkles count={120} scale={12} size={2.5} speed={0.4} opacity={0.7} color={PERSIMMON} />
      <Sparkles count={100} scale={14} size={2} speed={0.3} opacity={0.6} color={TEAL} />
      <Sparkles count={80} scale={16} size={1.8} speed={0.25} opacity={0.5} color={NEO_MINT} />
      <Sparkles count={60} scale={18} size={1.5} speed={0.2} opacity={0.4} color={CREAM} />

      <DynamicEffects />
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
        backgroundColor: COCOA_BROWN,
      }}
    >
      <Scene />
    </Canvas>
  );
}
