// Full-width scrolling "now playing" ticker, in the Syne display face.
// Two identical strips translate -50% for a seamless loop.

function Strip({ text }: { text: string }) {
  return (
    <div className="flex shrink-0 items-center">
      {Array.from({ length: 4 }).map((_, i) => (
        <span key={i} className="flex items-center">
          <span
            className="display whitespace-nowrap text-4xl font-semibold tracking-tightest md:text-7xl"
            style={{ color: "var(--fg)" }}
          >
            {text}
          </span>
          <span className="mx-8 text-2xl md:text-4xl" style={{ color: "var(--accent)" }}>
            ✺
          </span>
        </span>
      ))}
    </div>
  );
}

export default function Marquee({ text }: { text: string }) {
  return (
    <div className="w-full overflow-hidden">
      <div className="flex w-max animate-marquee">
        <Strip text={text} />
        <Strip text={text} />
      </div>
    </div>
  );
}
