import PageShell from "@/components/PageShell";
import TourMap from "@/components/TourMap";

export const metadata = { title: "Footprint — Tom Laroc" };

export default function FootprintPage() {
  return (
    <PageShell
      eyebrow="Footprint"
      title="Where the work has traveled."
      intro="Based in South Beach, Miami for 20+ years. From the Bronx to Miami to the decks of Jamaica to immersive rooms with no walls — and the talks and exhibitions coming next."
    >
      <div className="mt-8 -mx-6">
        <TourMap />
      </div>
    </PageShell>
  );
}
