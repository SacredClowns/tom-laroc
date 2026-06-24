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
    // calm, slow-breathing baseline; energy only really rises with playback
    const baseline = 0.06 + 0.03 * Math.sin(t * 1.0);
    const energy = baseline + audioState.level * (0.4 + 0.3 * pulse);

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
      groupRef.current.rotation.y += delta * 0.05;
      groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.1;
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
    </group>
  );
}
