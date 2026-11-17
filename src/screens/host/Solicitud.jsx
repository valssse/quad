import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Icon from '../../components/Icon.jsx'
import Button from '../../components/Button.jsx'
import { fadeUp, stagger } from '../../components/motion.js'
import { MOTIVOS_RECHAZO } from '../../data/host.js'
import { Avatar, Badge, Cabecera, Datos, Hoja, Tarjeta } from './ui.jsx'

/** H12 · Hoja para rechazar con motivo y mensaje opcional. */
function HojaRechazo({ abierta, s, onClose, onConfirmar }) {
  const [motivo, setMotivo] = useState(MOTIVOS_RECHAZO[1])
  const [mensaje, setMensaje] = useState('')
  return (
    <Hoja abierta={abierta} onClose={onClose} etiqueta="Rechazar solicitud">
      <div className="ch-sheet__head">
        <h2>¿Por qué rechazas la solicitud?</h2>
        <p>{s.corto} recibirá un mensaje amable. El motivo es solo para ti y nos ayuda a mejorar.</p>
      </div>
      <div className="hs-reasons" role="radiogroup">
        {MOTIVOS_RECHAZO.map((m) => {
          const on = m === motivo
          return (
            <motion.button key={m} type="button" role="radio" aria-checked={on} className={`hs-reason ${on ? 'hs-reason--on' : ''}`} whileTap={{ scale: 0.98 }} onClick={() => setMotivo(m)}>
              {m}
              <span className="hs-radio">
                <AnimatePresence>
                  {on && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 26 }}>
                      <Icon name="check" size={14} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </motion.button>
          )
        })}
      </div>
      <textarea className="textarea" placeholder={`Mensaje para ${s.corto} (opcional)`} value={mensaje} onChange={(e) => setMensaje(e.target.value)} maxLength={300} />
      <div className="hs-sheet__actions">
        <Button onClick={() => onConfirmar(motivo, mensaje)}>Rechazar solicitud</Button>
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </Hoja>
  )
}

/** H14 · Hoja de confirmación al aceptar. */
function HojaAceptada({ abierta, s, onClose, onContrato }) {
  return (
    <Hoja abierta={abierta} onClose={onClose} etiqueta="Solicitud aceptada" className="hs-sheet--center">
      <motion.span className="hs-success" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 320, damping: 18, delay: 0.12 }}>
        <Icon name="check-circle-fill" size={36} />
      </motion.span>
      <div className="ch-sheet__head">
        <h2>¡Aceptaste a {s.corto}!</h2>
        <p>Ya le avisamos. El siguiente paso es enviarle el contrato para que lo revise y lo firme desde la app.</p>
      </div>
      <div className="hs-sheet__actions">
        <Button onClick={onContrato}>Preparar contrato</Button>
        <Button variant="outline" onClick={onClose}>
          Escribirle a {s.corto}
        </Button>
      </div>
    </Hoja>
  )
}

/** H11 · Detalle de solicitud (y H12/H14 como hojas). */
export default function Solicitud({ s, aceptar, rechazar, avisar }) {
  const [hoja, setHoja] = useState(null)
  const coinciden = s.reglas.filter((r) => r.estado === 'ok').length
  const ojo = s.reglas.find((r) => r.estado !== 'ok')
  const nueva = s.estado === 'nueva'

  return (
    <div className="home-screen hs hs--stack">
      <Cabecera titulo="Solicitud" />

      <motion.div className="home-scroll hs-detail" variants={stagger} initial="hidden" animate="show">
        <motion.div className="hs-profile" variants={fadeUp}>
          <Avatar foto={s.foto} iniciales={s.iniciales} size={64} />
          <span className="hs-profile__text">
            <b>{s.nombre}</b>
            <small>
              {s.carrera} · {s.anio} · UCA
            </small>
            <small>De {s.ciudad}</small>
          </span>
        </motion.div>

        <motion.div className="hs-badges" variants={fadeUp}>
          <Badge icon="uca">
            <span className="hs-badge__dark">Estudiante de la UCA</span>
          </Badge>
          <Badge icon="hero-envelope-solid">Correo UCA</Badge>
          {s.estado === 'aceptada' && <Badge tono="green" icon="check-circle-fill">Aceptada</Badge>}
        </motion.div>

        <motion.div variants={fadeUp}>
          <Tarjeta className="hs-table">
            <Datos filas={s.datos} />
          </Tarjeta>
        </motion.div>

        <motion.section className="hs-section" variants={fadeUp}>
          <h2>Mensaje de {s.corto}</h2>
          <p className="hs-bubble">{s.mensaje}</p>
        </motion.section>

        <motion.div variants={fadeUp}>
          <Tarjeta className="hs-compat">
            <div className="hs-compat__head">
              <span>
                <small>Compatibilidad con tu casa</small>
                <b>
                  Coincide con {coinciden} de {s.reglas.length} reglas
                </b>
              </span>
              <span className="hs-compat__score">
                {coinciden}/{s.reglas.length}
              </span>
            </div>
            <div className="hs-compat__bar">
              {s.reglas.map((r, i) => (
                <motion.span
                  key={r.titulo}
                  className={r.estado === 'ok' ? 'ok' : 'ojo'}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.4, delay: 0.25 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                />
              ))}
            </div>
            <div className="hs-rules">
              {s.reglas.map((r) => (
                <div key={r.titulo} className={`hs-rule ${r.estado === 'ok' ? '' : 'hs-rule--ojo'}`}>
                  <Icon name={r.estado === 'ok' ? 'check-circle-fill' : 'info-circle-fill'} size={20} />
                  <span>
                    <b>{r.titulo}</b>
                    <small>{r.texto}</small>
                  </span>
                </div>
              ))}
            </div>
            {ojo?.pregunta && (
              <motion.button type="button" className="hs-ask" whileTap={{ scale: 0.98 }} onClick={() => avisar(`Le preguntamos a ${s.corto} por el chat`)}>
                <Icon name="chat-bubble-solid" size={16} />
                {ojo.pregunta}
              </motion.button>
            )}
          </Tarjeta>
        </motion.div>

        <motion.button type="button" className="hs-link hs-link--center" variants={fadeUp}>
          Ver su perfil completo
        </motion.button>
      </motion.div>

      <div className="hs-bar">
        <motion.button type="button" className="hs-icon-btn" aria-label={`Escribir a ${s.corto}`} whileTap={{ scale: 0.9 }}>
          <Icon name="chat-bubble-solid" size={20} />
        </motion.button>
        {nueva ? (
          <>
            <Button variant="outline" onClick={() => setHoja('rechazo')}>
              Rechazar
            </Button>
            <Button
              onClick={() => {
                aceptar(s.id)
                setHoja('aceptada')
              }}
            >
              Aceptar
            </Button>
          </>
        ) : (
          <Button>Escribir a {s.corto}</Button>
        )}
      </div>

      <HojaRechazo
        abierta={hoja === 'rechazo'}
        s={s}
        onClose={() => setHoja(null)}
        onConfirmar={(motivo, mensaje) => {
          setHoja(null)
          rechazar(s.id, motivo, mensaje)
        }}
      />
      <HojaAceptada
        abierta={hoja === 'aceptada'}
        s={s}
        onClose={() => setHoja(null)}
        onContrato={() => {
          setHoja(null)
          avisar(`Preparamos el contrato de ${s.corto}. Te avisaremos cuando lo firme.`)
        }}
      />
    </div>
  )
}
