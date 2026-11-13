import { motion } from 'motion/react'
import Step from './Step.jsx'
import Heading from './Heading.jsx'
import Button from '../../components/Button.jsx'
import Chip from '../../components/Chip.jsx'
import { fadeUp } from '../../components/motion.js'
import { INTERESES } from '../../data/estudiante.js'

const MAX = 300

/** E06 · Sobre ti — presentación (máx. 300 caracteres) e intereses. */
export default function SobreTi({ datos, actualizar, alternar, siguiente, ir }) {
  return (
    <Step
      className="step--long"
      actions={
        <>
          <Button onClick={siguiente}>Continuar</Button>
          <button type="button" className="link" onClick={() => ir('presupuesto')}>
            Completar después
          </button>
        </>
      }
    >
      <Heading title="Preséntate">
        Unas líneas sobre tu rutina y cómo eres en casa. Ayuda a que la familia te conozca.
      </Heading>

      <motion.div className="section" variants={fadeUp} style={{ gap: 8 }}>
        <label className="section-label" htmlFor="sobre-mi">
          Sobre mí
        </label>
        <textarea
          id="sobre-mi"
          className="textarea"
          maxLength={MAX}
          placeholder="Ej. Soy tranquila y ordenada. Estudio casi todo el día y los fines de semana me gusta cocinar."
          value={datos.sobreMi}
          onChange={(e) => actualizar({ sobreMi: e.target.value })}
        />
        <p className="counter">
          {datos.sobreMi.length}/{MAX}
        </p>
      </motion.div>

      <motion.div className="section" variants={fadeUp}>
        <p className="section-label">Tus intereses</p>
        <div className="chips">
          {INTERESES.map((i) => (
            <Chip
              key={i.id}
              tone="gray"
              label={i.label}
              icon={i.icon}
              iconSelected={i.iconSel}
              selected={datos.intereses.includes(i.id)}
              onToggle={() => alternar('intereses', i.id)}
            />
          ))}
        </div>
      </motion.div>
    </Step>
  )
}
