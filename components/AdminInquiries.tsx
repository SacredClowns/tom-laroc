"use client";

import { useState } from "react";
import type { Inquiry } from "@/lib/store";
import { TEMPLATE_META } from "@/lib/email-templates";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d > 0) return `${d}d ago`;
  const h = Math.floor(diff / 3600000);
  if (h > 0) return `${h}h ago`;
  const m = Math.floor(diff / 60000);
  return m > 0 ? `${m}m ago` : "just now";
}

const STATUS_COLOR: Record<string, string> = {
  new: "var(--accent)",
  contacted: "var(--muted)",
  client: "#5fd08a",
};

export default function AdminInquiries({ inquiries }: { inquiries: Inquiry[] }) {
  if (inquiries.length === 0) {
    return (
      <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}>
        No inquiries yet. They&apos;ll appear here the moment someone submits the
        form on Work With Tom.
      </p>
    );
  }
  return (
    <div className="mt-5 space-y-3">
      {inquiries.map((i) => (
        <Card key={i.id} inquiry={i} />
      ))}
    </div>
  );
}

function Card({ inquiry: i }: { inquiry: Inquiry }) {
  const [composing, setComposing] = useState(false);

  return (
    <div className="rounded-2xl border p-5" style={{ borderColor: "var(--accent-soft)" }}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: STATUS_COLOR[i.status] || "var(--muted)" }}
            title={i.status}
          />
          <span className="text-base" style={{ color: "var(--fg)" }}>
            {i.name}
          </span>
          {i.company && (
            <span className="text-sm" style={{ color: "var(--muted)" }}>
              · {i.company}
            </span>
          )}
        </div>
        <span className="flex items-center gap-3 text-xs" style={{ color: "var(--muted)" }}>
          {i.budget && <span style={{ color: "var(--accent)" }}>{i.budget}</span>}
          {i.timeline && <span>{i.timeline}</span>}
          <span>{timeAgo(i.createdAt)}</span>
        </span>
      </div>

      <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
        <Detail label="Email">
          <a href={`mailto:${i.email}`} className="underline" style={{ color: "var(--accent)" }}>
            {i.email}
          </a>
        </Detail>
        {i.role && <Detail label="Role">{i.role}</Detail>}
        {i.industry && <Detail label="Industry">{i.industry}</Detail>}
        {i.website && <Detail label="Website">{i.website}</Detail>}
        {i.focus && i.focus.length > 0 && <Detail label="Focus">{i.focus.join(", ")}</Detail>}
        {i.lastEmailedAt && (
          <Detail label="Last contacted">
            {timeAgo(i.lastEmailedAt)} · {i.lastTemplate}
          </Detail>
        )}
      </div>
      {i.challenge && (
        <div className="mt-3">
          <Detail label="Challenge">{i.challenge}</Detail>
        </div>
      )}
      {i.notes && (
        <div className="mt-3">
          <Detail label="Notes">{i.notes}</Detail>
        </div>
      )}

      <div className="mt-5 flex gap-3">
        <button
          onClick={() => setComposing((v) => !v)}
          className="rounded-full px-5 py-2.5 text-xs uppercase font-display font-medium tracking-[0.2em]"
          style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
        >
          {composing ? "Close" : "Compose outreach"}
        </button>
        <a
          href={`/for/${i.id}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border px-5 py-2.5 text-xs uppercase font-display font-medium tracking-[0.2em]"
          style={{ borderColor: "var(--accent-soft)", color: "var(--fg)" }}
        >
          View their page ↗
        </a>
      </div>

      {composing && <Outreach inquiry={i} />}
    </div>
  );
}

function Outreach({ inquiry }: { inquiry: Inquiry }) {
  const [templateId, setTemplateId] = useState(TEMPLATE_META[0].id);
  const [preview, setPreview] = useState<{
    subject: string;
    html: string;
    text: string;
    link: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  async function load(id: string) {
    setLoading(true);
    setStatus("");
    try {
      const res = await fetch("/api/admin/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactId: inquiry.id, templateId: id }),
      });
      const j = await res.json();
      if (j.ok) setPreview(j);
    } finally {
      setLoading(false);
    }
  }

  // load first preview on mount
  if (!preview && !loading) load(templateId);

  async function send() {
    setLoading(true);
    setStatus("");
    try {
      const res = await fetch("/api/admin/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactId: inquiry.id, templateId }),
      });
      const j = await res.json();
      if (j.ok) {
        setStatus("✓ Sent. Their bespoke page is live.");
      } else if (j.fallback) {
        const mailto = `mailto:${inquiry.email}?subject=${encodeURIComponent(
          j.subject
        )}&body=${encodeURIComponent(j.text)}`;
        window.location.href = mailto;
        setStatus("No Resend key yet — opened your mail app with the draft.");
      } else {
        setStatus(`Error: ${j.error || "send failed"}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-5 rounded-xl border p-5" style={{ borderColor: "var(--accent-soft)" }}>
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-[10px] uppercase font-display font-medium tracking-[0.2em]" style={{ color: "var(--muted)" }}>
            Template
          </span>
          <select
            value={templateId}
            onChange={(e) => {
              const id = e.target.value as typeof templateId;
              setTemplateId(id);
              load(id);
            }}
            className="rounded-lg border bg-transparent px-3 py-2 text-sm"
            style={{ borderColor: "var(--accent-soft)", color: "var(--fg)" }}
          >
            {TEMPLATE_META.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} — {t.tone}
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={send}
          disabled={loading}
          className="rounded-full px-6 py-2.5 text-xs uppercase font-display font-medium tracking-[0.2em] disabled:opacity-50"
          style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
        >
          {loading ? "…" : "Send via Resend"}
        </button>
        {preview && (
          <button
            onClick={() => {
              navigator.clipboard?.writeText(preview.html);
              setStatus("HTML copied to clipboard.");
            }}
            className="rounded-full border px-6 py-2.5 text-xs uppercase font-display font-medium tracking-[0.2em]"
            style={{ borderColor: "var(--accent-soft)", color: "var(--fg)" }}
          >
            Copy HTML
          </button>
        )}
      </div>

      {preview && (
        <div className="mt-5">
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            Subject
          </p>
          <p className="mb-1" style={{ color: "var(--fg)" }}>
            {preview.subject}
          </p>
          <p className="mb-3 break-all text-xs" style={{ color: "var(--accent)" }}>
            {preview.link}
          </p>
          <iframe
            title="email preview"
            srcDoc={preview.html}
            className="h-[460px] w-full rounded-lg border"
            style={{ borderColor: "var(--accent-soft)", background: "#fff" }}
          />
        </div>
      )}

      {status && (
        <p className="mt-4 text-sm" style={{ color: "var(--accent)" }}>
          {status}
        </p>
      )}
    </div>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] uppercase font-display font-medium tracking-[0.2em]" style={{ color: "var(--muted)" }}>
        {label}
      </p>
      <p className="mt-1" style={{ color: "var(--fg)" }}>
        {children}
      </p>
    </div>
  );
}
