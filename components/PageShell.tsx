import Footer from "@/components/Footer";

export default function PageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children?: React.ReactNode;
}) {
  return (
    <main className="min-h-screen pt-40">
      <section className="mx-auto max-w-5xl px-6 pb-32">
        <p
          className="mb-4 text-xs uppercase tracking-widest2"
          style={{ color: "var(--accent)" }}
        >
          {eyebrow}
        </p>
        <h1 className="display text-5xl leading-[0.95] md:text-8xl">{title}</h1>
        {intro && (
          <p className="mt-8 max-w-2xl text-lg" style={{ color: "var(--muted)" }}>
            {intro}
          </p>
        )}
        {children}
      </section>
      <Footer />
    </main>
  );
}
