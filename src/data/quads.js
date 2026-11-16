/**
 * Datos del Home del estudiante (sección "Home" en Figma):
 * quads, secciones de Explorar, zonas del buscador, conversaciones y pines del mapa.
 */
import cuartoFamilia from '../assets/quads/cuarto-familia.jpg'
import habitacionAmplia from '../assets/quads/habitacion-amplia.jpg'
import banoPropio from '../assets/quads/cuarto-bano-propio.jpg'
import hogarEspacioso from '../assets/quads/hogar-espacioso.jpg'
import cuartoBalcon from '../assets/quads/cuarto-balcon.jpg'
import casaTranquila from '../assets/quads/casa-tranquila.jpg'
import cuartoMadreselva from '../assets/quads/cuarto-madreselva.jpg'
import cuartoMerliot from '../assets/quads/cuarto-merliot.jpg'
import closetGrande from '../assets/quads/closet-grande.jpg'
import andrea from '../assets/personas/andrea.jpg'
import { DETALLES } from './detalle.js'

/* ---------- Quads ---------- */
// trayecto.modo: walking | bus | car  →  ícono walking-fill / bus-fill / car-fill
export const QUADS = [
  { id: 'familia', titulo: 'Cuarto en casa de familia', zona: 'Jardines de Guadalupe', zonaId: 'antiguo-cuscatlan', trayecto: { modo: 'walking', texto: '4 min caminando a la Peatonal', min: 4 }, precio: 115, rating: 4.8, foto: cuartoFamilia, disponible: true, cocina: true, soloMujeres: false },
  { id: 'amplia', titulo: 'Habitación amplia y luminosa', zona: 'Antiguo Cuscatlán', zonaId: 'antiguo-cuscatlan', trayecto: { modo: 'walking', texto: '9 min caminando a la Peatonal', min: 9 }, precio: 125, rating: 4.9, foto: habitacionAmplia, disponible: true, cocina: true, soloMujeres: false },
  { id: 'bano-propio', titulo: 'Cuarto con baño propio', zona: 'Urb. Madreselva', zonaId: 'antiguo-cuscatlan', trayecto: { modo: 'walking', texto: '6 min caminando a la Peatonal', min: 6 }, precio: 140, rating: 4.6, foto: banoPropio, disponible: true, cocina: false, soloMujeres: false },
  { id: 'hogar', titulo: 'Hogar espacioso', zona: 'Col. La Sultana', zonaId: 'la-sultana', trayecto: { modo: 'walking', texto: '7 min caminando a La Sultana', min: 7 }, precio: 120, rating: 4.9, foto: hogarEspacioso, disponible: true, cocina: true, soloMujeres: true },
  { id: 'balcon', titulo: 'Cuarto con balcón', zona: 'Santa Elena', zonaId: 'santa-elena', trayecto: { modo: 'bus', texto: '12 min en bus a Los Próceres', min: 12 }, precio: 135, rating: 4.5, foto: cuartoBalcon, disponible: false, cocina: false, soloMujeres: true },
  { id: 'tranquila', titulo: 'Habitación en casa tranquila', zona: 'Jardines de Guadalupe', zonaId: 'jardines-de-guadalupe', trayecto: { modo: 'walking', texto: '5 min caminando a la Peatonal', min: 5 }, precio: 105, rating: 4.7, foto: casaTranquila, disponible: true, cocina: true, soloMujeres: true },
  { id: 'madreselva', titulo: 'Cuarto en casa de familia', zona: 'Urb. Madreselva', zonaId: 'antiguo-cuscatlan', trayecto: { modo: 'walking', texto: '8 min caminando a La Sultana', min: 8 }, precio: 110, rating: 4.6, foto: cuartoMadreselva, disponible: true, cocina: true, lavanderia: true, soloMujeres: false },
  { id: 'merliot', titulo: 'Cuarto cerca de Plaza Merliot', zona: 'Ciudad Merliot', zonaId: 'ciudad-merliot', trayecto: { modo: 'bus', texto: '18 min en bus a La Sultana', min: 18 }, precio: 100, rating: 4.4, foto: cuartoMerliot, disponible: true, cocina: true, lavanderia: true, soloMujeres: false },
  { id: 'closet', titulo: 'Habitación con clóset grande', zona: 'Col. Escalón', zonaId: 'escalon', trayecto: { modo: 'car', texto: '22 min en carro a Los Próceres', min: 22 }, precio: 130, rating: 4.8, foto: closetGrande, disponible: true, cocina: true, lavanderia: true, soloMujeres: false },
]

export const quad = (id) => QUADS.find((q) => q.id === id)
export const ICONO_TRAYECTO = { walking: 'walking-fill', bus: 'bus-fill', car: 'car-fill' }

/* ---------- 02 · Explorar ---------- */
export const SECCIONES = [
  { id: 'cerca', titulo: 'Más cerca del portón peatonal', sub: 'A menos de 10 min caminando', quads: ['familia', 'amplia', 'bano-propio'] },
  { id: 'mujeres', titulo: 'Solo para mujeres', sub: 'Casas que solo reciben mujeres', quads: ['hogar', 'balcon', 'tranquila'] },
  { id: 'cocina', titulo: 'Con cocina y lavandería', sub: 'Servicios incluidos en el precio', quads: ['madreselva', 'merliot', 'closet'] },
]

export const FILTROS_RAPIDOS = [
  { id: 'todos', label: 'Todos' },
  { id: 'precio', label: 'Menor precio', icon: 'dollar-circle' },
  { id: 'cocina', label: 'Con cocina', icon: 'cutlery' },
  { id: 'mujeres', label: 'Solo mujeres', icon: 'female' },
  { id: 'visitas', label: 'Visitas permitidas', icon: 'user-plus' },
  { id: 'lavanderia', label: 'Lavandería', icon: 'washing-machine' },
]

/** Aplica un filtro rápido a una lista de quads. */
export function filtrar(lista, filtro) {
  switch (filtro) {
    case 'precio':
      return [...lista].sort((a, b) => a.precio - b.precio)
    case 'cocina':
      return lista.filter((q) => q.cocina)
    case 'mujeres':
      return lista.filter((q) => q.soloMujeres)
    case 'lavanderia':
      return lista.filter((q) => q.lavanderia)
    case 'visitas':
      return lista.filter((q) => DETALLES[q.id]?.filtros.visitas)
    case 'cerca':
      return [...lista].sort((a, b) => a.trayecto.min - b.trayecto.min)
    case 'disponibles':
      return lista.filter((q) => q.disponible)
    default:
      return lista
  }
}

/* ---------- 07 · Guardados ---------- */
export const GUARDADOS_INICIAL = ['familia', 'amplia', 'hogar', 'balcon', 'tranquila']
export const FILTROS_GUARDADOS = [
  { id: 'todos', label: 'Todos' },
  { id: 'disponibles', label: 'Disponibles' },
  { id: 'cerca', label: 'Más cerca' },
  { id: 'precio', label: 'Menor precio' },
]

/* ---------- 10 · Búsqueda ---------- */
export const ZONAS = [
  { id: 'antiguo-cuscatlan', nombre: 'Antiguo Cuscatlán', detalle: 'La Libertad', total: 18 },
  { id: 'antiguo-cuscatlan-centro', nombre: 'Antiguo Cuscatlán Centro', detalle: 'Colonia', total: 6, padre: 'antiguo-cuscatlan' },
  { id: 'jardines-de-guadalupe', nombre: 'Jardines de Guadalupe', detalle: 'Colonia', total: 9 },
  { id: 'la-sultana', nombre: 'Col. La Sultana', detalle: 'Colonia', total: 7 },
  { id: 'santa-elena', nombre: 'Santa Elena', detalle: 'Antiguo Cuscatlán', total: 5 },
  { id: 'ciudad-merliot', nombre: 'Ciudad Merliot', detalle: 'Santa Tecla', total: 11 },
  { id: 'escalon', nombre: 'Col. Escalón', detalle: 'San Salvador', total: 8 },
]

/** Quads de una zona (o de una sección de Explorar con "Ver todo"). */
export function quadsDe(id) {
  const seccion = SECCIONES.find((s) => s.id === id)
  if (seccion) return { titulo: seccion.titulo, sub: `${seccion.quads.length} resultados · ${seccion.sub.toLowerCase()}`, lista: seccion.quads.map(quad) }
  const zona = ZONAS.find((z) => z.id === id) || ZONAS[0]
  const raiz = zona.padre || zona.id
  const lista = raiz === 'antiguo-cuscatlan' ? ['amplia', 'familia', 'bano-propio', 'madreselva'].map(quad) : QUADS.filter((q) => q.zonaId === raiz)
  return { titulo: `Quads en ${zona.nombre}`, sub: `${zona.total} resultados · por distancia a la Peatonal`, lista, zona }
}

/* ---------- 08 · Mensajes ---------- */
export const CONVERSACIONES = [
  { id: 'andrea', nombre: 'Andrea Martínez', foto: andrea, quadId: 'familia', quad: 'Cuarto privado en casa de familia', mensaje: 'Visita propuesta: sáb 7 de nov, 10:00 a. m.', hora: '9:21 a. m.', noLeidos: 1, tipo: 'visita' },
  { id: 'carlos', nombre: 'Carlos Rivas', foto: DETALLES['bano-propio'].anfitrion.foto, quadId: 'bano-propio', quad: 'Cuarto con baño propio', mensaje: '¿Te gustaría agendar una visita esta semana?', hora: '8:05 a. m.', noLeidos: 2, tipo: 'visita' },
  { id: 'rosa', nombre: 'Rosa López', foto: DETALLES.amplia.anfitrion.foto, quadId: 'amplia', quad: 'Habitación amplia y luminosa', mensaje: 'Sí, la cocina se puede usar hasta las 9 p. m.', hora: 'Ayer', noLeidos: 0, tipo: 'solicitud' },
  { id: 'roberto', nombre: 'Roberto López', quad: 'Estudio luminoso', mensaje: 'Tú: ¡Qué interesante! Hablemos más.', hora: 'Jue', noLeidos: 0, tipo: 'solicitud' },
  { id: 'ana', nombre: 'Ana Martínez', quad: 'Casa acogedora', mensaje: 'Tú: ¡Perfecto! Espero tu respuesta.', hora: 'Mié', noLeidos: 0, tipo: 'visita' },
  { id: 'quad', nombre: 'Equipo Quad', iniciales: 'Q', marca: true, quad: 'Soporte', mensaje: 'Tu correo UCA quedó verificado. ¡Bienvenida a Quad!', hora: '28 oct', noLeidos: 0, tipo: 'soporte' },
]

export const FILTROS_MENSAJES = [
  { id: 'todos', label: 'Todos' },
  { id: 'no-leidos', label: 'No leídos' },
  { id: 'visitas', label: 'Visitas' },
  { id: 'solicitudes', label: 'Solicitudes' },
]

/* ---------- 11 · Mapa ---------- */
// Posición del centro de cada pin en el marco de Figma (390 × 844).
export const PINES = [
  { quad: 'madreselva', x: 61, y: 196 },
  { quad: 'tranquila', x: 308.5, y: 204 },
  { quad: 'familia', x: 195.5, y: 448 },
  { quad: 'bano-propio', x: 327, y: 456 },
  { quad: 'amplia', x: 62, y: 576 },
  { quad: 'closet', x: 326.5, y: 601 },
]
export const MI_UBICACION = { x: 250, y: 520 }

export const FILTROS_MAPA = [
  { id: 'todos', label: 'Todos' },
  { id: 'precio', label: 'Menor precio' },
  { id: 'cocina', label: 'Con cocina' },
  { id: 'mujeres', label: 'Solo mujeres' },
]

/** "Buenos días / tardes / noches" según la hora del teléfono. */
export function saludo(fecha = new Date()) {
  const h = fecha.getHours()
  return h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches'
}
