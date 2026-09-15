const palettes = {
  original: { name: 'Original', note: 'Original — warm ivory, forest green, and orange. Your starting point.' },
  ocean: { name: 'Tidal Blue', note: 'Tidal Blue — crisp and technical, with cobalt accents and cool blue surfaces.' },
  mulberry: { name: 'Mulberry', note: 'Mulberry — expressive and personal, with berry accents and soft plum surfaces.' },
  citrus: { name: 'Citrus & Ink', note: 'Citrus & Ink — sunny and grounded, with ochre accents, charcoal type, and pale lemon surfaces.' }
};
const preview = document.querySelector('#palette-preview');
const buttons = document.querySelectorAll('[data-palette]');
let current = 'ocean';
function selectPalette(key) {
  current = Object.hasOwn(palettes, key) ? key : 'ocean';
  const palette = palettes[current];
  buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.palette === current)));
  document.querySelector('#palette-note').textContent = palette.note;
  document.querySelector('#open-palette').href = `index.html?palette=${current}`;
  preview.title = `Connected Mind layout in ${palette.name}`;
  // Change tokens in place: keep scroll position and the animated network intact.
  preview.contentWindow.postMessage({ type: 'set-palette', palette: current }, location.origin);
}
buttons.forEach(button => button.addEventListener('click', () => {
  history.replaceState(null, '', `#${button.dataset.palette}`);
  selectPalette(button.dataset.palette);
}));
preview.addEventListener('load', () => selectPalette(current));
window.addEventListener('hashchange', () => selectPalette(location.hash.slice(1)));
document.querySelector('#phone').addEventListener('click', event => {
  const phone = preview.classList.toggle('phone');
  event.currentTarget.setAttribute('aria-pressed', String(phone));
  event.currentTarget.textContent = phone ? 'Full width' : 'Phone width';
});
selectPalette(location.hash.slice(1));
