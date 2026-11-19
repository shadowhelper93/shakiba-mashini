# CLAUDE.md

Repository guidance for Claude Code and compatible assistants. See also [AGENTS.md](./AGENTS.md) and [ARCHITECTURE.md](./ARCHITECTURE.md).

## Quick Reference

- **Framework**: Next.js 16 (App Router + Turbopack) + React 19 + Tailwind CSS v4
- **Port**: Always `3300` (`next dev -p 3300` / `next start -p 3300`)
- **Path alias**: `@/*` → `./src/*`

## Verification Commands

```bash
npm test          # tsx --test src/lib/*.test.ts
npm run typecheck # tsc --noEmit
npm run build     # next build (must pass with 0 errors and static prerender)
```

## Key Files

- `src/app/layout.tsx` — Root layout, `Poppins` (`next/font/google`), `metadata` (`metadataBase` via `NEXT_PUBLIC_SITE_URL` defaulting to `http://localhost:3300`), `viewport`, Schema.org `Person` JSON-LD
- `src/app/page.tsx` — Main page composition
- `src/app/globals.css` — Tailwind v4 `@theme inline` tokens and reduced-motion rules
- `src/components/` — Portfolio sections + `GraphTopologyCanvas` (Three.js), `CareerTopologyStage` (Canvas), `SpectralFooterVisual` (Canvas), `MotionProvider`
- `src/lib/` — Data (`portfolioData.ts`), graph math (`graphTopology.ts`), carousel helpers (`carouselUtils.ts`), and their `*.test.ts` suites
- `next.config.ts` — Sets `turbopack.root` to `process.cwd()`

## Conventions

- Preserve Server Component boundaries where no client hooks/DOM APIs are needed.
- Guard all `window` / `document` / WebGL / Canvas APIs inside `useEffect` to keep static prerendering clean.
- Keep commits clean: never stage `.next/`, `node_modules/`, or `.DS_Store`.
