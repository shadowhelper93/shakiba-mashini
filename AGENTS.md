# AGENTS.md

Instructions for AI coding agents working in this repository.

## Stack & Runtime

- **Next.js 16** (App Router, Turbopack), **React 19**, **TypeScript** (`strict: true`), **Tailwind CSS v4** (`@tailwindcss/postcss`).
- Default port is **`3300`** for both `npm run dev` and `npm run start`. Keep port `3300` configured unless explicitly asked to change it.

## Commands

- `npm run dev` — Dev server on `http://localhost:3300`
- `npm run build` — Production build + TypeScript check + static prerender
- `npm run start` — Production server on `http://localhost:3300`
- `npm run typecheck` — `tsc --noEmit`
- `npm test` — Unit tests (`tsx --test src/lib/*.test.ts`)

Always run `npm test`, `npm run typecheck`, and `npm run build` after code changes before declaring completion.

## Engineering Rules

1. **Server vs. Client Components**:
   - Keep `src/app/layout.tsx`, `src/app/page.tsx`, `ContactSection.tsx`, and pure SVG/presentational components as Server Components.
   - Add `'use client'` only to components that use React hooks, `motion/react`, Three.js, or browser APIs.
2. **SSR Safety**:
   - Never access `window`, `document`, `matchMedia`, or `requestAnimationFrame` during render. Keep all browser/WebGL/Canvas access inside `useEffect` or event handlers.
   - Respect `prefers-reduced-motion: reduce` in any new animation or canvas loop.
3. **Styling & Typography**:
   - Use Tailwind CSS v4 utilities and the theme tokens in `src/app/globals.css` (`#000000`, `#0a0c0c`, `#0c1515`, `#ffffff`).
   - Do not add external Google Fonts `<link>` tags; `Poppins` is loaded via `next/font/google` in `src/app/layout.tsx`.
4. **Data & Testing**:
   - Keep pure logic and datasets in `src/lib/` with unit tests in `src/lib/*.test.ts`.
   - Do not commit `.next/`, `node_modules/`, `.DS_Store`, or `next-env.d.ts`.
5. **Path Aliases**:
   - `@/*` maps to `./src/*` in `tsconfig.json`.
