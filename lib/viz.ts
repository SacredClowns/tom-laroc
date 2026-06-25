// Shared, per-frame visualizer state for the color picker + FX triggers.
// Read by every visualizer each frame (no React re-renders).

export const vizState: {
  color: string | null; // persistent color override (null = auto / phase tint)
  flash: number; // transient FX burst 0..~1.4, decays
  flashColor: string | null;
} = { color: null, flash: 0, flashColor: null };

export function setVizColor(c: string | null) {
  vizState.color = c;
}

// Fire a momentary color + energy burst (an FX icon press).
export function triggerFlash(color: string, strength = 1) {
  vizState.flash = Math.min(1.4, strength);
  vizState.flashColor = color;
}

// Decay the flash — call ONCE per frame from the active visualizer.
export function tickFlash(delta: number) {
  if (vizState.flash > 0) vizState.flash = Math.max(0, vizState.flash - delta * 1.3);
  return vizState.flash;
}

export function vizFlash() {
  return vizState.flash;
}

// The hex a visualizer should aim for this frame, given its phase fallback.
export function vizTargetHex(fallback: string) {
  if (vizState.flash > 0.04 && vizState.flashColor) return vizState.flashColor;
  return vizState.color || fallback;
}
