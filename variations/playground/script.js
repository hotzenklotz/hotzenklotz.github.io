const words = ['CURIOSITY', 'DISCOVERY', 'OPEN SOURCE', 'GOOD QUESTIONS'];
let index = 0;
const word = document.querySelector('#idea-word');
document.querySelector('#idea-button').addEventListener('click', () => {
  index = (index + 1) % words.length;
  word.textContent = words[index];
  word.classList.remove('pop');
  requestAnimationFrame(() => word.classList.add('pop'));
});
document.querySelector('[data-year]').textContent = new Date().getFullYear();
