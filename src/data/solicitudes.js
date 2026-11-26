/**
 * Solicitudes activas y notificaciones del estudiante (en memoria).
 * Solicitud: { quadId, enviadaEn (ms), estado: 'revision' | 'mas-info' | 'aceptada' | 'rechazada' }
 */

/** Texto y estilo de cada estado de una solicitud. */
export const ESTADOS_SOLICITUD = {
  revision: { texto: 'En revisión', corto: 'En revisión', icon: 'clock-fill', tono: 'ambar' },
  'mas-info': { texto: 'Quiere saber más de ti', corto: 'Quiere saber más', icon: 'chat-bubble-fill', tono: 'azul' },
  aceptada: { texto: 'Aceptada · falta el contrato', corto: 'Aceptada', icon: 'check-circle-fill', tono: 'verde' },
  rechazada: { texto: 'No aceptada', corto: 'No aceptada', icon: 'info-circle-fill', tono: 'gris' },
}

/** "hace un momento", "hace 5 min", "hace 2 h", "hace 3 d". */
export function haceCuanto(ts, ahora = Date.now()) {
  const min = Math.max(0, Math.floor((ahora - ts) / 60000))
  if (min < 1) return 'hace un momento'
  if (min < 60) return `hace ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `hace ${h} h`
  return `hace ${Math.floor(h / 24)} d`
}

/** Notificaciones de ejemplo al entrar (las nuevas se agregan al inicio). */
export const NOTIS_INICIAL = [
  { id: 'n-andrea', fotoDe: 'familia', texto: 'Andrea te propuso una visita: sáb 7 de nov, 10:00 a. m.', hace: '9:21 a. m.', leida: false, destino: ['chat', 'familia'] },
  { id: 'n-adrian', fotoDe: 'bano-propio', texto: 'Adrián te preguntó si quieres agendar una visita esta semana.', hace: '8:05 a. m.', leida: false, destino: ['chat', 'bano-propio'] },
  { id: 'n-perfil', icon: 'user', texto: 'Completa tu perfil para que las familias te conozcan mejor.', hace: 'Ayer', leida: true, destino: ['mi-perfil'] },
  { id: 'n-verificado', icon: 'shield-check-fill', texto: 'Tu correo UCA quedó verificado. ¡Bienvenida a Quad!', hace: '28 oct', leida: true, destino: null },
]
