const notes = {
  engineer: 'The challenge: make powerful software feel simple to use.',
  founder: 'The work: bring a small team together around big scientific questions.',
  curious: 'The question: what becomes possible when we look a little closer?'
};
const buttons = document.querySelectorAll('[data-lens]');
buttons.forEach(button => button.addEventListener('click', () => {
  buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  document.querySelector('#lens-note').textContent = notes[button.dataset.lens];
}));
document.querySelector('[data-year]').textContent = new Date().getFullYear();
