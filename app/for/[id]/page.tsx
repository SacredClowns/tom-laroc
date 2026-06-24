import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getInquiry } from "@/lib/store";
import ForYou from "@/components/ForYou";

export const dynamic = "force-dynamic";

// Bespoke pages are private — keep them out of search engines.
export const metadata: Metadata = {
  title: "A note from Tom Laroc",
  robots: { index: false, follow: false },
};

export default async function ForYouPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const contact = await getInquiry(id);
  if (!contact) notFound();

  return (
    <ForYou
      name={contact.name}
      company={contact.company}
      challenge={contact.challenge}
      focus={contact.focus}
    />
  );
}
