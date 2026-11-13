import { useState } from 'react'
import { motion } from 'motion/react'
import StatusBar from '../components/StatusBar.jsx'
import TextField from '../components/TextField.jsx'
import Button from '../components/Button.jsx'
import MicrosoftButton from '../components/MicrosoftButton.jsx'
import { fadeUp, stagger } from '../components/motion.js'
import logo from '../assets/icons/logo-blue.svg'
import userIcon from '../assets/icons/user.svg'
import lockIcon from '../assets/icons/lock.svg'
import './IniciarSesion.css'

/** 01b · Iniciar sesión — correo/usuario + contraseña, o Microsoft. */
export default function IniciarSesion({ onSubmit, onSignup }) {
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')

  // El botón se habilita solo cuando ambos campos tienen texto
  const canSubmit = user.trim() !== '' && password !== ''

  const handleSubmit = (e) => {
    e.preventDefault()
    if (canSubmit) onSubmit({ user })
  }

  return (
    <div className="screen login">
      <div className="screen__body">
        <motion.div variants={stagger} initial="hidden" animate="show" className="login__inner">
          {/* Encabezado degradado */}
          <div className="login__header">
            <StatusBar tone="dark" />
            <div className="safe-top" />
            <motion.div className="login__title" variants={fadeUp}>
              <img src={logo} width="52" height="52" alt="Quad" />
              <div className="login__spacer" />
              <h1 className="login__h1">¡Bienvenido!</h1>
              <p className="text-p">Inicia sesión para seguir buscando tu Quad.</p>
            </motion.div>
          </div>

          {/* Formulario */}
          <form className="login__form" onSubmit={handleSubmit}>
            <motion.div variants={fadeUp}>
              <TextField
                label="Correo o usuario"
                icon={userIcon}
                placeholder="nombre@correo.com"
                autoComplete="username"
                value={user}
                onChange={(e) => setUser(e.target.value)}
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <TextField
                label="Contraseña"
                icon={lockIcon}
                type="password"
                placeholder="••••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </motion.div>
            <motion.div className="login__forgot" variants={fadeUp}>
              <button type="button" className="link link--small">
                ¿Olvidaste tu contraseña?
              </button>
            </motion.div>
            <motion.div variants={fadeUp}>
              <Button type="submit" disabled={!canSubmit}>
                Iniciar sesión
              </Button>
            </motion.div>
            <motion.div className="divider" variants={fadeUp}>
              o
            </motion.div>
            <motion.div variants={fadeUp}>
              <MicrosoftButton onClick={() => onSubmit({ user: 'microsoft' })} />
            </motion.div>
            <motion.p className="login__note" variants={fadeUp}>
              Puedes usar tu correo personal o universitario
            </motion.p>
          </form>

          <div className="login__flex" />

          {/* Pie */}
          <motion.p className="login__footer" variants={fadeUp}>
            ¿No tienes cuenta?
            <button type="button" className="link" onClick={onSignup}>
              Crear cuenta
            </button>
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
