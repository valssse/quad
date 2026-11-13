import { motion } from 'motion/react'
import StatusBar from '../components/StatusBar.jsx'
import Button from '../components/Button.jsx'
import QuadLogo from '../components/QuadLogo.jsx'
import './Splash.css'

const easeInOut = [0.65, 0, 0.35, 1]
const easeOut = [0.16, 1, 0.3, 1]

/**
 * 01a · Inicio (splash)
 * Secuencia de entrada:
 *   1. el degradado baja de arriba hacia abajo (azul → blanco),
 *   2. se arma el logo,
 *   3. aparece "Quad." y luego el texto y los botones.
 */
const REVEAL = 1.1 // duración del barrido del degradado (s)

export default function Splash({ onLogin, onSignup }) {
  return (
    <div className="screen splash">
      {/* Degradado de fondo con barrido de arriba hacia abajo */}
      <motion.div
        className="splash__bg"
        initial={{ maskPosition: '0% 100%', WebkitMaskPosition: '0% 100%' }}
        animate={{ maskPosition: '0% 0%', WebkitMaskPosition: '0% 0%' }}
        transition={{ duration: REVEAL, ease: easeInOut }}
      />

      <StatusBar tone="light" />
      <div className="safe-top" />

      <div className="splash__brand">
        <QuadLogo size={88} tone="white" delay={0.5} />
        <motion.h1
          className="splash__wordmark"
          initial={{ opacity: 0, y: 10, letterSpacing: '8px' }}
          animate={{ opacity: 1, y: 0, letterSpacing: '1.14px' }}
          transition={{ duration: 0.8, ease: easeOut, delay: 1.0 }}
        >
          Quad.
        </motion.h1>
      </div>

      <motion.div
        className="splash__actions"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 1.2 } } }}
      >
        <motion.p className="splash__tagline" variants={item}>
          Encuentra un quad cerca de tu universidad,
          <br />
          con personas verificadas.
        </motion.p>
        <div className="splash__spacer" />
        <motion.div className="splash__btn" variants={item}>
          <Button onClick={onLogin}>Iniciar sesión</Button>
        </motion.div>
        <motion.div className="splash__btn" variants={item}>
          <Button variant="outline" onClick={onSignup}>
            Crear cuenta
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
}
