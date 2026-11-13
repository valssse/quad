import { AnimatePresence, motion } from 'motion/react'
import checkIcon from '../assets/icons/check-bold.svg'
import { fadeUp } from './motion.js'

/**
 * Opción · Selección. Al seleccionar, el ícono pasa de línea (gris) a relleno (azul)
 * y el radio muestra el check.
 */
export default function OptionCard({ title, description, icon, iconSelected, selected, onSelect }) {
  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={selected}
      className={`option ${selected ? 'option--selected' : ''}`}
      onClick={onSelect}
      variants={fadeUp}
      whileTap={{ scale: 0.99 }}
    >
      <span className="option__icon">
        <AnimatePresence initial={false}>
          <motion.img
            key={selected ? 'fill' : 'line'}
            src={selected ? iconSelected : icon}
            width="24"
            height="24"
            alt=""
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          />
        </AnimatePresence>
      </span>
      <span className="option__texts">
        <span className="option__title">{title}</span>
        <span className="option__desc">{description}</span>
      </span>
      <span className={`radio ${selected ? 'radio--checked' : ''}`}>
        <AnimatePresence>
          {selected && (
            <motion.img
              src={checkIcon}
              width="14"
              height="14"
              alt=""
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: 'spring', stiffness: 500, damping: 28 }}
            />
          )}
        </AnimatePresence>
      </span>
    </motion.button>
  )
}
