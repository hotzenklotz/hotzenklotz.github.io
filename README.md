# Tom Herold — personal website

The final Tidal Blue design: a responsive, one-page site built with HTML, CSS, and vanilla JavaScript. Hosted on GitHub Pages with the existing custom domain in `CNAME`.

## Preview locally

Run `python3 -m http.server 8000`, then open http://localhost:8000.

## Edit

- `index.html`: content, project links, publications, and social profiles.
- `style.css`: colors, typography, illustrations, responsive layouts, and motion styles.
- `script.js`: interactive SVG idea network and current footer year.

No build step or package installation is required. Google Fonts supplies DM Sans and Manrope, with sans-serif fallbacks. The diagram gently breathes and drifts on its own; hover and touch amplify its motion, which eases back after release. It respects reduced-motion preferences and pauses when offscreen or the browser tab is hidden.

Decorative icons use inline SVG symbols for consistent rendering on iOS. Hover effects are limited to devices with a fine pointer and hover support; touch controls have press feedback and larger tap targets.
