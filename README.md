# A2J Media Solutions — Website

A dark, editorial one-page site for A2J Media Solutions (church acoustics, soundproofing,
audio engineering & rigging, Karaikal / Bangalore). Built with [Astro](https://astro.build).

All copy is sourced directly from the provided brochure (Front.png / Back.png) and the
design reference image. All photography is the project photography you supplied.

## Getting started

You'll need [Node.js](https://nodejs.org) 18.17+ installed.

```bash
npm install
npm run dev
```

Then open the URL it prints (usually `http://localhost:4321`).

## Commands

| Command           | Action                                           |
| ------------------ | ------------------------------------------------- |
| `npm install`       | Install dependencies                              |
| `npm run dev`        | Start local dev server with hot reload            |
| `npm run build`       | Build the production site to `./dist/`             |
| `npm run preview`      | Preview the production build locally               |

## Project structure

```
src/
  components/     Nav, Hero, Marquee, Portfolio, Solutions, Rigging, Hardware, Contact, Footer
  layouts/        Base.astro — <head>, fonts, global wrappers
  pages/          index.astro — assembles the page
  scripts/        motion.js — scroll reveal, magnetic buttons, custom cursor, nav, marquee
  styles/         global.css — design tokens (colors, type, spacing), resets, utilities
public/
  images/         Optimised WebP photography used across the site
```

## Editing content

- **Text**: edit the `const` values at the top of each component in `src/components/`
  (e.g. `Solutions.astro` has the three Key Solutions cards, `Hardware.astro` has the
  brand list).
- **Colors / fonts**: change the CSS custom properties at the top of `src/styles/global.css`.
- **Images**: drop new files into `public/images/` and reference them as `/images/your-file.webp`.
  WebP is recommended for file size; any format works.
- **Contact details**: phone/email/address live in `Nav.astro`, `Hero.astro` isn't a contact
  point, but `Contact.astro` and `Footer.astro` both hold John Gratien's contact info —
  update both if it changes.

## Deploying

`npm run build` outputs a fully static site to `dist/`. That folder can be deployed as-is to
Netlify, Vercel, Cloudflare Pages, GitHub Pages, or any static host — point the host's
build command at `npm run build` and its output directory at `dist`.

## Notes on the motion design

Animations are intentionally restrained to one orchestrated hero entrance plus scroll
reveals — see `prefers-reduced-motion` handling in `global.css` and `motion.js`, which
disables non-essential motion for people who've asked their OS to reduce it.
