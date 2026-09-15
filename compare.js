const designs = {
  original: { url: './index.html?palette=original', title: 'Connected mind', description: 'Warm ivory, forest green, and an animated network. The original direction.' },
  playground: { url: './variations/playground/', title: 'Playground', description: 'Bold cobalt, electric lime, oversized type. A playful, confident builder’s portfolio.' },
  notebook: { url: './variations/notebook/', title: 'Notebook', description: 'White paper, literary serif type, and red marginal notes. A thoughtful research journal.' }
};
const frame = document.querySelector('#preview');
const options = document.querySelectorAll('[data-design]');
function selectDesign(key) {
  if (!Object.hasOwn(designs, key)) key = 'playground';
  const design = designs[key];
  options.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.design === key)));
  frame.src = design.url;
  frame.title = `${design.title} website design`;
  document.querySelector('#description').textContent = design.description;
  document.querySelector('#open').href = design.url;
}
options.forEach(button => button.addEventListener('click', () => {
  history.replaceState(null, '', `#${button.dataset.design}`);
  selectDesign(button.dataset.design);
}));
document.querySelector('#size').addEventListener('click', event => {
  const mobile = frame.classList.toggle('mobile');
  event.currentTarget.setAttribute('aria-pressed', String(mobile));
  event.currentTarget.textContent = mobile ? 'Full-width preview' : 'Phone preview';
});
window.addEventListener('hashchange', () => selectDesign(location.hash.slice(1)));
if (location.hash) selectDesign(location.hash.slice(1));
