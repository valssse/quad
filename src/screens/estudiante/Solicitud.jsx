import { motion } from 'motion/react'
import Step from './Step.jsx'
import Heading from './Heading.jsx'
import PerfilMini from './PerfilMini.jsx'
import Button from '../../components/Button.jsx'
import { fadeUp } from '../../components/motion.js'

/** E05e · Así aparecerás en una solicitud — vista previa que se va completando. */
export default function Solicitud({ datos, cuenta, siguiente }) {
  return (
    <Step actions={<Button onClick={siguiente}>Continuar</Button>}>
      <Heading title="Así aparecerás en una solicitud">
        Esto es lo que verá una familia cuando le envíes una solicitud. Se irá completando con lo que agregues.
      </Heading>

      <PerfilMini datos={datos} cuenta={cuenta} />

      <motion.div className="pending" variants={fadeUp}>
        <p className="pending__title">Tu presentación</p>
        <p className="pending__text">Lo que escribas en el siguiente paso aparecerá aquí.</p>
      </motion.div>
    </Step>
  )
}
