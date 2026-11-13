import { useState } from 'react'
import { motion } from 'motion/react'
import Screen from '../components/Screen.jsx'
import BackButton from '../components/BackButton.jsx'
import TextField from '../components/TextField.jsx'
import Button from '../components/Button.jsx'
import MicrosoftButton from '../components/MicrosoftButton.jsx'
import Checkbox from '../components/Checkbox.jsx'
import { fadeUp } from '../components/motion.js'
import userIcon from '../assets/icons/user.svg'
import emailIcon from '../assets/icons/email.svg'
import lockIcon from '../assets/icons/lock.svg'
import infoIcon from '../assets/icons/info-outline.svg'
import './CrearCuenta.css'

/** 01c · Crear cuenta — con cualquier correo; la universidad se verifica después. */
export default function CrearCuenta({ initialEmail = '', onBack, onSubmit, onLogin }) {
  const [form, setForm] = useState({ name: '', email: initialEmail, password: '', confirm: '' })
  const [terms, setTerms] = useState(false)

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ name: form.name, email: form.email })
  }

  return (
    <Screen
      className="signup"
      topbar={
        <div className="signup__header">
          <BackButton onClick={onBack} />
          <h1 className="signup__title">Crear cuenta</h1>
        </div>
      }
    >
      <motion.form className="signup__form" variants={fadeUp} onSubmit={handleSubmit}>
        <p className="text-p">
          Crea tu cuenta con cualquier correo. Si eres estudiante, después verificamos tu universidad.
        </p>

        <TextField
          label="Nombre completo"
          icon={userIcon}
          placeholder="Ej. Sofía Ramírez"
          autoComplete="name"
          value={form.name}
          onChange={update('name')}
        />
        <TextField
          label="Correo electrónico"
          icon={emailIcon}
          type="email"
          placeholder="nombre@correo.com"
          autoComplete="email"
          value={form.email}
          onChange={update('email')}
          hint={
            <p className="field__hint">
              <img src={infoIcon} width="14" height="14" alt="" />
              Te enviaremos un código a este correo
            </p>
          }
        />
        <TextField
          label="Contraseña"
          icon={lockIcon}
          type="password"
          placeholder="Mínimo 8 caracteres"
          autoComplete="new-password"
          value={form.password}
          onChange={update('password')}
        />
        <TextField
          label="Confirmar contraseña"
          icon={lockIcon}
          type="password"
          placeholder="Repite tu contraseña"
          autoComplete="new-password"
          value={form.confirm}
          onChange={update('confirm')}
        />

        <Checkbox checked={terms} onChange={setTerms}>
          Acepto los Términos y condiciones y la Política de privacidad
        </Checkbox>

        <Button type="submit" disabled={!terms}>
          Crear cuenta
        </Button>
        <div className="divider">o</div>
        <MicrosoftButton onClick={() => onSubmit({ name: '', email: '' })} />

        <p className="signup__footer">
          ¿Ya tienes cuenta?
          <button type="button" className="link" onClick={onLogin}>
            Inicia sesión
          </button>
        </p>
      </motion.form>
    </Screen>
  )
}
