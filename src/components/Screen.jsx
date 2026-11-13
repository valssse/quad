import { motion } from 'motion/react'
import StatusBar from './StatusBar.jsx'
import { ease, stagger } from './motion.js'

/**
 * Estructura base de cada pantalla del onboarding:
 * barra de estado · barra superior · contenido · barra de acciones.
 */
export default function Screen({ topbar, actions, children, statusTone = 'dark', className = '', animateContent = true, animateActions = false }) {
  return (
    <div className={`screen ${className}`}>
      <StatusBar tone={statusTone} />
      <div className="safe-top" />
      {topbar !== undefined && <header className="topbar">{topbar}</header>}

      <main className="screen__body">
        {animateContent ? (
          <motion.div className="screen__content" variants={stagger} initial="hidden" animate="show">
            {children}
          </motion.div>
        ) : (
          <div className="screen__content">{children}</div>
        )}
      </main>

      {actions &&
        (animateActions ? (
          <motion.footer
            className="actionbar"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease, delay: 0.25 }}
          >
            {actions}
          </motion.footer>
        ) : (
          <footer className="actionbar">{actions}</footer>
        ))}
    </div>
  )
}
