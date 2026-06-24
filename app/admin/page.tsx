import { listInquiries, listSubscribers } from "@/lib/store";
import { PACKAGES } from "@/lib/packages";
import AdminLogout from "@/components/AdminLogout";
import AdminInquiries from "@/components/AdminInquiries";

export const metadata = { title: "Tom HQ — Dashboard" };
export const dynamic = "force-dynamic";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d > 0) return `${d}d ago`;
  const h = Math.floor(diff / 3600000);
  if (h > 0) return `${h}h ago`;
  const m = Math.floor(diff / 60000);
  return m > 0 ? `${m}m ago` : "just now";
}

function within(iso: string, days: number) {
  return Date.now() - new Date(iso).getTime() < days * 86400000;
}

export default async function AdminDashboard() {
  const [inquiries, subscribers] = await Promise.all([
    listInquiries(),
    listSubscribers(),
  ]);

  const newThisWeek = inquiries.filter((i) => within(i.createdAt, 7)).length;

  const kpis = [
    { label: "Total leads", value: inquiries.length },
    { label: "New (7 days)", value: newThisWeek },
    { label: "Subscribers", value: subscribers.length },
    { label: "Packages", value: PACKAGES.length },
  ];

  return (
    <main className="min-h-screen px-6 py-10" style={{ backgroundColor: "var(--bg)" }}>
      <div className="mx-auto max-w-6xl">
        {/* header */}
        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-[11px] uppercase tracking-[0.4em]"
              style={{ color: "var(--accent)" }}
            >
              Tom HQ
            </p>
            <h1 className="display text-3xl">Command</h1>
          </div>
          <AdminLogout />
        </div>

        {/* KPIs */}
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {kpis.map((k) => (
            <div
              key={k.label}
              className="rounded-2xl border p-6"
              style={{ borderColor: "var(--accent-soft)" }}
            >
              <p className="display text-4xl">{k.value}</p>
              <p
                className="mt-1 text-[11px] uppercase tracking-[0.2em]"
                style={{ color: "var(--muted)" }}
              >
                {k.label}
              </p>
            </div>
          ))}
        </div>

        {/* Inquiries + outreach */}
        <section className="mt-12">
          <h2 className="display text-2xl">Inquiries</h2>
          <AdminInquiries inquiries={inquiries} />
        </section>

        {/* Packages + Subscribers */}
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <section>
            <h2 className="display text-2xl">Packages</h2>
            <div className="mt-5 space-y-3">
              {PACKAGES.map((p) => (
                <div
                  key={p.slug}
                  className="flex items-center justify-between rounded-2xl border p-5"
                  style={{ borderColor: "var(--accent-soft)" }}
                >
                  <div>
                    <p style={{ color: "var(--fg)" }}>{p.name}</p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>
                      {p.cadence}
                    </p>
                  </div>
                  <p className="display text-xl" style={{ color: "var(--accent)" }}>
                    {p.price}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="display text-2xl">Subscribers</h2>
            {subscribers.length === 0 ? (
              <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}>
                No subscribers yet.
              </p>
            ) : (
              <div className="mt-5 space-y-2">
                {subscribers.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-xl border px-4 py-3 text-sm"
                    style={{ borderColor: "var(--accent-soft)" }}
                  >
                    <span style={{ color: "var(--fg)" }}>{s.email}</span>
                    <span className="text-xs" style={{ color: "var(--muted)" }}>
                      {timeAgo(s.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
