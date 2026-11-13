import { motion } from 'motion/react'
import Screen from '../components/Screen.jsx'
import BackButton from '../components/BackButton.jsx'
import Button from '../components/Button.jsx'
import OptionCard from '../components/OptionCard.jsx'
import Note from '../components/Note.jsx'
import { fadeUp } from '../components/motion.js'
import searchLine from '../assets/icons/search-outline.svg'
import searchFill from '../assets/icons/search-fill.svg'
import homeLine from '../assets/icons/home-outline.svg'
import homeFill from '../assets/icons/home-fill.svg'
import infoFill from '../assets/icons/info-fill.svg'

const options = [
  {
    id: 'estudiante',
    title: 'Busco un Quad',
    description: 'Soy universitario y necesito dónde vivir cerca de mi campus',
    icon: searchLine,
    iconSelected: searchFill,
  },
  {
    id: 'anfitrion',
    title: 'Ofrezco un Quad',
    description: 'Tengo un espacio para recibir a estudiantes',
    icon: homeLine,
    iconSelected: homeFill,
  },
]

/** 01h · ¿Cómo usarás Quad? — elige modo estudiante o anfitrión. */
export default function ComoUsaras({ role, onRoleChange, onBack, onContinue }) {
  return (
    <Screen
      topbar={<BackButton onClick={onBack} />}
      actions={<Button onClick={onContinue}>Continuar</Button>}
    >
      <motion.div className="heading" variants={fadeUp}>
        <h1 className="text-h2">¿Cómo usarás Quad?</h1>
        <p className="text-p">Elige con qué empezar. Puedes cambiar de modo cuando quieras desde tu perfil.</p>
      </motion.div>

      <div className="heading" role="radiogroup" aria-label="Modo de uso" style={{ gap: 12 }}>
        {options.map((opt) => (
          <OptionCard
            key={opt.id}
            {...opt}
            selected={role === opt.id}
            onSelect={() => onRoleChange(opt.id)}
          />
        ))}
      </div>

      <Note icon={infoFill}>Una sola cuenta sirve para los dos modos.</Note>
    </Screen>
  )
}
