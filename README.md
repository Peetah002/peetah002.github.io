# 🗺️ Eradriel Map

> An interactive fantasy world map for my D&D campaign, hosted on GitHub Pages — no installs, no PDFs, no Discord file dumps.

***

## 📖 Overview

**Eradriel Map** is a lightweight, browser-based interactive map built for a homebrew D&D campaign. It solves a simple problem: I was tired of editing maps in Inkscape, exporting them, and sending files to Discord before every session. Now I update a JSON file, push it, and my players are synced.

The map evolves alongside the campaign — cities can become ruins, new locations unlock as the party explores, and points of interest appear as players discover them. The world changes because the characters change it.

***

## ✨ Features

### 🧙 DM View (`eradriel_map.html`)
- Draw and edit **regions** — colored polygons with name and subtitle
- Add, move, and edit **locations** — cities, ruins, points of interest, and mission targets
- Mark locations as **discovered**, **active**, or **destroyed** to reflect the party's journey
- Drag the **Tower of Nartharion** (party base) anywhere on the map
- Export map state to `mappa.json`
- Full pan & zoom — mouse and touch supported
- Data persisted in `localStorage`

### 👥 Player View (`index.html`)
- Read-only map showing only what the party has discovered
- Tap any location to see its name, type, and available info
- **Update** button — fetches the latest `mappa.json` from GitHub Pages
- **Import** button — loads a local JSON file as fallback

***

## ⚔️ Session Workflow

1. Open `eradriel_map.html` locally before the session
2. Update the map — add new locations, mark discoveries, turn cities to ruins, reveal mission targets
3. Export `mappa.json` and push it to the repo
4. Players open `index.html` and hit **Update** — the world has moved on

***

## 🎨 Visual Style

Old fantasy map aesthetic: **Cinzel** and **IM Fell English** fonts, gold and ink color palette, compass rose, legend, and vignette border. Built entirely with SVG — no canvas, no external libraries.

***

## 🛠️ Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML, CSS, JavaScript |
| Hosting | GitHub Pages |
| Persistence (DM) | `localStorage` |
| Sync (Players) | `fetch` API |

***

## 📝 Notes

This project is built for personal use and isn't designed to scale or be repurposed out of the box. There's no authentication, no backend, and no build step — and that's intentional.
