// Aerodynamic paper-plane cursor: inertia, heading, banking and a tapered
// contrail with wingtip vortices. Lives in a manual popover so it stays above
// modal dialogs (top layer).
import { $, fine, motion } from "./utils.js";

const layer = $("#cursor-layer");
const cursor = $("#cursor");
const plane = $("#cursor-plane");
const label = $("#cursor-label");
const canvas = $("#trail");
const ctx = canvas.getContext("2d");
const hasPopover = typeof layer.showPopover === "function";

let active = false;
let raf = 0;
let last = 0;
let tx = 0, ty = 0, x = 0, y = 0, vx = 0, vy = 0;
let heading = -30, bank = 0, scale = 1, targetScale = 1;
let points = [];
let bursts = [];
let idle = 0;

function resize() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

export function raiseCursor() {
  if (!hasPopover) return;
  try {
    if (layer.matches(":popover-open")) layer.hidePopover();
    layer.showPopover();
  } catch {
    /* ignore */
  }
}

function enabled() {
  return fine.matches && !motion.reduced;
}

function schedule() {
  if (!raf && active) raf = requestAnimationFrame(tick);
}

function tick(time) {
  raf = 0;
  const dt = Math.min((time - (last || time - 16)) / 16.67, 3);
  last = time;

  // spring follow (slight lag = inertia)
  const k = 1 - Math.pow(0.72, dt);
  const nx = x + (tx - x) * k;
  const ny = y + (ty - y) * k;
  vx = nx - x;
  vy = ny - y;
  x = nx;
  y = ny;
  const speed = Math.hypot(vx, vy);

  // heading follows velocity; banking proportional to turn rate
  let turn = 0;
  if (speed > 0.6) {
    const target = (Math.atan2(vy, vx) * 180) / Math.PI;
    const diff = ((target - heading + 540) % 360) - 180;
    turn = diff * (1 - Math.pow(0.8, dt));
    heading += turn;
    idle = 0;
  } else {
    idle += dt;
  }
  bank += (Math.max(-70, Math.min(70, turn * 9)) - bank) * (1 - Math.pow(0.85, dt));
  scale += (targetScale - scale) * (1 - Math.pow(0.75, dt));
  const bob = idle > 20 ? Math.sin(time / 380) * 2.5 : 0;

  cursor.style.transform = `translate3d(${x}px, ${y + bob}px, 0)`;
  plane.style.transform = `rotate(${heading}deg) rotateX(${bank}deg) scale(${scale})`;

  // trail
  if (speed > 0.8) points.push({ x, y, a: heading, life: 1 });
  for (const p of points) p.life -= 0.035 * dt;
  points = points.filter((p) => p.life > 0).slice(-34);

  ctx.clearRect(0, 0, innerWidth, innerHeight);
  if (points.length > 2) {
    // main ribbon
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1], b = points[i];
      const t = i / points.length;
      ctx.strokeStyle = `rgba(200,220,255,${t * b.life * 0.38})`;
      ctx.lineWidth = t * 3.2;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
    // wingtip vortices
    for (const side of [-1, 1]) {
      ctx.beginPath();
      points.forEach((p, i) => {
        const r = ((p.a + 90 * side) * Math.PI) / 180;
        const off = 7 + (1 - p.life) * 9;
        const px = p.x + Math.cos(r) * off;
        const py = p.y + Math.sin(r) * off;
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      });
      ctx.strokeStyle = "rgba(214,198,255,0.13)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
  // click bursts
  for (const b of bursts) {
    b.life -= 0.04 * dt;
    b.r += 2.2 * dt;
    ctx.strokeStyle = `rgba(169,200,255,${Math.max(b.life, 0) * 0.5})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2 + b.seed;
      ctx.beginPath();
      ctx.moveTo(b.x + Math.cos(ang) * b.r * 0.6, b.y + Math.sin(ang) * b.r * 0.6);
      ctx.lineTo(b.x + Math.cos(ang) * b.r * 1.1, b.y + Math.sin(ang) * b.r * 1.1);
      ctx.stroke();
    }
  }
  bursts = bursts.filter((b) => b.life > 0);

  if (speed > 0.05 || points.length || bursts.length || Math.abs(bank) > 0.2 || idle > 20) schedule();
}

function labelFor(target) {
  const el = target.closest("[data-cursor]");
  return el ? el.dataset.cursor : "";
}

function onMove(e) {
  if (!enabled() || e.pointerType !== "mouse") return;
  if (!active) {
    x = tx = e.clientX;
    y = ty = e.clientY;
    active = true;
    document.body.classList.add("custom-cursor");
    raiseCursor();
  }
  tx = e.clientX;
  ty = e.clientY;
  const interactive = e.target.closest("a, button, summary, label, input, [data-cursor]");
  const text = labelFor(e.target);
  targetScale = text ? 1.25 : interactive ? 1.4 : 1;
  label.textContent = text;
  label.classList.toggle("show", Boolean(text));
  schedule();
}

function deactivate() {
  active = false;
  document.body.classList.remove("custom-cursor");
  cancelAnimationFrame(raf);
  raf = 0;
  points = [];
  bursts = [];
  ctx.clearRect(0, 0, innerWidth, innerHeight);
}

export function initCursor() {
  resize();
  addEventListener("resize", resize, { passive: true });
  if (hasPopover) {
    try {
      layer.showPopover();
    } catch {
      /* ignore */
    }
  }
  addEventListener("pointermove", onMove, { passive: true });
  addEventListener("pointerdown", (e) => {
    if (!active) return;
    bursts.push({ x: e.clientX, y: e.clientY, r: 4, life: 1, seed: Math.random() * 6 });
    targetScale = 0.8;
    setTimeout(() => (targetScale = 1.3), 120);
    schedule();
  });
  document.documentElement.addEventListener("pointerleave", () => {
    if (active) cursor.style.opacity = "0";
  });
  document.documentElement.addEventListener("pointerenter", () => (cursor.style.opacity = ""));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      raf = 0;
    } else schedule();
  });
  fine.addEventListener("change", () => !fine.matches && deactivate());
  motion.on((reduced) => reduced && deactivate());
}
