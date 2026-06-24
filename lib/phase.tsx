"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type Phase = "warmup" | "peak" | "afterhours" | "sunrise";

export const PHASES: {
  id: Phase;
  label: string;
  time: string;
  mood: string;
  nowPlaying: string;
}[] = [
  {
    id: "warmup",
    label: "Warm-Up",
    time: "22:00",
    mood: "A room finding its pulse. Patient, warm, low to the floor.",
    nowPlaying: "Sleeping Bag, Side A — vinyl warm-up edit",
  },
  {
    id: "peak",
    label: "Peak",
    time: "01:00",
    mood: "The room breaks open. Everyone arrives at the same second.",
    nowPlaying: "Blue Monday (Laroc Rework, feat. Peter Hook)",
  },
  {
    id: "afterhours",
    label: "Afterhours",
    time: "03:30",
    mood: "It turns inward. Fewer people, more truth.",
    nowPlaying: "Hi-Fi-Ai — generative drift, live take",
  },
  {
    id: "sunrise",
    label: "Sunrise",
    time: "06:00",
    mood: "First pink light. Everyone leaves changed.",
    nowPlaying: "All Falls Down — archive edit, 2005",
  },
];

type PhaseCtx = {
  phase: Phase;
  setPhase: (p: Phase) => void;
};

const Ctx = createContext<PhaseCtx | null>(null);

export function PhaseProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("warmup");
  return (
    <Ctx.Provider value={{ phase, setPhase }}>
      <div
        data-phase={phase}
        style={{
          backgroundColor: "var(--bg)",
          color: "var(--fg)",
          minHeight: "100vh",
          transition: "background-color 1.2s ease, color 1.2s ease",
        }}
      >
        {children}
      </div>
    </Ctx.Provider>
  );
}

export function usePhase() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePhase must be used within PhaseProvider");
  return ctx;
}
