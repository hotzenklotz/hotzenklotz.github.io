# Tom Herold — personal website

A responsive, one-page site built with HTML, CSS, and vanilla JavaScript. Hosted on GitHub Pages with the existing custom domain in `CNAME`.

## Preview locally

Run `python3 -m http.server 8000`, then open http://localhost:8000.

## Edit

- `index.html`: content, project links, publications, and social profiles.
- `style.css`: colors, typography, illustrations, responsive layouts, and motion styles.
- `script.js`: interactive SVG idea network and current footer year.

No build step or package installation is required. Google Fonts supplies DM Sans and Manrope, with sans-serif fallbacks. The diagram respects reduced-motion preferences and pauses when offscreen or the browser tab is hidden.

## Design comparison

Open `http://localhost:8000/compare.html` to switch between three designs and preview phone width.

- Connected Mind: `/index.html` — the chosen layout with Tidal Blue colors and a connected-ideas illustration.
- Playground: `/variations/playground/` — cobalt and lime, large condensed typography, interactive idea prompt.
- Notebook: `/variations/notebook/` — white and red, serif typography, perspective selector and expandable research entries.

The alternatives have independent styles and scripts; the original design is preserved.

## Color palette comparison

Open `http://localhost:8000/palettes.html` to compare Tidal Blue, Mulberry, and Citrus & Ink on the original layout, with the original palette as a reference. Changes preserve the preview scroll position.

Direct links use `index.html?palette=ocean`, `index.html?palette=mulberry`, or `index.html?palette=citrus`. Opening `index.html` without a palette uses the selected Tidal Blue colors. Use `index.html?palette=original` for the original ivory and orange colors. Theme overrides live in `palettes.css`.
