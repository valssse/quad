import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Icon from '../../components/Icon.jsx'
import Button from '../../components/Button.jsx'
import { fadeUp, stagger } from '../../components/motion.js'
import { RESPUESTAS_RAPIDAS, RESPUESTA_SUGERIDA } from '../../data/host.js'
import Switch from '../../components/Switch.jsx'
import { Avatar, Badge, Cabecera, Datos, Estado, Hoja, Tarjeta } from './ui.jsx'

const ICONO_PAGO = { pagado: 'green', proximo: 'gray', vencido: 'amber' }

/** H19 · Detalle de estancia (H19b con pago pendiente, H19c con recordatorio enviado). */
export function Estancia({ e, reportes, recordado, recordar, ir }) {
  const lista = e.reportes.map((id) => reportes[id])
  return (
    <div className="home-screen hs hs--stack">
      <Cabecera titulo="Estancia" />

      <motion.div className="home-scroll hs-detail hs-detail--gap16" variants={stagger} initial="hidden" animate="show">
        <motion.div variants={fadeUp}>
          <Tarjeta className="hs-tenant">
            <div className="hs-tenant__person">
              <Avatar iniciales={e.iniciales} size={56} />
              <span className="hs-tenant__text">
                <b>{e.nombre}</b>
                <span className="hs-badges">
                  <Badge icon="uca">
                    <span className="hs-badge__dark">{e.carrera} · UCA</span>
                  </Badge>
                  <Estado id={e.alDia ? 'alDia' : 'pendiente'} />
                </span>
              </span>
            </div>
            <div className="hs-tenant__actions">
              <motion.button type="button" className="hs-btn-soft" whileTap={{ scale: 0.97 }}>
                Escribir
              </motion.button>
              <motion.button type="button" className="hs-btn-soft" whileTap={{ scale: 0.97 }}>
                Ver perfil
              </motion.button>
            </div>
          </Tarjeta>
        </motion.div>

        {e.vencido && (
          <motion.div className="hs-alert" variants={fadeUp}>
            <div className="hs-alert__text">
              <Icon name="clock-fill" size={20} />
              <span>
                <b>{e.vencido.titulo}</b>
                <small>{e.vencido.texto}</small>
              </span>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              {recordado ? (
                <motion.span key="hecho" className="hs-btn-soft hs-btn-soft--full" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
                  Recordatorio enviado hoy
                </motion.span>
              ) : (
                <motion.button key="btn" type="button" className="hs-small-btn hs-small-btn--full" exit={{ opacity: 0 }} whileTap={{ scale: 0.98 }} onClick={() => recordar(e)}>
                  Enviar recordatorio
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        <motion.div variants={fadeUp}>
          <Tarjeta className="hs-box">
            <div className="hs-box__head">
              <h2>Contrato</h2>
              <button type="button" className="hs-link">
                Ver PDF
              </button>
            </div>
            <div className="hs-progress">
              <span className="hs-progress__track">
                <motion.span className="hs-progress__fill" initial={{ scaleX: 0 }} animate={{ scaleX: e.avance }} transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} />
              </span>
              <small>Termina en {e.termina} días</small>
            </div>
            <Datos filas={e.datos} />
          </Tarjeta>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Tarjeta className="hs-box">
            <div className="hs-box__head">
              <h2>Pagos</h2>
              <button type="button" className="hs-link">
                Ver todos
              </button>
            </div>
            {e.pagos.map((p, i) => (
              <div key={p.mes} className={`hs-row ${i ? 'hs-row--line' : ''}`}>
                <span className={`hs-row__icon hs-row__icon--${ICONO_PAGO[p.estado]}`}>
                  <Icon name="dollar-circle-fill" size={22} />
                </span>
                <span className="hs-row__text">
                  <b>{p.mes}</b>
                  <small>{p.texto}</small>
                </span>
                <Estado id={p.estado} />
              </div>
            ))}
          </Tarjeta>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Tarjeta className={`hs-box ${lista.length ? '' : 'hs-box--empty'}`}>
            <div className="hs-box__head">
              <h2>Reportes{lista.length ? ` · ${lista.length}` : ''}</h2>
            </div>
            {lista.length ? (
              lista.map((r, i) => (
                <motion.button key={r.id} type="button" className={`hs-row hs-row--btn ${i ? 'hs-row--line' : ''}`} whileTap={{ scale: 0.98 }} onClick={() => ir('reporte', r.id)}>
                  <span className={`hs-row__icon hs-row__icon--${r.atendido ? 'green' : 'amber'}`}>
                    <Icon name="info-circle-fill" size={22} />
                  </span>
                  <span className="hs-row__text">
                    <b>{r.titulo}</b>
                    <small>
                      {r.tipo} · {r.fecha}
                    </small>
                  </span>
                  <Estado id={r.atendido ? 'atendido' : 'abierto'} />
                </motion.button>
              ))
            ) : (
              <p className="hs-box__empty">{e.corto} no ha enviado reportes.</p>
            )}
          </Tarjeta>
        </motion.div>
      </motion.div>
    </div>
  )
}

/** H21 · Hoja para responder un reporte. */
function HojaResponder({ abierta, nombre, onClose, onEnviar }) {
  const [texto, setTexto] = useState(RESPUESTA_SUGERIDA)
  const [cerrar, setCerrar] = useState(true)
  return (
    <Hoja abierta={abierta} onClose={onClose} etiqueta={`Responder a ${nombre}`}>
      <div className="ch-sheet__head">
        <h2>Responder a {nombre}</h2>
        <p>Tu respuesta le llega por el chat y queda en el reporte.</p>
      </div>
      <div className="hs-quick">
        {RESPUESTAS_RAPIDAS.map((q) => (
          <motion.button key={q} type="button" whileTap={{ scale: 0.95 }} onClick={() => setTexto(`Hola, ${nombre}. ${q}.`.replace('?.', '?'))}>
            {q}
          </motion.button>
        ))}
      </div>
      <textarea className="textarea" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder={`Escribe tu respuesta para ${nombre}`} maxLength={400} />
      <label className="hs-switch-row">
        <Icon name="check-circle-fill" size={22} className={cerrar ? 'hs-green' : 'hs-muted'} />
        <span>
          <b>Marcar como atendido</b>
          <small>Cierra el reporte y le avisa a {nombre}</small>
        </span>
        <Switch checked={cerrar} onChange={setCerrar} label="Marcar como atendido" />
      </label>
      <Button disabled={!texto.trim()} onClick={() => onEnviar(texto.trim(), cerrar)}>
        Enviar respuesta
      </Button>
    </Hoja>
  )
}

/** H20 · Reporte del inquilino (H21 hoja · H22 atendido). */
export function Reporte({ r, e, responder }) {
  const [hoja, setHoja] = useState(false)
  const pasos = [
    ...r.pasos.map((p) => ({ ...p, hecho: true })),
    r.atendido ? { titulo: 'Atendido', fecha: r.cierre, hecho: true } : { titulo: 'Atendido', fecha: 'Responde para cerrar el reporte', hecho: false },
  ]

  return (
    <div className="home-screen hs hs--stack">
      <Cabecera titulo="Reporte" />

      <motion.div className="home-scroll hs-detail hs-detail--gap16" variants={stagger} initial="hidden" animate="show">
        <motion.div className="hs-badges" variants={fadeUp}>
          <Estado id={r.atendido ? 'atendido' : 'abierto'} />
          <Badge icon="home-solid">{r.tipo}</Badge>
        </motion.div>
        <motion.div className="hs-report__head" variants={fadeUp}>
          <h1>{r.titulo}</h1>
          <small>{r.meta}</small>
        </motion.div>
        <motion.p className="hs-bubble" variants={fadeUp}>
          {r.texto}
        </motion.p>
        {r.fotos.length > 0 && (
          <motion.div className="hs-photos" variants={fadeUp}>
            {r.fotos.map((f) => (
              <img key={f} src={f} alt="" />
            ))}
          </motion.div>
        )}
        <AnimatePresence initial={false}>
          {r.respuesta && (
            <motion.section className="hs-section" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}>
              <h2>Tu respuesta</h2>
              <p className="hs-bubble hs-bubble--blue">{r.respuesta}</p>
            </motion.section>
          )}
        </AnimatePresence>
        <motion.section className="hs-section hs-steps" variants={fadeUp}>
          <h2>Seguimiento</h2>
          {pasos.map((p) => (
            <div key={p.titulo} className={`hs-step ${p.hecho ? '' : 'hs-step--wait'}`}>
              <Icon name={p.hecho ? 'check-circle-fill' : 'clock-fill'} size={20} />
              <span>
                <b>{p.titulo}</b>
                <small>{p.fecha}</small>
              </span>
            </div>
          ))}
        </motion.section>
      </motion.div>

      <div className="hs-bar">
        <Button variant="outline">Escribir a {e.corto}</Button>
        {!r.atendido && <Button onClick={() => setHoja(true)}>Responder</Button>}
      </div>

      <HojaResponder
        abierta={hoja}
        nombre={e.corto}
        onClose={() => setHoja(false)}
        onEnviar={(texto, cerrar) => {
          setHoja(false)
          responder(r, texto, cerrar)
        }}
      />
    </div>
  )
}
