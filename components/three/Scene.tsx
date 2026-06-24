"use client";

import { useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import FrequencyOrb from "./FrequencyOrb";
import Particles from "./Particles";
import Beams from "./Beams";

function CameraRig() {
  useFrame((state) => {
    const px = state.pointer.x * 0.7;
    const py = state.pointer.y * 0.45;
    state.camera.position.x += (px - state.camera.position.x) * 0.045;
    state.camera.position.y += (py - state.camera.position.y) * 0.045;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function Scene() {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [small, setSmall] = useState(false);

  useEffect(() => {
    setMounted(true);
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setSmall(window.matchMedia("(max-width: 768px)").matches);
  }, []);

  if (!mounted) return null;

  const detail = small ? 14 : 26; // lighter geometry on mobile
  const particleCount = small ? 600 : 1500;

  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, small ? 1.5 : 1.9]}
      camera={{ position: [0, 0, 4.4], fov: 42 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
      frameloop={reduced ? "demand" : "always"}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 3, 5]} intensity={20} />

      <Beams count={small ? 7 : 10} />
      <FrequencyOrb detail={detail} />
      <Particles count={particleCount} />

      {!reduced && <CameraRig />}

      <EffectComposer>
        <Bloom
          intensity={1.9}
          luminanceThreshold={0.12}
          luminanceSmoothing={0.6}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.0006, 0.0009)}
        />
        <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.35} />
        <Vignette eskil={false} offset={0.25} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
}
