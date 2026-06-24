"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.replace("/admin");
        router.refresh();
        return;
      }
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Login failed.");
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm">
      <p
        className="mb-3 text-xs uppercase tracking-[0.4em]"
        style={{ color: "var(--accent)" }}
      >
        Tom HQ
      </p>
      <h1 className="display text-4xl">Command.</h1>
      <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
        Private. Authorized access only.
      </p>

      <input
        type="password"
        autoFocus
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="mt-8 w-full rounded-xl border bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
        style={{ borderColor: "var(--accent-soft)", color: "var(--fg)" }}
      />

      {error && (
        <p className="mt-3 text-sm" style={{ color: "var(--accent)" }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 w-full rounded-full px-6 py-4 text-xs uppercase tracking-[0.2em] disabled:opacity-50"
        style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
      >
        {loading ? "…" : "Enter"}
      </button>
    </form>
  );
}
