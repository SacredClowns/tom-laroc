import { NextResponse } from "next/server";
import { getInquiry } from "@/lib/store";
import { renderTemplate, type TemplateId } from "@/lib/email-templates";

export async function POST(req: Request) {
  const { contactId, templateId } = await req.json().catch(() => ({}));
  if (!contactId || !templateId) {
    return NextResponse.json({ ok: false, error: "Missing fields." }, { status: 400 });
  }

  const contact = await getInquiry(contactId);
  if (!contact) {
    return NextResponse.json({ ok: false, error: "Contact not found." }, { status: 404 });
  }

  const link = `${new URL(req.url).origin}/for/${contact.id}`;
  const email = renderTemplate(templateId as TemplateId, { contact, link });

  return NextResponse.json({ ok: true, ...email, link });
}
