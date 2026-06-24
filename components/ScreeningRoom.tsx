"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import type { Video } from "@/lib/youtube";
import { YT_URL } from "@/lib/youtube";

export default function ScreeningRoom({ videos }: { videos: Video[] }) {
  const [active, setActive] = useState(0);

  if (videos.length === 0) {
    return (
      <div
        className="rounded-2xl border p-10 text-center"
        style={{ borderColor: "var(--accent-soft)" }}
      >
        <p style={{ color: "var(--muted)" }}>
          The screening room is loading.{" "}
          <a href={YT_URL} className="underline" style={{ color: "var(--accent)" }}>
            Watch on YouTube →
          </a>
        </p>
      </div>
    );
  }

  const current = videos[active];

  return (
    <div>
      {/* feature player */}
      <div
        className="overflow-hidden rounded-2xl border"
        style={{ borderColor: "var(--accent-soft)" }}
      >
        <div className="relative aspect-video w-full">
          <iframe
            key={current.id}
            src={`https://www.youtube.com/embed/${current.id}?rel=0`}
            title={current.title}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
      <p className="mt-4 text-lg" style={{ color: "var(--fg)" }}>
        {current.title}
      </p>

      {/* grid */}
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((v, i) => {
          const on = i === active;
          return (
            <button
              key={v.id}
              onClick={() => {
                setActive(i);
                if (typeof window !== "undefined")
                  window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="group overflow-hidden rounded-xl border text-left transition-colors"
              style={{ borderColor: on ? "var(--accent)" : "var(--accent-soft)" }}
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={v.thumb}
                  alt={v.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span
                  className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
                  style={{ backgroundColor: "color-mix(in srgb, var(--bg) 35%, transparent)" }}
                >
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-full"
                    style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
                  >
                    ▶
                  </span>
                </span>
                {on && (
                  <span
                    className="absolute bottom-2 right-2 rounded-full px-2 py-1 text-[10px]"
                    style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
                  >
                    now playing
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="line-clamp-2 text-sm" style={{ color: "var(--fg)" }}>
                  {v.title}
                </p>
                <p className="mt-1 text-[11px]" style={{ color: "var(--muted)" }}>
                  {v.year}
                  {v.views ? ` · ${v.views.toLocaleString()} views` : ""}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <p className="mt-10 text-center text-xs" style={{ color: "var(--muted)" }}>
        <a href={YT_URL} className="underline" style={{ color: "var(--accent)" }}>
          Full channel on YouTube →
        </a>
      </p>
    </div>
  );
}
