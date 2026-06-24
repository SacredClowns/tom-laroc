import PageShell from "@/components/PageShell";
import InnerCircle from "@/components/InnerCircle";

export const metadata = { title: "Inner Circle — Tom Laroc" };

export default function InnerCirclePage() {
  return (
    <PageShell eyebrow="Inner Circle" title="Let me in.">
      <div className="-mx-6">
        <InnerCircle />
      </div>
    </PageShell>
  );
}
