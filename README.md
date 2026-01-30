# The Green Chapel

A browser-based roguelike inspired by *Sir Gawain and the Green Knight*.

## Concept
You are a knight who has accepted a challenge: travel to the Green Chapel before the year turns. 
The path is procedurally generated — forests, ruins, caves, moors — each hiding encounters, 
items, and creatures drawn from Arthurian legend and medieval mythology.

**Permadeath.** Each journey is unique. Each death is final.

## Design Pillars
1. **Atmosphere over complexity** — Minimal UI, evocative text, ASCII art
2. **Meaningful choices** — Every encounter should offer genuine decisions
3. **Mythological weirdness** — Not generic fantasy; specifically medieval/Arthurian with a touch of the uncanny
4. **Short runs** — 20-30 minutes per attempt. Dense, not sprawling.

## Tech
- Vanilla HTML/CSS/JS (no dependencies)
- Served via Clawdbot canvas
- Mobile-friendly

## Architecture
- `src/game.js` — Core game loop, state management
- `src/map.js` — Procedural map generation
- `src/combat.js` — Turn-based combat system
- `src/encounters.js` — Event/encounter system
- `src/entities.js` — Player, enemies, NPCs
- `src/items.js` — Items and inventory
- `src/renderer.js` — Terminal-style UI rendering
- `src/data.js` — All content data (enemies, items, encounter text)
- `index.html` — Entry point

## Status
🚧 Under construction by Gawain
