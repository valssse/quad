import { motion } from 'motion/react'

/** Switch 44 × 26 (Estado = Activo / Inactivo). */
export default function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className="switch"
      onClick={() => onChange(!checked)}
    >
      <motion.span
        className="switch__knob"
        animate={{ x: checked ? 18 : 0 }}
        transition={{ type: 'spring', stiffness: 520, damping: 34 }}
      />
    </button>
  )
}
