/**
 * Pantalla de Filtros (botón junto al buscador en Explorar, Búsqueda y Mapa).
 * No existe en el Figma: sigue el mismo sistema visual (chips, tarjetas de servicio, switches).
 */
import { QUADS } from './quads.js'
import { DETALLES } from './detalle.js'

export const PRECIO_MIN = 90
export const PRECIO_MAX = 180

export const FILTROS_VACIOS = {
  precio: [PRECIO_MIN, PRECIO_MAX],
  transporte: [], // walking | bus | car
  tiempo: 'cualquiera', // 10 | 20 | cualquiera
  servicios: [], // cocina | lavanderia | banoPropio | wifi
  soloMujeres: false,
  visitas: false,
  sinMascotas: false,
  disponibles: false,
  rating: 0,
  zonas: [],
}

export const TRANSPORTES = [
  { id: 'walking', label: 'A pie', icon: 'walking-fill' },
  { id: 'bus', label: 'En bus', icon: 'bus-fill' },
  { id: 'car', label: 'En carro', icon: 'car-fill' },
]

export const TIEMPOS = [
  { id: 10, label: 'Hasta 10 min' },
  { id: 20, label: 'Hasta 20 min' },
  { id: 'cualquiera', label: 'Cualquiera' },
]

export const SERVICIOS = [
  { id: 'cocina', label: 'Uso de cocina', sub: 'Con o sin horario', icon: 'cutlery-fill' },
  { id: 'lavanderia', label: 'Lavandería', sub: 'En casa o incluida', icon: 'washing-fill' },
  { id: 'banoPropio', label: 'Baño propio', sub: 'Solo para ti', icon: 'bathroom' },
  { id: 'wifi', label: 'Wi-Fi', sub: 'Incluido', icon: 'wifi-fill' },
]

export const CALIFICACIONES = [
  { id: 0, label: 'Cualquiera' },
  { id: 4.5, label: '4.5 o más' },
  { id: 4.8, label: '4.8 o más' },
]

export const ZONAS_FILTRO = [
  { id: 'antiguo-cuscatlan', label: 'Antiguo Cuscatlán' },
  { id: 'jardines-de-guadalupe', label: 'Jardines de Guadalupe' },
  { id: 'la-sultana', label: 'La Sultana' },
  { id: 'santa-elena', label: 'Santa Elena' },
  { id: 'ciudad-merliot', label: 'Ciudad Merliot' },
  { id: 'escalon', label: 'Escalón' },
]

/** Datos de un quad para filtrar (tarjeta + casa). */
const rasgos = (q) => {
  const f = DETALLES[q.id]?.filtros || {}
  return { ...f, cocina: q.cocina, lavanderia: !!q.lavanderia || DETALLES[q.id]?.incluye.some((i) => i.icon === 'washing-fill' && !/cercana/i.test(i.detalle)) }
}

/** Aplica los filtros avanzados. */
export function aplicarFiltros(lista, f) {
  return lista.filter((q) => {
    const r = rasgos(q)
    if (q.precio < f.precio[0] || q.precio > f.precio[1]) return false
    if (f.transporte.length && !f.transporte.includes(q.trayecto.modo)) return false
    if (f.tiempo !== 'cualquiera' && q.trayecto.min > f.tiempo) return false
    if (f.servicios.some((s) => !r[s])) return false
    if (f.soloMujeres && !q.soloMujeres) return false
    if (f.visitas && !r.visitas) return false
    if (f.sinMascotas && r.mascotas) return false
    if (f.disponibles && !q.disponible) return false
    if (q.rating < f.rating) return false
    if (f.zonas.length && !f.zonas.includes(q.zonaId) && !(f.zonas.includes('antiguo-cuscatlan') && q.zonaId === 'antiguo-cuscatlan')) return false
    return true
  })
}

/** Cuántos filtros están activos (para el puntito del botón). */
export function contarFiltros(f) {
  let n = 0
  if (f.precio[0] !== PRECIO_MIN || f.precio[1] !== PRECIO_MAX) n++
  if (f.transporte.length) n++
  if (f.tiempo !== 'cualquiera') n++
  n += f.servicios.length
  if (f.soloMujeres) n++
  if (f.visitas) n++
  if (f.sinMascotas) n++
  if (f.disponibles) n++
  if (f.rating) n++
  if (f.zonas.length) n++
  return n
}

export const filtrados = (f) => aplicarFiltros(QUADS, f)
