// Minimal monochrome FX glyphs (currentColor). Tasteful, line/fill — not emoji.

type P = { className?: string };

export function Leaf({ className }: P) {
  // stylized cannabis leaf — 7 leaflets radiating from the stem
  const leaflet = "M0 0 C -2.1 -5 -1.4 -12 0 -16.5 C 1.4 -12 2.1 -5 0 0 Z";
  const specs: [number, number][] = [
    [-72, 0.45],
    [-48, 0.66],
    [-24, 0.86],
    [0, 1],
    [24, 0.86],
    [48, 0.66],
    [72, 0.45],
  ];
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <g transform="translate(12 21)">
        {specs.map(([rot, sc], i) => (
          <path key={i} d={leaflet} transform={`rotate(${rot}) scale(${sc})`} />
        ))}
        <rect x="-0.5" y="-1" width="1" height="4" rx="0.5" />
      </g>
    </svg>
  );
}

export function Bolt({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M13 2 L5 13 h5 l-1 9 9-12 h-5 z" />
    </svg>
  );
}

export function Sparkle({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2 C13 8 16 11 22 12 C16 13 13 16 12 22 C11 16 8 13 2 12 C8 11 11 8 12 2 Z" />
    </svg>
  );
}

export function Flame({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2 C13 6 17 8 16.5 13 a4.5 4.5 0 1 1 -9 0 C7.2 10.5 9 9.5 9.2 7 C10 8.4 11 8.2 12 7.4 C12.4 5.6 12.2 3.8 12 2 Z" />
    </svg>
  );
}

export function Note({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M9 4 v11.6 a3 3 0 1 1 -2 -2.8 V6.2 L19 4 z" />
    </svg>
  );
}

export function Record({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="2.4" fill="currentColor" />
    </svg>
  );
}

export function Star({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2 l2.9 6.2 6.8 .7 -5.1 4.6 1.5 6.7 -6.1 -3.5 -6.1 3.5 1.5 -6.7 -5.1 -4.6 6.8 -.7 z" />
    </svg>
  );
}

export function Diamond({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2 L21 9 L12 22 L3 9 Z" />
    </svg>
  );
}
