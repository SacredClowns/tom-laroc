import { NextResponse } from "next/server";
import { getInquiry, markContacted } from "@/lib/store";
import { renderTemplate, type TemplateId } from "@/lib/email-templates";
import { CONTACT_EMAIL, FROM_EMAIL } from "@/lib/contact";

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
  const key = process.env.RESEND_API_KEY;
  const from = process.env.INQUIRY_FROM || FROM_EMAIL;
  const replyTo = process.env.INQUIRY_TO || CONTACT_EMAIL;

  // No Resend yet → hand the rendered email back so Tom can copy or mailto it.
  if (!key) {
    return NextResponse.json({
      ok: false,
      fallback: true,
      subject: email.subject,
      html: email.html,
      text: email.text,
      to: contact.email,
      link,
    });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: contact.email,
        reply_to: replyTo,
        subject: email.subject,
        html: email.html,
        text: email.text,
      }),
    });
    if (!res.ok) {
      const detail = await res.text();
      return NextResponse.json({ ok: false, error: detail }, { status: 502 });
    }
    await markContacted(contact.id, templateId).catch(() => {});
    return NextResponse.json({ ok: true, link });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
