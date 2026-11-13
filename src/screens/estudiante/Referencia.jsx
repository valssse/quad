import { motion } from 'motion/react'
import Step from './Step.jsx'
import Heading from './Heading.jsx'
import Button from '../../components/Button.jsx'
import SelectCard from '../../components/SelectCard.jsx'
import Chip from '../../components/Chip.jsx'
import { fadeUp } from '../../components/motion.js'
import { ENTRADAS, TRANSPORTES } from '../../data/estudiante.js'

/** E08 · ¿Desde dónde medimos distancias? — entrada del campus y cómo te mueves. */
export default function Referencia({ datos, actualizar, alternar, siguiente }) {
  return (
    <Step actions={<Button onClick={siguiente}>Continuar</Button>}>
      <Heading title="¿Desde dónde medimos distancias?">Elige la entrada de tu campus que más usas.</Heading>

      <div className="heading" role="radiogroup" aria-label="Entrada" style={{ gap: 10 }}>
        {ENTRADAS.map((e) => (
          <SelectCard
            key={e.id}
            title={e.titulo}
            description={e.desc}
            icon={e.icon}
            iconSelected={e.iconSel}
            selected={datos.entrada === e.id}
            onSelect={() => actualizar({ entrada: e.id })}
          />
        ))}
      </div>

      <motion.div className="section" variants={fadeUp}>
        <p className="section-label">¿Cómo te mueves?</p>
        <div className="chips">
          {TRANSPORTES.map((t) => (
            <Chip
              key={t.id}
              label={t.label}
              icon={t.icon}
              iconSelected={t.iconSel}
              selected={datos.transporte.includes(t.id)}
              onToggle={() => alternar('transporte', t.id)}
            />
          ))}
        </div>
      </motion.div>
    </Step>
  )
}
