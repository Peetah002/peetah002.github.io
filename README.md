# Eradriel Map

Mappa interattiva del mondo di **Eradriel** per la mia campagna D&D.

---

## Stack

- **Next.js 16** (App Router, static export)
- **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui**
- **Zustand** (state + localStorage persist)
- **react-zoom-pan-pinch** (pan/zoom mappa)
- **GitHub Pages** per l'hosting

---

## Pagine

| Route | Descrizione |
|---|---|
| `/` | Landing page |
| `/map` | Mappa giocatori (read-only) |
| `/editor` | Editor DM (regioni, città, terreni) |
| `/regions` | Lista e dettaglio regioni |
| `/cities` | Lista e dettaglio città |
| `/lore` | Enciclopedia del mondo |
| `/timeline` | Cronologia campagna |

---

## Workflow

1. Apro `/editor` e modifico la mappa
2. Esporto il `mappa.json`
3. Lo carico su GitHub Pages
4. I giocatori aprono `/map` e premono **Aggiorna**

---

## Dev

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # genera out/ per deploy
```
