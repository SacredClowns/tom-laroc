"use client";

import { useRouter } from "next/navigation";

export default function AdminLogout() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.replace("/admin/login");
        router.refresh();
      }}
      className="rounded-full border px-4 py-2 text-xs uppercase font-medium tracking-[0.2em]"
      style={{ borderColor: "var(--accent-soft)", color: "var(--muted)" }}
    >
      Sign out
    </button>
  );
}
