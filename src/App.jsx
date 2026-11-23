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
import Intro, { INTRO_REVELADO } from './screens/Intro.jsx'
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
import HomeShell from './screens/home/HomeShell.jsx'
import HostShell from './screens/host/HostShell.jsx'

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
  'app',
  'host',
  'listo',
]

export default function App() {
  const { route, param, sub, direction, navigate } = useHashRoute(FLOW, 'bienvenida/1')

  // Al abrir la app siempre se empieza en la Bienvenida 1, aunque la URL guardada apunte a la 2 o la 3
  // (el carrusel actualiza el hash, y el navegador lo recuerda al volver a abrir el enlace).
  useEffect(() => {
    if (route === 'bienvenida' && param !== '1') navigate('bienvenida/1', { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Splash animado al abrir la app: 'logo' → 'revelando' (la app ya está detrás) → 'listo'
  const [intro, setIntro] = useState('logo')

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
        retraso={intro === 'listo' ? 0 : 450}
      />
    ),
    inicio: <Splash onLogin={() => navigate('iniciar-sesion')} onSignup={() => navigate('crear-cuenta')} />,
    'iniciar-sesion': (
      <IniciarSesion onSubmit={({ microsoft }) => navigate(microsoft ? 'host/inicio' : 'app/explorar')} onSignup={() => navigate('crear-cuenta')} />
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
        onFinish={() => navigate('app/explorar')}
      />
    ),
    anfitrion: (
      <AnfitrionFlow
        pasoId={param}
        datos={anfitrion}
        setDatos={setAnfitrion}
        navigate={navigate}
        onFinish={() => navigate('host/inicio')}
      />
    ),
    app: (
      <HomeShell
        pantalla={param}
        sub={sub}
        cuenta={account}
        estudiante={estudiante}
        navigate={navigate}
        onAnfitrion={() => {
          setRole('anfitrion')
          navigate('anfitrion/tipo')
        }}
        onCerrarSesion={() => navigate('inicio')}
      />
    ),
    host: (
      <HostShell
        pantalla={param}
        sub={sub}
        navigate={navigate}
        onPublicar={() => navigate('anfitrion/fotos')}
        onEstudiante={() => navigate('app/perfil')}
        onCerrarSesion={() => navigate('inicio')}
      />
    ),
    listo: <Listo role={role} etapa={param} onRestart={() => navigate('bienvenida/1')} />,
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="stage">
        <div className="device">
          {/* La app se monta detrás del splash cuando empieza el recorte y entra con zoom y desenfoque suaves.
              La primera pantalla no se desliza: la revela la máscara del splash. */}
          {intro !== 'logo' && (
            <motion.div
              className="screen-layer"
              initial={{ scale: 1.08, filter: 'blur(10px)' }}
              animate={{ scale: 1, filter: 'blur(0px)', transitionEnd: { filter: 'none', transform: 'none' } }}
              transition={{ duration: INTRO_REVELADO + 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <AnimatePresence custom={direction}>
                <motion.div
                  key={route}
                  className="screen-layer"
                  custom={direction}
                  variants={route === 'inicio' ? revealVariants : screenVariants}
                  initial={intro === 'listo' ? 'enter' : 'center'}
                  animate="center"
                  exit="exit"
                >
                  {screens[route]}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
          {intro !== 'listo' && <Intro onRevelar={() => setIntro('revelando')} onFin={() => setIntro('listo')} />}
        </div>
      </div>
    </MotionConfig>
  )
}
