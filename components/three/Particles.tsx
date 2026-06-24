"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePhase, type Phase } from "@/lib/phase";
import { audioState } from "@/lib/audio";

const PHASE_TINT: Record<Phase, string> = {
  warmup: "#6c8cff",
  peak: "#ff6a3d",
  afterhours: "#8b6cff",
  sunrise: "#ffb37e",
};

export default function Particles({ count = 1400 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);
  const { phase } = usePhase();
  const tint = useMemo(() => new THREE.Color(), []);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // shell-biased distribution around the orb
      const r = 2.2 + Math.random() * 3.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    const energy = audioState.level;
    if (ref.current) {
      ref.current.rotation.y += delta * (0.04 + energy * 0.25);
      ref.current.rotation.z -= delta * 0.012;
    }
    if (matRef.current) {
      tint.set(PHASE_TINT[phase]);
      matRef.current.color.lerp(tint, Math.min(1, delta * 1.5));
      // twinkle + flare with the energy
      matRef.current.opacity =
        0.6 + 0.25 * Math.sin(state.clock.elapsedTime * 3) + energy * 0.3;
      matRef.current.size = 0.018 + energy * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.018}
        sizeAttenuation
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color={PHASE_TINT.warmup}
      />
    </points>
  );
}
