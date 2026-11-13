import { motion } from 'motion/react'
import { press } from './motion.js'

/**
 * Botón/Primario de Figma y sus variantes.
 * variant: "primary" | "outline" | "neutral"
 */
export default function Button({ variant = 'primary', children, className = '', ...props }) {
  return (
    <motion.button type="button" className={`btn btn--${variant} ${className}`} {...press} {...props}>
      {children}
    </motion.button>
  )
}
