import sofia from '../assets/personas/sofia.jpg'
import { ESTUDIANTE_INICIAL } from './estudiante.js'

/** Perfil de ejemplo del Figma (09a): se usa si la persona entró sin hacer el onboarding. */
export const PERFIL_DEMO = {
  ...ESTUDIANTE_INICIAL,
  nombre: 'Sofía Ramírez',
  foto: sofia,
  carrera: 'Ingeniería Industrial',
  anio: '2',
  ciudad: 'Santa Ana',
  sobreMi: 'Soy tranquila y ordenada. Estudio casi todo el día y los fines de semana me gusta cocinar.',
  intereses: ['musica', 'cocinar', 'viajes', 'fotografia'],
  convivencia: ['mujeres', 'no-fumadores', 'tranquilo', 'noche', 'fines'],
  servicios: ['cocina', 'lavanderia', 'wifi', 'cama', 'escritorio', 'parada'],
  tipos: ['familia', 'apartamento'],
  transporte: ['caminando', 'bus'],
  presupuesto: [100, 150],
  entrada: 'peatonal',
  mudanza: 'ciclo1',
  duracion: 'anio',
}

/** Perfil inicial: lo que llenó en el onboarding o, si no hizo el onboarding, el del Figma. */
export function perfilInicial(cuenta, estudiante) {
  const nombre = (cuenta?.name || '').trim()
  const hizoOnboarding = estudiante && (estudiante.carrera || estudiante.intereses.length || estudiante.sobreMi)
  if (!hizoOnboarding) return { ...PERFIL_DEMO, nombre: nombre || PERFIL_DEMO.nombre }
  return { ...estudiante, nombre: nombre || 'Tu nombre' }
}
