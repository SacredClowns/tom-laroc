// Productized engagements — Tom's revenue model. Prices are placeholders;
// edit freely. `priceId` is where a Stripe Price ID goes when checkout is wired.

export type Pkg = {
  slug: string;
  name: string;
  price: string;
  cadence: string;
  tagline: string;
  includes: string[];
  featured?: boolean;
  priceId?: string; // Stripe Price ID (when checkout is enabled)
};

export const PACKAGES: Pkg[] = [
  {
    slug: "ai-audit",
    name: "AI Audit",
    price: "$2,500",
    cadence: "one-time",
    tagline: "A clear-eyed read on where AI actually fits your business.",
    includes: [
      "Deep review of your workflows & goals",
      "Prioritized roadmap — what to do, in what order",
      "90-minute findings session",
      "Written action plan you own",
    ],
  },
  {
    slug: "strategy-intensive",
    name: "Strategy Intensive",
    price: "$7,500",
    cadence: "2-week sprint",
    tagline: "We design the systems and ship the first one together.",
    includes: [
      "Everything in the Audit",
      "Hands-on system + workflow design",
      "One working pipeline built with your team",
      "Templates, prompts & playbooks",
    ],
    featured: true,
  },
  {
    slug: "advisory",
    name: "Monthly Advisory",
    price: "$4,000",
    cadence: "per month",
    tagline: "An ongoing strategic partner as you scale.",
    includes: [
      "Twice-monthly working calls",
      "Async direction & reviews",
      "Priority access to Tom",
      "Cancel anytime",
    ],
  },
];

export const CUSTOM = {
  name: "Custom / Production",
  tagline:
    "Generative campaigns, AI animation, film direction, immersive work. Scoped to the project.",
};
