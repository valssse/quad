import { motion } from 'motion/react'
import Screen from '../components/Screen.jsx'
import BackButton from '../components/BackButton.jsx'
import Button from '../components/Button.jsx'
import Switch from '../components/Switch.jsx'
import { fadeUp } from '../components/motion.js'
import locationIcon from '../assets/icons/location-fill.svg'
import bellIcon from '../assets/icons/bell-fill.svg'

const rows = [
  { id: 'location', icon: locationIcon, title: 'Ubicación', text: 'Calcula distancias y tiempos hasta tu campus' },
  { id: 'notifications', icon: bellIcon, title: 'Notificaciones', text: 'Mensajes, solicitudes, visitas y pagos' },
]

/** 01i · Permisos — ubicación y notificaciones. */
export default function Permisos({ permissions, onToggle, onBack, onContinue, onSkip }) {
  return (
    <Screen
      topbar={<BackButton onClick={onBack} />}
      actions={
        <>
          <Button onClick={onContinue}>Continuar</Button>
          <button type="button" className="link" onClick={onSkip}>
            Ahora no
          </button>
        </>
      }
    >
      <motion.div className="heading" variants={fadeUp}>
        <h1 className="text-h2">Activa estos permisos</h1>
        <p className="text-p">Te ayudan a ver quads cerca y a no perderte mensajes, visitas ni pagos.</p>
      </motion.div>

      <div className="heading" style={{ gap: 12 }}>
        {rows.map((row) => (
          <motion.div key={row.id} className="perm-row" variants={fadeUp}>
            <img src={row.icon} width="24" height="24" alt="" />
            <div className="option__texts">
              <span className="option__title">{row.title}</span>
              <span className="option__desc">{row.text}</span>
            </div>
            <Switch checked={permissions[row.id]} onChange={(v) => onToggle(row.id, v)} label={row.title} />
          </motion.div>
        ))}
      </div>
    </Screen>
  )
}
