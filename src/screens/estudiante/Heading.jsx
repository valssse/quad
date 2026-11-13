import { motion } from 'motion/react'
import { fadeUp } from '../../components/motion.js'

/** Encabezado estándar de un paso: título H2 + descripción. */
export default function Heading({ title, children }) {
  return (
    <motion.div className="heading" variants={fadeUp}>
      <h1 className="text-h2">{title}</h1>
      {children && <p className="text-p">{children}</p>}
    </motion.div>
  )
}
