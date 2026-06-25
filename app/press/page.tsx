import PageShell from "@/components/PageShell";

export const metadata = { title: "Press / EPK — Tom Laroc" };

export default function PressPage() {
  return (
    <PageShell
      eyebrow="Press / EPK"
      title="The kit."
      intro="Bio, hi-res imagery, logos, tech rider, and quotes. Downloadable press pack lives here."
    >
      <a
        href="#"
        className="mt-12 inline-block rounded-full border px-7 py-4 text-xs uppercase font-medium tracking-[0.2em]"
        style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
      >
        Download EPK (placeholder)
      </a>
    </PageShell>
  );
}
