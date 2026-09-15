const svg = document.querySelector('#idea-map');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const NS = 'http://www.w3.org/2000/svg';
let variation = 0;
let nodes = [];
let edges = [];
let frame;
let visible = true;
let pointer = { x: 260, y: 240, active: false };
function element(name, attributes) {
  const el = document.createElementNS(NS, name);
  for (const [key, value] of Object.entries(attributes)) el.setAttribute(key, value);
  svg.append(el);
  return el;
}
function build() {
  svg.replaceChildren();
  nodes = [];
  edges = [];
  const count = 38;
  for (let i = 0; i < count; i++) {
    const angle = i * 2.39996 + variation * .7;
    const radius = 30 + Math.sqrt(i / count) * 165;
    nodes.push({ x: 260 + Math.cos(angle) * radius, y: 233 + Math.sin(angle) * radius * .94, phase: i * .82, r: i % 9 === 0 ? 11 : i % 4 === 0 ? 6 : 3 });
  }
  nodes.forEach((a, i) => nodes.slice(i + 1).forEach((b, j) => {
    if (Math.hypot(a.x - b.x, a.y - b.y) < 112) edges.push({ a: i, b: i + j + 1, el: element('line', { stroke: 'var(--network-line)', 'stroke-width': .8, opacity: .37 }) });
  }));
  nodes.forEach((n, i) => { n.el = element('circle', { r: n.r, fill: i % 4 === 0 ? 'var(--orange)' : i % 3 === 0 ? 'var(--paper)' : 'var(--network-node)', stroke: i % 4 === 0 ? 'var(--orange)' : 'var(--network-node)', 'stroke-width': 1.3 }); });
  draw(0);
}
function draw(time) {
  nodes.forEach(n => {
    const sway = reducedMotion.matches ? 0 : 5;
    n.px = n.x + Math.sin(time * .0005 + n.phase) * sway;
    n.py = n.y + Math.cos(time * .0004 + n.phase) * sway;
    if (pointer.active && !reducedMotion.matches) {
      const dx = n.px - pointer.x, dy = n.py - pointer.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 110 && distance > 0) { const force = (110 - distance) * .18; n.px += dx / distance * force; n.py += dy / distance * force; }
    }
    n.el.setAttribute('cx', n.px); n.el.setAttribute('cy', n.py);
  });
  edges.forEach(({ a, b, el }) => { el.setAttribute('x1', nodes[a].px); el.setAttribute('y1', nodes[a].py); el.setAttribute('x2', nodes[b].px); el.setAttribute('y2', nodes[b].py); });
}
function animate(time) { draw(time); if (visible && !document.hidden && !reducedMotion.matches) frame = requestAnimationFrame(animate); }
function restart() { cancelAnimationFrame(frame); if (visible && !document.hidden && !reducedMotion.matches) frame = requestAnimationFrame(animate); else draw(0); }
svg.addEventListener('pointermove', event => {
  const matrix = svg.getScreenCTM();
  if (!matrix) return;
  const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
  pointer = { x: point.x, y: point.y, active: true };
});
svg.addEventListener('pointerleave', () => { pointer.active = false; });
document.querySelector('#shuffle').addEventListener('click', () => { variation++; build(); });
reducedMotion.addEventListener('change', restart);
new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; restart(); }).observe(svg);
document.addEventListener('visibilitychange', restart);
document.querySelector('#year').textContent = new Date().getFullYear();
build();
