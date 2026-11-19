# Architecture

## Overview

The application is a statically prerendered single-page portfolio built on the **Next.js 16 App Router** (`src/app/`). Data is colocated in typed TypeScript modules under `src/lib/`, while interactive sections and real-time graphics run inside explicit Client Components.

## Rendering & Component Boundaries

```text
src/app/layout.tsx (Server)
 └── src/app/page.tsx (Server)
      └── MotionProvider ('use client' — MotionConfig reducedMotion="user")
           ├── Navbar ('use client')
           ├── <main id="main-content">
           │    ├── HeroSection ('use client')
           │    │    └── GraphTopologyCanvas ('use client' — Three.js WebGL)
           │    ├── AboutSection ('use client')
           │    ├── ExpertiseSection ('use client')
           │    ├── CareerSection ('use client')
           │    │    └── CareerTopologyStage ('use client' — 2D Canvas)
           │    └── CredentialsSection ('use client')
           └── ContactSection (Server)
                ├── SpectralFooterVisual ('use client' — 2D Canvas)
                └── ShakibaLogo (Server — pure SVG)
```

### Server Components
- **`src/app/layout.tsx`**: Loads `Poppins` via `next/font/google` (`--font-poppins`), exports static `metadata` and `viewport`, and injects Schema.org `Person` JSON-LD.
- **`src/app/page.tsx`**: Composes top-level sections and accessibility skip link.
- **`src/components/ContactSection.tsx`** & **`src/components/ShakibaLogo.tsx`**: Pure markup/SVG with zero client state.

### Client Components (`'use client'`)
- **`MotionProvider.tsx`**: Wraps the app in `<MotionConfig reducedMotion="user">`.
- **Interactive sections**: `Navbar`, `HeroSection`, `AboutSection`, `ExpertiseSection`, `CareerSection`, `CredentialsSection`.
- **Visualizers**:
  - `GraphTopologyCanvas.tsx`: Three.js WebGL 3D community-graph renderer with software-GL detection and reduced-motion handling. All `window`/`document` calls are guarded inside `useEffect`.
  - `CareerTopologyStage.tsx`: 2D Canvas stage rendering role-specific topology patterns.
  - `SpectralFooterVisual.tsx`: 2D Canvas animated research-spectrum visualization.

## Styling & Design Tokens

- **Tailwind CSS v4** via `@tailwindcss/postcss` (`postcss.config.mjs`).
- **`src/app/globals.css`** defines `@theme inline` tokens:
  - `--font-sans: var(--font-poppins), sans-serif`
  - Palette: `--color-pure-black` (`#000000`), `--color-obsidian` (`#0a0c0c`), `--color-spruce` (`#0c1515`), `--color-spruce-elevated` (`#111d1d`), `--color-spruce-border` (`#1a2929`), `--color-pure-white` (`#ffffff`).
- Honors `prefers-reduced-motion: reduce` both in CSS and in canvas/WebGL loops.

## Data & Pure Logic (`src/lib/`)

- **`portfolioData.ts`**: Profile metadata, portraits, research award, expertise domains, career roles, credentials, and helper filters/validators.
- **`graphTopology.ts`**: Deterministic 3-community graph generator and community-aware sparsification logic.
- **`carouselUtils.ts`**: Circular index wrapping, shortest signed offset, and pointer-swipe step resolution for the credentials carousel.

## Testing & Verification

Unit tests live alongside `src/lib/` modules (`*.test.ts`) using `node:test` and `node:assert/strict`, executed via `tsx --test`. Production builds (`npm run build`) run Turbopack compilation, TypeScript checking, and static prerendering for `/` and `/_not-found`.
