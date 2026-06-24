// Tom's portfolio — the work that sells the talent. Real projects drawn from
// his actual practice; swap blurbs/images freely. Visuals are gradient
// placeholders until real stills/loops are added.

export type Work = {
  slug: string;
  title: string;
  category: string;
  year: string;
  blurb: string;
};

export const WORK: Work[] = [
  {
    slug: "blue-monday",
    title: "Blue Monday",
    category: "Film · Direction",
    year: "2026",
    blurb:
      "Directed and produced. A reimagining of the New Order classic with Peter Hook — generative visuals cut to a rebuilt bassline.",
  },
  {
    slug: "gnarls-barkley",
    title: "Gnarls Barkley",
    category: "Music Visuals",
    year: "Feature",
    blurb:
      "High-profile music visuals — generative media built around the track, not bolted on. Where the eye for music meets AI.",
  },
  {
    slug: "multi-model-pipeline",
    title: "The Multi-Model Pipeline",
    category: "AI Direction",
    year: "Signature",
    blurb:
      "Stringing ~10 leading tools — video generators like Sora, image models like Ideogram, specialized audio engines — layered with traditional animation, illustration, and human direction. Premium, never generic.",
  },
  {
    slug: "digital-isolation",
    title: "Golden Age of Digital Isolation",
    category: "Generative Art",
    year: "2025",
    blurb:
      "A 1563 Rijksmuseum family portrait, reinterpreted — bodies present, eyes elsewhere. Screen-glow where candlelight used to be.",
  },
  {
    slug: "ai-animation",
    title: "Motion Studies",
    category: "AI Animation",
    year: "2024 — now",
    blurb:
      "Generative animation recognized in the community for composition, reflection, and ratio. The eye, applied to a new material.",
  },
  {
    slug: "immersive",
    title: "Rooms That Don't Exist",
    category: "Immersive · VR",
    year: "2024",
    blurb:
      "Spatial.io galleries and immersive storytelling — plus STEAM workshops bringing families into 3D and generative tools.",
  },
  {
    slug: "design-systems",
    title: "Design × AI Systems",
    category: "Design Direction",
    year: "Ongoing",
    blurb:
      "The bridge in practice: brand and aesthetic direction that keeps AI output unmistakably on-brand. AI that never looks like AI.",
  },
  {
    slug: "the-archive",
    title: "The Archive",
    category: "Curation",
    year: "1985 — now",
    blurb:
      "Four decades of music and culture, preserved and recontextualized — including rare material like the 2005 mixtape sessions.",
  },
  {
    slug: "sound",
    title: "Sound",
    category: "Music · DJ",
    year: "40 years",
    blurb:
      "Where the taste was trained. A 40-year discography — mixes and rooms read in real time. The original prompt engineering.",
  },
];
