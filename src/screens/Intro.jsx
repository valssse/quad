import { motion } from 'motion/react'
import StatusBar from '../components/StatusBar.jsx'
import QuadLogo from '../components/QuadLogo.jsx'
import './Intro.css'

const ease = [0.65, 0, 0.35, 1]

/**
 * Splash animado de apertura (fondo azul de marca).
 * El logo se arma, se sostiene un instante y sale; luego el azul se desvanece
 * para dar paso a la Bienvenida 1. Duración sincronizada con INTRO_MS en App.jsx.
 */
export default function Intro() {
  return (
    <motion.div
      className="screen intro"
      role="img"
      aria-label="Quad"
      exit={{ opacity: 0, transition: { duration: 0.4, ease, delay: 0.18 } }}
    >
      <StatusBar tone="light" />
      <div className="safe-top" />

      <div className="intro__stage">
        <motion.div
          className="intro__logo"
          exit={{ scale: 0.9, opacity: 0, transition: { duration: 0.3, ease } }}
        >
          <QuadLogo size={88} tone="white" delay={0.15} />
        </motion.div>
      </div>
    </motion.div>
  )
}
