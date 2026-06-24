// Placeholder content — "from the archive" until real assets land.
// Replace with Supabase queries when the backend is wired.

export type SetCard = {
  title: string;
  venue: string;
  city: string;
  duration: string;
  phase: "Warm-Up" | "Peak" | "Afterhours" | "Sunrise";
  story: string;
};

export const SETS: SetCard[] = [
  {
    title: "A Man and His Music",
    venue: "Private rooftop",
    city: "Bronx, NY",
    duration: "1:12:40",
    phase: "Warm-Up",
    story:
      "Built from the 2005 mixtape archive. Lauryn Hill bleeds into a sub you feel before you hear.",
  },
  {
    title: "Signal Chain, Live",
    venue: "Spatial.io gallery",
    city: "The cloud",
    duration: "58:02",
    phase: "Afterhours",
    story:
      "Generative visuals reacting to the mix in real time. The room was a render. It still moved.",
  },
  {
    title: "Blue Monday (Rework Set)",
    venue: "Studio session",
    city: "—",
    duration: "1:04:18",
    phase: "Peak",
    story:
      "The night the rework finally landed. Peter Hook's bassline, rebuilt from the ground up.",
  },
  {
    title: "Zero Hallucinations",
    venue: "Warehouse",
    city: "Brooklyn, NY",
    duration: "1:47:55",
    phase: "Peak",
    story:
      "No setlist. Read the room for two hours straight. Not one wrong record.",
  },
  {
    title: "Filigree",
    venue: "Loft",
    city: "Manhattan, NY",
    duration: "1:31:09",
    phase: "Afterhours",
    story: "Ornate, slow, deliberate. Bass like beadwork. The mask stayed on.",
  },
  {
    title: "Father's Day, Bronx",
    venue: "Block party",
    city: "Bronx, NY",
    duration: "0:44:30",
    phase: "Sunrise",
    story:
      "Closed on a record my father would've known. Mid-century into morning.",
  },
  {
    title: "Sleeping Bag Revival",
    venue: "Record shop, after close",
    city: "NYC",
    duration: "1:18:00",
    phase: "Warm-Up",
    story: "Erick Sermon era, dusted off. Crackle left in on purpose.",
  },
  {
    title: "Digital Isolation",
    venue: "Home studio",
    city: "—",
    duration: "39:12",
    phase: "Afterhours",
    story:
      "Recorded the week the phone went in the drawer. Quieter than anything before it.",
  },
];

export type TourStop = {
  city: string;
  venue: string;
  date: string;
  upcoming: boolean;
  memory: string;
  home?: boolean;
  // rough lat/long projected to 0–100 % on an equirectangular map
  x: number;
  y: number;
};

export const TOUR: TourStop[] = [
  {
    city: "South Beach, Miami",
    venue: "Home base · studio · clients · teaching",
    date: "20+ years",
    upcoming: false,
    home: true,
    memory:
      "Home for two decades. Studio, clients, and the local scene — available in Miami and beyond. Let's connect.",
    x: 25.5,
    y: 45.5,
  },
  {
    city: "Bronx, NY",
    venue: "Where the eye was trained",
    date: "Origin",
    upcoming: false,
    memory: "The block, the first crate, design before it had a name.",
    x: 27,
    y: 38,
  },
  {
    city: "Kingston, Jamaica",
    venue: "Years on the decks",
    date: "Long-running",
    upcoming: false,
    memory: "Countless nights DJing across the island. The taste, road-tested.",
    x: 27.5,
    y: 50,
  },
  {
    city: "The cloud",
    venue: "Spatial.io · immersive galleries",
    date: "2024 — now",
    upcoming: false,
    memory: "Exhibitions with no walls. Rooms that don't exist.",
    x: 52,
    y: 60,
  },
  {
    city: "London, UK",
    venue: "Talk · exhibition",
    date: "2026",
    upcoming: true,
    memory: "Bringing the design-meets-AI work across the water.",
    x: 49,
    y: 33,
  },
  {
    city: "Tokyo, JP",
    venue: "Exhibition",
    date: "2026",
    upcoming: true,
    memory: "Concept-store country. It feels like home for Hi-Fi-Ai.",
    x: 84,
    y: 41,
  },
];
