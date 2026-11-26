/**
 * Datos del Home del estudiante (sección "Home" en Figma):
 * quads, secciones de Explorar, zonas del buscador, conversaciones y pines del mapa.
 */
import { foto } from './fotos.js'
import { DETALLES } from './detalle.js'

/* ---------- Quads ---------- */
// trayecto.modo: walking | bus | car  →  ícono walking-fill / bus-fill / car-fill
export const QUADS = [
  { id: 'familia', pos: [13.6768, -89.2385], titulo: 'Cuarto con TV en casa de familia', zona: 'Jardines de Guadalupe', zonaId: 'jardines-de-guadalupe', trayecto: { modo: 'walking', texto: '4 min caminando a la Peatonal', min: 4 }, precio: 115, rating: 4.8, foto: foto('casa-martinez/cuarto-tv'), disponible: true, cocina: true, soloMujeres: false },
  { id: 'amplia', pos: [13.6771, -89.2381], titulo: 'Cuarto con escritorio y ventana', zona: 'Jardines de Guadalupe', zonaId: 'jardines-de-guadalupe', trayecto: { modo: 'walking', texto: '4 min caminando a la Peatonal', min: 4 }, precio: 110, rating: 4.9, foto: foto('casa-martinez/cuarto-escritorio'), disponible: true, cocina: true, soloMujeres: false },
  { id: 'bano-propio', pos: [13.6783, -89.2419], titulo: 'Cuarto con ventana al jardín', zona: 'Col. La Sultana', zonaId: 'la-sultana', trayecto: { modo: 'walking', texto: '6 min caminando a la Peatonal', min: 6 }, precio: 120, rating: 4.6, foto: foto('casa-adrian/cuarto'), disponible: true, cocina: true, lavanderia: true, soloMujeres: false },
  { id: 'hogar', pos: [13.6790, -89.2433], titulo: 'Pupilaje con terraza', zona: 'Antiguo Cuscatlán', zonaId: 'antiguo-cuscatlan', trayecto: { modo: 'walking', texto: '7 min caminando a La Sultana', min: 7 }, precio: 125, rating: 4.9, foto: foto('casa-aguilar/cuarto'), disponible: true, cocina: true, lavanderia: true, soloMujeres: true },
  { id: 'tranquila', pos: [13.6756, -89.2370], titulo: 'Cuarto con cama matrimonial', zona: 'Jardines de Guadalupe', zonaId: 'jardines-de-guadalupe', trayecto: { modo: 'walking', texto: '5 min caminando a la Peatonal', min: 5 }, precio: 105, rating: 4.7, foto: foto('casa-hernandez/cuarto'), disponible: true, cocina: true, soloMujeres: true },
  { id: 'madreselva', pos: [13.6732, -89.2554], titulo: 'Suite con baño privado y jardín', zona: 'Santa Elena', zonaId: 'santa-elena', trayecto: { modo: 'bus', texto: '12 min en bus a Los Próceres', min: 12 }, precio: 150, rating: 4.9, foto: foto('casa-portillo/cuarto'), disponible: true, cocina: false, soloMujeres: false },
  { id: 'closet', pos: [13.6805, -89.2735], titulo: 'Cuarto amueblado con escritorio', zona: 'Ciudad Merliot', zonaId: 'ciudad-merliot', trayecto: { modo: 'bus', texto: '18 min en bus a La Sultana', min: 18 }, precio: 110, rating: 4.7, foto: foto('casa-tony/cuarto'), disponible: true, cocina: true, lavanderia: true, soloMujeres: false },
]

export const quad = (id) => QUADS.find((q) => q.id === id)
export const ICONO_TRAYECTO = { walking: 'walking-fill', bus: 'bus-fill', car: 'car-fill' }

/* ---------- 02 · Explorar ---------- */
export const SECCIONES = [
  { id: 'cerca', titulo: 'Más cerca del portón peatonal', sub: 'A menos de 10 min caminando', quads: ['familia', 'amplia', 'bano-propio'] },
  { id: 'mujeres', titulo: 'Solo para mujeres', sub: 'Casas que solo reciben mujeres', quads: ['hogar', 'tranquila'] },
  { id: 'cocina', titulo: 'Casas con jardín', sub: 'Para estudiar al aire libre', quads: ['madreselva', 'closet'] },
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
export const GUARDADOS_INICIAL = ['familia', 'amplia', 'hogar', 'tranquila']
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
]

/** Quads de una zona (o de una sección de Explorar con "Ver todo"). */
export function quadsDe(id) {
  const seccion = SECCIONES.find((s) => s.id === id)
  if (seccion) return { titulo: seccion.titulo, sub: `${seccion.quads.length} resultados · ${seccion.sub.toLowerCase()}`, lista: seccion.quads.map(quad) }
  const zona = ZONAS.find((z) => z.id === id) || ZONAS[0]
  const raiz = zona.padre || zona.id
  const lista = raiz === 'antiguo-cuscatlan' ? ['familia', 'amplia', 'bano-propio', 'hogar', 'tranquila'].map(quad) : QUADS.filter((q) => q.zonaId === raiz)
  return { titulo: `Quads en ${zona.nombre}`, sub: `${zona.total} resultados · por distancia a la Peatonal`, lista, zona }
}

/* ---------- 08 · Mensajes ---------- */
export const CONVERSACIONES = [
  { id: 'andrea', nombre: 'Andrea Martínez', quadId: 'familia', quad: 'Cuarto con TV en casa de familia', mensaje: 'Visita propuesta: sáb 7 de nov, 10:00 a. m.', hora: '9:21 a. m.', noLeidos: 1, tipo: 'visita' },
  { id: 'adrian', nombre: 'Adrián Rivas', foto: DETALLES['bano-propio'].anfitrion.foto, quadId: 'bano-propio', quad: 'Cuarto con ventana al jardín', mensaje: '¿Te gustaría agendar una visita esta semana?', hora: '8:05 a. m.', noLeidos: 2, tipo: 'visita' },
  { id: 'rosa', nombre: 'Rosa Martínez', quadId: 'amplia', quad: 'Cuarto con escritorio y ventana', mensaje: 'Sí, la cocina se puede usar hasta las 9 p. m.', hora: 'Ayer', noLeidos: 0, tipo: 'solicitud' },
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
// Las coordenadas reales de cada quad están en `pos` (ver data/geo.js)

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
