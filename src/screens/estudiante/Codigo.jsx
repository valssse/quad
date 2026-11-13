import { useState } from 'react'
import { motion } from 'motion/react'
import Step from './Step.jsx'
import Heading from './Heading.jsx'
import Button from '../../components/Button.jsx'
import OtpInput from '../../components/OtpInput.jsx'
import { fadeUp } from '../../components/motion.js'

/** E03 · Código universitario — 6 dígitos enviados al correo de la universidad. */
export default function Codigo({ datos, ir }) {
  const [digitos, setDigitos] = useState(Array(6).fill(''))
  const [reenviado, setReenviado] = useState(false)
  const completo = digitos.every(Boolean)

  return (
    <Step
      actions={
        <>
          <Button onClick={() => ir('verificado')} disabled={!completo}>
            Verificar
          </Button>
          <button type="button" className="link" onClick={() => ir('verificar')}>
            Usar otro método
          </button>
        </>
      }
    >
      <Heading title="Ingresa el código">
        Lo enviamos a {datos.correoUni || 'tu correo universitario'}. Puede tardar un par de minutos.
      </Heading>

      <OtpInput digits={digitos} onChange={setDigitos} />

      <motion.p className="resend" variants={fadeUp}>
        ¿No te llegó?
        <button type="button" className="link" onClick={() => setReenviado(true)} disabled={reenviado}>
          {reenviado ? 'Código reenviado' : 'Reenviar código'}
        </button>
      </motion.p>
    </Step>
  )
}
