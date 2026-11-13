import { useRef } from 'react'
import { motion } from 'motion/react'

/**
 * Deslizador de rango con dos manijas (presupuesto mínimo y máximo).
 * Funciona con el dedo, el mouse y las flechas del teclado.
 */
export default function RangeSlider({ min, max, step, value, onChange }) {
  const pista = useRef(null)
  const activa = useRef(0)
  const [a, b] = value
  const pct = (v) => ((v - min) / (max - min)) * 100

  const valorEn = (clientX) => {
    const r = pista.current.getBoundingClientRect()
    const p = Math.min(1, Math.max(0, (clientX - r.left) / r.width))
    return Math.round((min + p * (max - min)) / step) * step
  }

  const mover = (indice, v) => {
    if (indice === 0) onChange([Math.min(v, b - step), b])
    else onChange([a, Math.max(v, a + step)])
  }

  const down = (e) => {
    const v = valorEn(e.clientX)
    activa.current = Math.abs(v - a) <= Math.abs(v - b) ? 0 : 1
    pista.current.setPointerCapture(e.pointerId)
    mover(activa.current, v)
  }

  const move = (e) => {
    if (pista.current.hasPointerCapture(e.pointerId)) mover(activa.current, valorEn(e.clientX))
  }

  const teclado = (indice) => (e) => {
    const delta = { ArrowRight: step, ArrowUp: step, ArrowLeft: -step, ArrowDown: -step }[e.key]
    if (!delta) return
    e.preventDefault()
    mover(indice, Math.min(max, Math.max(min, value[indice] + delta)))
  }

  const spring = { type: 'spring', stiffness: 500, damping: 40 }

  return (
    <div className="range" ref={pista} onPointerDown={down} onPointerMove={move}>
      <span className="range__track" />
      <motion.span className="range__fill" animate={{ left: `${pct(a)}%`, right: `${100 - pct(b)}%` }} transition={spring} />
      {[a, b].map((v, i) => (
        <motion.span
          key={i}
          className="range__thumb"
          role="slider"
          tabIndex={0}
          aria-label={i === 0 ? 'Presupuesto mínimo' : 'Presupuesto máximo'}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={v}
          onKeyDown={teclado(i)}
          animate={{ left: `${pct(v)}%` }}
          whileTap={{ scale: 1.15 }}
          transition={spring}
        />
      ))}
    </div>
  )
}
