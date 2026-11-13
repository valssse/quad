import { useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import useHashRoute from './hooks/useHashRoute.js'
import { screenVariants } from './components/motion.js'

/** El Inicio no se desliza: entra con el barrido de su propio degradado. */
const revealVariants = {
  enter: { opacity: 1, x: 0 },
  center: { opacity: 1, x: 0 },
  exit: screenVariants.exit,
}
import Intro from './screens/Intro.jsx'
import Bienvenida from './screens/Bienvenida.jsx'
import Splash from './screens/Splash.jsx'
import IniciarSesion from './screens/IniciarSesion.jsx'
import CrearCuenta from './screens/CrearCuenta.jsx'
import VerificarCorreo from './screens/VerificarCorreo.jsx'
import ComoUsaras from './screens/ComoUsaras.jsx'
import Permisos from './screens/Permisos.jsx'
import Listo from './screens/Listo.jsx'
import EstudianteFlow from './screens/estudiante/EstudianteFlow.jsx'
import { ESTUDIANTE_INICIAL } from './data/estudiante.js'
import AnfitrionFlow from './screens/anfitrion/AnfitrionFlow.jsx'
import { ANFITRION_INICIAL } from './data/anfitrion.js'

/**
 * Onboarding compartido de Quad (sección "Onboarding · Compartido" en Figma).
 * Flujo: Bienvenida 1–3 → Inicio → Iniciar sesión | Crear cuenta
 *        → Verificar correo → ¿Cómo usarás Quad? → Permisos.
 */
const FLOW = [
  'bienvenida',
  'inicio',
  'iniciar-sesion',
  'crear-cuenta',
  'verificar-correo',
  'como-usaras',
  'permisos',
  'estudiante',
  'anfitrion',
  'listo',
]

/** Duración del splash animado antes de pasar a la Bienvenida 1 (ms). */
const INTRO_MS = 1800

export default function App() {
  const { route, param, direction, navigate } = useHashRoute(FLOW, 'bienvenida/1')

  // Splash animado: se muestra siempre al abrir la app
  const [introDone, setIntroDone] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setIntroDone(true), INTRO_MS)
    return () => clearTimeout(id)
  }, [])

  // Estado compartido del onboarding
  const [account, setAccount] = useState({ name: '', email: '' })
  const [role, setRole] = useState('estudiante')
  const [permissions, setPermissions] = useState({ location: true, notifications: true })
  const [estudiante, setEstudiante] = useState(ESTUDIANTE_INICIAL)
  const [anfitrion, setAnfitrion] = useState(ANFITRION_INICIAL)

  // Dirección interna del carrusel de bienvenida
  const [slideDir, setSlideDir] = useState(1)
  const slide = Math.min(Math.max(Number(param) || 1, 1), 3) - 1

  const goBack = () => window.history.back()

  const screens = {
    bienvenida: (
      <Bienvenida
        index={slide}
        direction={slideDir}
        onChange={(i) => {
          setSlideDir(i > slide ? 1 : -1)
          navigate(`bienvenida/${i + 1}`, { replace: true })
        }}
        onSkip={() => navigate('inicio')}
        onFinish={() => navigate('inicio')}
      />
    ),
    inicio: <Splash onLogin={() => navigate('iniciar-sesion')} onSignup={() => navigate('crear-cuenta')} />,
    'iniciar-sesion': (
      <IniciarSesion onSubmit={() => navigate('como-usaras')} onSignup={() => navigate('crear-cuenta')} />
    ),
    'crear-cuenta': (
      <CrearCuenta
        initialEmail={account.email}
        onBack={goBack}
        onLogin={() => navigate('iniciar-sesion')}
        onSubmit={(data) => {
          setAccount(data)
          navigate('verificar-correo')
        }}
      />
    ),
    'verificar-correo': (
      <VerificarCorreo
        email={account.email}
        onBack={goBack}
        onChangeEmail={goBack}
        onVerify={() => navigate('como-usaras')}
      />
    ),
    'como-usaras': (
      <ComoUsaras role={role} onRoleChange={setRole} onBack={goBack} onContinue={() => navigate('permisos')} />
    ),
    permisos: (
      <Permisos
        permissions={permissions}
        onToggle={(id, value) => setPermissions((p) => ({ ...p, [id]: value }))}
        onBack={goBack}
        onContinue={() => navigate(role === 'estudiante' ? 'estudiante/universidad' : 'anfitrion/tipo')}
        onSkip={() => navigate(role === 'estudiante' ? 'estudiante/universidad' : 'anfitrion/tipo')}
      />
    ),
    estudiante: (
      <EstudianteFlow
        pasoId={param}
        datos={estudiante}
        setDatos={setEstudiante}
        cuenta={account}
        navigate={navigate}
        onFinish={() => navigate('listo/estudiante')}
      />
    ),
    anfitrion: (
      <AnfitrionFlow
        pasoId={param}
        datos={anfitrion}
        setDatos={setAnfitrion}
        navigate={navigate}
        onFinish={() => navigate('listo/anfitrion')}
      />
    ),
    listo: <Listo role={role} etapa={param} onRestart={() => navigate('bienvenida/1')} />,
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="stage">
        <div className="device">
          {/* mode="wait": primero termina de salir el splash, luego entra la app */}
          <AnimatePresence mode="wait">
            {!introDone ? (
              <Intro key="intro" />
            ) : (
              <div key="app" className="screen-layer">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={route}
                    className="screen-layer"
                    custom={direction}
                    variants={route === 'inicio' ? revealVariants : screenVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                  >
                    {screens[route]}
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  )
}
