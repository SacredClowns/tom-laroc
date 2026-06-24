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

// A radial starburst of thin emissive planes. Bloom turns them into light
// rays — the energy/"pew pew" behind the orb. Pulses with audio energy.
export default function Beams({ count = 9 }: { count?: number }) {
  const group = useRef<THREE.Group>(null);
  const { phase } = usePhase();
  const tint = useMemo(() => new THREE.Color(), []);

  const geometry = useMemo(() => new THREE.PlaneGeometry(0.06, 9), []);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(PHASE_TINT.warmup),
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    []
  );

  const angles = useMemo(
    () => Array.from({ length: count }, (_, i) => (i / count) * Math.PI * 2),
    [count]
  );

  useFrame((state, delta) => {
    const energy = audioState.level;
    if (group.current) {
      group.current.rotation.z += delta * (0.05 + energy * 0.3);
      const s = 1 + energy * 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.04;
      group.current.scale.setScalar(s);
    }
    tint.set(PHASE_TINT[phase]);
    material.color.lerp(tint, Math.min(1, delta * 1.5));
    material.opacity = 0.03 + energy * 0.14;
  });

  return (
    <group ref={group} position={[0, 0, -1.5]}>
      {angles.map((a, i) => (
        <mesh
          key={i}
          rotation={[0, 0, a]}
          geometry={geometry}
          material={material}
        />
      ))}
    </group>
  );
}
