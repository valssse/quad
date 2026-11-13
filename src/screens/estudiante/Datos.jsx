import { motion } from 'motion/react'
import Step from './Step.jsx'
import Heading from './Heading.jsx'
import Button from '../../components/Button.jsx'
import Chip from '../../components/Chip.jsx'
import Icon from '../../components/Icon.jsx'
import { fadeUp } from '../../components/motion.js'
import { ANIOS } from '../../data/estudiante.js'

/** Campo de texto con ícono de la librería (Campo/Texto de Figma). */
function Campo({ id, label, icon, ...props }) {
  return (
    <motion.div className="field" variants={fadeUp}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <div className="field__control">
        <Icon name={icon} size={20} className="field__icon field__icon--svg" />
        <input id={id} className="field__input" {...props} />
      </div>
    </motion.div>
  )
}

/** E05d · Datos académicos — carrera, año y ciudad de origen. */
export default function Datos({ datos, actualizar, siguiente }) {
  return (
    <Step actions={<Button onClick={siguiente}>Continuar</Button>}>
      <Heading title="Tus datos académicos">Así las familias saben qué estudias y de dónde vienes.</Heading>

      <Campo
        id="carrera"
        label="Carrera"
        icon="sparks"
        placeholder="Ej. Ingeniería Industrial"
        value={datos.carrera}
        onChange={(e) => actualizar({ carrera: e.target.value })}
      />

      <motion.div className="section" variants={fadeUp}>
        <p className="section-label">Año que cursas</p>
        <div className="chips" role="radiogroup" aria-label="Año que cursas">
          {ANIOS.map((a) => (
            <Chip key={a.id} label={a.label} selected={datos.anio === a.id} onToggle={() => actualizar({ anio: a.id })} />
          ))}
        </div>
      </motion.div>

      <Campo
        id="ciudad"
        label="Ciudad de origen"
        icon="map-pin"
        placeholder="Ej. Santa Ana"
        value={datos.ciudad}
        onChange={(e) => actualizar({ ciudad: e.target.value })}
      />
    </Step>
  )
}
