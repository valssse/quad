import { motion } from 'motion/react'
import Step from './Step.jsx'
import Heading from './Heading.jsx'
import Button from '../../components/Button.jsx'
import Categorias from './Categorias.jsx'
import { fadeUp } from '../../components/motion.js'
import { INTERESES_GRUPOS } from '../../data/estudiante.js'

const MAX = 300

/** E06 · Preséntate — presentación (máx. 300 caracteres) e intereses por categoría. */
export default function SobreTi({ datos, actualizar, alternar, siguiente }) {
  return (
    <Step className="step--long" actions={<Button onClick={siguiente}>Continuar</Button>}>
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

      <Categorias titulo="Tus intereses" grupos={INTERESES_GRUPOS} seleccion={datos.intereses} onToggle={(id) => alternar('intereses', id)} />
    </Step>
  )
}
