# Shakiba Mashini — Portfolio

Personal academic and research portfolio for **Shakiba Mashini**, PhD student in Computer Science at Georgia State University and Research Specialist at Emory University School of Medicine.

Built with **Next.js 16 (App Router + Turbopack)**, **React 19**, **Tailwind CSS v4**, **Motion**, and **Three.js**.

## Stack

- **Framework**: Next.js 16 (`src/app/` App Router, static prerendering)
- **UI & Styling**: React 19, Tailwind CSS v4 (`@tailwindcss/postcss`), `lucide-react`, `Poppins` via `next/font/google`
- **Motion & Visualizations**: `motion` (`motion/react`), `three` (WebGL 3D community graph), HTML5 2D Canvas
- **Testing & Types**: TypeScript (`strict`), Node.js native test runner via `tsx --test`

## Getting Started

```bash
npm install
npm run dev
```

The app runs on **http://localhost:3300** in both development (`npm run dev`) and production (`npm run start`).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Next.js dev server on port `3300` |
| `npm run build` | Build optimized production bundle (Turbopack + TypeScript check) |
| `npm run start` | Start production server on port `3300` |
| `npm run typecheck` | Run `tsc --noEmit` |
| `npm test` | Run unit tests in `src/lib/*.test.ts` with `tsx --test` |

## Environment Variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3300` | Base URL for Open Graph and Twitter Card `metadataBase` in `src/app/layout.tsx` |

## Project Structure

```text
public/
  assets/aistudio/         # Static portrait and media assets
src/
  app/
    globals.css            # Tailwind v4 theme tokens & base styles
    layout.tsx             # Root layout, Poppins font, Metadata, Viewport, JSON-LD
    page.tsx               # Main portfolio page (Server Component)
  components/              # Section components, canvas/WebGL visualizers, MotionProvider
  lib/                     # Portfolio datasets, graph topology math, carousel utils + tests
```

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) — Component boundaries, rendering model, and visual systems
- [AGENTS.md](./AGENTS.md) — Guidelines for autonomous coding agents
- [CLAUDE.md](./CLAUDE.md) — Claude Code repository reference
- [CHANGELOG.md](./CHANGELOG.md) — Release and migration history
