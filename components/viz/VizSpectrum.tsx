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

const BARS = 72;
const INNER = 1.5;

// A radial spectrum — bars in a circle that dance with the energy.
export default function VizSpectrum() {
  const group = useRef<THREE.Group>(null);
  const refs = useRef<THREE.Mesh[]>([]);
  const { phase } = usePhase();
  const tint = useMemo(() => new THREE.Color(), []);

  const geometry = useMemo(() => new THREE.BoxGeometry(0.05, 1, 0.05), []);
  const material = useMemo(
    () => new THREE.MeshBasicMaterial({ color: new THREE.Color(TINT.warmup), toneMapped: false }),
    []
  );
  const angles = useMemo(
    () => Array.from({ length: BARS }, (_, i) => (i / BARS) * Math.PI * 2),
    []
  );

  useFrame((state, delta) => {
    audioState.level += (audioState.target - audioState.level) * Math.min(1, delta * 2.5);
    const e = vizEnergy(audioState.level, state.clock.elapsedTime, audioState.playing);
    const t = state.clock.elapsedTime;

    refs.current.forEach((m, i) => {
      if (!m) return;
      const a = angles[i];
      const len = 0.3 + (0.4 + e * 2.4) * (0.5 + 0.5 * Math.sin(t * 4 + i * 0.5));
      m.scale.y = len;
      const rad = INNER + len / 2;
      m.position.set(Math.cos(a) * rad, Math.sin(a) * rad, 0);
      m.rotation.z = a - Math.PI / 2;
    });
    if (group.current) group.current.rotation.z += delta * (0.04 + e * 0.2);
    tint.set(TINT[phase]);
    material.color.lerp(tint, Math.min(1, delta * 1.5));
  });

  return (
    <group ref={group}>
      {angles.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) refs.current[i] = el;
          }}
          geometry={geometry}
          material={material}
        />
      ))}
    </group>
  );
}
