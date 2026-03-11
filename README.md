# Big Game Hunters Classic

**Matthew Houghton Edition** — A lighthearted, retro-style browser game. Hunt targets, read the popups, and reach the end. No gore, no losing; just point, click, and enjoy.

## How to run locally

1. Open the project folder (where `index.html` lives).
2. Double-click **`index.html`** to open it in your default browser.

   **Or** from a terminal in the project folder:
   - **macOS:** `open index.html`
   - **Windows:** `start index.html`
   - **Linux:** `xdg-open index.html`

No server or build step is required. Everything runs from the three static files: `index.html`, `style.css`, and `script.js`.

## What you’ll see

- **Start screen** — Title, subtitle, and a **Start Hunt** button.
- **Game screen** — Dark forest background; one target at a time moves slowly across the screen. Click the target when you’re ready.
- **Popups** — After each hit, a modal shows a short title and text. Use **Continue Hunt** to move to the next target.
- **Final screen** — After the fourth target, you’ll see **DATA DEMOCRATIZED**.

## Files

- `index.html` — Structure and screens.
- `style.css` — Layout, colors, crosshair cursor, and effects.
- `script.js` — Game flow, target movement, and popup logic.
- `sounds/gunshot.mp3` — Gunshot sound effect (add this file for hit feedback).

Have fun, and happy hunting!
