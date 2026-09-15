// Load before CSS so a shared palette URL paints in the selected colors.
(() => {
  const colors = { original: '#f8f7f2', ocean: '#f7faff', mulberry: '#fff9fc', citrus: '#fffef7' };
  function applyPalette(name) {
    const palette = Object.hasOwn(colors, name) ? name : 'ocean';
    document.documentElement.dataset.palette = palette;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', colors[palette]);
  }
  applyPalette(new URLSearchParams(location.search).get('palette'));
  window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== window.parent) return;
    if (event.data?.type === 'set-palette') applyPalette(event.data.palette);
  });
})();
