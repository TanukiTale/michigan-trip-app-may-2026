# Eric & Mona West Michigan Trip App

A mobile-first React + TypeScript + Vite + Tailwind app designed as a curated trip board for a West Michigan birthday getaway.

## Setup

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages

This project is configured for direct GitHub Pages publishing with:

```bash
npm run deploy
```

That command builds the app and publishes `dist` to the `gh-pages` branch.

In the GitHub repository settings:

1. Open `Settings` → `Pages`
2. Set `Source` to `Deploy from a branch`
3. Choose branch `gh-pages` and folder `/ (root)`

## Where to edit trip content

Most trip content lives in:

- [/Users/monalarge/Documents/Codex Projects/Michigan Trip App May 2026/src/data/trip.ts](/Users/monalarge/Documents/Codex Projects/Michigan Trip App May 2026/src/data/trip.ts)

That file is structured so future trips can reuse the same layout and component system by changing:

- trip title, dates, and route
- daily itinerary content
- hikes and activities
- food and packing lists
- route stop cards

## Structure

- [/Users/monalarge/Documents/Codex Projects/Michigan Trip App May 2026/src/App.tsx](/Users/monalarge/Documents/Codex Projects/Michigan Trip App May 2026/src/App.tsx): page composition, interactions, and section layout
- [/Users/monalarge/Documents/Codex Projects/Michigan Trip App May 2026/src/components](/Users/monalarge/Documents/Codex Projects/Michigan Trip App May 2026/src/components): reusable UI building blocks
- [/Users/monalarge/Documents/Codex Projects/Michigan Trip App May 2026/src/types/trip.ts](/Users/monalarge/Documents/Codex Projects/Michigan Trip App May 2026/src/types/trip.ts): reusable trip data types
- [/Users/monalarge/Documents/Codex Projects/Michigan Trip App May 2026/src/index.css](/Users/monalarge/Documents/Codex Projects/Michigan Trip App May 2026/src/index.css): design tokens and shared editorial card styles
