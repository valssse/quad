import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import Screen from '../components/Screen.jsx'
import BackButton from '../components/BackButton.jsx'
import Button from '../components/Button.jsx'
import Note from '../components/Note.jsx'
import OtpInput from '../components/OtpInput.jsx'
import { fadeUp } from '../components/motion.js'
import mailIcon from '../assets/icons/mail-fill.svg'

const LENGTH = 6
const RESEND_SECONDS = 45

/** 01g · Verificar correo — código de 6 dígitos con reenvío temporizado. */
export default function VerificarCorreo({ email, onBack, onVerify, onChangeEmail }) {
  const [digits, setDigits] = useState(Array(LENGTH).fill(''))
  const [seconds, setSeconds] = useState(RESEND_SECONDS)
  // Cuenta regresiva para reenviar el código
  useEffect(() => {
    if (seconds <= 0) return
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(id)
  }, [seconds])

  const complete = digits.every(Boolean)
  const time = `0:${String(seconds).padStart(2, '0')}`

  return (
    <Screen
      topbar={<BackButton onClick={onBack} />}
      actions={
        <>
          <Button onClick={onVerify} disabled={!complete}>
            Verificar
          </Button>
          <button type="button" className="link" onClick={onChangeEmail}>
            Cambiar correo
          </button>
        </>
      }
    >
      <motion.div className="heading" variants={fadeUp}>
        <h1 className="text-h2">Revisa tu correo</h1>
        <p className="text-p">
          Te enviamos un código de 6 dígitos a {email || 'tu correo'}. Escríbelo para confirmar tu cuenta.
        </p>
      </motion.div>

      <OtpInput digits={digits} onChange={setDigits} />

      <motion.p className="resend" variants={fadeUp}>
        ¿No te llegó?
        {seconds > 0 ? (
          <span className="resend__timer">Reenviar en {time}</span>
        ) : (
          <button type="button" className="link" onClick={() => setSeconds(RESEND_SECONDS)}>
            Reenviar código
          </button>
        )}
      </motion.p>

      <Note icon={mailIcon}>Revisa también tu carpeta de spam o correo no deseado.</Note>
    </Screen>
  )
}
