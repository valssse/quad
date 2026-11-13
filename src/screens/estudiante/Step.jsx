import { motion } from 'motion/react'
import { stagger } from '../../components/motion.js'

/**
 * Paso del onboarding de estudiante: contenido desplazable + barra de acciones.
 * La barra superior (atrás + progreso) vive en EstudianteFlow, no aquí.
 */
export default function Step({ children, actions, className = '' }) {
  return (
    <div className={`step ${className}`}>
      <main className="screen__body">
        <motion.div className="screen__content" variants={stagger} initial="hidden" animate="show">
          {children}
        </motion.div>
      </main>
      {actions && <footer className="actionbar">{actions}</footer>}
    </div>
  )
}
