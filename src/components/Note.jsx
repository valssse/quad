import { motion } from 'motion/react'
import Icon from './Icon.jsx'
import { fadeUp } from './motion.js'

/**
 * Nota informativa con fondo azul suave.
 * Recibe `icon` (ruta de un SVG) o `iconName` (ícono de la librería, en azul).
 */
export default function Note({ icon, iconName, children }) {
  return (
    <motion.div className="note" variants={fadeUp}>
      {iconName ? (
        <Icon name={iconName} size={16} className="note__icon" />
      ) : (
        <img src={icon} width="16" height="16" alt="" />
      )}
      <p>{children}</p>
    </motion.div>
  )
}
