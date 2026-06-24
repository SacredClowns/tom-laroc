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
