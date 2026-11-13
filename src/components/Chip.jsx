import { AnimatePresence, motion } from 'motion/react'
import Icon from './Icon.jsx'

/**
 * Chip de selección (componente "Chip" de Figma).
 * tone="blue": selección corta (≤ 3 opciones) · tone="gray": selección múltiple.
 * Sin seleccionar el ícono va en línea; seleccionado pasa a relleno.
 */
export default function Chip({ label, icon, iconSelected, selected, tone = 'blue', onToggle }) {
  const name = selected ? iconSelected || icon : icon
  return (
    <motion.button
      type="button"
      role="checkbox"
      aria-checked={selected}
      className={`chip ${selected ? `chip--${tone}` : ''}`}
      onClick={onToggle}
      whileTap={{ scale: 0.96 }}
      layout="position"
    >
      {icon && (
        <span className="chip__icon">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={name}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.18 }}
            >
              <Icon name={name} size={16} />
            </motion.span>
          </AnimatePresence>
        </span>
      )}
      {label}
    </motion.button>
  )
}
