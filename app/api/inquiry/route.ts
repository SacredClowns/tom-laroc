import { NextResponse } from "next/server";
import { CONTACT_EMAIL, FROM_EMAIL } from "@/lib/contact";
import { addInquiry } from "@/lib/store";

type Inquiry = {
  name?: string;
  email?: string;
  company?: string;
  role?: string;
  website?: string;
  industry?: string;
  focus?: string[];
  challenge?: string;
  timeline?: string;
  budget?: string;
  notes?: string;
};

function esc(s = "") {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function row(label: string, value?: string) {
  if (!value) return "";
  return `<tr>
    <td style="padding:8px 16px;color:#8a8f9c;font:13px/1.4 system-ui;vertical-align:top;white-space:nowrap;">${label}</td>
    <td style="padding:8px 16px;color:#11131a;font:14px/1.5 system-ui;">${esc(value)}</td>
  </tr>`;
}

function inquiryHtml(d: Inquiry) {
  return `
  <div style="background:#0b0d14;padding:32px;">
    <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;">
      <div style="background:#0b0d14;padding:24px 24px 20px;">
        <p style="margin:0;color:#8b6cff;font:600 11px/1 system-ui;letter-spacing:.3em;text-transform:uppercase;">New Inquiry</p>
        <h1 style="margin:8px 0 0;color:#fff;font:600 22px/1.2 Georgia,serif;">${esc(d.name || "")}${
          d.company ? ` · ${esc(d.company)}` : ""
        }</h1>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        ${row("Email", d.email)}
        ${row("Role", d.role)}
        ${row("Company", d.company)}
        ${row("Industry", d.industry)}
        ${row("Website", d.website)}
        ${row("Focus", (d.focus || []).join(", "))}
        ${row("Timeline", d.timeline)}
        ${row("Budget", d.budget)}
        ${row("Challenge", d.challenge)}
        ${row("Notes", d.notes)}
      </table>
      <div style="padding:16px 24px;background:#f4f1ea;color:#8a8f9c;font:12px/1.5 system-ui;">
        Reply directly to this email to reach ${esc(d.name || "them")}.
      </div>
    </div>
  </div>`;
}

function autoReplyHtml(name: string) {
  const first = (name || "there").split(" ")[0];
  return `
  <div style="background:#0b0d14;padding:32px;">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:32px;">
      <p style="margin:0 0 16px;color:#11131a;font:16px/1.6 system-ui;">Hi ${esc(first)},</p>
      <p style="margin:0 0 16px;color:#11131a;font:16px/1.6 system-ui;">
        Thanks for reaching out. I read every one of these personally — give me a couple of days
        and I'll come back to you with an honest, specific take on where AI can actually move the
        needle for your business. No template, no funnel.
      </p>
      <p style="margin:0 0 24px;color:#11131a;font:16px/1.6 system-ui;">— Tom</p>
      <p style="margin:0;color:#8a8f9c;font:13px/1.5 system-ui;">
        Tom Laroc · AI strategy &amp; creative direction · tomlaroc.com
      </p>
    </div>
  </div>`;
}

async function sendEmail(key: string, payload: Record<string, unknown>) {
  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function POST(req: Request) {
  let data: Inquiry;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  const name = (data.name || "").trim();
  const email = (data.email || "").trim();
  if (!name || !email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "A name and valid email are required." },
      { status: 422 }
    );
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_TO || CONTACT_EMAIL;
  const from = process.env.INQUIRY_FROM || FROM_EMAIL;

  // 1) Persist the lead first — it must never be lost, email or not.
  let saved = false;
  try {
    await addInquiry({
      name,
      email,
      company: data.company,
      role: data.role,
      website: data.website,
      industry: data.industry,
      focus: data.focus,
      challenge: data.challenge,
      timeline: data.timeline,
      budget: data.budget,
      notes: data.notes,
    });
    saved = true;
  } catch (e) {
    console.error("inquiry persist failed:", e);
  }

  // 2) Best-effort email notification + branded auto-reply (when configured).
  let emailed = false;
  if (key) {
    try {
      const res = await sendEmail(key, {
        from,
        to,
        reply_to: email,
        subject: `New inquiry — ${name}${data.company ? ` · ${data.company}` : ""}`,
        html: inquiryHtml(data),
      });
      if (res.ok) {
        emailed = true;
        try {
          await sendEmail(key, {
            from,
            to: email,
            subject: "Thanks — Tom will be in touch",
            html: autoReplyHtml(name),
          });
        } catch {
          /* non-fatal */
        }
      }
    } catch (e) {
      console.error("inquiry email failed:", e);
    }
  }

  // Nothing landed anywhere — let the client hand off via mailto so the lead
  // still reaches Tom.
  if (!saved && !emailed) {
    return NextResponse.json({ ok: false, fallback: true });
  }

  return NextResponse.json({ ok: true });
}
