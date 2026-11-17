import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import StatusBar from '../../components/StatusBar.jsx'
import Icon from '../../components/Icon.jsx'
import { ease } from '../../components/motion.js'
import { BotonMapa } from './ui.jsx'
import Explorar from './Explorar.jsx'
import Guardados from './Guardados.jsx'
import Mensajes from './Mensajes.jsx'
import Perfil from './Perfil.jsx'
import Mapa from './Mapa.jsx'
import { Buscar, Resultados } from './Buscar.jsx'
import { Detalle, PerfilCasa } from './Detalle.jsx'
import { Conversacion } from './Chat.jsx'
import FiltrosPantalla from './FiltrosPantalla.jsx'
import { MiPerfil, EditarPerfil } from './MiPerfil.jsx'
import { perfilInicial } from '../../data/perfil.js'
import { useLiquidGlass } from '../../components/LiquidGlass.jsx'
import { FILTROS_VACIOS, contarFiltros } from '../../data/filtros.js'
import './detalle.css'
import { GUARDADOS_INICIAL } from '../../data/quads.js'
import { ANIOS, UNIVERSIDADES } from '../../data/estudiante.js'
import './home.css'

const TABS = [
  { id: 'explorar', label: 'Inicio', icon: 'home', iconOn: 'home-solid' },
  { id: 'guardados', label: 'Guardados', icon: 'heart', iconOn: 'heart-solid' },
  { id: 'mensajes', label: 'Mensajes', icon: 'chat-bubble', iconOn: 'chat-bubble-solid' },
  { id: 'perfil', label: 'Perfil', icon: 'user', iconOn: 'user-solid' },
]
const ES_TAB = TABS.map((t) => t.id)
// Pantallas que se abren encima (sin barra de navegación)
const NIVEL = { 'mi-perfil': 1, 'editar-perfil': 2, buscar: 1, resultados: 2, filtros: 3, mapa: 3, quad: 4, casa: 5, chat: 6 }
const APILADAS = Object.keys(NIVEL)
// Pantallas que dibujan su propia barra de estado (foto o mapa detrás)
const SIN_ESTADO = ['mapa', 'quad']

/** Barra de navegación tipo vidrio, con la pastilla azul que se desliza al tab activo. */
export function Navegacion({ tabs = TABS, activo, onChange }) {
  const [ref, vidrio, filtro] = useLiquidGlass()
  return (
    <nav ref={ref} className={`tabbar ${vidrio ? 'tabbar--liquid' : ''}`} style={vidrio} aria-label="Navegación principal">
      {filtro}
      {tabs.map((t) => {
        const on = t.id === activo
        return (
          <motion.button
            key={t.id}
            type="button"
            className={`tabbar__tab ${on ? 'tabbar__tab--on' : ''}`}
            aria-current={on ? 'page' : undefined}
            whileTap={{ scale: 0.92 }}
            onClick={() => onChange(t.id)}
          >
            {on && <motion.span layoutId="tab-activo" className="tabbar__pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            <Icon name={on ? t.iconOn : t.icon} size={22} />
            <span>{t.label}</span>
          </motion.button>
        )
      })}
    </nav>
  )
}

/* Tabs: aparecen con un fundido corto. Pantallas apiladas: se deslizan. */
const variantes = {
  enter: ({ apilada, dir }) => (apilada ? { opacity: 0, x: dir >= 0 ? 32 : -32 } : { opacity: 0, y: 6 }),
  center: { opacity: 1, x: 0, y: 0, transition: { duration: 0.36, ease } },
  exit: ({ apilada, dir }) => ({ opacity: 0, x: apilada ? (dir >= 0 ? -24 : 24) : 0, transition: { duration: 0.18, ease } }),
}

/**
 * Home del estudiante (sección "Home" de Figma):
 * 02 Explorar · 07 Guardados · 08 Mensajes · 09 Perfil · 10 Búsqueda/Resultados · 11 Mapa.
 */
export default function HomeShell({ pantalla = 'explorar', sub, cuenta, estudiante, navigate, onAnfitrion, onCerrarSesion }) {
  const [guardados, setGuardados] = useState(GUARDADOS_INICIAL)
  const [consulta, setConsulta] = useState('')
  const [filtros, setFiltros] = useState(FILTROS_VACIOS)
  const nFiltros = contarFiltros(filtros)
  // Perfil del estudiante (09): lo que llenó en el onboarding o el del Figma; se edita en 09b
  const [yo, setYo] = useState(() => perfilInicial(cuenta, estudiante))
  const [aviso, setAviso] = useState(false)
  const alternarGuardado = (id) => setGuardados((g) => (g.includes(id) ? g.filter((x) => x !== id) : [...g, id]))

  // Dirección para las pantallas apiladas
  const nivel = (p) => NIVEL[p] || 0
  const [previa, setPrevia] = useState(pantalla)
  const [dir, setDir] = useState(1)
  if (previa !== pantalla) {
    setDir(nivel(pantalla) >= nivel(previa) ? 1 : -1)
    setPrevia(pantalla)
  }

  const ir = (p, param, opts) => navigate(param ? `app/${p}/${param}` : `app/${p}`, opts)
  const cambiarTab = (t) => t !== pantalla && navigate(`app/${t}`, { replace: true })

  // Datos del perfil para las demás pantallas
  const uni = UNIVERSIDADES.find((u) => u.id === yo.universidad)
  const perfil = {
    nombre: yo.nombre.split(' ')[0],
    nombreCompleto: yo.nombre,
    detalle: [yo.carrera || 'Tu carrera', `${ANIOS.find((a) => a.id === yo.anio)?.label || '2.º'} año`, uni?.corto || 'UCA'].join(' · '),
    foto: yo.foto || null,
  }

  const guardarPerfil = (nuevo) => {
    setYo(nuevo)
    setAviso(true)
    window.history.back()
  }

  const props = { ir, perfil, guardados, alternarGuardado, consulta, setConsulta, filtros, setFiltros, nFiltros }
  const esTab = ES_TAB.includes(pantalla)
  const oscuro = pantalla === 'explorar' || pantalla === 'guardados'

  const contenido = {
    explorar: <Explorar {...props} />,
    guardados: <Guardados {...props} />,
    mensajes: <Mensajes {...props} />,
    perfil: <Perfil {...props} onAnfitrion={onAnfitrion} onCerrarSesion={onCerrarSesion} />,
    buscar: <Buscar {...props} modo={sub} />,
    resultados: <Resultados {...props} id={sub} />,
    mapa: <Mapa {...props} sub={sub} />,
    filtros: <FiltrosPantalla {...props} modo={sub} />,
    quad: <Detalle {...props} id={sub} />,
    casa: <PerfilCasa {...props} id={sub} />,
    chat: <Conversacion {...props} id={sub} />,
    'mi-perfil': <MiPerfil {...props} yo={yo} aviso={aviso} cerrarAviso={() => setAviso(false)} />,
    'editar-perfil': <EditarPerfil {...props} yo={yo} guardar={guardarPerfil} />,
  }

  return (
    <div className="screen home">
      {/* Barra de estado fija (el mapa dibuja la suya encima de la imagen) */}
      <AnimatePresence initial={false}>
        {!SIN_ESTADO.includes(pantalla) && (
          <motion.div key="status" className={`home__status ${['chat', 'mi-perfil', 'editar-perfil'].includes(pantalla) ? 'home__status--white' : ''}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <StatusBar />
            <div className="safe-top" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`home__stage ${SIN_ESTADO.includes(pantalla) ? 'home__stage--full' : ''}`}>
        <AnimatePresence initial={false} custom={{ apilada: !esTab || APILADAS.includes(previa), dir }}>
          <motion.div
            key={pantalla}
            className="screen-layer"
            custom={{ apilada: !esTab, dir }}
            variants={variantes}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {contenido[pantalla] || contenido.explorar}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Degradado inferior para que la barra se lea sobre el contenido */}
      <AnimatePresence>
        {esTab && (
          <motion.div
            key={oscuro ? 'oscuro' : 'claro'}
            className={`home__fade ${oscuro ? 'home__fade--dark' : ''} ${pantalla === 'explorar' ? 'home__fade--blur' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Navegación (+ "Ver Mapa" solo en Inicio) */}
      <AnimatePresence>
        {esTab && (
          <motion.div
            className="home__dock"
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          >
            <AnimatePresence>
              {pantalla === 'explorar' && (
                <motion.div
                  key="mapa"
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                >
                  <BotonMapa onClick={() => ir('mapa')} />
                </motion.div>
              )}
            </AnimatePresence>
            <Navegacion activo={pantalla} onChange={cambiarTab} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
