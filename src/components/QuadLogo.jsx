import { motion } from 'motion/react'

/** Origen de transformación al centro de cada forma del SVG. */
const origin = { transformBox: 'fill-box', transformOrigin: 'center' }

/** Curva suave para revelados (entra rápido, asienta lento). */
const easeOut = [0.16, 1, 0.3, 1]

/**
 * Isologo de Quad (SVG exportado de Figma) con animación de armado:
 *   1. aparece el cuadrado de marca,
 *   2. se revela el marco en L desde su esquina,
 *   3. el cuadro pequeño se desliza y encaja en su lugar.
 *
 * tone: "white" (cuadrado blanco, marca azul) | "blue" (cuadrado azul, marca blanca)
 * delay: segundos antes de empezar.
 */
export default function QuadLogo({ size = 88, tone = 'white', delay = 0 }) {
  const base = tone === 'white' ? '#FFFFFF' : '#2667FF'
  const mark = tone === 'white' ? '#2667FF' : '#FFFFFF'

  return (
    <svg width={size} height={size} viewBox="0 0 88 88" fill="none" aria-hidden="true" style={{ overflow: 'visible' }}>
      {/* 1 · Cuadrado de marca */}
      <motion.path
        d="M67.2421 0H20.7579C9.29362 0 0 9.29362 0 20.7579V67.2421C0 78.7064 9.29362 88 20.7579 88H67.2421C78.7064 88 88 78.7064 88 67.2421V20.7579C88 9.29362 78.7064 0 67.2421 0Z"
        fill={base}
        style={origin}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          scale: { type: 'spring', stiffness: 180, damping: 18, delay },
          opacity: { duration: 0.3, delay },
        }}
      />

      {/* 2 · Marco en L: se revela desde la esquina superior izquierda */}
      <motion.path
        d="M60.0922 21.7344V42.5691H49.3635V32.4612H32.4573V49.3597H42.5652V60.0961H21.7305V21.7344H60.0922Z"
        fill={mark}
        initial={{ clipPath: 'inset(0% 100% 100% 0%)' }}
        animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        transition={{ duration: 0.55, ease: easeOut, delay: delay + 0.32 }}
      />

      {/* 3 · Cuadro pequeño: se desliza en diagonal y encaja */}
      <motion.path
        d="M66.2696 49.3596H49.3634V66.2658H66.2696V49.3596Z"
        fill={mark}
        style={origin}
        initial={{ x: -10, y: -10, scale: 0.5, opacity: 0 }}
        animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24, delay: delay + 0.62 }}
      />
    </svg>
  )
}
