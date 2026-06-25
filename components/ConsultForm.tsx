"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CONTACT_EMAIL,
  FOCUS_AREAS,
  TIMELINES,
  BUDGETS,
} from "@/lib/contact";

type State = "idle" | "sending" | "done" | "error";

const inputCls =
  "w-full rounded-xl border bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--accent)]";

export default function ConsultForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");
  const [focus, setFocus] = useState<string[]>([]);

  function toggleFocus(area: string) {
    setFocus((f) =>
      f.includes(area) ? f.filter((x) => x !== area) : [...f, area]
    );
  }

  function mailtoFallback(d: Record<string, string>) {
    const body = [
      `Name: ${d.name}`,
      `Email: ${d.email}`,
      d.company && `Company: ${d.company}`,
      d.role && `Role: ${d.role}`,
      d.website && `Website: ${d.website}`,
      d.industry && `Industry: ${d.industry}`,
      focus.length && `Focus: ${focus.join(", ")}`,
      d.challenge && `\nBiggest challenge:\n${d.challenge}`,
      d.timeline && `\nTimeline: ${d.timeline}`,
      d.budget && `Budget: ${d.budget}`,
      d.notes && `\nNotes:\n${d.notes}`,
    ]
      .filter(Boolean)
      .join("\n");
    const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      `Business inquiry — ${d.name}`
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setError("");

    const form = new FormData(e.currentTarget);
    const d = Object.fromEntries(form.entries()) as Record<string, string>;
    const payload = { ...d, focus };

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (json.ok) {
        setState("done");
        return;
      }
      if (json.fallback) {
        // email backend not configured yet — hand off to their mail client
        mailtoFallback(d);
        setState("done");
        return;
      }
      setError(json.error || "Something went wrong. Please email directly.");
      setState("error");
    } catch {
      setError("Network error. Please email directly.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border p-12 text-center"
        style={{ borderColor: "var(--accent-soft)" }}
      >
        <p className="display text-3xl md:text-4xl" style={{ color: "var(--accent)" }}>
          Sent.
        </p>
        <p className="mx-auto mt-4 max-w-md text-base" style={{ color: "var(--muted)" }}>
          Tom reads every inquiry personally. Expect a thoughtful, specific reply
          within two business days — not a template.
        </p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border p-7 md:p-10"
      style={{ borderColor: "var(--accent-soft)" }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Name *">
          <input name="name" required className={inputCls} style={borderStyle} />
        </Field>
        <Field label="Email *">
          <input
            name="email"
            type="email"
            required
            className={inputCls}
            style={borderStyle}
          />
        </Field>
        <Field label="Company / project">
          <input name="company" className={inputCls} style={borderStyle} />
        </Field>
        <Field label="Your role">
          <input name="role" className={inputCls} style={borderStyle} />
        </Field>
        <Field label="Website or socials">
          <input name="website" className={inputCls} style={borderStyle} />
        </Field>
        <Field label="Industry">
          <input name="industry" className={inputCls} style={borderStyle} />
        </Field>
      </div>

      <div className="mt-7">
        <Label>What do you want AI to help with?</Label>
        <div className="mt-3 flex flex-wrap gap-2">
          {FOCUS_AREAS.map((area) => {
            const on = focus.includes(area);
            return (
              <button
                type="button"
                key={area}
                onClick={() => toggleFocus(area)}
                className="rounded-full border px-4 py-2 text-xs transition-colors"
                style={{
                  borderColor: on ? "var(--accent)" : "var(--accent-soft)",
                  backgroundColor: on ? "var(--accent)" : "transparent",
                  color: on ? "var(--bg)" : "var(--muted)",
                }}
              >
                {area}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-7">
        <Field label="Your biggest challenge right now">
          <textarea
            name="challenge"
            rows={4}
            className={inputCls}
            style={borderStyle}
            placeholder="Where are you stuck? What would moving the needle look like?"
          />
        </Field>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Field label="Timeline">
          <select name="timeline" className={inputCls} style={borderStyle}>
            <option value="">Select…</option>
            {TIMELINES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Budget (optional)">
          <select name="budget" className={inputCls} style={borderStyle}>
            <option value="">Select…</option>
            {BUDGETS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {state === "error" && (
        <p className="mt-5 text-sm" style={{ color: "var(--accent)" }}>
          {error}{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
            Email Tom directly
          </a>
          .
        </p>
      )}

      <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          Confidential. No obligation. A real human reply.
        </p>
        <button
          type="submit"
          disabled={state === "sending"}
          className="rounded-full px-8 py-4 text-xs uppercase font-medium tracking-[0.2em] transition-opacity disabled:opacity-50"
          style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
        >
          {state === "sending" ? "Sending…" : "Send to Tom"}
        </button>
      </div>
    </form>
  );
}

const borderStyle = { borderColor: "var(--accent-soft)" as const };

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-[11px] uppercase font-medium tracking-[0.2em]"
      style={{ color: "var(--muted)" }}
    >
      {children}
    </span>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <Label>{label}</Label>
      {children}
    </label>
  );
}
