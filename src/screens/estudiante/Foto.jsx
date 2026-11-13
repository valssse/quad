import { motion } from 'motion/react'
import Step from './Step.jsx'
import Heading from './Heading.jsx'
import Avatar from './Avatar.jsx'
import Button from '../../components/Button.jsx'
import Icon from '../../components/Icon.jsx'
import { fadeUp } from '../../components/motion.js'

const CONSEJOS = ['Rostro centrado y con buena luz', 'Sin lentes oscuros ni gorra', 'Solo tú en la foto']

/** E05a · Foto de perfil — al tocar "Agregar foto" se abre la hoja E05b. */
export default function Foto({ abrirHoja, ir }) {
  return (
    <Step
      className="step--gap28"
      actions={
        <>
          <Button onClick={abrirHoja}>Agregar foto</Button>
          <button type="button" className="link" onClick={() => ir('datos')}>
            Hacerlo después
          </button>
        </>
      }
    >
      <Heading title="Agrega tu foto">
        Las familias verán esta foto cuando les envíes una solicitud. Una foto clara de tu rostro ayuda a generar
        confianza.
      </Heading>

      <motion.button type="button" variants={fadeUp} onClick={abrirHoja} aria-label="Agregar foto">
        <Avatar variant="add" />
      </motion.button>

      <motion.ul className="tips" variants={fadeUp}>
        {CONSEJOS.map((c) => (
          <li key={c}>
            <Icon name="check-circle-fill" size={18} />
            {c}
          </li>
        ))}
      </motion.ul>
    </Step>
  )
}
