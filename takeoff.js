// Takeoff sequence: A cinematic flight simulation during order processing.
// Canvas draws wind streams, vapor particles, and a glowing paper plane
// while the HUD gauges climb in altitude and airspeed.
import { $, wait, motion } from "./utils.js";
import { showBoardingPass } from "./boardingpass.js";

export function startTakeoff(bookingState) {
  const takeoff = $("#takeoff");
  const canvas = $("#takeoff-canvas");
  const ctx = canvas.getContext("2d");
  const statusEl = $("#takeoff-status");
  const hudAlt = $("#hud-alt");
  const hudSpd = $("#hud-spd");
  const hudDest = $("#hud-dest");
  const hudBar = $("#hud-bar");

  if (!takeoff || !canvas) return;

  takeoff.hidden = false;
  takeoff.classList.remove("out");
  document.body.style.overflow = "hidden";

  if (hudDest) {
    hudDest.textContent = (bookingState.dream || "DRM").slice(0, 8).toUpperCase();
  }

  // Setup canvas
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // Particles: wind currents and speed streaks
  const particles = [];
  for (let i = 0; i < 70; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      len: 40 + Math.random() * 120,
      spd: 12 + Math.random() * 20,
      alpha: 0.1 + Math.random() * 0.4,
      width: 0.8 + Math.random() * 1.5,
    });
  }

  let raf = 0;
  let active = true;
  const startTime = performance.now();
  const duration = 4000; // 4s total takeoff flight

  const phases = [
    { p: 0.0, text: "Plegando tus alas..." },
    { p: 0.28, text: "Cruzando corrientes de aire..." },
    { p: 0.6, text: "Alcanzando velocidad de crucero..." },
    { p: 0.88, text: "Aproximación a tu destino..." },
  ];

  function loop(now) {
    if (!active) return;
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);

    // Update HUD
    const alt = Math.floor(progress * 35000);
    const spd = Math.floor(progress * 520);
    if (hudAlt) hudAlt.textContent = alt.toLocaleString("en-US");
    if (hudSpd) hudSpd.textContent = spd;
    if (hudBar) hudBar.style.transform = `scaleX(${progress})`;

    const curPhase = phases.slice().reverse().find((ph) => progress >= ph.p) || phases[0];
    if (statusEl && statusEl.textContent !== curPhase.text) {
      statusEl.textContent = curPhase.text;
    }

    // Render Canvas
    ctx.fillStyle = "rgba(4, 5, 10, 0.28)";
    ctx.fillRect(0, 0, w, h);

    // Draw wind streaks rushing past
    const speedMult = 1 + progress * 2.5;
    ctx.lineCap = "round";
    for (const p of particles) {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.len * (0.8 + progress * 0.5), p.y + p.len * 0.2);
      ctx.strokeStyle = `rgba(169, 200, 255, ${p.alpha * (0.4 + progress * 0.6)})`;
      ctx.lineWidth = p.width;
      ctx.stroke();

      p.x += p.spd * speedMult;
      p.y -= p.spd * 0.25 * speedMult;
      if (p.x > w + p.len || p.y < -p.len) {
        p.x = -p.len;
        p.y = Math.random() * h * 1.2;
      }
    }

    // Center silhouette of paper airplane climbing
    ctx.save();
    const cx = w * 0.5;
    const cy = h * 0.46 + Math.sin(now / 180) * 8;
    const bank = -18 + Math.sin(now / 320) * 4;

    ctx.translate(cx, cy);
    ctx.rotate((bank * Math.PI) / 180);
    ctx.scale(1.4, 1.4);

    // Glowing contrails behind wings
    ctx.beginPath();
    ctx.moveTo(-25, 10);
    ctx.lineTo(-120 - progress * 80, 20);
    ctx.strokeStyle = `rgba(169, 200, 255, ${0.4 + progress * 0.4})`;
    ctx.lineWidth = 2.4;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 16);
    ctx.lineTo(-90 - progress * 60, 28);
    ctx.strokeStyle = `rgba(214, 198, 255, ${0.3 + progress * 0.3})`;
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // The Plane
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(35, -2);
    ctx.lineTo(-30, -22);
    ctx.lineTo(-12, 0);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#9db0cc";
    ctx.beginPath();
    ctx.moveTo(35, -2);
    ctx.lineTo(-12, 0);
    ctx.lineTo(-30, 22);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#e5ebf5";
    ctx.beginPath();
    ctx.moveTo(35, -2);
    ctx.lineTo(-12, 0);
    ctx.lineTo(-24, 0);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    if (progress < 1) {
      raf = requestAnimationFrame(loop);
    } else {
      active = false;
      takeoff.classList.add("out");
      setTimeout(() => {
        takeoff.hidden = true;
        document.body.style.overflow = "";
        showBoardingPass(bookingState);
      }, 650);
    }
  }

  raf = requestAnimationFrame(loop);
}
