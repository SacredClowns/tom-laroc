"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "./shaders";
import { usePhase, type Phase } from "@/lib/phase";
import { audioState } from "@/lib/audio";

// Per-phase look: [colorA, colorB, turbulence/intensity 0..1]
const PHASE_LOOK: Record<Phase, { a: string; b: string; intensity: number }> = {
  warmup: { a: "#1b2a55", b: "#6c8cff", intensity: 0.25 },
  peak: { a: "#5a1208", b: "#ff6a3d", intensity: 1.0 },
  afterhours: { a: "#2a1a55", b: "#8b6cff", intensity: 0.6 },
  sunrise: { a: "#5a2a14", b: "#ffb37e", intensity: 0.4 },
};

export default function FrequencyOrb({ detail = 24 }: { detail?: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { phase } = usePhase();

  // Target colors lerped toward each frame (so phase changes morph smoothly).
  const target = useMemo(
    () => ({
      a: new THREE.Color(),
      b: new THREE.Color(),
      intensity: 0,
    }),
    []
  );

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAudio: { value: 0 },
      uIntensity: { value: 0.25 },
      uColorA: { value: new THREE.Color(PHASE_LOOK.warmup.a) },
      uColorB: { value: new THREE.Color(PHASE_LOOK.warmup.b) },
    }),
    []
  );

  useFrame((state, delta) => {
    const look = PHASE_LOOK[phase];
    target.a.set(look.a);
    target.b.set(look.b);
    target.intensity = look.intensity;

    // ease audio energy toward target, with a living pulse while playing
    audioState.level += (audioState.target - audioState.level) * Math.min(1, delta * 2.5);
    const t = state.clock.elapsedTime;
    const pulse = audioState.playing
      ? 0.5 + 0.5 * Math.sin(t * 6.0)
      : 1.0;
    // alive even before anyone presses play: baseline shimmer + periodic bursts
    const baseline = 0.14 + 0.07 * Math.sin(t * 1.6);
    const burst = Math.pow(Math.max(0, Math.sin(t * 0.5)), 10) * 0.6;
    const energy = baseline + burst + audioState.level * (0.6 + 0.4 * pulse);

    const m = matRef.current;
    if (m) {
      const u = m.uniforms;
      u.uTime.value = state.clock.elapsedTime;
      u.uAudio.value = energy;
      const k = Math.min(1, delta * 1.6);
      (u.uColorA.value as THREE.Color).lerp(target.a, k);
      (u.uColorB.value as THREE.Color).lerp(target.b, k);
      u.uIntensity.value += (target.intensity - u.uIntensity.value) * k;
    }

    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (0.12 + energy * 0.5);
      groupRef.current.rotation.x = Math.sin(t * 0.15) * 0.16;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[1.25, detail]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </mesh>

      {/* faint inner wireframe for depth */}
      <mesh scale={0.985}>
        <icosahedronGeometry args={[1.25, 3]} />
        <meshBasicMaterial wireframe color="#ffffff" transparent opacity={0.04} />
      </mesh>
    </group>
  );
}
