// A small spinning vinyl record — pure CSS, no WebGL. Used in place of the
// service numbers, each with its own label color. Spin pauses under
// prefers-reduced-motion (handled globally in globals.css).

export default function Vinyl({
  color,
  size = 52,
}: {
  color: string;
  size?: number;
}) {
  return (
    <span
      aria-hidden
      className="block animate-[spin_6s_linear_infinite] rounded-full"
      style={{
        width: size,
        height: size,
        // grooved black disc
        background:
          "repeating-radial-gradient(circle at 50% 50%, #0b0b10 0, #0b0b10 1px, #181820 1px, #181820 2.4px)",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05), 0 2px 10px rgba(0,0,0,0.5)",
        position: "relative",
      }}
    >
      {/* sheen */}
      <span
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.12), transparent 45%, transparent 60%, rgba(255,255,255,0.06))",
        }}
      />
      {/* colored center label */}
      <span
        className="absolute left-1/2 top-1/2 rounded-full"
        style={{
          width: "44%",
          height: "44%",
          transform: "translate(-50%, -50%)",
          background: color,
          boxShadow: `0 0 12px ${color}66`,
        }}
      />
      {/* spindle hole */}
      <span
        className="absolute left-1/2 top-1/2 rounded-full"
        style={{
          width: 4,
          height: 4,
          transform: "translate(-50%, -50%)",
          background: "var(--bg)",
        }}
      />
    </span>
  );
}
