# Palpatine Earth Dashboard

Imperial intelligence dashboards for **Sector Zero-Zero-Zero-One** (Earth), framed through Emperor Palpatine's lens. Built as [Cursor Canvas](https://cursor.com) files — live React panels you can open beside the chat in Cursor IDE.

## Canvases

| File | Description |
|------|-------------|
| `canvases/palpatine-imperial-dashboard.canvas.tsx` | **Main war-room dashboard** — KPI strip, overview charts, great powers, threat matrix, domain status |
| `canvases/palpatine-earth-assessment.canvas.tsx` | **Full sector briefing** — 13 domains (economy, military, nuclear, energy, alliances, tech, space, demographics, trade, maritime, cyber, climate, exploitation) |
| `canvases/earth-economy-sith-dashboard.canvas.tsx` | **Vader war-room** — macro snapshot, geopolitical pressure matrix, IMF scenarios |

## How to use

1. Clone this repo (or copy the `canvases/` folder into your Cursor project's `canvases/` directory).
2. In Cursor, open any `.canvas.tsx` file — the IDE compiles it automatically.
3. Open the canvas beside the chat to interact with charts, pills, and tables.

Canvases import only from `cursor/canvas` (provided by Cursor). No `npm install` required for normal use inside Cursor.

## Data sources

Public data embedded in the canvases (as of mid-2026):

- IMF World Economic Outlook (April 2026)
- SIPRI military expenditure & nuclear forces (2025–2026)
- UNCTAD / WTO trade reports (2025–2026)
- IEA Global Energy Review (2026)
- World Population Review (2026)

Palpatine/Vader commentary is fictional framing atop real figures.

## License

MIT — fan project, not affiliated with Lucasfilm or Disney.
