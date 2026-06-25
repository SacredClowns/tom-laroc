"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePhase, type Phase } from "@/lib/phase";
import { audioState, vizEnergy } from "@/lib/audio";

const TINT: Record<Phase, string> = {
  warmup: "#6c8cff",
  peak: "#ff6a3d",
  afterhours: "#8b6cff",
  sunrise: "#ffb37e",
};

// A slow, hypnotic spiral galaxy of points.
export default function VizGalaxy({ count = 6000 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);
  const { phase } = usePhase();
  const tint = useMemo(() => new THREE.Color(), []);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const arms = 4;
    const maxR = 5;
    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 0.7) * maxR;
      const branch = ((i % arms) / arms) * Math.PI * 2;
      const spin = r * 1.1;
      const spread = (Math.random() - 0.5) * 0.5 * (0.4 + r * 0.15);
      arr[i * 3] = Math.cos(branch + spin) * r + spread;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 0.4 * (1 - r / (maxR * 1.5));
      arr[i * 3 + 2] = Math.sin(branch + spin) * r + spread;
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    audioState.level += (audioState.target - audioState.level) * Math.min(1, delta * 2.5);
    const e = vizEnergy(audioState.level, state.clock.elapsedTime, audioState.playing);
    if (ref.current) {
      ref.current.rotation.y += delta * (0.06 + e * 0.25);
      ref.current.rotation.x = -0.5; // tilt the disc toward camera
    }
    if (matRef.current) {
      tint.set(TINT[phase]);
      matRef.current.color.lerp(tint, Math.min(1, delta * 1.5));
      matRef.current.size = 0.022 + e * 0.02;
      matRef.current.opacity = 0.7 + e * 0.3;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.024}
        sizeAttenuation
        transparent
        opacity={0.75}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color={TINT.warmup}
      />
    </points>
  );
}
