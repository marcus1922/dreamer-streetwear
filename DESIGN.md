---
name: DREAMER
description: Streetwear editorial oscuro para quienes nunca dejan de perseguir sus sueños.
colors:
  primary: "#c4d6ee"
  charcoal: "#080808"
  panel: "#111113"
  paper-white: "#f5f5f3"
  smoke: "#a2a2aa"
  divider: "#303034"
  field: "#19191d"
  boarding-paper: "#dce3eb"
  boarding-ink: "#16171b"
typography:
  display:
    fontFamily: "Dreamer, sans-serif"
    fontSize: "clamp(68px, 7.35vw, 112px)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Dreamer, sans-serif"
    fontSize: "clamp(38px, 4.5vw, 66px)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Body, sans-serif"
    fontSize: "25px"
    fontWeight: 400
    lineHeight: 1.2
  editorial:
    fontFamily: "Editorial, serif"
    fontSize: "34px"
    lineHeight: 1.15
  body:
    fontFamily: "Body, sans-serif"
    fontSize: "18px"
    lineHeight: 1.5
  label:
    fontFamily: "Body, sans-serif"
    fontSize: "10px"
    letterSpacing: "0.1em"
rounded:
  square: "0px"
  circle: "50%"
spacing:
  compact: "12px"
  control: "20px"
  section-gap: "24px"
  dialog: "38px"
components:
  button-primary:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.charcoal}"
    height: "53px"
    padding: "0 20px"
  button-primary-hover:
    backgroundColor: "{colors.primary}"
  field:
    backgroundColor: "{colors.field}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.square}"
    height: "43px"
    padding: "0 12px"
  size-selected:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.charcoal}"
  boarding-pass:
    backgroundColor: "{colors.boarding-paper}"
    textColor: "{colors.boarding-ink}"
    padding: "24px"
---

# Design System: DREAMER

## Overview

**Creative North Star: "La editorial del despegue"**

Una editorial de streetwear nocturna: carbón, blancos suaves, titulares condensados y una firma serif en cursiva. La dirección visual autorizada combina contundencia de marca y espacio para contemplar la prenda. Diales de dirección: diseño 8, movimiento 7, densidad 3; son intención creativa, no métricas de rendimiento.

La identidad usa los archivos reales DB y Dreamer Boy del usuario junto a un render generado de la sudadera, identificado como visualización conceptual. La metáfora de vuelo conecta cursor, interacción y pase coleccionable. El negro carbón, la serif editorial, el cursor avión y el checkout demo con boarding pass son decisiones explícitas del brief y prevalecen sobre recomendaciones genéricas que desaconsejen esos recursos.

**Key Characteristics:**

- Contraste oscuro editorial y acento azul cielo discreto.
- Tipografía condensada protagonista; serif reservada para frases emocionales.
- Superficies rectas y profundidad concentrada en la prenda y el pase.
- Movimiento opcional con alternativa reducida y cursor nativo en diálogos.

Documento extraído de PRODUCT.md, index.html, src/style.css y src/main.js. Las familias reales de los archivos locales se verificaron con fc-scan. El motor Impeccable no está disponible: este documento y el sidecar no implican una validación por su motor ni una inspección visual automatizada. La corrección de superposición de tipografía en la prenda está en curso; se documenta la intención, no se certifica el resultado.

## Colors

El acento azul cielo aparece sobre una escala carbón, humo y blanco suave. Los valores normativos están en el frontmatter y corresponden al CSS observado. Las rampas OKLCH del sidecar son muestras auxiliares sintetizadas para el panel, no colores adicionales implementados.

### Primary

- **Azul cielo tenue** (`primary`, CSS `--accent`): firma serif, foco, hover primario y símbolos de vuelo.

### Neutral

- **Carbón profundo** (`charcoal`, `--bg`): lienzo de marca.
- **Carbón elevado** (`panel`, `--panel`): superficies de diálogo.
- **Blanco suave** (`paper-white`, `--text`): lectura principal y CTA invertido.
- **Humo** (`smoke`, `--muted`): información secundaria y notas de demo.
- **Grafito divisor** (`divider`, `--line`): separación estructural fina.
- **Grafito de campo** (`field`): superficie de inputs.
- **Papel de embarque** y **tinta de embarque** (`boarding-paper`, `boarding-ink`): inversión clara reservada al pase coleccionable.

**The Cielo Rule.** El azul acompaña la lectura y el estado; el lienzo dominante sigue siendo carbón.

## Typography

**Display Font:** Dreamer, alias local de Fira Sans Condensed ExtraBold; fallback sans-serif. Archivo `/assets/display.woff2`.

**Body Font:** Body, alias local de Fira Sans Condensed; fallback sans-serif. Archivo `/assets/body.woff2`.

**Editorial Font:** Editorial, alias local de Liberation Serif en cursiva; fallback serif. Archivo `/assets/editorial.woff2`.

Todas usan `font-display: swap`; el display se precarga. El contraste procede de condensación, tamaño y cursiva, sin dependencia de fuentes remotas.

### Hierarchy

- **Display:** titular de campaña, pesado y compacto; en móvil usa `clamp(57px,14vw,90px)` y altura de línea `.93`.
- **Headline:** manifiesto con líneas apretadas; el contorno es un tratamiento puntual de énfasis.
- **Title:** nombre de producto con peso regular.
- **Editorial:** frases breves en cursiva; baja a 25px en móvil.
- **Body:** introducción y textos de apoyo; párrafo de manifiesto limitado a 360px en escritorio.
- **Label:** etiquetas de selección y metadatos de viaje, con tracking amplio.

**The Prenda Rule.** La tipografía ambiental pertenece al fondo: debe conservar intacta la legibilidad de la silueta y del emblema de la sudadera.

## Layout

Hero asimétrico de dos columnas (`.83fr 1.4fr`), ancho máximo 1600px y márgenes laterales 4%. El manifiesto limita su ancho a 1400px, usa dos columnas y padding vertical 110px. El archivo alterna proporciones `1.15fr 1fr`, con la segunda pieza desplazada 90px. Los espacios extraídos son valores observados, no una escala exhaustiva nueva.

A 1024px se compactan composición y tipografía. Hasta 767px el hero y el archivo pasan a una columna y los márgenes suben a 6%; la navegación de texto se oculta y permanece la selección. A partir de 1600px crece el escenario de producto. El checkout ocupa el lateral derecho con ancho máximo 540px y altura de viewport; en móvil se ajusta al ancho disponible. El dialog informativo usa `min(760px,92vw)`.

## Elevation & Depth

No hay un sistema de sombras de tarjetas. La separación viene de tonos y bordes. La prenda usa perspectiva CSS de 1000px, planos en profundidad y seguimiento del puntero; no es un modelo 3D. La intención es una prenda delante de letras ambientales, con órbita elíptica y brillo sutil. El pase utiliza perspectiva de 900px y rotación de -2 a 2 grados. El backdrop del diálogo oscurece y desenfoca 7px.

**The Profundidad Rule.** Concentrar profundidad en la prenda y el pase; conservar planos los controles de compra.

## Shapes

Controles y paneles rectos. Swatches, contador y control de ampliación circulares; órbita elíptica. Divisores sólidos finos y perforación visual discontinua en el pase. El avión de papel es la silueta de interacción distintiva.

## Components

### Buttons

CTA ancho con blanco suave sobre carbón, inversión del esquema de página, tracking `.08em` y flecha. Hover azul cielo; transiciones 160ms; pulsación a escala `.97`. Foco visible con contorno de 2px y separación de 5px. Deshabilitado usa opacidad `.45` y cursor de espera. En móvil el primario mide 52px de alto.

El enlace editorial subrayado y el botón de continuar son variantes transparentes. Los iconos de la aplicación son Phosphor locales del paquete instalado.

### Chips

Tallas rectangulares S–XXL con selección invertida y `aria-pressed`; M es el valor inicial. Los swatches circulares también usan `aria-pressed`, etiqueta textual y contorno seleccionado. Onyx es inicial; White y Grey son simulaciones por filtro, no fotografías adicionales.

### Cards / Containers

El panel de producto se abre con una línea, sin caja independiente. El archivo usa piezas visuales abiertas con leyenda; hover de imagen a opacidad `.83`. Los diálogos nativos contienen checkout e información y restauran foco al cerrarse.

### Inputs / Fields

Campos cuadrados oscuros, borde gris de 1px, padding lateral 12px y caret azul cielo. Validación HTML nativa mediante required, email, límites de longitud y código postal de cinco dígitos. Los métodos de pago demo usan radios nativos con borde de selección azul cielo. No existe un estilo personalizado de error de formulario; el error de QR usa un mensaje `role="alert"` y deshabilita la descarga.

### Navigation

Cabecera de 90px en escritorio, enlaces pequeños en gris y hover blanco, marca a la izquierda y selección a la derecha. En móvil, cabecera de 74px sin navegación textual. Existe enlace para saltar al contenido y foco visible en enlaces y botones.

### Cursor y escenario

Avión de 28px con inercia y estela de partículas, solo para ratón con puntero fino. Sobre controles gira y crece; en diálogos vuelve el cursor nativo. El escenario responde también a arrastre táctil conservando desplazamiento vertical. Un único requestAnimationFrame bajo demanda suaviza posición y giro; se detiene al ocultarse el documento.

`prefers-reduced-motion` y el control del pie desactivan animación, transiciones, cursor custom y tilt. La transición de filtros dura 240ms y la entrada de diálogo 260ms, con la curva `cubic-bezier(.23,1,.32,1)` donde corresponde.

### Checkout y boarding pass

Flujo visual: selección → formulario demo → tres fases de texto de un segundo → pase. La animación CSS de despegue dura 3.1s; el estado de procesamiento dura tres segundos más el tiempo local de QR. Durante procesamiento se oculta el cierre y se bloquea Escape. El pase coloca ruta NOW → DRM, nombre, metadatos y QR, y puede exportarse a PNG de 1100 × 650. El QR no incluye email ni dirección; la demo no cobra ni persiste datos personales. Mantener visible su naturaleza coleccionable y sin valor de viaje.

## Do's and Don'ts

### Do:

- **Do** conservar los activos originales de marca y distinguirlos del render conceptual.
- **Do** mantener la tipografía ambiental detrás de la silueta de la sudadera, sin letras sobre su cuerpo.
- **Do** preservar foco visible, navegación por teclado y preferencia de movimiento reducido.
- **Do** identificar precio, colores y checkout como demostración cuando corresponda.

### Don't:

- **Don't** convertir el render o los filtros de color en evidencia de un producto real.
- **Don't** añadir claims de materiales, disponibilidad, medidas o precio oficial sin confirmación.
- **Don't** sustituir las decisiones explícitas del brief por reglas estéticas genéricas.
- **Don't** convertir el pase coleccionable en una confirmación real de pago o viaje.
