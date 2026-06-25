import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Phase-driven colors are CSS vars (see globals.css).
        // These are static brand tokens.
        ink: "#07070b",
        haze: "#0d0e15",
        bone: "#f4f1ea",
        ember: "#ff6a3d",
        ultraviolet: "#8b6cff",
        dawn: "#ffb37e",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        widest2: "0.2em",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.85" },
          "50%": { transform: "scale(1.06)", opacity: "1" },
        },
        drift: {
          "0%": { transform: "translateY(0) translateX(0)" },
          "100%": { transform: "translateY(-40px) translateX(20px)" },
        },
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "20%": { transform: "translate(-5%, 5%)" },
          "40%": { transform: "translate(-10%, -5%)" },
          "60%": { transform: "translate(5%, 10%)" },
          "80%": { transform: "translate(10%, -10%)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.25" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% center" },
          "100%": { backgroundPosition: "-200% center" },
        },
      },
      animation: {
        breathe: "breathe 7s ease-in-out infinite",
        drift: "drift 12s ease-in-out infinite alternate",
        grain: "grain 1.2s steps(6) infinite",
        marquee: "marquee 62s linear infinite",
        blink: "blink 1.8s ease-in-out infinite",
        shimmer: "shimmer 9s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
