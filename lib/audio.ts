// Mutable singleton shared between the DOM mini-player and the WebGL orb.
// Read every frame inside useFrame (no React re-renders), written on play/pause.
//
// `level` eases toward `target` and carries the live energy that drives the
// shader's uAudio uniform. When real audio is wired, replace the simulated
// target with an AnalyserNode RMS reading via `pushAnalyser`.

type AudioState = {
  playing: boolean;
  target: number; // 0..1 desired energy
  level: number; // 0..1 smoothed energy (read by the shader)
};

export const audioState: AudioState = {
  playing: false,
  target: 0,
  level: 0,
};

const listeners = new Set<(playing: boolean) => void>();

export function setPlaying(playing: boolean) {
  audioState.playing = playing;
  audioState.target = playing ? 1 : 0;
  listeners.forEach((l) => l(playing));
}

export function togglePlaying() {
  setPlaying(!audioState.playing);
}

export function subscribe(l: (playing: boolean) => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

// Optional hook for a real Web Audio AnalyserNode (call each frame).
export function pushAnalyserRMS(rms: number) {
  audioState.target = Math.min(1, rms * 1.8);
}

// Shared "energy" the visualizers read each frame. Mixcloud audio can't be
// analyzed (cross-origin/DRM), so when a mix is playing we synthesize a
// convincing beat from layered oscillators scaled by the play state.
export function vizEnergy(level: number, t: number, playing: boolean) {
  const baseline = 0.12 + 0.06 * Math.sin(t * 1.4);
  if (!playing && level < 0.02) return baseline;
  const beat =
    0.55 +
    0.45 * Math.sin(t * 6.3) * Math.sin(t * 2.1) +
    0.2 * Math.sin(t * 11.0);
  return baseline + level * (0.45 + 0.75 * Math.max(0, beat));
}
