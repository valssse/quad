import { AnimatePresence, motion } from 'motion/react'

/**
 * Barra de progreso del onboarding (6px) + contador "n/total".
 * Vive fuera de las pantallas, así que el avance se anima de un paso al siguiente.
 */
export default function ProgressBar({ step, total }) {
  const pct = (step / total) * 100
  return (
    <>
      <div
        className="progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={step}
        aria-label={`Paso ${step} de ${total}`}
      >
        <motion.div
          className="progress__fill"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 90, damping: 20, mass: 0.9 }}
        />
      </div>
      <span className="progress__count" aria-hidden="true">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={step}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
          >
            {step}/{total}
          </motion.span>
        </AnimatePresence>
      </span>
    </>
  )
}
