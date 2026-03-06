# Cash Counter

Cash Counter is a small, mobile-friendly web app for **learning to count US money**. It includes three quick “game modes”:

- **Build the Amount**: a target amount is shown — pick bills & coins to match it.
- **Count the Money**: bills and coins are shown — calculate the total.
- **Make Change**: simulate a purchase, take payment, and give correct change.

The app is built with **React + Vite** and is configured as an **installable PWA** (Add to Home Screen on supported devices).

## Quick start

Prerequisites:

- **Node.js**: a modern LTS version (recommended).
- **npm**: comes with Node.

Install and run the dev server:

```bash
npm install
npm run dev
```

Then open the local URL printed in your terminal.

## Scripts

- **dev**: `npm run dev` — start the dev server
- **build**: `npm run build` — create a production build
- **preview**: `npm run preview` — serve the production build locally
- **lint**: `npm run lint` — run ESLint

## Tech stack

- **React** (UI)
- **Vite** (dev server + build)
- **vite-plugin-pwa** (offline/PWA packaging)

## Test on your phone (optional)

To try it on a real device on the same Wi‑Fi network, run the dev server with a host bind and open the printed network URL on your phone:

```bash
npm run dev -- --host
```

## Project structure (high level)

- `src/App.jsx`: mode selection + PWA install prompt handling
- `src/components/*Mode.jsx`: the three game modes
- `src/money.js`: bill/coin definitions, money formatting helpers, and random scenario generation

## PWA / install behavior

This project uses `vite-plugin-pwa` (see `vite.config.js`) and registers a service worker with `registerType: 'autoUpdate'`.

The home screen shows an **“Add to Home Screen”** button when the browser fires `beforeinstallprompt` (and the app is not already running standalone).

## Deploying under a subpath (GitHub Pages)

This repo is currently configured with a Vite `base` of `/coin-counter/` (see `vite.config.js`). That’s typical for GitHub Pages deployments where your app is served from a repo subpath.

If you deploy somewhere else (root domain, different repo name, etc.), update all of these to match:

- `vite.config.js`: `base`
- `vite.config.js`: PWA `manifest.scope` and `manifest.start_url`
- `index.html`: icon paths that currently start with `/coin-counter/…`
- Any asset paths built from `import.meta.env.BASE_URL` (used in `src/money.js`)

## Assets (money images + icons)

The UI expects image assets for bills/coins and PWA icons:

- **Money images**: referenced as `money/bills/*` and `money/coins/*` (see `src/money.js`)
- **Icons**: referenced as `icon-192.png`, `icon-512.png`, and `icon-180.png` (see `index.html` and `vite.config.js`)

If you clone this repo and those files aren’t present in your working tree, add them in the locations the code expects (commonly a `public/` folder in Vite projects), or update the references to match your asset layout.

## License

Apache-2.0 — see `LICENSE`.
