import { motion } from 'motion/react'
import Step from './Step.jsx'
import Heading from './Heading.jsx'
import Button from '../../components/Button.jsx'
import SelectCard from '../../components/SelectCard.jsx'
import Chip from '../../components/Chip.jsx'
import { fadeUp } from '../../components/motion.js'
import { DURACIONES, FECHAS } from '../../data/estudiante.js'

/** E12 · ¿Cuándo necesitas mudarte? — fecha y duración. */
export default function Mudanza({ datos, actualizar, siguiente }) {
  return (
    <Step actions={<Button onClick={siguiente}>Continuar</Button>}>
      <Heading title="¿Cuándo necesitas mudarte?">Te avisamos de quads que estén libres para esa fecha.</Heading>

      <div className="heading" role="radiogroup" aria-label="Fecha" style={{ gap: 10 }}>
        {FECHAS.map((f) => (
          <SelectCard
            key={f.id}
            title={f.titulo}
            description={f.desc}
            icon={f.icon}
            iconSelected={f.iconSel}
            selected={datos.mudanza === f.id}
            onSelect={() => actualizar({ mudanza: f.id })}
          />
        ))}
      </div>

      <motion.div className="section" variants={fadeUp}>
        <p className="section-label">¿Por cuánto tiempo?</p>
        <div className="chips" role="radiogroup" aria-label="Duración">
          {DURACIONES.map((d) => (
            <Chip key={d.id} label={d.label} selected={datos.duracion === d.id} onToggle={() => actualizar({ duracion: d.id })} />
          ))}
        </div>
      </motion.div>
    </Step>
  )
}
