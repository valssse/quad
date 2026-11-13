import { AnimatePresence, motion } from 'motion/react'
import Step from './Step.jsx'
import Heading from './Heading.jsx'
import RangeSlider from './RangeSlider.jsx'
import Button from '../../components/Button.jsx'
import Chip from '../../components/Chip.jsx'
import Switch from '../../components/Switch.jsx'
import Icon from '../../components/Icon.jsx'
import { fadeUp } from '../../components/motion.js'
import { ATAJOS, PRESUPUESTO, formatoRango } from '../../data/estudiante.js'

/** E07 · ¿Cuánto puedes pagar al mes? — rango, atajos y servicios incluidos. */
export default function Presupuesto({ datos, actualizar, siguiente }) {
  const [a, b] = datos.presupuesto
  const texto = formatoRango(datos.presupuesto)

  return (
    <Step actions={<Button onClick={siguiente}>Continuar</Button>}>
      <Heading title="¿Cuánto puedes pagar al mes?">Te mostramos primero los quads dentro de tu rango.</Heading>

      <motion.div className="range-card" variants={fadeUp}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.p
            key={texto}
            className="range-card__value"
            initial={{ opacity: 0.4, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
          >
            {texto}
          </motion.p>
        </AnimatePresence>
        <p className="text-p">por mes</p>
        <RangeSlider
          min={PRESUPUESTO.min}
          max={PRESUPUESTO.max}
          step={PRESUPUESTO.paso}
          value={datos.presupuesto}
          onChange={(v) => actualizar({ presupuesto: v })}
        />
        <div className="range__limits">
          <span>${PRESUPUESTO.min}</span>
          <span>${PRESUPUESTO.max}+</span>
        </div>
      </motion.div>

      <motion.div className="section" variants={fadeUp}>
        <p className="section-label">Atajos</p>
        <div className="chips" role="radiogroup" aria-label="Atajos de presupuesto">
          {ATAJOS.map((x) => (
            <Chip
              key={x.id}
              label={x.label}
              selected={x.rango[0] === a && x.rango[1] === b}
              onToggle={() => actualizar({ presupuesto: x.rango })}
            />
          ))}
        </div>
      </motion.div>

      <motion.div className="perm-row" variants={fadeUp}>
        <Icon name="dollar-circle-fill" className="note__icon" />
        <div className="option__texts">
          <span className="option__title">Con servicios incluidos</span>
          <span className="option__desc">Agua, luz e internet dentro del precio</span>
        </div>
        <Switch
          checked={datos.serviciosIncluidos}
          onChange={(v) => actualizar({ serviciosIncluidos: v })}
          label="Con servicios incluidos"
        />
      </motion.div>
    </Step>
  )
}
