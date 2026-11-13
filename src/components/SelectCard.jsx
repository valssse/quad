import { AnimatePresence, motion } from 'motion/react'
import Icon from './Icon.jsx'
import checkIcon from '../assets/icons/check-bold.svg'
import { fadeUp } from './motion.js'

/**
 * Tarjeta seleccionable ("Opción · Selección" / "Opción · Universidad").
 * - icon / iconSelected: nombres de ícono (línea → relleno al seleccionar).
 * - leading: nodo propio a la izquierda (p. ej. el logo de la universidad).
 * - multiple: usa role="checkbox" en lugar de "radio" (mismo aspecto visual).
 */
export default function SelectCard({ title, description, icon, iconSelected, leading, selected, multiple, onSelect }) {
  const name = selected ? iconSelected || icon : icon
  return (
    <motion.button
      type="button"
      role={multiple ? 'checkbox' : 'radio'}
      aria-checked={selected}
      className={`option ${selected ? 'option--selected' : ''}`}
      onClick={onSelect}
      variants={fadeUp}
      whileTap={{ scale: 0.99 }}
    >
      {leading ? (
        leading
      ) : (
        <span className="option__icon option__icon--svg">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Icon name={name} size={24} />
            </motion.span>
          </AnimatePresence>
        </span>
      )}
      <span className="option__texts">
        <span className="option__title">{title}</span>
        {description && <span className="option__desc">{description}</span>}
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
