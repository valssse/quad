import { motion } from 'motion/react'
import Step from './Step.jsx'
import Heading from './Heading.jsx'
import ChipGroups from './ChipGroups.jsx'
import Button from '../../components/Button.jsx'
import Switch from '../../components/Switch.jsx'
import Icon from '../../components/Icon.jsx'
import { fadeUp } from '../../components/motion.js'
import { CONVIVENCIA } from '../../data/estudiante.js'

/** E11 · ¿Cómo te gusta convivir? — preferencias, rutina y convivencia con la familia. */
export default function Convivencia({ datos, actualizar, alternar, siguiente }) {
  return (
    <Step className="step--long" actions={<Button onClick={siguiente}>Continuar</Button>}>
      <Heading title="¿Cómo te gusta convivir?">Así encontramos casas que encajen con tu forma de vivir.</Heading>

      <ChipGroups grupos={CONVIVENCIA} seleccion={datos.convivencia} onToggle={(id) => alternar('convivencia', id)} />

      <motion.div className="perm-row" variants={fadeUp}>
        <Icon name="group-fill" className="note__icon" />
        <div className="option__texts">
          <span className="option__title">Me gustaría convivir con la familia</span>
          <span className="option__desc">Comidas o actividades juntos de vez en cuando</span>
        </div>
        <Switch
          checked={datos.convivirFamilia}
          onChange={(v) => actualizar({ convivirFamilia: v })}
          label="Me gustaría convivir con la familia"
        />
      </motion.div>
    </Step>
  )
}
