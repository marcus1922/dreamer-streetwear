// Boarding Pass: Digital collectible boarding pass with QR code,
// holographic foil sheen on mouse tilt, and full high-res PNG export.
import QRCode from "qrcode";
import { $, clamp, toast } from "./utils.js";

let currentPassData = null;

export async function showBoardingPass(booking) {
  const dialog = $("#pass-view");
  const pass = $("#pass");
  const qrCanvas = $("#qr");
  if (!dialog || !pass) return;

  const passId = `DRM-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const now = new Date();
  const dateStr = now.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).toUpperCase();

  currentPassData = {
    id: passId,
    passenger: booking.passenger || "Marcus",
    destination: (booking.dream || "YOUR HIGHEST POTENTIAL").toUpperCase(),
    piece: `${booking.colorName || "Midnight Onyx"} · Talla ${booking.size || "M"}`,
    date: dateStr,
    flight: "DRM-2026",
    seat: "01A",
    gate: "∞",
  };

  // Populate pass fields
  $("#pass-id").textContent = currentPassData.id;
  $("#pass-name").textContent = currentPassData.passenger;
  $("#pass-dest").textContent = currentPassData.destination;
  $("#pass-piece").textContent = `${(booking.colorName || "Onyx").replace("Midnight ", "").replace("Night Flight ", "")} · ${booking.size || "M"}`;
  $("#pass-date").textContent = currentPassData.date;

  // Generate realistic barcode lines
  const barcodeContainer = $("#pass-barcode");
  if (barcodeContainer) {
    barcodeContainer.innerHTML = "";
    const pattern = "101100111010110100111010101110110101001110101100111010110100111010101110110";
    for (let i = 0; i < pattern.length; i++) {
      const bar = document.createElement("i");
      bar.style.width = pattern[i] === "1" ? `${1.5 + (i % 3) * 0.8}px` : "2.5px";
      bar.style.opacity = pattern[i] === "1" ? "0.9" : "0";
      barcodeContainer.appendChild(bar);
    }
  }

  // Generate QR Code
  try {
    await QRCode.toCanvas(
      qrCanvas,
      JSON.stringify({
        airline: "DREAMER",
        pass: currentPassData.id,
        passenger: currentPassData.passenger,
        flight: currentPassData.flight,
        dest: currentPassData.destination,
        motto: "NEVER STOP CHASING",
      }),
      {
        width: 170,
        margin: 1,
        color: {
          dark: "#121318",
          light: "#e4e2db",
        },
        errorCorrectionLevel: "M",
      }
    );
  } catch (err) {
    console.warn("QR creation fallback:", err);
  }

  dialog.showModal();

  // Setup interactive 3D foil tilt on the pass card
  setupPassTilt(pass);

  // Setup Download & Share
  setupActions(pass, currentPassData);
}

function setupPassTilt(pass) {
  pass.addEventListener("pointermove", (e) => {
    const rect = pass.getBoundingClientRect();
    const px = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    const py = clamp((e.clientY - rect.top) / rect.height, 0, 1);

    const rx = (py - 0.5) * -14;
    const ry = (px - 0.5) * 16;

    pass.style.setProperty("--prx", `${rx.toFixed(2)}deg`);
    pass.style.setProperty("--pry", `${ry.toFixed(2)}deg`);
    pass.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
    pass.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
  });

  pass.addEventListener("pointerleave", () => {
    pass.style.setProperty("--prx", "0deg");
    pass.style.setProperty("--pry", "0deg");
  });
}

function setupActions(passElement, data) {
  const downloadBtn = $("#download");
  const shareBtn = $("#share");

  if (downloadBtn) {
    downloadBtn.onclick = async () => {
      downloadBtn.disabled = true;
      try {
        await generatePassPNG(data);
        toast("Pase de abordaje descargado");
      } catch (e) {
        console.error(e);
        toast("No se pudo generar la imagen");
      } finally {
        downloadBtn.disabled = false;
      }
    };
  }

  if (shareBtn) {
    if (navigator.share) {
      shareBtn.hidden = false;
      shareBtn.onclick = () => {
        navigator.share({
          title: "DREAMER® Boarding Pass",
          text: `Embarcando en vuelo DRM-2026 hacia ${data.destination}. Never Stop Chasing.`,
          url: window.location.href,
        }).catch(() => {});
      };
    } else {
      shareBtn.hidden = true;
    }
  }
}

// Generate high-resolution Boarding Pass Ticket PNG for offline download
async function generatePassPNG(data) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const scale = 2;
  const width = 1080 * scale;
  const height = 500 * scale;

  canvas.width = width;
  canvas.height = height;
  ctx.scale(scale, scale);

  // Background Ticket Paper
  ctx.fillStyle = "#eeece6";
  ctx.fillRect(0, 0, 1080, 500);

  // Perforation divider
  ctx.strokeStyle = "rgba(18, 19, 24, 0.25)";
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(800, 0);
  ctx.lineTo(800, 500);
  ctx.stroke();
  ctx.setLineDash([]);

  // Perforation cutouts top and bottom
  ctx.fillStyle = "#060709";
  ctx.beginPath();
  ctx.arc(800, 0, 18, 0, Math.PI * 2);
  ctx.arc(800, 500, 18, 0, Math.PI * 2);
  ctx.fill();

  // Brand header
  ctx.fillStyle = "#121318";
  ctx.font = "800 32px Dreamer, sans-serif";
  ctx.fillText("DREAMER® Airlines", 48, 56);

  ctx.fillStyle = "#6b6e78";
  ctx.font = "11px sans-serif";
  ctx.fillText("BOARDING PASS · PASE DE ABORDAJE", 480, 48);

  // Flight Route
  ctx.fillStyle = "#121318";
  ctx.font = "800 68px Dreamer, sans-serif";
  ctx.fillText("NOW", 48, 150);
  ctx.fillText("DRM", 600, 150);

  ctx.fillStyle = "#6b6e78";
  ctx.font = "12px sans-serif";
  ctx.fillText("DONDE ESTÁS HOY", 48, 174);
  ctx.fillText("TUS SUEÑOS", 600, 174);

  // Connecting route line & plane symbol
  ctx.strokeStyle = "#4a5a78";
  ctx.lineWidth = 1.8;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(220, 130);
  ctx.lineTo(560, 130);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "#4a5a78";
  ctx.beginPath();
  ctx.moveTo(390, 130);
  ctx.lineTo(375, 122);
  ctx.lineTo(380, 130);
  ctx.lineTo(375, 138);
  ctx.closePath();
  ctx.fill();

  // Destination
  ctx.fillStyle = "#6b6e78";
  ctx.font = "11px sans-serif";
  ctx.fillText("DESTINO", 48, 226);

  ctx.fillStyle = "#2a3a5c";
  ctx.font = "italic 30px Editorial, serif";
  ctx.fillText(data.destination.slice(0, 38), 48, 264);

  // Row 1 Details Grid
  const row1 = [
    { label: "PASAJERO", val: data.passenger, x: 48 },
    { label: "VUELO", val: data.flight, x: 260 },
    { label: "CLASE", val: "Dreamer", x: 440 },
    { label: "EMBARQUE", val: "Ahora", x: 620 },
  ];
  row1.forEach((f) => {
    ctx.fillStyle = "#6b6e78";
    ctx.font = "10px sans-serif";
    ctx.fillText(f.label, f.x, 320);

    ctx.fillStyle = "#121318";
    ctx.font = "bold 17px sans-serif";
    ctx.fillText(f.val, f.x, 344);
  });

  // Row 2 Details Grid
  const row2 = [
    { label: "PIEZA", val: data.piece, x: 48 },
    { label: "PUERTA", val: data.gate, x: 340 },
    { label: "ASIENTO", val: data.seat, x: 460 },
    { label: "FECHA", val: data.date, x: 600 },
  ];
  row2.forEach((f) => {
    ctx.fillStyle = "#6b6e78";
    ctx.font = "10px sans-serif";
    ctx.fillText(f.label, f.x, 396);

    ctx.fillStyle = "#121318";
    ctx.font = "bold 17px sans-serif";
    ctx.fillText(f.val, f.x, 420);
  });

  // Barcode decoration at bottom
  ctx.fillStyle = "#121318";
  for (let i = 0; i < 60; i++) {
    const barW = (i % 3 === 0 ? 3 : 1.5);
    ctx.fillRect(48 + i * 11, 448, barW, 26);
  }

  // Right Stub
  const qrSource = $("#qr");
  if (qrSource) {
    ctx.drawImage(qrSource, 840, 42, 180, 180);
  }

  ctx.fillStyle = "#121318";
  ctx.font = "800 24px Dreamer, sans-serif";
  ctx.fillText("NEVER", 840, 270);
  ctx.fillText("STOP", 840, 298);
  ctx.fillText("CHASING.", 840, 326);

  ctx.fillStyle = "#6b6e78";
  ctx.font = "12px sans-serif";
  ctx.fillText(data.id, 840, 370);
  ctx.fillText("Pase coleccionable demo.", 840, 430);

  // Trigger Download
  const link = document.createElement("a");
  link.download = `DREAMER-BOARDING-PASS-${data.id}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
