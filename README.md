# DREAMER / Never Stop Chasing

Experiencia editorial interactiva desarrollada con HTML, CSS y JavaScript modular.

## Ejecutar

```sh
npm install
npm run dev
```

## Validar y compilar

```sh
npm test
npm run build
npm run preview
```

`npm test` requiere Chromium de Playwright (`npx playwright install chromium`) y el servidor de desarrollo en localhost:5173.

## Arquitectura

- `index.html`: escaparate, manifiesto, archivo, checkout y pase.
- `src/style.css`: tokens, diseño responsive y animaciones.
- `src/main.js`: selectores, compra local, QR, descarga y física mediante un único requestAnimationFrame bajo demanda.
- `public/assets/`: imágenes originales y fuentes locales; `hoodie.webp` es un render conceptual generado a partir del póster.
- `.impeccable/review/`: evidencia de revisión visual.

Sustituye `public/assets/hoodie.webp` por la fotografía final para conservar la integración. Los colores alternativos son simulaciones CSS, señaladas en la interfaz. Si falta la imagen principal se usa el póster de campaña.

## Alcance comercial

Esta entrega es un frontend de demostración. El precio, envío y pago son simulados. No integra Apple Pay real ni procesa tarjetas, no almacena formularios ni envía sus valores a servicios externos. El QR codifica el identificador local del pase, el vuelo y el destino, sin datos personales. Antes de vender deben incorporarse catálogo y fotografías definitivos, inventario, precios, políticas, backend y proveedor de pagos.

## Diseño y referencias

Jerarquía comercial: https://www.jacquemus.com/ y https://fearofgod.com/ (consultadas durante el desarrollo). No se incorporaron fotografías ni código de esas marcas. Fuentes Fira Sans Condensed y Liberation Serif alojadas localmente; licencias en `public/assets/licenses/`. Logotipos y póster: archivos aportados por el usuario. Iconos: Phosphor. QR: qrcode.

Objetivo de animación: 60 FPS mediante transform y opacity, canvas con partículas acotadas y frames bajo demanda; no constituye garantía en todos los dispositivos. La preferencia del sistema de movimiento reducido siempre prevalece.

## Validación realizada

- Build Vite correcto y recorrido automatizado con Playwright: selección de variantes, compra, QR, descarga PNG, Escape, movimiento reducido, formulario inválido y móvil sin overflow.
- Lighthouse móvil sobre el build de producción: rendimiento 99, accesibilidad 100, buenas prácticas 100, SEO 100; LCP 2.1 s, CLS 0.017, TBT 0 ms. Resultado de laboratorio, dependiente de dispositivo y red.
- Auditoría npm tras actualizar dependencias: cero vulnerabilidades reportadas.
- El ejecutable de Impeccable no estaba instalado; sus directrices se aplicaron mediante lectura de referencias y revisión independiente. No se ejecutó su detector.
