import { AnimatePresence, motion } from 'motion/react'
import Icon from '../../components/Icon.jsx'
import { fadeUp, stagger } from '../../components/motion.js'
import { Avatar, Estado, Tarjeta } from './ui.jsx'

const SEGMENTOS = [
  { id: 'solicitudes', label: 'Solicitudes' },
  { id: 'visitas', label: 'Visitas' },
  { id: 'estancias', label: 'Estancias' },
  { id: 'historial', label: 'Historial' },
]

const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`

function Segmentado({ activo, onChange }) {
  return (
    <div className="hs-seg" role="tablist">
      {SEGMENTOS.map((s) => (
        <button key={s.id} type="button" role="tab" aria-selected={s.id === activo} className={`hs-seg__tab ${s.id === activo ? 'hs-seg__tab--on' : ''}`} onClick={() => onChange(s.id)}>
          {s.id === activo && <motion.span layoutId="hs-seg" className="hs-seg__pill" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
          <span>{s.label}</span>
        </button>
      ))}
    </div>
  )
}

/* H10 · Solicitudes */
function Solicitudes({ solicitudes, ir }) {
  const visibles = solicitudes.filter((s) => s.estado !== 'rechazada')
  if (!visibles.length) return <p className="hs-empty">No tienes solicitudes por ahora.</p>
  return (
    <AnimatePresence initial={false}>
      {visibles.map((s) => (
        <motion.button
          key={s.id}
          type="button"
          className="hs-card hs-req"
          layout
          variants={fadeUp}
          exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
          onClick={() => ir('solicitud', s.id)}
        >
          <span className="hs-person">
            <Avatar foto={s.foto} iniciales={s.iniciales} />
            <span className="hs-person__text">
              <b>{s.nombre}</b>
              <small>
                {s.carrera} · UCA
              </small>
            </span>
            <Estado id={s.estado} />
          </span>
          <span className="hs-meta">
            <span>
              <Icon name="calendar-fill" size={14} />
              Entra {s.entra}
            </span>
            <span>
              <Icon name="clock-fill" size={14} />
              {s.duracionCorta}
            </span>
            <span>
              <Icon name="bed-fill" size={14} />
              {s.quadCorto}
            </span>
          </span>
          <span className="hs-quote">“{s.extracto}”</span>
        </motion.button>
      ))}
    </AnimatePresence>
  )
}

/* H15 · Visitas */
function Visitas({ visitas, confirmar }) {
  let dia = null
  return visitas.map((v) => {
    const titulo = v.dia !== dia ? v.dia : null
    dia = v.dia
    return (
      <motion.div key={v.id} className="hs-group" variants={fadeUp}>
        {titulo && <p className="hs-group__label">{titulo}</p>}
        <Tarjeta className="hs-visit">
          <span className="hs-visit__time">
            <b>{v.hora}</b>
            <small>{v.ampm}</small>
          </span>
          <span className="hs-visit__line" />
          <span className="hs-visit__text">
            <b>{v.nombre}</b>
            <small>{v.quad}</small>
            <em className={v.confirmada ? 'hs-green' : 'hs-amber'}>{v.confirmada ? 'Confirmada' : 'Propuso esta fecha'}</em>
          </span>
          <AnimatePresence mode="popLayout" initial={false}>
            {v.confirmada ? (
              <motion.span key="ok" className="hs-visit__ok" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 22 }}>
                <Icon name="check-circle-fill" size={20} />
              </motion.span>
            ) : (
              <motion.button key="btn" type="button" className="hs-small-btn" exit={{ opacity: 0, scale: 0.9 }} whileTap={{ scale: 0.95 }} onClick={() => confirmar(v)}>
                Confirmar
              </motion.button>
            )}
          </AnimatePresence>
        </Tarjeta>
      </motion.div>
    )
  })
}

/* H17 · Estancias */
function Estancias({ estancias, ir }) {
  return estancias.map((e) => (
    <motion.button key={e.id} type="button" className="hs-card hs-stay" variants={fadeUp} whileTap={{ scale: 0.98 }} onClick={() => ir('estancia', e.id)}>
      <span className="hs-person">
        <Avatar iniciales={e.iniciales} />
        <span className="hs-person__text">
          <b>{e.nombre}</b>
          <small>{e.quad}</small>
        </span>
        <Icon name="nav-arrow-right" size={18} className="hs-chevron" />
      </span>
      <span className="hs-divider" />
      <span className="hs-meta">
        <span>
          <Icon name="calendar-fill" size={14} />
          {e.contratoCorto}
        </span>
      </span>
      <span className="hs-stay__pay">
        <Icon name="dollar-circle-fill" size={16} />
        <b>{e.pagoTexto}</b>
        <Estado id={e.alDia ? 'alDia' : 'pendiente'} />
      </span>
    </motion.button>
  ))
}

/* H18 · Historial */
function Historial({ historial }) {
  return historial.map((g) => (
    <motion.div key={g.mes} className="hs-group" variants={fadeUp}>
      <p className="hs-group__label">{g.mes}</p>
      {g.items.map((h) => (
        <Tarjeta key={h.titulo} className="hs-hist">
          <span className={`hs-hist__icon hs-hist__icon--${h.tono}`}>
            <Icon name={h.icon} size={20} />
          </span>
          <span className="hs-hist__text">
            <b>{h.titulo}</b>
            <small>{h.texto}</small>
          </span>
          <span className="hs-hist__date">{h.fecha}</span>
        </Tarjeta>
      ))}
    </motion.div>
  ))
}

/** H10 / H15 / H17 / H18 · Inquilinos (con segmentado). */
export default function Inquilinos({ seg = 'solicitudes', ir, solicitudes, visitas, estancias, historial, confirmarVisita, totalCobro }) {
  const nuevas = solicitudes.filter((s) => s.estado === 'nueva').length
  const porConfirmar = visitas.filter((v) => !v.confirmada).length
  const subtitulo = {
    solicitudes: [nuevas ? plural(nuevas, 'solicitud nueva', 'solicitudes nuevas') : 'Sin solicitudes nuevas', porConfirmar ? plural(porConfirmar, 'visita por confirmar', 'visitas por confirmar') : null].filter(Boolean).join(' · '),
    visitas: porConfirmar ? `${plural(porConfirmar, 'visita por confirmar', 'visitas por confirmar')} esta semana` : 'Todas tus visitas están confirmadas',
    estancias: `${plural(estancias.length, 'inquilina', 'inquilinas')} · $${totalCobro} al mes`,
    historial: 'Lo que ya pasó en tu casa',
  }[seg]

  const listas = {
    solicitudes: <Solicitudes solicitudes={solicitudes} ir={ir} />,
    visitas: <Visitas visitas={visitas} confirmar={confirmarVisita} />,
    estancias: <Estancias estancias={estancias} ir={ir} />,
    historial: <Historial historial={historial} />,
  }

  return (
    <div className="home-screen hs">
      <div className="hs-tenants__head">
        <div className="hs-title">
          <h1>Inquilinos</h1>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p key={subtitulo} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }}>
              {subtitulo}
            </motion.p>
          </AnimatePresence>
        </div>
        <Segmentado activo={seg} onChange={(id) => ir('inquilinos', id, { replace: true })} />
      </div>

      <motion.div key={seg} className="home-scroll hs-tenants__list" variants={stagger} initial="hidden" animate="show">
        {listas[seg]}
      </motion.div>
    </div>
  )
}
