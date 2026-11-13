import { motion } from 'motion/react'
import Step from './Step.jsx'
import Heading from './Heading.jsx'
import Avatar from './Avatar.jsx'
import Button from '../../components/Button.jsx'
import Note from '../../components/Note.jsx'
import { fadeUp } from '../../components/motion.js'

/** E05c · Tu foto — vista previa antes de usarla. */
export default function TuFoto({ datos, abrirHoja, ir }) {
  return (
    <Step
      className="step--photo"
      actions={
        <>
          <Button onClick={() => ir('datos')}>Usar esta foto</Button>
          <Button variant="outline" onClick={abrirHoja}>
            Cambiar foto
          </Button>
        </>
      }
    >
      <Heading title="Así te verán las familias">Revisa tu foto. Puedes cambiarla cuando quieras.</Heading>

      <motion.div variants={fadeUp}>
        <Avatar variant="ready" photo={datos.foto} />
      </motion.div>

      <Note iconName="info-circle-fill">
        Esta foto se mostrará en tus solicitudes. Puedes cambiarla cuando quieras desde tu perfil.
      </Note>
    </Step>
  )
}
