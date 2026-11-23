import cuartoFamilia from '../assets/quads/cuarto-familia.jpg'
import casaTranquila from '../assets/quads/casa-tranquila.jpg'
import cuartoBalcon from '../assets/quads/cuarto-balcon.jpg'
import habitacionAmplia from '../assets/quads/habitacion-amplia.jpg'
import banoPropio from '../assets/quads/cuarto-bano-propio.jpg'
import closetGrande from '../assets/quads/closet-grande.jpg'
import cuartoMerliot from '../assets/quads/cuarto-merliot.jpg'
import madreselva from '../assets/quads/cuarto-madreselva.jpg'
import fachada from '../assets/detalle/casa-martinez.jpg'
import andrea from '../assets/personas/andrea.jpg'
import sofia from '../assets/personas/sofia.jpg'
import rosa from '../assets/detalle/rosa.jpg'
import carlos from '../assets/detalle/carlos.jpg'

/**
 * Contenido de 01d, 01e y 01f · Bienvenida (Rediseño B).
 * Posiciones en px dentro de la ilustración de 390 × 400, tal como en Figma.
 */
const bienvenidas = [
  {
    title: 'Encuentra un quad cerca de tu universidad',
    text: 'Busca por campus, conoce el tiempo de traslado y compara opciones en un solo lugar.',
    cta: 'Siguiente',
    // Solo fotos de quads, nunca de personas
    fotos: [
      { src: cuartoFamilia, x: 96, y: 20, d: 84 },
      { src: casaTranquila, x: 210, y: 76, d: 58 },
      { src: cuartoBalcon, x: 302, y: 40, d: 58 },
      { src: habitacionAmplia, x: 26, y: 250, d: 60 },
      { src: banoPropio, x: 128, y: 262, d: 52 },
      { src: closetGrande, x: 280, y: 252, d: 74 },
    ],
    chips: [
      { icon: 'map-pin-fill', x: 18, y: 150 },
      { icon: 'wifi-fill', x: 334, y: 160 },
      { icon: 'bed-fill', x: 212, y: 300 },
    ],
    destellos: [
      { x: 40, y: 40, s: 22, tono: 'blanco' },
      { x: 236, y: 8, s: 34, tono: 'blanco' },
      { x: 258, y: 230, s: 14, tono: 'azul' },
      { x: 96, y: 220, s: 16, tono: 'azul' },
    ],
  },
  {
    title: 'Conoce a la familia antes de llegar',
    text: 'Mira quiénes viven ahí, sus reglas y lo que opinan otros estudiantes. Pregunta todo por chat.',
    cta: 'Siguiente',
    // Siempre fotos de personas, nunca iniciales
    tarjetas: [
      { id: 'anfitriona', titulo: 'Andrea Martínez', texto: 'Anfitriona · responde en 1 h', foto: andrea, barra: 'var(--brand-primary)', x: 28, y: 58, w: 330, rot: -1.5 },
      { id: 'reglas', titulo: 'Reglas de la casa', texto: 'Llegada antes de 10 p. m.', foto: carlos, barra: 'var(--yellow-100)', x: 50, y: 134, w: 300, rot: 1.2 },
      { id: 'wifi', titulo: 'Preguntar por el wifi', check: true, x: 108, y: 206, w: 210, rot: -1 },
    ],
    personas: [
      { src: rosa, x: 86, y: 286, d: 46 },
      { src: andrea, x: 160, y: 300, d: 76 },
      { src: carlos, x: 258, y: 292, d: 44 },
      { src: sofia, x: 36, y: 338, d: 38 },
    ],
    destellos: [
      { x: 48, y: 250, s: 18, tono: 'azul' },
      { x: 322, y: 240, s: 24, tono: 'amarillo' },
      { x: 140, y: 262, s: 12, tono: 'azul' },
      { x: 300, y: 300, s: 10, tono: 'azul' },
    ],
  },
  {
    title: 'Todo seguro, dentro de Quad',
    text: 'Identidades verificadas, contrato y pagos en la app. Si algo falla, te acompañamos.',
    cta: 'Empezar',
    // Tres columnas en bucle: personas y quads mezclados (4 cápsulas por columna)
    columnas: [
      { x: 40, y: 22, dir: 'abajo', dur: 24, fotos: [{ src: andrea, h: 176 }, { src: habitacionAmplia, h: 150 }, { src: sofia, h: 168 }, { src: cuartoFamilia, h: 140 }] },
      { x: 145, y: 6, dir: 'arriba', dur: 21, fotos: [{ src: rosa, h: 120 }, { src: fachada, h: 210 }, { src: closetGrande, h: 150 }, { src: carlos, h: 180 }] },
      { x: 250, y: 36, dir: 'abajo', dur: 27, fotos: [{ src: cuartoMerliot, h: 160 }, { src: carlos, h: 150 }, { src: madreselva, h: 140 }, { src: rosa, h: 170 }] },
    ],
    chips: [
      { icon: 'shield-check-fill', x: 72, y: 186 },
      { icon: 'hero-lock-closed-solid', x: 177, y: 114 },
      { icon: 'dollar-circle-fill', x: 282, y: 186 },
    ],
    destellos: [
      { x: 12, y: 80, s: 20, tono: 'azul' },
      { x: 356, y: 200, s: 26, tono: 'amarillo' },
      { x: 240, y: 4, s: 14, tono: 'azul' },
      { x: 138, y: 340, s: 12, tono: 'azul' },
    ],
  },
]

export default bienvenidas
