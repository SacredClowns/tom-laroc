# Tom Laroc — Hi-Fi-Ai

An immersive sonic + generative world. Built per the Creative Director brief:
a site that feels like the moment the room becomes one.

## Stack (scaffolded)

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** for styling, with phase-driven CSS variables
- **Framer Motion** for reveals / transitions
- **Lenis** for smooth scroll

## Stack (planned — not yet wired)

- **Three.js / React Three Fiber** — replace the canvas hero in `components/Hero.tsx`
- **Web Audio API + Howler.js / Wavesurfer.js** — power `components/MiniPlayer.tsx`
- **Supabase** — releases, tour dates, subscribers (`lib/data.ts` holds placeholders)
- **Stripe** — merch / tickets
- **Resend / Loops** — Inner Circle list (`components/InnerCircle.tsx` form)
- **MDX** — Dispatches
- **Cloudflare R2** — audio + imagery

## Run

```bash
npm install
npm run dev    # http://localhost:3000
```

## The signature mechanic — The Arc of the Night

`lib/phase.tsx` holds a `PhaseProvider` + `usePhase()` context. Selecting a
phase (Warm-Up / Peak / Afterhours / Sunrise) sets `data-phase` on a wrapper,
and every section reads CSS variables (`--bg`, `--accent`, `--glow`, …) defined
per phase in `app/globals.css`. This re-themes the **entire page** — color,
glow, and now-playing track — which is the soul of the interaction.

## Structure

```
app/
  layout.tsx            # PhaseProvider + SmoothScroll + Nav + MiniPlayer
  page.tsx              # homepage: all sections in arc order
  globals.css           # phase palettes + grain + reduced-motion
  artist|music|sets|live|dispatches|roots|press|bookings|inner-circle/
components/
  Hero.tsx              # breathing canvas (R3F placeholder)
  Manifesto.tsx
  ArcOfTheNight.tsx     # the signature interactive selector
  SignalChain.tsx       # DJ = prompt engineering — the brand spine
  FeaturedRelease.tsx   # Blue Monday
  SetsGrid.tsx · TourMap.tsx · SoulAnchor.tsx · InnerCircle.tsx
  Nav.tsx · MiniPlayer.tsx · Footer.tsx · PageShell.tsx
lib/
  phase.tsx             # Arc-of-the-Night theme context
  data.ts               # placeholder sets + tour stops
```

## Notes

- Audio is **opt-in**, never autoplay. The mini-player is persistent.
- `prefers-reduced-motion` disables Lenis + animations.
- All placeholder media is labeled — no broken players, no stock.
