/** "Andrea Martínez" → "AM". */
const iniciales = (nombre = '') =>
  nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()

/** Avatar con iniciales para las personas que no tienen foto. Ocupa todo su contenedor. */
export default function Iniciales({ nombre, tono, className = '', style }) {
  return (
    <span className={`ini-avatar ${className}`} style={{ ...(tono ? { background: tono } : {}), ...style }} aria-hidden="true">
      {iniciales(nombre)}
    </span>
  )
}
