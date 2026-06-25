"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePhase, type Phase } from "@/lib/phase";
import { audioState, vizEnergy } from "@/lib/audio";
import { vizTargetHex, tickFlash } from "@/lib/viz";

const TINT: Record<Phase, [string, string]> = {
  warmup: ["#1b2a55", "#6c8cff"],
  peak: ["#5a1208", "#ff6a3d"],
  afterhours: ["#2a1a55", "#8b6cff"],
  sunrise: ["#5a2a14", "#ffb37e"],
};

const vertex = /* glsl */ `
uniform float uTime; uniform float uEnergy;
varying float vH;
void main(){
  vec3 p = position;
  float t = uTime;
  float h = sin(p.x * 0.6 + t * 1.2) * cos(p.y * 0.6 + t * 1.0);
  h += 0.5 * sin(p.x * 1.3 - t * 1.7) * cos(p.y * 1.1 + t * 1.3);
  h *= (0.25 + uEnergy * 1.6);
  vH = h;
  p.z += h;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

const fragment = /* glsl */ `
uniform vec3 uColorA; uniform vec3 uColorB; uniform float uEnergy;
varying float vH;
void main(){
  float m = smoothstep(-1.0, 1.0, vH);
  vec3 c = mix(uColorA, uColorB, m);
  c += uEnergy * 0.5 * uColorB;
  gl_FragColor = vec4(c, 0.9);
}
`;

export default function VizWave() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { phase } = usePhase();
  const a = useMemo(() => new THREE.Color(), []);
  const b = useMemo(() => new THREE.Color(), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uEnergy: { value: 0 },
      uColorA: { value: new THREE.Color(TINT.warmup[0]) },
      uColorB: { value: new THREE.Color(TINT.warmup[1]) },
    }),
    []
  );

  useFrame((state, delta) => {
    audioState.level += (audioState.target - audioState.level) * Math.min(1, delta * 2.5);
    const f = tickFlash(delta);
    const e = vizEnergy(audioState.level, state.clock.elapsedTime, audioState.playing) + f * 1.2;
    const m = mat.current;
    if (m) {
      m.uniforms.uTime.value = state.clock.elapsedTime;
      m.uniforms.uEnergy.value = e;
      a.set(TINT[phase][0]);
      b.set(vizTargetHex(TINT[phase][1]));
      (m.uniforms.uColorA.value as THREE.Color).lerp(a, Math.min(1, delta * 1.5));
      (m.uniforms.uColorB.value as THREE.Color).lerp(b, Math.min(1, delta * 1.5));
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2.4, 0, 0]} position={[0, -0.6, 0]}>
      <planeGeometry args={[18, 18, 110, 110]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        wireframe
        transparent
      />
    </mesh>
  );
}
