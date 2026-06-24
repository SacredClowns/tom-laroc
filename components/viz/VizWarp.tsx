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

const DEPTH = 18;

export default function VizWarp({ count = 1800 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);
  const { phase } = usePhase();
  const tint = useMemo(() => new THREE.Color(), []);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 0.5 + Math.random() * 6;
      const a = Math.random() * Math.PI * 2;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = Math.sin(a) * r;
      arr[i * 3 + 2] = -Math.random() * DEPTH;
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    audioState.level += (audioState.target - audioState.level) * Math.min(1, delta * 2.5);
    const e = vizEnergy(audioState.level, state.clock.elapsedTime, audioState.playing);
    const speed = (2 + e * 14) * delta;

    const pts = ref.current;
    if (pts) {
      const pos = pts.geometry.attributes.position as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;
      for (let i = 0; i < count; i++) {
        const zi = i * 3 + 2;
        arr[zi] += speed;
        if (arr[zi] > 2) {
          const r = 0.5 + Math.random() * 6;
          const a = Math.random() * Math.PI * 2;
          arr[i * 3] = Math.cos(a) * r;
          arr[i * 3 + 1] = Math.sin(a) * r;
          arr[zi] = -DEPTH;
        }
      }
      pos.needsUpdate = true;
      pts.rotation.z += delta * (0.05 + e * 0.2);
    }
    if (matRef.current) {
      tint.set(TINT[phase]);
      matRef.current.color.lerp(tint, Math.min(1, delta * 1.5));
      matRef.current.size = 0.03 + e * 0.06;
      matRef.current.opacity = 0.6 + e * 0.4;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.04}
        sizeAttenuation
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color={TINT.warmup}
      />
    </points>
  );
}
