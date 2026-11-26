import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Icon from '../../components/Icon.jsx'
import Iniciales from '../../components/Iniciales.jsx'
import { fadeUp, stagger } from '../../components/motion.js'
import { BotonIcono } from './ui.jsx'
import { quad as buscarQuad } from '../../data/quads.js'
import { detalle } from '../../data/detalle.js'
import { ESTADOS_SOLICITUD, haceCuanto } from '../../data/solicitudes.js'

/** Re-renderiza cada cierto tiempo para que "hace X" avance. */
function useAhora(ms = 30000) {
  const [ahora, setAhora] = useState(() => Date.now())
  useEffect(() => {
    const t = setInterval(() => setAhora(Date.now()), ms)
    return () => clearInterval(t)
  }, [ms])
  return ahora
}

/** Card de una solicitud en el carrusel de Inicio. */
export function TarjetaSolicitud({ solicitud, solo, onOpen }) {
  const q = buscarQuad(solicitud.quadId)
  const ahora = useAhora()
  const est = ESTADOS_SOLICITUD[solicitud.estado]
  return (
    <motion.article
      className={`quad-card req-card ${solo ? 'req-card--solo' : ''}`}
      variants={fadeUp}
      whileTap={{ scale: 0.985 }}
      onClick={onOpen}
    >
      <img className="quad-card__img" src={q.foto} alt="" loading="lazy" draggable="false" />
      <span className="quad-card__shade" />
      <div className="quad-card__bottom">
        <div className="quad-card__info">
          <h3>{q.titulo}</h3>
          <span className="meta-row meta-row--sm">
            <Icon name="map-pin-fill" size={13} />
            <span>{q.zona}</span>
          </span>
          <span className="meta-row meta-row--sm meta-row--medium">
            <Icon name="send-fill" size={14} />
            <span>Solicitud enviada {haceCuanto(solicitud.enviadaEn, ahora)}</span>
          </span>
          <span className={`req-status req-status--${est.tono}`}>
            <Icon name={est.icon === 'check-circle-fill' ? 'check-circle' : est.icon} size={14} />
            {est.texto}
          </span>
        </div>
      </div>
    </motion.article>
  )
}

/** Barra superior de pantallas apiladas: atrás + título. */
export function BarraPagina({ titulo, derecha }) {
  return (
    <div className="page-bar">
      <BotonIcono icon="nav-arrow-left" size={40} label="Atrás" className="icon-btn--plain" onClick={() => window.history.back()} />
      <h1>{titulo}</h1>
      {derecha}
    </div>
  )
}

/** Listado de solicitudes activas ("Ver todo" en Inicio). */
export function Solicitudes({ solicitudes, abrirSolicitud }) {
  const ahora = useAhora()
  return (
    <div className="home-screen">
      <BarraPagina titulo="Solicitudes activas" />
      <hr className="home-divider home-divider--top" />
      <motion.div className="home-scroll home-scroll--flat" variants={stagger} initial="hidden" animate="show">
        <motion.p className="req-count" variants={fadeUp}>
          {solicitudes.length === 1 ? '1 solicitud en curso' : `${solicitudes.length} solicitudes en curso`}
        </motion.p>
        <div className="row-list req-list">
          <AnimatePresence initial={false} mode="popLayout">
            {solicitudes.map((s) => {
              const q = buscarQuad(s.quadId)
              const est = ESTADOS_SOLICITUD[s.estado]
              const a = detalle(q).anfitrion
              return (
                <motion.article key={s.quadId} layout className="quad-row req-row" variants={fadeUp} whileTap={{ scale: 0.99 }} onClick={() => abrirSolicitud(s)}>
                  <img className="quad-row__img" src={q.foto} alt="" loading="lazy" draggable="false" />
                  <div className="quad-row__info">
                    <h3>{q.titulo}</h3>
                    <span className="meta-row">
                      <Icon name="map-pin-fill" size={14} />
                      <span>{q.zona} · {a.corto}</span>
                    </span>
                    <span className="meta-row">
                      <Icon name="send-fill" size={14} />
                      <span>Enviada {haceCuanto(s.enviadaEn, ahora)}</span>
                    </span>
                    <span className={`req-status req-status--${est.tono}`}>
                      <Icon name={est.icon} size={13} />
                      {est.corto}
                    </span>
                  </div>
                  <Icon name="nav-arrow-right" size={18} className="req-row__go" />
                </motion.article>
              )
            })}
          </AnimatePresence>
          {solicitudes.length === 0 && <p className="home-empty">No tienes solicitudes activas.</p>}
        </div>
      </motion.div>
    </div>
  )
}

/** Pantalla de notificaciones (campana de Inicio). */
export function Notificaciones({ notis, abrirNoti, marcarLeidas }) {
  // Lo que estaba sin leer al entrar queda en "Nuevas" aunque se marque como leído
  const [nuevas] = useState(() => notis.filter((n) => !n.leida).map((n) => n.id))
  useEffect(() => {
    const t = setTimeout(marcarLeidas, 1200)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const grupos = [
    { titulo: 'Nuevas', lista: notis.filter((n) => nuevas.includes(n.id)) },
    { titulo: 'Anteriores', lista: notis.filter((n) => !nuevas.includes(n.id)) },
  ].filter((g) => g.lista.length)

  return (
    <div className="home-screen">
      <BarraPagina titulo="Notificaciones" />
      <hr className="home-divider home-divider--top" />
      <motion.div className="home-scroll home-scroll--flat" variants={stagger} initial="hidden" animate="show">
        {grupos.map((g) => (
          <motion.section key={g.titulo} className="noti-group" variants={fadeUp}>
            <h2>{g.titulo}</h2>
            <div className="chat-list">
              {g.lista.map((n) => (
                <button key={n.id} type="button" className={`noti-row ${nuevas.includes(n.id) ? 'noti-row--new' : ''}`} onClick={() => abrirNoti(n)}>
                  <span className={`noti-row__avatar ${n.foto ? '' : 'noti-row__avatar--icon'}`}>
                    {n.foto ? <img src={n.foto} alt="" /> : n.nombre ? <Iniciales nombre={n.nombre} style={{ fontSize: 16 }} /> : <Icon name={n.icon || 'bell'} size={22} />}
                  </span>
                  <span className="noti-row__body">
                    <span className="noti-row__text">{n.texto}</span>
                    <small>{n.hace}</small>
                  </span>
                  {nuevas.includes(n.id) && <span className="noti-row__dot" />}
                </button>
              ))}
            </div>
          </motion.section>
        ))}
        {grupos.length === 0 && <p className="home-empty">No tienes notificaciones.</p>}
      </motion.div>
    </div>
  )
}
