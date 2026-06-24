import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="border-t px-6 py-16"
      style={{ borderColor: "var(--accent-soft)" }}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-10 md:flex-row md:justify-between">
        <div>
          <p className="display text-2xl tracking-tightest">
            TOM LAROC{" "}
            <span className="align-super text-[10px]" style={{ color: "var(--accent)" }}>
              HI-FI-AI
            </span>
          </p>
          <p className="mt-3 max-w-xs text-sm" style={{ color: "var(--muted)" }}>
            AI that never looks like AI.
          </p>
        </div>

        <div className="flex gap-16">
          <div className="flex flex-col gap-3 text-xs uppercase tracking-[0.2em]">
            <span style={{ color: "var(--accent)" }}>Explore</span>
            {[
              ["Work", "/work"],
              ["Archive", "/archive"],
              ["Footprint", "/live"],
              ["Dispatches", "/dispatches"],
            ].map(([l, h]) => (
              <Link key={h} href={h} style={{ color: "var(--muted)" }}>
                {l}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-3 text-xs uppercase tracking-[0.2em]">
            <span style={{ color: "var(--accent)" }}>Elsewhere</span>
            {[
              ["Mixcloud", "https://www.mixcloud.com/tomlaroc/"],
              ["X / @TomLaroc", "https://x.com/TomLaroc"],
              ["Work With Tom", "/bookings"],
              ["Press / EPK", "/press"],
            ].map(([l, h]) => (
              <a key={h} href={h} style={{ color: "var(--muted)" }}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-16 text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>
        © {new Date().getFullYear()} Tom Laroc — Hi-Fi-Ai. All sources credited.
      </p>
    </footer>
  );
}
