"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePhase, type Phase } from "@/lib/phase";
import { audioState, vizEnergy } from "@/lib/audio";
import { vizTargetHex, tickFlash } from "@/lib/viz";

export type Glyph = "leaf" | "note" | "record" | "star" | "bolt" | "diamond";

const DEFAULT_TINT: Record<Glyph, string> = {
  leaf: "#5fd06a",
  note: "#8b6cff",
  record: "#22d3ee",
  star: "#ffd166",
  bolt: "#ffffff",
  diamond: "#ff5fd2",
};

// White-on-transparent glyph → texture (recolored by material).
function makeGlyphTexture(glyph: Glyph): THREE.Texture {
  const s = 256;
  const cv = document.createElement("canvas");
  cv.width = s;
  cv.height = s;
  const ctx = cv.getContext("2d")!;
  const c = s / 2;
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#ffffff";

  if (glyph === "leaf") {
    ctx.save();
    ctx.translate(c, s * 0.66);
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
    ctx.fillRect(-1.5, 0, 3, s * 0.14);
    ctx.restore();
  } else if (glyph === "note") {
    ctx.beginPath();
    ctx.ellipse(c - 22, s * 0.68, 34, 24, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(c + 8, s * 0.24, 10, s * 0.46);
    ctx.beginPath();
    ctx.moveTo(c + 18, s * 0.24);
    ctx.quadraticCurveTo(c + 64, s * 0.32, c + 38, s * 0.52);
    ctx.quadraticCurveTo(c + 56, s * 0.34, c + 18, s * 0.4);
    ctx.fill();
  } else if (glyph === "record") {
    ctx.beginPath();
    ctx.arc(c, c, s * 0.36, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = s * 0.012;
    [0.2, 0.27].forEach((r) => {
      ctx.beginPath();
      ctx.arc(c, c, s * r, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.beginPath();
    ctx.arc(c, c, s * 0.045, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (glyph === "star") {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 ? s * 0.16 : s * 0.38;
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const x = c + Math.cos(a) * r;
      const y = c + Math.sin(a) * r;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  } else if (glyph === "bolt") {
    const p: [number, number][] = [
      [0.58, 0.06], [0.22, 0.54], [0.46, 0.54], [0.36, 0.94], [0.8, 0.4], [0.52, 0.4], [0.64, 0.06],
    ];
    ctx.beginPath();
    p.forEach(([px, py], i) => {
      const x = px * s, y = py * s;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
  } else {
    // diamond
    const p: [number, number][] = [[0.5, 0.06], [0.86, 0.4], [0.5, 0.95], [0.14, 0.4]];
    ctx.beginPath();
    p.forEach(([px, py], i) => {
      const x = px * s, y = py * s;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

const PHASE_FALLBACK: Record<Phase, string | null> = {
  warmup: null,
  peak: null,
  afterhours: null,
  sunrise: null,
};

type Item = { x: number; y: number; z: number; spin: number; sway: number; phase: number; scale: number };

export default function VizSwarm({ glyph, count = 18 }: { glyph: Glyph; count?: number }) {
  const refs = useRef<THREE.Mesh[]>([]);
  const { phase } = usePhase();
  const tint = useMemo(() => new THREE.Color(), []);
  const texture = useMemo(() => makeGlyphTexture(glyph), [glyph]);
  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1), []);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: texture,
        color: new THREE.Color(DEFAULT_TINT[glyph]),
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
        depthWrite: false,
        toneMapped: false,
      }),
    [texture, glyph]
  );

  const items = useMemo<Item[]>(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 9,
        y: (Math.random() - 0.5) * 8,
        z: (Math.random() - 0.5) * 4 - 1,
        spin: (Math.random() - 0.5) * 1.4,
        sway: 0.6 + Math.random() * 1.2,
        phase: Math.random() * Math.PI * 2,
        scale: 0.55 + Math.random() * 0.9,
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
      const it = items[i];
      it.y += delta * (0.4 + e * 1.6);
      if (it.y > 4.5) it.y = -4.5;
      const sway = Math.sin(t * it.sway + it.phase) * (0.5 + e * 0.6);
      m.position.set(it.x + sway, it.y, it.z);
      m.rotation.z = t * it.spin;
      m.rotation.x = Math.sin(t * 1.3 + it.phase) * 0.6;
      m.rotation.y = Math.cos(t * 1.1 + it.phase) * 0.6;
      m.scale.setScalar(it.scale * (1 + e * 0.5 + Math.sin(t * 6 + it.phase) * 0.08 * (0.3 + e)));
    });

    tint.set(vizTargetHex(PHASE_FALLBACK[phase] ?? DEFAULT_TINT[glyph]));
    material.color.lerp(tint, Math.min(1, delta * 1.5));
    material.opacity = 0.8 + e * 0.2;
  });

  return (
    <group>
      {items.map((_, i) => (
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
