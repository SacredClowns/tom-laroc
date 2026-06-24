// Pulls Tom's entire Mixcloud catalog via the free public API. No key needed.
// This is the surviving 40-year archive (the originals were lost to a fire),
// so we fetch ALL of it and let it keep syncing as he uploads more.

const USER = "tomlaroc";
const BASE = `https://api.mixcloud.com/${USER}/cloudcasts/?limit=100`;

export const MIXCLOUD_PROFILE = `https://www.mixcloud.com/${USER}/`;

export type Mix = {
  key: string; // e.g. "/tomlaroc/some-mix/" — used as the embed feed
  slug: string;
  name: string;
  picture: string;
  year: string;
  length: string;
  plays: number;
};

function fmtLen(sec: number) {
  if (!sec) return "";
  const h = Math.floor(sec / 3600);
  const m = Math.round((sec % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function getMixes(): Promise<Mix[]> {
  const out: Mix[] = [];
  let url: string | null = BASE;
  let guard = 0;
  try {
    while (url && guard < 12) {
      const res: Response = await fetch(url, { next: { revalidate: 86400 } });
      if (!res.ok) break;
      const json: any = await res.json();
      for (const c of json.data || []) {
        const pics = c.pictures || {};
        out.push({
          key: c.key,
          slug: c.slug || "",
          name: c.name || "Untitled",
          picture:
            pics.large || pics["640wx640h"] || pics["300wx300h"] || pics.medium || "",
          year: (c.created_time || "").slice(0, 4),
          length: fmtLen(c.audio_length),
          plays: c.play_count || 0,
        });
      }
      url = json.paging?.next || null;
      guard++;
    }
  } catch {
    // network/API hiccup — return whatever we have; UI links out to Mixcloud.
  }
  return out;
}
/* eslint-enable @typescript-eslint/no-explicit-any */
