const svg = document.querySelector('#idea-map');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const hoverPointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const NS = 'http://www.w3.org/2000/svg';
let variation = 0;
let nodes = [];
let edges = [];
let frame;
let visible = true;
let pointer = { x: 260, y: 240, active: false, strength: 0 };
let touchPointerId = null;
let motionTime = 0;
let lastFrameTime = null;
let interactionEnergy = 0;
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
  nodes.forEach((n, i) => { n.el = element('circle', { r: n.r, fill: i % 4 === 0 ? 'var(--accent)' : i % 3 === 0 ? 'var(--paper)' : 'var(--network-node)', stroke: i % 4 === 0 ? 'var(--accent)' : 'var(--network-node)', 'stroke-width': 1.3 }); });
  draw(motionTime);
}
function draw(time) {
  const moving = !reducedMotion.matches;
  const energy = moving ? interactionEnergy : 0;
  const angle = moving ? Math.sin(time * .00023) * (.045 + energy * .035) : 0;
  const breathing = moving ? 1 + Math.sin(time * .00065) * (.025 + energy * .015) : 1;
  const driftX = moving ? Math.sin(time * .00037) * 4 : 0;
  const driftY = moving ? Math.cos(time * .00031) * 4 : 0;
  const sway = moving ? 8 + energy * 9 : 0;
  nodes.forEach(n => {
    const x = (n.x - 260) * breathing, y = (n.y - 233) * breathing;
    n.px = 260 + x * Math.cos(angle) - y * Math.sin(angle) + driftX + Math.sin(time * .0007 + n.phase) * sway;
    n.py = 233 + x * Math.sin(angle) + y * Math.cos(angle) + driftY + Math.cos(time * .0006 + n.phase) * sway;
    if (pointer.strength > .001 && moving) {
      const dx = n.px - pointer.x, dy = n.py - pointer.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 140 && distance > 0) {
        const force = (140 - distance) * .28 * pointer.strength;
        n.px += dx / distance * force; n.py += dy / distance * force;
      }
    }
    n.el.setAttribute('cx', n.px); n.el.setAttribute('cy', n.py);
  });
  edges.forEach(({ a, b, el }) => { el.setAttribute('x1', nodes[a].px); el.setAttribute('y1', nodes[a].py); el.setAttribute('x2', nodes[b].px); el.setAttribute('y2', nodes[b].py); });
}
function animate(time) {
  const delta = lastFrameTime === null ? 16 : Math.min(64, Math.max(0, time - lastFrameTime));
  lastFrameTime = time;
  motionTime += delta;
  // Smoothly amplify while interacting, then settle back into the idle motion.
  const ease = 1 - Math.exp(-delta / 180);
  pointer.strength += ((pointer.active ? 1 : 0) - pointer.strength) * ease;
  interactionEnergy += ((pointer.active ? 1 : 0) - interactionEnergy) * (1 - Math.exp(-delta / 700));
  draw(motionTime);
  if (visible && !document.hidden && !reducedMotion.matches) frame = requestAnimationFrame(animate);
}
function restart() {
  cancelAnimationFrame(frame);
  lastFrameTime = null;
  if (visible && !document.hidden && !reducedMotion.matches) frame = requestAnimationFrame(animate);
  else draw(motionTime);
}
function updatePointer(event) {
  if (reducedMotion.matches) return;
  const matrix = svg.getScreenCTM();
  if (!matrix) return;
  const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
  pointer.x = point.x; pointer.y = point.y; pointer.active = true;
}
svg.addEventListener('pointerdown', event => {
  if (event.pointerType === 'touch') {
    if (touchPointerId !== null) return;
    touchPointerId = event.pointerId;
  }
  updatePointer(event);
  interactionEnergy = 1;
}, { passive: true });
svg.addEventListener('pointermove', event => {
  if (event.pointerType === 'touch') {
    if (event.pointerId !== touchPointerId) return;
  } else if (!hoverPointer.matches) return;
  updatePointer(event);
}, { passive: true });
function releasePointer(event) {
  if (event.pointerType === 'touch' && event.pointerId !== touchPointerId) return;
  touchPointerId = null;
  pointer.active = false;
}
svg.addEventListener('pointerleave', releasePointer);
svg.addEventListener('pointercancel', releasePointer);
// Listen outside the SVG too, so lifting a finger beyond its bounds resets it.
window.addEventListener('pointerup', event => {
  if (event.pointerType === 'touch') releasePointer(event);
}, { passive: true });
hoverPointer.addEventListener('change', () => { pointer.active = false; });
document.querySelector('#shuffle').addEventListener('click', () => { variation++; build(); });
reducedMotion.addEventListener('change', restart);
new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; restart(); }).observe(svg);
document.addEventListener('visibilitychange', restart);
document.querySelector('#year').textContent = new Date().getFullYear();
build();

// Keep ambient project motion running only while the illustrations are visible.
const projectObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    entry.target.closest('.work-card').classList.toggle('is-in-view', entry.isIntersecting);
  });
});
document.querySelectorAll('.company-art, .volume-art').forEach(art => projectObserver.observe(art));
function syncProjectMotion() {
  document.documentElement.classList.toggle('motion-paused', document.hidden);
}
document.addEventListener('visibilitychange', syncProjectMotion);
syncProjectMotion();
