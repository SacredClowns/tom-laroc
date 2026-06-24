import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { DISPATCHES } from "@/lib/dispatches";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "/", priority: 1 },
    { path: "/bookings", priority: 0.9 },
    { path: "/work", priority: 0.8 },
    { path: "/archive", priority: 0.8 },
    { path: "/visualizer", priority: 0.7 },
    { path: "/artist", priority: 0.8 },
    { path: "/dispatches", priority: 0.7 },
    { path: "/live", priority: 0.6 },
    { path: "/roots", priority: 0.5 },
    { path: "/press", priority: 0.5 },
    { path: "/inner-circle", priority: 0.4 },
  ];

  const base: MetadataRoute.Sitemap = routes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    changeFrequency: "monthly",
    priority: r.priority,
  }));

  const posts: MetadataRoute.Sitemap = DISPATCHES.map((d) => ({
    url: `${SITE_URL}/dispatches/${d.slug}`,
    lastModified: new Date(d.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...base, ...posts];
}
