import type { Metadata } from "next";
import { getMixes } from "@/lib/mixcloud";
import VisualizerRoom from "@/components/VisualizerRoom";

export const metadata: Metadata = {
  title: "The Visualizer — Play Tom's Mixes",
  description:
    "Play any of Tom Laroc's mixes and watch them come alive — choose your visualizer: The Frequency orb, a wave field, or warp. A 40-year archive, in motion.",
  alternates: { canonical: "/visualizer" },
};

export const revalidate = 86400;

export default async function VisualizerPage() {
  const mixes = await getMixes();
  return <VisualizerRoom mixes={mixes} />;
}
