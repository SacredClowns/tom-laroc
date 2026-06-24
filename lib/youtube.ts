// Pulls Tom's YouTube uploads via the FREE public RSS feed — no API key.
// Channel: @HIFIAISound. The feed returns the latest ~15 uploads and
// auto-updates, so new videos appear on the site on their own.

const CHANNEL_ID = "UCQO8_V-UoiVctFTKLTqNZEA";
export const YT_HANDLE = "HIFIAISound";
export const YT_URL = `https://www.youtube.com/@${YT_HANDLE}`;
const FEED = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

export type Video = {
  id: string;
  title: string;
  thumb: string;
  year: string;
  views: number;
  url: string;
};

function decode(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

export async function getVideos(): Promise<Video[]> {
  try {
    const res = await fetch(FEED, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const xml = await res.text();
    const entries = xml.split("<entry>").slice(1);
    const videos: Video[] = [];
    for (const e of entries) {
      const id = e.match(/<yt:videoId>([^<]+)</)?.[1];
      if (!id) continue;
      const title = e.match(/<title>([^<]+)</)?.[1] || "Untitled";
      const published = e.match(/<published>([^<]+)</)?.[1] || "";
      const views = Number(e.match(/views="(\d+)"/)?.[1] || 0);
      const thumb =
        e.match(/<media:thumbnail url="([^"]+)"/)?.[1] ||
        `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
      videos.push({
        id,
        title: decode(title),
        thumb,
        year: published.slice(0, 4),
        views,
        url: `https://www.youtube.com/watch?v=${id}`,
      });
    }
    return videos;
  } catch {
    return [];
  }
}
