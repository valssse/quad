import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import StatusBar from '../../components/StatusBar.jsx'
import Button from '../../components/Button.jsx'
import { ease } from '../../components/motion.js'
import { Navegacion } from '../home/HomeShell.jsx'
import Panel from './Panel.jsx'
import Inquilinos from './Inquilinos.jsx'
import Solicitud from './Solicitud.jsx'
import { Estancia, Reporte } from './Estancia.jsx'
import { Aviso } from './ui.jsx'
import { ESTANCIAS, HISTORIAL, REPORTES, SOLICITUDES, VISITAS } from '../../data/host.js'
import '../home/home.css'
import '../home/detalle.css'
import '../estudiante/estudiante.css'
import './host.css'

const TABS = [
  { id: 'inicio', label: 'Inicio', icon: 'home', iconOn: 'home-solid' },
  { id: 'quads', label: 'Mis quads', icon: 'bed', iconOn: 'bed-fill' },
  { id: 'inquilinos', label: 'Inquilinos', icon: 'group', iconOn: 'group-fill' },
  { id: 'mensajes', label: 'Mensajes', icon: 'chat-bubble', iconOn: 'chat-bubble-solid' },
  { id: 'perfil', label: 'Perfil', icon: 'user', iconOn: 'user-solid' },
]
const ES_TAB = TABS.map((t) => t.id)
const NIVEL = { solicitud: 1, estancia: 1, reporte: 2 }

const variantes = {
  enter: ({ apilada, dir }) => (apilada ? { opacity: 0, x: dir >= 0 ? 32 : -32 } : { opacity: 0, y: 6 }),
  center: { opacity: 1, x: 0, y: 0, transition: { duration: 0.36, ease } },
  exit: ({ apilada, dir }) => ({ opacity: 0, x: apilada ? (dir >= 0 ? -24 : 24) : 0, transition: { duration: 0.18, ease } }),
}

/** Secciones que vienen en otras partes del Figma (Mis quads, Mensajes, Perfil). */
function Pronto({ titulo, texto, children }) {
  return (
    <div className="home-screen hs">
      <div className="home-scroll hs-soon">
        <h1>{titulo}</h1>
        <p>{texto}</p>
        {children}
      </div>
    </div>
  )
}

/**
 * App del anfitrión (sección "Anfitrión · App" de Figma):
 * H01 Panel · H10–H18 Inquilinos · H11–H14 Solicitud · H19 Estancia · H20–H22 Reporte.
 */
export default function HostShell({ pantalla = 'inicio', sub, navigate, onPublicar, onEstudiante, onCerrarSesion }) {
  const [estados, setEstados] = useState(() => Object.fromEntries(SOLICITUDES.map((s) => [s.id, s.estado])))
  const [rechazos, setRechazos] = useState([])
  const [confirmadas, setConfirmadas] = useState(() => Object.fromEntries(VISITAS.map((v) => [v.id, v.confirmada])))
  const [recordados, setRecordados] = useState([])
  const [reportes, setReportes] = useState(REPORTES)

  // Aviso (toast) que se va solo
  const [aviso, setAviso] = useState(null)
  const reloj = useRef(null)
  const pantallaRef = useRef(pantalla)
  useEffect(() => {
    pantallaRef.current = pantalla
  }, [pantalla])
  const avisar = useCallback((texto, accion, en) => {
    clearTimeout(reloj.current)
    setAviso({ id: Date.now(), texto, accion, en: en || pantallaRef.current })
    reloj.current = setTimeout(() => setAviso(null), accion ? 5000 : 3200)
  }, [])
  useEffect(() => () => clearTimeout(reloj.current), [])

  // Dirección para las pantallas apiladas
  const nivel = (p) => NIVEL[p] || 0
  const [previa, setPrevia] = useState(pantalla)
  const [dir, setDir] = useState(1)
  if (previa !== pantalla) {
    setDir(nivel(pantalla) >= nivel(previa) ? 1 : -1)
    setPrevia(pantalla)
  }

  const ir = (p, param, opts) => {
    if (p === 'publicar') return onPublicar()
    navigate(param ? `host/${p}/${param}` : `host/${p}`, opts)
  }
  const cambiarTab = (t) => t !== pantalla && navigate(`host/${t}`, { replace: true })

  const solicitudes = SOLICITUDES.map((s) => ({ ...s, estado: estados[s.id] }))
  const visitas = VISITAS.map((v) => ({ ...v, confirmada: confirmadas[v.id] }))
  const totalCobro = 230
  const historial = rechazos.length ? [{ mes: 'Noviembre 2026', items: rechazos }, ...HISTORIAL] : HISTORIAL

  const aceptar = (id) => setEstados((e) => ({ ...e, [id]: 'aceptada' }))
  const rechazar = (id, motivo) => {
    const s = SOLICITUDES.find((x) => x.id === id)
    const previo = estados[id]
    setEstados((e) => ({ ...e, [id]: 'rechazada' }))
    setRechazos((r) => [{ icon: 'group-fill', tono: 'gray', titulo: `Rechazaste a ${s.nombre}`, texto: `${motivo} · ${s.quadCorto}`, fecha: 'Hoy', id }, ...r])
    navigate('host/inquilinos/solicitudes', { replace: true })
    avisar(
      `Rechazaste la solicitud de ${s.corto}`,
      {
        label: 'Deshacer',
        fn: () => {
          setEstados((e) => ({ ...e, [id]: previo }))
          setRechazos((r) => r.filter((x) => x.id !== id))
          setAviso(null)
        },
      },
      'inquilinos',
    )
  }
  const confirmarVisita = (v) => {
    setConfirmadas((c) => ({ ...c, [v.id]: true }))
    avisar(`Visita confirmada. Le avisamos a ${v.corto || v.nombre.split(' ')[0]}.`)
  }
  const recordar = (e) => {
    setRecordados((r) => [...r, e.id])
    avisar(`Le recordamos a ${e.corto} el pago de ${e.vencido.mes}`)
  }
  const responder = (r, texto, cerrar) => {
    const e = ESTANCIAS.find((x) => x.id === r.estanciaId)
    setReportes((rs) => ({ ...rs, [r.id]: { ...rs[r.id], respuesta: texto, atendido: cerrar } }))
    avisar(cerrar ? `Reporte atendido. Le avisamos a ${e.corto}.` : `Le enviamos tu respuesta a ${e.corto}.`)
  }

  const esTab = ES_TAB.includes(pantalla)
  const props = { ir, avisar, solicitudes, visitas, estancias: ESTANCIAS, totalCobro }

  const solicitud = solicitudes.find((s) => s.id === sub) || solicitudes[0]
  const estancia = ESTANCIAS.find((e) => e.id === sub) || ESTANCIAS[0]
  const reporte = reportes[sub] || reportes.ducha

  const contenido = {
    inicio: <Panel {...props} inquilinas={ESTANCIAS.length} />,
    inquilinos: <Inquilinos {...props} seg={sub} historial={historial} confirmarVisita={confirmarVisita} />,
    quads: <Pronto titulo="Mis quads" texto="Aquí vas a administrar tus quads publicados. Esta sección se programa en la siguiente parte del Figma (Anfitrión · Mis quads)." />,
    mensajes: <Pronto titulo="Mensajes" texto="Tus conversaciones con estudiantes. Esta sección se programa en la siguiente parte del Figma (Anfitrión · Mensajes)." />,
    perfil: (
      <Pronto titulo="Perfil" texto="Tu perfil de anfitriona, cobros y verificación. Esta sección se programa en la siguiente parte del Figma (Anfitrión · Perfil).">
        <div className="hs-soon__actions">
          <Button variant="outline" onClick={onEstudiante}>
            Cambiar a modo estudiante
          </Button>
          <button type="button" className="logout" onClick={onCerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </Pronto>
    ),
    solicitud: <Solicitud key={solicitud.id} s={solicitud} aceptar={aceptar} rechazar={rechazar} avisar={avisar} />,
    estancia: <Estancia e={estancia} reportes={reportes} recordado={recordados.includes(estancia.id)} recordar={recordar} ir={ir} />,
    reporte: <Reporte r={reporte} e={ESTANCIAS.find((x) => x.id === reporte.estanciaId)} responder={responder} />,
  }

  return (
    <div className="screen home host">
      <div className="home__status">
        <StatusBar />
        <div className="safe-top" />
      </div>

      <div className="home__stage">
        <AnimatePresence initial={false} custom={{ apilada: !esTab || !ES_TAB.includes(previa), dir }}>
          <motion.div key={pantalla} className="screen-layer" custom={{ apilada: !esTab, dir }} variants={variantes} initial="enter" animate="center" exit="exit">
            {contenido[pantalla] || contenido.inicio}
          </motion.div>
        </AnimatePresence>
      </div>

      <Aviso aviso={aviso && aviso.en === pantalla ? aviso : null} arriba={pantalla === 'estancia'} />

      <AnimatePresence>
        {esTab && (
          <motion.div key="fade" className="home__fade" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {esTab && (
          <motion.div
            className="home__dock home__dock--host"
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          >
            <Navegacion tabs={TABS} activo={pantalla} onChange={cambiarTab} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

