"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePhase, type Phase } from "@/lib/phase";
import { audioState, vizEnergy } from "@/lib/audio";
import { vizTargetHex, tickFlash } from "@/lib/viz";

const TINT: Record<Phase, string> = {
  warmup: "#5fd06a",
  peak: "#5fd06a",
  afterhours: "#5fd06a",
  sunrise: "#5fd06a",
};

// Draw a cannabis leaf (white, on transparent) to a canvas → texture.
// White so the material color can re-tint it via the color picker.
function makeLeafTexture(): THREE.Texture {
  const s = 256;
  const cv = document.createElement("canvas");
  cv.width = s;
  cv.height = s;
  const ctx = cv.getContext("2d")!;
  ctx.translate(s / 2, s * 0.66);
  ctx.fillStyle = "#ffffff";
  const L = s * 0.42;
  const specs: [number, number][] = [
    [-74, 0.42], [-50, 0.6], [-26, 0.82], [0, 1], [26, 0.82], [50, 0.6], [74, 0.42],
  ];
  for (const [deg, sc] of specs) {
    ctx.save();
    ctx.rotate((deg * Math.PI) / 180);
    const w = L * 0.17;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-w, -L * sc * 0.35, -w * 0.55, -L * sc * 0.82, 0, -L * sc);
    ctx.bezierCurveTo(w * 0.55, -L * sc * 0.82, w, -L * sc * 0.35, 0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  ctx.fillRect(-1.5, 0, 3, s * 0.14); // stem
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

type Leaf = { x: number; y: number; z: number; rot: number; spin: number; sway: number; phase: number; scale: number };

export default function VizLeaves({ count = 18 }: { count?: number }) {
  const refs = useRef<THREE.Mesh[]>([]);
  const { phase } = usePhase();
  const tint = useMemo(() => new THREE.Color(), []);
  const texture = useMemo(() => makeLeafTexture(), []);
  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1), []);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: texture,
        color: new THREE.Color(TINT.warmup),
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
        depthWrite: false,
        toneMapped: false,
      }),
    [texture]
  );

  const leaves = useMemo<Leaf[]>(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 9,
        y: (Math.random() - 0.5) * 8,
        z: (Math.random() - 0.5) * 4 - 1,
        rot: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 1.4,
        sway: 0.6 + Math.random() * 1.2,
        phase: Math.random() * Math.PI * 2,
        scale: 0.6 + Math.random() * 0.9,
      })),
    [count]
  );

  useFrame((state, delta) => {
    audioState.level += (audioState.target - audioState.level) * Math.min(1, delta * 2.5);
    const f = tickFlash(delta);
    const e = vizEnergy(audioState.level, state.clock.elapsedTime, audioState.playing) + f;
    const t = state.clock.elapsedTime;

    refs.current.forEach((m, i) => {
      if (!m) return;
      const lf = leaves[i];
      // float up, recycle
      lf.y += delta * (0.4 + e * 1.6);
      if (lf.y > 4.5) lf.y = -4.5;
      const sway = Math.sin(t * lf.sway + lf.phase) * (0.5 + e * 0.6);
      m.position.set(lf.x + sway, lf.y, lf.z);
      // tumble / dance
      m.rotation.z = lf.rot + t * lf.spin;
      m.rotation.x = Math.sin(t * 1.3 + lf.phase) * 0.6;
      m.rotation.y = Math.cos(t * 1.1 + lf.phase) * 0.6;
      const pulse = lf.scale * (1 + e * 0.5 + Math.sin(t * 6 + lf.phase) * 0.08 * (0.3 + e));
      m.scale.setScalar(pulse);
    });

    tint.set(vizTargetHex(TINT[phase]));
    material.color.lerp(tint, Math.min(1, delta * 1.5));
    material.opacity = 0.8 + e * 0.2;
  });

  return (
    <group>
      {leaves.map((_, i) => (
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
