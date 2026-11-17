import { motion } from 'motion/react'
import Icon from '../../components/Icon.jsx'
import { fadeUp, stagger } from '../../components/motion.js'
import { ANFITRIONA, BANNER_FOTO, MIS_QUADS, SEMANA } from '../../data/host.js'
import { Avatar, Estado } from './ui.jsx'

const toque = { whileTap: { scale: 0.98 } }

function saludo() {
  const h = new Date().getHours()
  return h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches'
}

/** H01 · Panel del anfitrión. */
export default function Panel({ ir, solicitudes, visitas, totalCobro, inquilinas }) {
  const nuevas = solicitudes.filter((s) => s.estado === 'nueva')
  const hoy = visitas.filter((v) => v.hoy)
  const pendientes = [
    ...nuevas.map((s) => ({ tipo: 'solicitud', s })),
    ...hoy.map((v) => ({ tipo: 'visita', v })),
  ]

  return (
    <div className="home-screen hs">
      <motion.div className="home-scroll hs-panel" variants={stagger} initial="hidden" animate="show">
        <motion.header className="hs-hello" variants={fadeUp}>
          <img src={ANFITRIONA.foto} alt="" className="hs-hello__avatar" />
          <span className="hs-hello__text">
            <small>
              {saludo()}, {ANFITRIONA.nombre}
            </small>
            <b>Tu casa en {ANFITRIONA.casa}</b>
          </span>
          <motion.button type="button" className="hs-bell" aria-label="Notificaciones" whileTap={{ scale: 0.9 }}>
            <Icon name="bell" size={22} />
            <span className="hs-bell__dot" />
          </motion.button>
        </motion.header>

        <motion.section className="hs-cobro" variants={fadeUp}>
          <p className="hs-cobro__label">Por cobrar en diciembre</p>
          <p className="hs-cobro__total">${totalCobro}</p>
          <div className="hs-cobro__datos">
            <span>
              <Icon name="group-fill" size={16} />
              {inquilinas} inquilinas
            </span>
            <span>
              <Icon name="calendar-fill" size={16} />
              Próximo pago: 1 de dic
            </span>
          </div>
          <span className="hs-cobro__line" />
          <motion.button type="button" className="hs-cobro__link" {...toque} onClick={() => ir('inquilinos', 'estancias')}>
            Ver cobros y retiros
            <Icon name="nav-arrow-right" size={16} />
          </motion.button>
        </motion.section>

        <motion.section className="hs-block" variants={fadeUp}>
          <div className="hs-block__head">
            <h2>Esta semana</h2>
            <small>{SEMANA.rango}</small>
          </div>
          <div className="hs-metrics">
            {SEMANA.metricas.map((m) => (
              <div key={m.label} className="hs-metric">
                <b>{m.valor}</b>
                <span>{m.label}</span>
                <em className={`hs-metric__delta hs-metric__delta--${m.tono}`}>{m.delta}</em>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section className="hs-banner" variants={fadeUp} style={{ backgroundImage: `url(${BANNER_FOTO})` }}>
          <span className="hs-banner__tag">
            <Icon name="star-fill" size={14} />
            Quad destacado
          </span>
          <div className="hs-banner__text">
            <h2>Destaca tu quad</h2>
            <p>Aparece primero en Explorar y recibe hasta 3× más visitas.</p>
            <motion.button type="button" className="hs-banner__btn" {...toque}>
              Ver planes
              <Icon name="nav-arrow-right" size={16} />
            </motion.button>
          </div>
        </motion.section>

        {pendientes.length > 0 && (
          <motion.section className="hs-block" variants={fadeUp}>
            <div className="hs-block__head hs-block__head--start">
              <h2>Pendientes</h2>
              <span className="hs-count">{pendientes.length}</span>
            </div>
            <div className="hs-list">
              {pendientes.map((p) =>
                p.tipo === 'solicitud' ? (
                  <motion.button key={`s-${p.s.id}`} type="button" className="hs-pend" {...toque} onClick={() => ir('solicitud', p.s.id)}>
                    <Avatar foto={p.s.foto} iniciales={p.s.iniciales} size={44} />
                    <span className="hs-pend__text">
                      <small>Solicitud nueva</small>
                      <b>{p.s.nombre}</b>
                      <span>{p.s.pendiente}</span>
                    </span>
                    <Icon name="nav-arrow-right" size={18} className="hs-chevron" />
                  </motion.button>
                ) : (
                  <motion.button key={`v-${p.v.id}`} type="button" className="hs-pend" {...toque} onClick={() => ir('inquilinos', 'visitas')}>
                    <span className="hs-pend__icon">
                      <Icon name="calendar-fill" size={22} />
                    </span>
                    <span className="hs-pend__text">
                      <small>Visita de hoy</small>
                      <b>
                        {p.v.nombre} · {p.v.hora} {p.v.ampm}
                      </b>
                      <span>Viene a conocer el {p.v.quad.charAt(0).toLowerCase() + p.v.quad.slice(1)}</span>
                    </span>
                    <Icon name="nav-arrow-right" size={18} className="hs-chevron" />
                  </motion.button>
                ),
              )}
            </div>
          </motion.section>
        )}

        <motion.section className="hs-block hs-block--bleed" variants={fadeUp}>
          <div className="hs-block__head">
            <div className="hs-block__head hs-block__head--start">
              <h2>Mis quads</h2>
              <span className="hs-count">{MIS_QUADS.length}</span>
            </div>
            <motion.button type="button" className="hs-link" {...toque} onClick={() => ir('quads')}>
              Ver todo
              <Icon name="nav-arrow-right" size={16} />
            </motion.button>
          </div>
          <div className="hs-carousel">
            {MIS_QUADS.map((q) => (
              <motion.article key={q.id} className="hs-quad" {...toque}>
                <img src={q.foto} alt="" />
                <div className="hs-quad__info">
                  <Estado id={q.estado} />
                  <p className="hs-quad__title">{q.titulo}</p>
                  <p className="hs-quad__price">
                    ${q.precio}
                    <small>/mes</small>
                  </p>
                  {q.datos && (
                    <p className="hs-quad__meta">
                      <Icon name={q.estado === 'pausado' ? 'clock-fill' : 'eye'} size={14} />
                      {q.datos}
                    </p>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.button type="button" className="hs-publish" variants={fadeUp} {...toque} onClick={() => ir('publicar')}>
          <Icon name="bed-fill" size={20} />
          Publicar un quad nuevo
        </motion.button>
      </motion.div>
    </div>
  )
}
