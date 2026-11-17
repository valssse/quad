import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import StatusBar from '../../components/StatusBar.jsx'
import { ease } from '../../components/motion.js'
import { Navegacion } from '../home/HomeShell.jsx'
import Panel from './Panel.jsx'
import Inquilinos from './Inquilinos.jsx'
import Solicitud from './Solicitud.jsx'
import { Estancia, Reporte } from './Estancia.jsx'
import { Aviso } from './ui.jsx'
import { Destacar, EditarQuad, MisQuads, Pagar } from './MisQuads.jsx'
import { Cobros, EditarCasa, PerfilHost, Resenas, Verificacion } from './PerfilHost.jsx'
import { PerfilCasa } from '../home/Detalle.jsx'
import Skeleton from '../../components/Skeleton.jsx'
import { ChatHost, MensajesHost } from './MensajesHost.jsx'
import { ESTANCIAS, HISTORIAL, MASCOTAS_CASA, MIS_QUADS, MOVIMIENTOS, PERSONAS_CASA, RESPUESTAS_GUARDADAS, REPORTES, SOLICITUDES, TARJETA, VISITAS } from '../../data/host.js'
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
const NIVEL = { chat: 1, solicitud: 1, estancia: 1, reporte: 2, 'editar-quad': 1, destacar: 1, pagar: 2, casa: 1, 'editar-casa': 2, cobros: 1, verificacion: 1, resenas: 1 }

const variantes = {
  enter: ({ apilada, dir }) => (apilada ? { opacity: 0, x: dir >= 0 ? 32 : -32 } : { opacity: 0, y: 6 }),
  center: { opacity: 1, x: 0, y: 0, transition: { duration: 0.36, ease } },
  exit: ({ apilada, dir }) => ({ opacity: 0, x: apilada ? (dir >= 0 ? -24 : 24) : 0, transition: { duration: 0.18, ease } }),
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
  const [quads, setQuads] = useState(MIS_QUADS)
  const [plan, setPlan] = useState(1)
  const [saldo, setSaldo] = useState(230)
  const [movimientos, setMovimientos] = useState(MOVIMIENTOS)
  const [casa, setCasa] = useState({ personas: PERSONAS_CASA, mascotas: MASCOTAS_CASA })
  const [casaVersion, setCasaVersion] = useState(0)
  const [leidas, setLeidas] = useState([])
  const [ultimos, setUltimos] = useState({})
  const [bloqueados, setBloqueados] = useState([])
  const [guardadas, setGuardadas] = useState(RESPUESTAS_GUARDADAS)

  // Skeleton de referencia al entrar
  const [cargando, setCargando] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setCargando(false), 1400)
    return () => clearTimeout(t)
  }, [])

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

  /* ---------- Mis quads ---------- */
  const cambiarQuad = (id, cambios) => setQuads((qs) => qs.map((x) => (x.id === id ? { ...x, ...cambios } : x)))
  const pausar = (q) => {
    const previo = { estado: q.estado, datos: q.datos }
    cambiarQuad(q.id, { estado: 'pausado', datos: 'Pausado hoy' })
    avisar('Pausaste el quad. Ya no aparece en Explorar.', {
      label: 'Deshacer',
      fn: () => {
        cambiarQuad(q.id, previo)
        setAviso(null)
      },
    })
  }
  const reactivar = (q) => {
    cambiarQuad(q.id, { estado: 'publicado', datos: '0 vistas · 0 solicitudes' })
    avisar('Reactivaste el quad. Ya aparece en Explorar.')
  }
  const eliminar = (q) => {
    const idx = quads.findIndex((x) => x.id === q.id)
    setQuads((qs) => qs.filter((x) => x.id !== q.id))
    avisar('Eliminaste el quad.', {
      label: 'Deshacer',
      fn: () => {
        setQuads((qs) => [...qs.slice(0, idx), q, ...qs.slice(idx)])
        setAviso(null)
      },
    })
  }
  const pagarDestacado = (q, p, fechas) => {
    cambiarQuad(q.id, { destacado: true })
    setMovimientos((m) => [{ icon: 'star-fill', tono: 'gray', titulo: `Quad destacado · ${p.dias} días`, texto: `${fechas.split(' –')[0]} · ${TARJETA.corta}`, monto: -p.precio }, ...m])
  }
  const retirar = () => {
    setMovimientos((m) => [{ icon: 'dollar-circle-fill', tono: 'gray', titulo: 'Retiro a Banco Agrícola', texto: 'Hoy · en camino', monto: -saldo }, ...m])
    setSaldo(0)
  }

  /* ---------- Mensajes ---------- */
  const actualizarUltimo = (id, ultimo) => setUltimos((u) => ({ ...u, [id]: { ultimo } }))
  const bloquear = (c) => {
    setBloqueados((b) => [...b, c.id])
    navigate('host/mensajes', { replace: true })
    avisar(
      `Bloqueaste a ${c.corto}. Ya no podrá escribirte.`,
      {
        label: 'Deshacer',
        fn: () => {
          setBloqueados((b) => b.filter((x) => x !== c.id))
          setAviso(null)
        },
      },
      'mensajes',
    )
  }

  const esTab = ES_TAB.includes(pantalla)
  const props = { ir, avisar, solicitudes, visitas, estancias: ESTANCIAS, totalCobro }

  const solicitud = solicitudes.find((s) => s.id === sub) || solicitudes[0]
  const estancia = ESTANCIAS.find((e) => e.id === sub) || ESTANCIAS[0]
  const reporte = reportes[sub] || reportes.ducha
  const quad = quads.find((q) => q.id === sub) || quads[0] || MIS_QUADS[0]

  const contenido = {
    inicio: <Panel {...props} quads={quads} inquilinas={ESTANCIAS.length} />,
    inquilinos: <Inquilinos {...props} seg={sub} historial={historial} confirmarVisita={confirmarVisita} />,
    quads: <MisQuads {...props} quads={quads} pausar={pausar} reactivar={reactivar} eliminar={eliminar} />,
    mensajes: <MensajesHost {...props} leidas={leidas} marcarLeida={(id) => setLeidas((l) => (l.includes(id) ? l : [...l, id]))} ultimos={ultimos} bloqueados={bloqueados} />,
    chat: (
      <ChatHost
        key={sub}
        id={sub}
        ir={ir}
        guardadas={guardadas}
        crearGuardada={(r) => setGuardadas((g) => [...g, r])}
        confirmarVisita={(id) => setConfirmadas((c) => ({ ...c, [id]: true }))}
        visitaConfirmada={confirmadas.sofia}
        actualizarUltimo={actualizarUltimo}
        bloquear={bloquear}
        avisar={avisar}
      />
    ),
    perfil: <PerfilHost {...props} saldo={saldo} onEstudiante={onEstudiante} onCerrarSesion={onCerrarSesion} />,
    'editar-quad': (
      <EditarQuad
        q={quad}
        agregarFoto={(q, f) => setQuads((qs) => qs.map((x) => (x.id === q.id ? { ...x, fotos: [...x.fotos, f] } : x)))}
        guardar={() => avisar('Cambios guardados. Ya se ven en tu quad.')}
        verComoEstudiante={() => navigate('app/quad/familia')}
      />
    ),
    destacar: <Destacar q={quad} plan={plan} setPlan={setPlan} ir={ir} />,
    pagar: <Pagar q={quad} plan={plan} pagar={pagarDestacado} irQuads={() => navigate('host/quads', { replace: true })} irInicio={() => navigate('host/inicio', { replace: true })} />,
    casa: (
      <PerfilCasa
        key={casaVersion}
        id="familia"
        ir={ir}
        anfitrion={{ verComoEstudiante: () => navigate('app/casa/familia'), editar: () => ir('editar-casa') }}
      />
    ),
    'editar-casa': (
      <EditarCasa
        casa={casa}
        guardar={(c) => {
          setCasa(c)
          setCasaVersion((v) => v + 1)
          window.history.back()
          avisar('Cambios guardados. Ya se ven en tu perfil.', null, 'casa')
        }}
      />
    ),
    cobros: <Cobros saldo={saldo} movimientos={movimientos} retirar={retirar} />,
    verificacion: <Verificacion />,
    resenas: <Resenas />,
    solicitud: <Solicitud key={solicitud.id} s={solicitud} aceptar={aceptar} rechazar={rechazar} avisar={avisar} />,
    estancia: <Estancia e={estancia} reportes={reportes} recordado={recordados.includes(estancia.id)} recordar={recordar} ir={ir} />,
    reporte: <Reporte r={reporte} e={ESTANCIAS.find((x) => x.id === reporte.estanciaId)} responder={responder} />,
  }

  return (
    <div className="screen home host">
      <div className={`home__status ${pantalla === 'chat' ? 'home__status--white' : ''}`}>
        <StatusBar />
        <div className="safe-top" />
      </div>

      <div className="home__stage">
        <AnimatePresence initial={false} custom={{ apilada: !esTab || !ES_TAB.includes(previa), dir }}>
          <motion.div key={pantalla} className="screen-layer" custom={{ apilada: !esTab, dir }} variants={variantes} initial="enter" animate="center" exit="exit">
            {contenido[pantalla] || contenido.inicio}
          </motion.div>
        </AnimatePresence>
        <AnimatePresence>{cargando && <Skeleton key="sk" tipo="anfitrion" />}</AnimatePresence>
      </div>

      <Aviso aviso={aviso && aviso.en === pantalla ? aviso : null} arriba={pantalla === 'estancia'} />

      <AnimatePresence>
        {esTab && (
          <motion.div key="fade" className={`home__fade home__fade--dark ${pantalla === 'inicio' ? 'home__fade--blur' : ''}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {esTab && !cargando && (
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

