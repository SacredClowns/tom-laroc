// Dispatches — Tom's writing. Doubles as SEO content + proof of expertise.
// Each piece funnels to /bookings. Body is structured blocks (no MDX dep).

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string };

export type Dispatch = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  readMins: number;
  tags: string[];
  body: Block[];
};

export const DISPATCHES: Dispatch[] = [
  {
    slug: "ai-that-never-looks-like-ai",
    title: "AI That Never Looks Like AI",
    excerpt:
      "The tell isn't the tool — it's the taste. Why most generative work reads as cheap, and how to keep it unmistakably yours.",
    date: "2026-06-10",
    readMins: 4,
    tags: ["Design", "AI strategy", "Brand"],
    body: [
      {
        type: "p",
        text: "You can usually spot AI work in a second. Not because the rendering is bad — it's because nobody made a decision. The default look is the absence of taste: even lighting, safe composition, the same five gradients, a sheen of competence with nothing underneath.",
      },
      {
        type: "p",
        text: "That's not an AI problem. It's a direction problem. The model will happily generate forever; it has no point of view. Yours is the only one in the room.",
      },
      { type: "h2", text: "Taste is the moat" },
      {
        type: "p",
        text: "I came to AI as a designer first — decades of composition, type, color, and the discipline of cutting what doesn't belong. The model is just the newest material. The work that lands is the work where a trained eye set the constraints, killed the misses, and held a consistent feeling across a hundred outputs.",
      },
      {
        type: "quote",
        text: "The constraints aren't the cage. They're the instrument.",
      },
      { type: "h2", text: "How to keep it on-brand" },
      {
        type: "p",
        text: "Build a reference language before you generate — the palette, the grain, the type, the negative space that's actually yours. Treat prompts like art direction, not slot-machine pulls. Review like an editor: keep the one in twenty that has a point of view, cut the rest without sentiment. Done right, the result doesn't read as 'AI.' It reads as you, faster.",
      },
      {
        type: "p",
        text: "That's the whole practice in one line: AI that never looks like AI.",
      },
    ],
  },
  {
    slug: "djing-was-always-prompt-engineering",
    title: "DJing Was Always Prompt Engineering",
    excerpt:
      "Temperature, constraints, intent, reading the room. I ran that loop for thirty years before the tools caught up.",
    date: "2026-05-22",
    readMins: 3,
    tags: ["AI strategy", "Craft"],
    body: [
      {
        type: "p",
        text: "Most people treat AI like a slot machine — pull, hope, pull again. I treat it like a set. And a set is just real-time prompt engineering with a dancefloor instead of a text box.",
      },
      { type: "h2", text: "The same dials" },
      {
        type: "p",
        text: "Temperature: how far you'll stray from the expected. Constraints: the key, the BPM, the room you're actually in. Intent: where the night has to arrive. Then you read the floor and adjust — every record a test, the crowd the reward signal. Zero tolerance for the wrong one at 1am.",
      },
      {
        type: "quote",
        text: "The floor is the reward signal. I've been doing reinforcement learning for thirty years; it just didn't have a citation.",
      },
      {
        type: "p",
        text: "That instinct — taste as a quality gate, the refusal to ship the plausible-but-wrong — is the most transferable skill I own. It's exactly what separates a good generative output from a finished one. The tools changed. The discipline didn't.",
      },
    ],
  },
  {
    slug: "bring-ai-into-your-business-without-losing-the-soul",
    title: "Bring AI Into Your Business Without Losing the Soul",
    excerpt:
      "A practical, hype-free way to put AI to work — for brands, artists, and teams who care how things look and feel.",
    date: "2026-04-30",
    readMins: 5,
    tags: ["AI strategy", "Teams", "Miami"],
    body: [
      {
        type: "p",
        text: "After years of helping brands, artists, and professionals adopt AI — and teaching thousands how to use it — the pattern is always the same. The win isn't the flashiest tool. It's a clear system, pointed at a real problem, run by people who keep their taste.",
      },
      { type: "h2", text: "Start with the bottleneck, not the tool" },
      {
        type: "p",
        text: "Don't ask 'where can we use AI.' Ask 'where are we slow, and why.' Most teams are stuck producing on-brand assets, or drowning in repetitive work that quietly kills momentum. That's where AI earns its keep — and where it's easy to do badly.",
      },
      { type: "h2", text: "Design the human-in-the-loop" },
      {
        type: "p",
        text: "Automate the busywork; keep the judgment where it matters. A good system makes the machine do the reps and a person make the calls. That's how you move faster without the output sliding into generic.",
      },
      { type: "h2", text: "Protect the taste" },
      {
        type: "p",
        text: "Set a reference language up front and review like an editor. The goal is leverage without losing the thing that makes you you. If the output starts looking like everyone else's, the system is wrong — not the ambition.",
      },
      {
        type: "quote",
        text: "AI from noise into a working system — and a genuine edge.",
      },
      {
        type: "p",
        text: "I do this with clients in Miami and worldwide, from a one-time audit to ongoing advisory. If that's where you are, tell me about your business and I'll come back with a specific read on where it can move the needle for you.",
      },
    ],
  },
];

export function getDispatch(slug: string) {
  return DISPATCHES.find((d) => d.slug === slug);
}

export function allDispatchSlugs() {
  return DISPATCHES.map((d) => d.slug);
}
