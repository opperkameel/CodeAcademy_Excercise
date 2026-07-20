# Adomate Lite

A lightweight, self-hostable AI ad‑creative studio inspired by [Adomate](https://www.adomate.com/). Give it a short brand brief and it produces:

- **On‑brand ad copy** tailored per platform (Instagram, Facebook, Google Search, LinkedIn, TikTok)
- **Downloadable ad creatives** at every channel size (feed, story, square, landscape)
- **Multi‑channel reformatting** — one creative concept, rendered at all sizes automatically

It's a "software + service" MVP: a Next.js app you own and run yourself, powered by the Claude API.

## How it works

Claude can't render raster images, so instead of a diffusion model this app uses Claude as a **creative director**:

1. You submit a brief (brand, product, audience, tone, benefit, color, optional product image).
2. `/api/generate` sends it to Claude, which returns **copy variants** *and* a structured **design spec** (colors, layout, on‑image headline, CTA, badge).
3. The browser renders that spec deterministically to real PNGs on `<canvas>` at every channel size — no image model required, and creatives stay private (rendered locally).

```
Brief ──▶ /api/generate (Claude) ──▶ { campaignConcept, variants[], design }
                                            │
                                            ├─▶ CopyCard  (per-platform copy)
                                            └─▶ AdCanvas  (design → PNG × N sizes)
```

## Getting started

Requires Node.js 18.17+.

```bash
cd adomate-lite
npm install
cp .env.example .env.local   # then add your ANTHROPIC_API_KEY
npm run dev
```

Open http://localhost:3000, click **Load example**, then **Generate campaign**.

## Configuration

| Variable            | Required | Default          | Notes                         |
| ------------------- | -------- | ---------------- | ----------------------------- |
| `ANTHROPIC_API_KEY` | yes      | —                | Your Anthropic API key        |
| `ANTHROPIC_MODEL`   | no       | `claude-opus-4-8`| Any current Claude model id   |

## Project structure

```
app/
  page.tsx              # brief form + results UI (client)
  api/generate/route.ts # calls Claude, returns copy + design spec
  layout.tsx, globals.css
components/
  AdCanvas.tsx          # renders a design spec to a downloadable PNG
  CopyCard.tsx          # per-platform copy card
lib/
  schema.ts             # shared request/response types
  channels.ts           # channel size presets
```

## Extending it

- Add channels/sizes in `lib/channels.ts`.
- Add platforms in `lib/schema.ts` (`PLATFORMS`) — copy is generated per platform automatically.
- Tune the creative direction in the system prompt in `app/api/generate/route.ts`.
- Swap the canvas composition in `components/AdCanvas.tsx` for new layouts.

## Notes

- Creatives are rendered client‑side; nothing is uploaded to a third‑party image service.
- This is an MVP scaffold — no auth, database, or campaign persistence yet. Those are natural next steps for a full "service".
