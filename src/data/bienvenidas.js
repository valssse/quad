import { foto } from './fotos.js'

const b = (n) => foto(`bienvenida/${n}`)

/**
 * Contenido de 01d, 01e y 01f · Bienvenida (Rediseño B).
 * Posiciones en px dentro de la ilustración de 390 × 400, tal como en Figma.
 * Todas las fotos son de la sesión de las casas y no se repiten en el resto de la app.
 * Las personas se muestran con iniciales (solo hay fotos de los anfitriones, que viven en sus perfiles).
 */
const bienvenidas = [
  {
    title: 'Encuentra un quad cerca de tu universidad',
    text: 'Busca por campus, conoce el tiempo de traslado y compara opciones en un solo lugar.',
    cta: 'Siguiente',
    // Solo fotos de las casas, nunca de personas
    fotos: [
      { src: b('b01'), x: 96, y: 20, d: 84 },
      { src: b('b02'), x: 210, y: 76, d: 58 },
      { src: b('b03'), x: 302, y: 40, d: 58 },
      { src: b('b04'), x: 26, y: 250, d: 60 },
      { src: b('b05'), x: 128, y: 262, d: 52 },
      { src: b('b06'), x: 280, y: 252, d: 74 },
    ],
    chips: [
      { icon: 'map-pin-fill', x: 18, y: 150 },
      { icon: 'wifi-fill', x: 334, y: 160 },
      { icon: 'bed-fill', x: 212, y: 300 },
    ],
  },
  {
    title: 'Conoce a la familia antes de llegar',
    text: 'Mira quiénes viven ahí, sus reglas y lo que opinan otros estudiantes. Pregunta todo por chat.',
    cta: 'Siguiente',
    tarjetas: [
      { id: 'anfitriona', titulo: 'Andrea Martínez', texto: 'Anfitriona · responde en 1 h', nombre: 'Andrea Martínez', tono: '#dce6ff', barra: 'var(--brand-primary)', x: 28, y: 58, w: 330, rot: -1.5 },
      { id: 'reglas', titulo: 'Reglas de la casa', texto: 'Llegada antes de 10 p. m.', foto: b('b07'), barra: 'var(--yellow-100)', x: 50, y: 134, w: 300, rot: 1.2 },
      { id: 'wifi', titulo: 'Preguntar por el wifi', check: true, x: 108, y: 206, w: 210, rot: -1 },
    ],
    personas: [
      { nombre: 'Rosa Martínez', tono: '#fce7f3', color: '#be185d', x: 86, y: 286, d: 46 },
      { nombre: 'Andrea Martínez', tono: '#dce6ff', color: '#2667ff', x: 160, y: 300, d: 76 },
      { nombre: 'Carlos Martínez', tono: '#dcfce7', color: '#15803d', x: 258, y: 292, d: 44 },
      { nombre: 'Sofía Ramírez', tono: '#fdebd3', color: '#b45309', x: 36, y: 338, d: 38 },
    ],
  },
  {
    title: 'Todo seguro, dentro de Quad',
    text: 'Identidades verificadas, contrato y pagos en la app. Si algo falla, te acompañamos.',
    cta: 'Empezar',
    // Tres columnas en bucle con 17 fotos distintas: ninguna se repite dentro del ciclo
    columnas: [
      { x: 27, y: 22, dir: 'abajo', dur: 30, fotos: [{ src: b('b08'), h: 176 }, { src: b('b09'), h: 150 }, { src: b('b10'), h: 160 }, { src: b('b11'), h: 140 }, { src: b('b12'), h: 168 }] },
      { x: 145, y: 6, dir: 'arriba', dur: 28, fotos: [{ src: b('b13'), h: 120 }, { src: b('b15'), h: 210 }, { src: b('b14'), h: 150 }, { src: b('b16'), h: 180 }, { src: b('b17'), h: 140 }, { src: b('b18'), h: 160 }] },
      { x: 263, y: 36, dir: 'abajo', dur: 32, fotos: [{ src: b('b19'), h: 160 }, { src: b('b20'), h: 168 }, { src: b('b21'), h: 140 }, { src: b('b22'), h: 150 }, { src: b('b23'), h: 130 }, { src: b('b24'), h: 170 }] },
    ],
  },
]

export default bienvenidas
