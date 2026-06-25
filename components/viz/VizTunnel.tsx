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

const RINGS = 28;
const SPACING = 1.15;
const TOTAL = RINGS * SPACING;

// Fly-through wormhole — glowing rings rushing toward the camera.
export default function VizTunnel() {
  const refs = useRef<THREE.Mesh[]>([]);
  const { phase } = usePhase();
  const tint = useMemo(() => new THREE.Color(), []);

  const geometry = useMemo(() => new THREE.TorusGeometry(2.6, 0.03, 8, 64), []);
  const material = useMemo(
    () => new THREE.MeshBasicMaterial({ color: new THREE.Color(TINT.warmup), toneMapped: false }),
    []
  );

  useFrame((state, delta) => {
    audioState.level += (audioState.target - audioState.level) * Math.min(1, delta * 2.5);
    const e = vizEnergy(audioState.level, state.clock.elapsedTime, audioState.playing);
    const speed = (3 + e * 18) * delta;

    refs.current.forEach((m, i) => {
      if (!m) return;
      m.position.z += speed;
      if (m.position.z > 4) m.position.z -= TOTAL;
      m.rotation.z += delta * (0.2 + i * 0.01);
      const s = 1 + Math.sin(state.clock.elapsedTime + i) * 0.05 + e * 0.15;
      m.scale.set(s, s, 1);
    });
    tint.set(TINT[phase]);
    material.color.lerp(tint, Math.min(1, delta * 1.5));
  });

  return (
    <group>
      {Array.from({ length: RINGS }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) refs.current[i] = el;
          }}
          geometry={geometry}
          material={material}
          position={[0, 0, -i * SPACING]}
        />
      ))}
    </group>
  );
}
