import { motion } from 'motion/react'
import Screen from '../components/Screen.jsx'
import Button from '../components/Button.jsx'
import { fadeUp } from '../components/motion.js'

/**
 * Pantalla temporal de cierre (no existe en Figma).
 * Marca el final del onboarding compartido mientras se programan
 * los onboardings de Estudiante y Anfitrión.
 */
export default function Listo({ role, etapa, onRestart }) {
  const deEstudiante = etapa === 'estudiante'
  const deAnfitrion = etapa === 'anfitrion'
  const next = deEstudiante ? 'Home' : deAnfitrion ? 'Panel del anfitrión' : role === 'anfitrion' ? 'Onboarding · Anfitrión' : 'Estudiante · Onboarding'
  return (
    <Screen topbar={null} actions={<Button onClick={onRestart}>Volver a empezar</Button>}>
      <motion.div className="heading" variants={fadeUp}>
        <h1 className="text-h2">{deEstudiante ? 'Onboarding de estudiante listo' : deAnfitrion ? 'Onboarding de anfitrión listo' : 'Onboarding compartido listo'}</h1>
        <p className="text-p">Siguiente flujo por programar: {next}.</p>
      </motion.div>
    </Screen>
  )
}
