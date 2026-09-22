# Dhan Admin Console

Internal admin tool for Dhan. Next.js (App Router) + TypeScript + Tailwind CSS.

This is a separate app from the Dhan mobile app — no shared code.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Design reference

`design-export/` is a static HTML/CSS export from Claude Design used as a
visual reference only — it isn't imported or built by this app.

## Design system

Colors, fonts, corner radii, and the spacing convention live as Tailwind
theme tokens in `app/globals.css`. Use the token-based utility classes
(`bg-primary`, `text-secondary`, `rounded-md`, ...) rather than hardcoded
hex values.
