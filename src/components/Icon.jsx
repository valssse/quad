import icons from '../assets/icons/icons.js'

/**
 * Ícono de la librería de Quad (Iconoir, Heroicons y los de relleno del archivo de Figma).
 * El color sale de `color` en CSS (currentColor).
 */
const attrs = {
  stroke: { fill: 'none', strokeWidth: 1.5 },
  'hero-outline': { fill: 'none', strokeWidth: 1.5, stroke: 'currentColor' },
  fill: { fill: 'currentColor' },
  raw: { fill: 'none' },
}

export default function Icon({ name, size = 24, className = '', style }) {
  const icon = icons[name]
  if (!icon) return null
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={style}
      {...attrs[icon.type]}
      dangerouslySetInnerHTML={{ __html: icon.body }}
    />
  )
}
