// Instagram feed. MOCK for now (placeholder tiles). When Tom authorizes the
// account in Behold (behold.so) and you set BEHOLD_FEED_ID, real posts flow in
// automatically — no component changes needed.

export type InstaPost = {
  id: string;
  image?: string; // real photo URL (from Behold)
  gradient?: string; // placeholder fill
  caption: string;
  likes?: number; // placeholder-only (IG API doesn't expose like counts here)
  comments?: number;
  permalink: string;
  kind?: "image" | "video" | "carousel";
};

export const IG_HANDLE = "tomlaroc";
export const IG_URL = `https://www.instagram.com/${IG_HANDLE}/`;

const g = (a: string, b: string) => `linear-gradient(135deg, ${a}, ${b})`;

// On-brand placeholder grid (no fake photos — gradient tiles + real captions).
export const PLACEHOLDER_POSTS: InstaPost[] = [
  { id: "1", gradient: g("#2a1a55", "#8b6cff"), caption: "Multi-model pipeline test — Sora × Ideogram × hand", likes: 1240, comments: 58, permalink: IG_URL, kind: "video" },
  { id: "2", gradient: g("#5a1208", "#ff6a3d"), caption: "Blue Monday — a frame", likes: 2310, comments: 102, permalink: IG_URL, kind: "image" },
  { id: "3", gradient: g("#1b2a55", "#6c8cff"), caption: "#AIArtToday — today's drop", likes: 880, comments: 41, permalink: IG_URL, kind: "carousel" },
  { id: "4", gradient: g("#5a2a14", "#ffb37e"), caption: "Generative study — golden hour", likes: 1567, comments: 73, permalink: IG_URL, kind: "image" },
  { id: "5", gradient: g("#0d1018", "#8b6cff"), caption: "Gnarls Barkley — music visual", likes: 3050, comments: 140, permalink: IG_URL, kind: "video" },
  { id: "6", gradient: g("#2a1a55", "#ff6a3d"), caption: "From the archive — Bronx, mid-50s", likes: 1990, comments: 88, permalink: IG_URL, kind: "image" },
  { id: "7", gradient: g("#1b2a55", "#ffb37e"), caption: "On the decks — 40 years deep", likes: 1420, comments: 60, permalink: IG_URL, kind: "image" },
  { id: "8", gradient: g("#5a1208", "#8b6cff"), caption: "Behind the render", likes: 1110, comments: 47, permalink: IG_URL, kind: "carousel" },
  { id: "9", gradient: g("#0d1018", "#6c8cff"), caption: "AI that never looks like AI", likes: 2680, comments: 119, permalink: IG_URL, kind: "image" },
];

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function getInstagramPosts(): Promise<InstaPost[]> {
  const id = process.env.BEHOLD_FEED_ID;
  if (!id) return PLACEHOLDER_POSTS; // mock until connected

  try {
    const res = await fetch(`https://feeds.behold.so/${id}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return PLACEHOLDER_POSTS;
    const json: any = await res.json();
    const arr: any[] = Array.isArray(json) ? json : json.posts || [];
    const posts: InstaPost[] = arr.slice(0, 12).map((p: any, i: number) => {
      const type = String(p.mediaType || "").toLowerCase();
      return {
        id: p.id || String(i),
        image: p.sizes?.medium?.mediaUrl || p.mediaUrl || p.thumbnailUrl,
        caption: p.prunedCaption || p.caption || "",
        permalink: p.permalink || IG_URL,
        kind: type.includes("video") ? "video" : type.includes("carousel") ? "carousel" : "image",
      };
    });
    return posts.length ? posts : PLACEHOLDER_POSTS;
  } catch {
    return PLACEHOLDER_POSTS;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
