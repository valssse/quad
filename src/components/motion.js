/**
 * Presets de animación compartidos.
 * Regla: movimientos cortos (≤ 12px), suaves y rápidos (≤ 0.45s).
 */

export const ease = [0.22, 1, 0.36, 1]

/** Transición entre pantallas: deslizamiento corto según la dirección. */
export const screenVariants = {
  enter: (dir) => ({ opacity: 0, x: dir >= 0 ? 24 : -24 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.38, ease } },
  exit: (dir) => ({ opacity: 0, x: dir >= 0 ? -24 : 24, transition: { duration: 0.22, ease } }),
}

/** Contenedor que escalona la entrada de sus hijos. */
export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } },
}

/** Cada bloque sube 8px mientras aparece. */
export const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.42, ease } },
}

/** Respuesta táctil de botones. */
export const press = {
  whileTap: { scale: 0.98 },
  transition: { type: 'spring', stiffness: 500, damping: 30 },
}
