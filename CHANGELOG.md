# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- Project documentation: `README.md`, `ARCHITECTURE.md`, `AGENTS.md`, `CLAUDE.md`, and `CHANGELOG.md`.

### Changed
- Centered the About section studio portrait card vertically and horizontally within the desktop left column (`src/components/AboutSection.tsx`).

## [0.1.0] - 2026-11-19

### Added
- Next.js 16 App Router setup (`src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`).
- Self-hosted `Poppins` typography via `next/font/google` wired to Tailwind CSS v4 `@theme inline`.
- Next.js `Metadata`, `Viewport`, `metadataBase` (`NEXT_PUBLIC_SITE_URL` fallback `http://localhost:3300`), and Schema.org `Person` JSON-LD.
- `MotionProvider` client wrapper (`src/components/MotionProvider.tsx`) and `'use client'` directives on interactive and canvas/WebGL components.
- PostCSS Tailwind v4 config (`postcss.config.mjs`), `next.config.ts` (`turbopack.root`), and `.gitignore`.
- Unit test script (`npm test` using `tsx --test src/lib/*.test.ts`) and `npm run typecheck`.

### Changed
- Configured `dev` and `start` scripts in `package.json` to always run on port `3300`.

### Removed
- Legacy Vite/Express template files (`index.html`, `vite.config.ts`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `metadata.json`, `bun.lock`) and unused dependencies (`@google/genai`, `express`, `dotenv`, `vite`).
