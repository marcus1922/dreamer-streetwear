// Showcase 3D: Depth, perspective tilt, dynamic light sheen,
// drag-to-rotate, flip front/back, and color/size synchronization.
import { $, $$, clamp, lerp, motion } from "./utils.js";

export const state = {
  view: "front", // "front" | "back"
  color: "onyx",
  colorName: "Midnight Onyx",
  size: "M",
  qty: 1,
  passenger: "Marcus",
  email: "dreamer@example.com",
  dream: "",
  address: "Avenida de los Sueños 2026",
  city: "Tijuana",
  postal: "22000",
  shipMethod: "std",
  paymentMethod: "card",
  unitPrice: 1890,
  shippingCost: 0,
};

const COLOR_NAMES = {
  onyx: "Midnight Onyx",
  storm: "Storm Grey",
  navy: "Night Flight Navy",
};

export function initShowcase() {
  const showcase = $("#showcase");
  const garment = $("#garment");
  const floorShadow = $("#floor-shadow");
  if (!showcase || !garment) return;

  let rx = 0, ry = 0;
  let targetRx = 0, targetRy = 0;
  let baseRy = 0; // 0 for front, 180 for back
  let isDragging = false;
  let dragStartX = 0;
  let dragStartRy = 0;
  let lightX = 50, lightY = 35;
  let targetLightX = 50, targetLightY = 35;

  let raf = 0;

  function update() {
    raf = 0;
    if (motion.reduced) {
      garment.style.setProperty("--rx", "0deg");
      garment.style.setProperty("--ry", `${baseRy}deg`);
      return;
    }

    // Smooth lerp
    rx = lerp(rx, targetRx, 0.12);
    ry = lerp(ry, targetRy, 0.12);
    lightX = lerp(lightX, targetLightX, 0.15);
    lightY = lerp(lightY, targetLightY, 0.15);

    const currentTotalRy = baseRy + ry;

    garment.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
    garment.style.setProperty("--ry", `${currentTotalRy.toFixed(2)}deg`);
    showcase.style.setProperty("--lx", `${lightX.toFixed(1)}%`);
    showcase.style.setProperty("--ly", `${lightY.toFixed(1)}%`);

    // Shadow shifts inversely with perspective tilt
    if (floorShadow) {
      const shadowShift = (-currentTotalRy * 0.4).toFixed(1);
      const shadowScale = (1 - Math.abs(rx) * 0.015).toFixed(2);
      floorShadow.style.setProperty("--sx", `${shadowShift}px`);
      floorShadow.style.setProperty("--ss", shadowScale);
    }

    if (
      Math.abs(targetRx - rx) > 0.05 ||
      Math.abs(targetRy - ry) > 0.05 ||
      Math.abs(targetLightX - lightX) > 0.1 ||
      Math.abs(targetLightY - lightY) > 0.1
    ) {
      raf = requestAnimationFrame(update);
    }
  }

  function schedule() {
    if (!raf) raf = requestAnimationFrame(update);
  }

  // Pointer move: perspective tilt and specular sheen
  showcase.addEventListener(
    "pointermove",
    (e) => {
      if (motion.reduced || isDragging) return;
      const rect = showcase.getBoundingClientRect();
      const px = clamp((e.clientX - rect.left) / rect.width, 0, 1);
      const py = clamp((e.clientY - rect.top) / rect.height, 0, 1);

      // Tilt angle range
      targetRx = (py - 0.5) * -16;
      targetRy = (px - 0.5) * 22;

      // Dynamic light coordinate
      targetLightX = px * 100;
      targetLightY = py * 100;

      schedule();
    },
    { passive: true }
  );

  showcase.addEventListener("pointerleave", () => {
    if (isDragging) return;
    targetRx = 0;
    targetRy = 0;
    targetLightX = 50;
    targetLightY = 35;
    schedule();
  });

  // Drag to rotate horizontally 360
  garment.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    isDragging = true;
    dragStartX = e.clientX;
    dragStartRy = ry;
    garment.classList.add("dragging");
    garment.setPointerCapture(e.pointerId);
  });

  garment.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX;
    targetRy = dragStartRy + deltaX * 0.45;
    ry = targetRy;

    // Detect if we flipped past 90 degrees
    const normalized = (baseRy + ry) % 360;
    const isBackFacing = Math.abs(normalized) > 90 && Math.abs(normalized) < 270;
    garment.classList.toggle("show-back", isBackFacing);

    schedule();
  });

  const stopDrag = (e) => {
    if (!isDragging) return;
    isDragging = false;
    garment.classList.remove("dragging");
    try {
      if (e && e.pointerId) garment.releasePointerCapture(e.pointerId);
    } catch {}

    // Snap to closest front or back
    const total = baseRy + ry;
    const turns = Math.round(total / 360);
    const remainder = ((total % 360) + 360) % 360;

    if (remainder > 90 && remainder < 270) {
      setView("back");
    } else {
      setView("front");
    }
  };

  garment.addEventListener("pointerup", stopDrag);
  garment.addEventListener("pointercancel", stopDrag);

  // View toggle buttons (Frente / Espalda)
  exportSetView = (view) => setView(view);
  function setView(view) {
    state.view = view;
    baseRy = view === "back" ? 180 : 0;
    targetRy = 0;
    ry = 0;

    $$(".view-toggle button").forEach((btn) => {
      const active = btn.dataset.view === view;
      btn.classList.toggle("selected", active);
      btn.setAttribute("aria-pressed", String(active));
    });

    garment.classList.toggle("show-back", view === "back");
    schedule();
  }

  $$(".view-toggle button").forEach((btn) => {
    btn.addEventListener("click", () => {
      setView(btn.dataset.view);
    });
  });

  // Color Swatches
  $$(".swatches .swatch").forEach((btn) => {
    btn.addEventListener("click", () => {
      const c = btn.dataset.color;
      state.color = c;
      state.colorName = COLOR_NAMES[c] || c;

      $$(".swatches .swatch").forEach((b) => {
        const sel = b === btn;
        b.classList.toggle("selected", sel);
        b.setAttribute("aria-pressed", String(sel));
      });

      const colorNameEl = $("#color-name");
      if (colorNameEl) colorNameEl.textContent = state.colorName;

      showcase.dataset.color = c;

      // Update preview note
      const note = $("#preview-note");
      if (note) {
        note.textContent =
          c === "onyx"
            ? "Experiencia demo · Visualización conceptual de la prenda."
            : `Color ${state.colorName} simulado con tinte óptico en tiempo real.`;
      }

      // Sync ticket & pass preview
      syncSelection();
    });
  });

  // Size buttons
  $$(".sizes button").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.size = btn.dataset.size;
      $$(".sizes button").forEach((b) => {
        const sel = b === btn;
        b.classList.toggle("selected", sel);
        b.setAttribute("aria-pressed", String(sel));
      });
      syncSelection();
    });
  });

  function syncSelection() {
    const ticketVariant = $("#ticket-variant");
    if (ticketVariant) {
      ticketVariant.textContent = `${state.colorName} · Talla ${state.size}`;
    }
    const passPiece = $("#pass-piece");
    if (passPiece) {
      passPiece.textContent = `${state.colorName.replace("Midnight ", "").replace("Night Flight ", "")} · ${state.size}`;
    }
  }

  syncSelection();
}

export let exportSetView = () => {};
