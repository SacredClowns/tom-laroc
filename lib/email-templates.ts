// Outreach templates. Each renders a personalized email whose payoff is a link
// to a one-of-one microsite (/for/[id]) built for that exact recipient — the
// "dynamic experience" lives on the web page; the email is the elegant teaser.
//
// Pure functions, no secrets — safe to import anywhere. TEMPLATE_META is the
// serializable list the admin UI uses for its dropdown.

import type { Inquiry } from "@/lib/store";

export type RenderedEmail = {
  subject: string;
  html: string;
  text: string;
};

type Ctx = { contact: Inquiry; link: string };

export const TEMPLATE_META = [
  { id: "personal-note", name: "The Personal Note", tone: "Warm · short · human" },
  { id: "ai-audit", name: "The Audit Offer", tone: "Value-led · concrete" },
  { id: "strategist", name: "The Strategist", tone: "Sharp · insight-first" },
] as const;

export type TemplateId = (typeof TEMPLATE_META)[number]["id"];

function first(name: string) {
  return (name || "there").trim().split(" ")[0];
}

const C = {
  ink: "#0b0d14",
  card: "#ffffff",
  text: "#14161f",
  muted: "#6b7280",
  accent: "#7c5cff",
};

function shell(opts: {
  preheader: string;
  bodyHtml: string;
  link: string;
  ctaLabel: string;
}) {
  return `<!doctype html><html><body style="margin:0;background:${C.ink};">
  <span style="display:none;opacity:0;color:transparent;height:0;overflow:hidden;">${opts.preheader}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.ink};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:${C.card};border-radius:18px;overflow:hidden;">
        <tr><td style="background:${C.ink};padding:22px 28px;">
          <span style="color:#fff;font:700 17px/1 'Helvetica Neue',Arial,sans-serif;letter-spacing:.04em;">TOM&nbsp;LAROC</span>
          <span style="color:${C.accent};font:700 10px/1 Arial,sans-serif;letter-spacing:.25em;"> &nbsp;HI-FI-AI</span>
        </td></tr>
        <tr><td style="padding:32px 28px 8px;">
          ${opts.bodyHtml}
        </td></tr>
        <tr><td style="padding:8px 28px 32px;">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td style="border-radius:999px;background:${C.accent};">
              <a href="${opts.link}" style="display:inline-block;padding:15px 30px;color:#fff;font:600 13px/1 Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;text-decoration:none;border-radius:999px;">${opts.ctaLabel}</a>
            </td>
          </tr></table>
          <p style="margin:18px 0 0;color:${C.muted};font:400 12px/1.5 Arial,sans-serif;">
            This page was built for you alone. No one else has this link.
          </p>
        </td></tr>
        <tr><td style="padding:16px 28px;background:#f4f1ea;color:${C.muted};font:400 12px/1.5 Arial,sans-serif;">
          Tom Laroc · AI strategy &amp; creative direction · tomlaroc.com
        </td></tr>
      </table>
    </td></tr>
  </table></body></html>`;
}

function p(text: string) {
  return `<p style="margin:0 0 16px;color:${C.text};font:400 16px/1.6 'Helvetica Neue',Arial,sans-serif;">${text}</p>`;
}

const RENDERERS: Record<TemplateId, (c: Ctx) => RenderedEmail> = {
  "personal-note": ({ contact, link }) => {
    const f = first(contact.name);
    const co = contact.company ? ` at ${contact.company}` : "";
    return {
      subject: `${f}, I made you something.`,
      html: shell({
        preheader: `A page built just for you, ${f}.`,
        ctaLabel: "Open your page",
        link,
        bodyHtml:
          p(`Hi ${f},`) +
          p(`Thanks for reaching out about what you're building${co}. Instead of a wall of text, I put together a short page — just for you — on how I'd approach it.`) +
          p(`Take a look. If it lands, hit reply and we'll talk.`) +
          p(`— Tom`),
      }),
      text: `Hi ${f},\n\nThanks for reaching out${co}. I built you a short page on how I'd approach it: ${link}\n\nIf it lands, just reply.\n\n— Tom`,
    };
  },

  "ai-audit": ({ contact, link }) => {
    const f = first(contact.name);
    const co = contact.company || "your business";
    const focus = contact.focus?.length ? contact.focus[0].toLowerCase() : "AI";
    return {
      subject: `A 60-second read on ${co} + AI`,
      html: shell({
        preheader: `Where AI actually moves the needle for ${co}.`,
        ctaLabel: "See your read",
        link,
        bodyHtml:
          p(`Hi ${f},`) +
          p(`You mentioned ${focus} — so I sketched out where I think AI can actually move the needle for ${co}, and where it's just noise.`) +
          p(`It's on a page I made for you. Two minutes, no pitch deck. If it's useful, my AI Audit turns it into a prioritized plan you own.`) +
          p(`— Tom`),
      }),
      text: `Hi ${f},\n\nI sketched where AI can move the needle for ${co}: ${link}\n\nTwo minutes, no pitch deck.\n\n— Tom`,
    };
  },

  strategist: ({ contact, link }) => {
    const f = first(contact.name);
    return {
      subject: `${f} — AI is just reading the room`,
      html: shell({
        preheader: `Forty years of it, actually.`,
        ctaLabel: "Read it",
        link,
        bodyHtml:
          p(`Hi ${f},`) +
          p(`Most people treat AI like a slot machine. I treat it like a DJ set — temperature, constraints, intent, reading the room. I've run that loop for forty years; the tools just caught up.`) +
          p(`I wrote down how that applies to what you're working on. It's a page made for you — give it a look.`) +
          p(`— Tom`),
      }),
      text: `Hi ${f},\n\nAI is just reading the room — I've done it for forty years. Here's how it applies to you: ${link}\n\n— Tom`,
    };
  },
};

export function renderTemplate(id: TemplateId, ctx: Ctx): RenderedEmail {
  const r = RENDERERS[id] || RENDERERS["personal-note"];
  return r(ctx);
}
