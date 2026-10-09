import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto("http://localhost:5173");
await page.evaluate(() => document.fonts.ready);
await page.locator("#hoodie").evaluate((img) => img.decode());
await page.screenshot({
  path: ".impeccable/review/desktop.png",
  fullPage: true,
});
await page.locator('[data-size="XL"]').click();
await page
  .getByRole("button", { name: "Dream Dust Grey", exact: true })
  .click();
await page.locator("#claim").click();
assert.match(
  await page.locator("#order-variant").textContent(),
  /Dream Dust Grey.*XL/,
);
await page.getByRole("button", { name: "CONFIRMAR VUELO" }).click();
await page.locator("#success").waitFor({ state: "visible", timeout: 6000 });
assert.equal(await page.locator("#pass-name").textContent(), "Marcus");
assert.ok(await page.locator("#qr").evaluate((c) => c.width > 0));
await page.screenshot({ path: ".impeccable/review/checkout.png" });
const download = page.waitForEvent("download");
await page.locator("#download").click();
const file = await download;
assert.match(file.suggestedFilename(), /DREAMER-DRM.*png/);
await file.saveAs(".impeccable/review/boarding-pass.png");
await page.getByRole("button", { name: "Seguir explorando" }).click();
assert.equal(await page.locator("#checkout").evaluate((d) => d.open), false);
await page.getByRole("button", { name: "Guía de fit" }).click();
await page.keyboard.press("Escape");
await page.emulateMedia({ reducedMotion: "reduce" });
await page.mouse.move(200, 200);
assert.equal(
  await page
    .locator("body")
    .evaluate((b) => b.classList.contains("custom-cursor")),
  false,
);
const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 1,
});
await mobile.goto("http://localhost:5173");
await mobile.evaluate(() => document.fonts.ready);
await mobile.locator("#hoodie").evaluate((img) => img.decode());
assert.equal(
  await mobile.evaluate(
    () => document.documentElement.scrollWidth <= innerWidth,
  ),
  true,
  "mobile overflow",
);
await mobile.screenshot({
  path: ".impeccable/review/mobile.png",
  fullPage: true,
});
await mobile.locator("#claim").click();
await mobile.locator("input[name=email]").fill("incorrecto");
await mobile.getByRole("button", { name: "CONFIRMAR VUELO" }).click();
assert.equal(
  await mobile.locator("input[name=email]").evaluate((i) => i.validity.valid),
  false,
);
await mobile.screenshot({ path: ".impeccable/review/mobile-checkout.png" });
assert.deepEqual(errors, []);
await browser.close();
await fs.writeFile(
  ".impeccable/review/test-results.json",
  JSON.stringify(
    {
      desktop: "1440x950",
      mobile: "390x844",
      overflow: false,
      checkout: "passed",
      download: "passed",
      reducedMotion: "passed",
      validation: "passed",
      consoleErrors: errors,
    },
    null,
    2,
  ),
);
console.log(
  "PASS: desktop, mobile, variants, checkout, QR, download, keyboard dismissal, reduced motion, validation, console.",
);
