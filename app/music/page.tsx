import PageShell from "@/components/PageShell";

export const metadata = { title: "Music — Tom Laroc" };

export default function MusicPage() {
  return (
    <PageShell
      eyebrow="Music"
      title="Releases & Discography."
      intro="Productions, reworks, and directed videos. Embed Spotify, Apple, and the Blue Monday video here; wire releases to Supabase."
    >
      <p className="mt-12 text-sm" style={{ color: "var(--muted)" }}>
        Placeholder — release grid coming once the catalog is wired.
      </p>
    </PageShell>
  );
}
