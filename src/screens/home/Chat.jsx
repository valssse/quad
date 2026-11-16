import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useDragControls } from 'motion/react'
import Icon from '../../components/Icon.jsx'
import { Avatar } from './Detalle.jsx'
import { quad as buscarQuad } from '../../data/quads.js'
import { DIAS, HORAS, HORAS_OCUPADAS, SUGERENCIAS, detalle, responder } from '../../data/detalle.js'

/* La conversación se guarda mientras la app esté abierta (al volver sigue igual). */
const memoria = {}

const ahora = () =>
  new Date()
    .toLocaleTimeString('es-SV', { hour: 'numeric', minute: '2-digit', hour12: true })
    .replace('a.m.', 'a. m.')
    .replace('p.m.', 'p. m.')
    .replace(/ /g, ' ')

const burbuja = {
  initial: { opacity: 0, y: 10, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 420, damping: 32 } },
}

/** 06 · Hoja "Propón otra fecha". */
function HojaFecha({ abierta, anfitrion, onClose, onEnviar }) {
  const [dia, setDia] = useState(11)
  const [hora, setHora] = useState('4:00 p. m.')
  const [nota, setNota] = useState('')
  const arrastre = useDragControls()
  const d = DIAS.find((x) => x.id === dia)

  return (
    <AnimatePresence>
      {abierta && (
        <div className="sheet-layer" role="dialog" aria-modal="true" aria-label="Propón otra fecha">
          <motion.div className="sheet-dim" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} />
          <motion.div
            className="sheet ch-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            drag="y"
            dragListener={false}
            dragControls={arrastre}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => (info.offset.y > 90 || info.velocity.y > 500) && onClose()}
          >
            <span className="ch-sheet__grip" onPointerDown={(e) => arrastre.start(e)}>
              <span />
            </span>
            <div className="ch-sheet__head">
              <h2>Propón otra fecha</h2>
              <p>{anfitrion.corto} recibirá tu propuesta en el chat y podrá aceptarla o sugerir otra.</p>
            </div>

            <div className="ch-sheet__group">
              <div className="ch-sheet__label">
                <span>Día</span>
                <small>Noviembre 2026</small>
              </div>
              <div className="ch-days">
                {DIAS.map((x) => (
                  <motion.button
                    key={x.id}
                    type="button"
                    className={`ch-day ${dia === x.id ? 'ch-day--on' : ''}`}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setDia(x.id)}
                    aria-pressed={dia === x.id}
                  >
                    <span>{x.corto}</span>
                    <b>{x.id}</b>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="ch-sheet__group">
              <div className="ch-sheet__label">
                <span>Hora</span>
                <small>Visitas de 1 hora</small>
              </div>
              <div className="ch-hours">
                {HORAS.map((h) => {
                  const ocupada = HORAS_OCUPADAS.includes(h)
                  return (
                    <motion.button
                      key={h}
                      type="button"
                      className={`ch-hour ${hora === h ? 'ch-hour--on' : ''} ${ocupada ? 'ch-hour--off' : ''}`}
                      whileTap={ocupada ? undefined : { scale: 0.95 }}
                      disabled={ocupada}
                      onClick={() => setHora(h)}
                    >
                      {h}
                    </motion.button>
                  )
                })}
              </div>
            </div>

            <input className="ch-note" placeholder={`Agrega una nota para ${anfitrion.corto} (opcional)`} value={nota} onChange={(e) => setNota(e.target.value)} />

            <div className="ch-summary">
              <Icon name="calendar-fill" size={18} />
              <span>
                <small>Tu propuesta</small>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.b key={`${dia}${hora}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                    {d.corto} {dia} de nov · {hora}
                  </motion.b>
                </AnimatePresence>
              </span>
            </div>

            <motion.button type="button" className="ch-send-btn" whileTap={{ scale: 0.97 }} onClick={() => onEnviar(`${d.corto} ${dia} de nov · ${hora}`, nota.trim())}>
              Enviar propuesta
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

/** Tarjeta "Visita propuesta" con Aceptar / Otra fecha. */
function TarjetaVisita({ v, propia, onAceptar, onOtra }) {
  return (
    <div className={`ch-row ${propia ? 'ch-row--me' : ''}`}>
      <div className="ch-visit">
        <div className="ch-visit__top">
          <Icon name={v.estado === 'aceptada' ? 'check-circle-fill' : 'calendar-fill'} size={18} />
          <span>
            <b>{v.estado === 'aceptada' ? 'Visita confirmada' : propia ? 'Propuesta enviada' : 'Visita propuesta'}</b>
            <small>{v.fecha}</small>
          </span>
        </div>
        <AnimatePresence initial={false}>
          {v.estado === 'pendiente' && !propia && (
            <motion.div className="ch-visit__actions" exit={{ opacity: 0, height: 0, marginTop: -12 }}>
              <motion.button type="button" className="ch-visit__ok" whileTap={{ scale: 0.96 }} onClick={onAceptar}>
                Aceptar
              </motion.button>
              <motion.button type="button" className="ch-visit__other" whileTap={{ scale: 0.96 }} onClick={onOtra}>
                Otra fecha
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
        {v.nota && <p className="ch-visit__note">“{v.nota}”</p>}
      </div>
    </div>
  )
}

/** 05 · Conversación previa a solicitar. */
export function Conversacion({ id, ir }) {
  const q = buscarQuad(id) || buscarQuad('familia')
  const d = detalle(q)
  const a = d.anfitrion

  const [items, setItems] = useState(
    () =>
      memoria[q.id] || [
        ...d.chat.map((x, i) => ({ id: `m${i}`, tipo: 'msg', ...x })),
        ...(q.disponible ? [{ id: 'v0', tipo: 'visita', de: 'anfitrion', fecha: d.visita, estado: 'pendiente' }] : []),
      ],
  )
  const [texto, setTexto] = useState('')
  const [escribiendo, setEscribiendo] = useState(false)
  const [hoja, setHoja] = useState(false)
  const lista = useRef(null)

  useEffect(() => {
    memoria[q.id] = items
  }, [items, q.id])

  // Siempre mostrar lo último
  useLayoutEffect(() => {
    const el = lista.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: items.length > d.chat.length + 1 ? 'smooth' : 'auto' })
  }, [items, escribiendo, d.chat.length])

  const agregar = (x) => setItems((l) => [...l, { id: `n${Date.now()}${Math.random()}`, hora: ahora(), ...x }])
  const respuesta = (t, ms = 1300) => {
    setEscribiendo(true)
    setTimeout(() => {
      setEscribiendo(false)
      agregar({ tipo: 'msg', de: 'anfitrion', texto: t })
    }, ms)
  }

  const enviar = (t) => {
    const limpio = t.trim()
    if (!limpio) return
    agregar({ tipo: 'msg', de: 'yo', texto: limpio })
    setTexto('')
    const sug = SUGERENCIAS.find((s) => s === limpio)
    respuesta(sug ? responder(d, sug) : '¡Claro! Déjame revisarlo y te confirmo en un momento.')
  }

  const aceptar = (vid) => {
    setItems((l) => l.map((x) => (x.id === vid ? { ...x, estado: 'aceptada' } : x)))
    respuesta(`¡Listo! Te espero. La dirección exacta es en ${d.colonia}; te mando la ubicación por aquí.`)
  }

  const proponer = (fecha, nota) => {
    setHoja(false)
    setItems((l) => l.map((x) => (x.tipo === 'visita' && x.estado === 'pendiente' ? { ...x, estado: 'cambiada' } : x)))
    agregar({ tipo: 'visita', de: 'yo', fecha, nota, estado: 'enviada' })
    respuesta(`¡Perfecto! El ${fecha.split(' · ')[0].toLowerCase()} me queda bien. Te espero.`, 1600)
  }

  return (
    <div className="home-screen ch">
      <div className="ch-header">
        <div className="ch-header__row">
          <motion.button type="button" className="dt-round dt-round--plain" whileTap={{ scale: 0.9 }} aria-label="Atrás" onClick={() => window.history.back()}>
            <Icon name="nav-arrow-left" size={20} />
          </motion.button>
          <button type="button" className="ch-header__who" onClick={() => ir('casa', q.id)}>
            <Avatar src={a.foto} nombre={a.nombre} size={44} />
            <span>
              <b>{a.nombre}</b>
              <AnimatePresence mode="wait" initial={false}>
                <motion.small key={escribiendo ? 'e' : 'r'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {escribiendo ? 'Escribiendo…' : a.rol}
                </motion.small>
              </AnimatePresence>
            </span>
          </button>
          <motion.button type="button" className="dt-round dt-round--soft" whileTap={{ scale: 0.9 }} aria-label="Videollamada">
            <Icon name="video-camera" size={20} />
          </motion.button>
        </div>
        <div className="ch-quad-wrap">
          <motion.button type="button" className="ch-quad" whileTap={{ scale: 0.985 }} onClick={() => ir('quad', q.id)}>
            <img src={q.foto} alt="" />
            <span>
              <b>{d.tituloLargo}</b>
              <small>${q.precio}/mes</small>
            </span>
            <Icon name="nav-arrow-right" size={18} className="dt-chevron" />
          </motion.button>
        </div>
      </div>

      <div className="ch-list" ref={lista}>
        <div className="ch-date">
          <span>Hoy</span>
        </div>
        {items.map((x) =>
          x.tipo === 'visita' ? (
            x.estado === 'cambiada' ? null : (
              <motion.div key={x.id} {...burbuja}>
                <TarjetaVisita v={x} propia={x.de === 'yo'} onAceptar={() => aceptar(x.id)} onOtra={() => setHoja(true)} />
              </motion.div>
            )
          ) : (
            <motion.div key={x.id} className={`ch-row ${x.de === 'yo' ? 'ch-row--me' : ''}`} {...burbuja}>
              <p className="ch-bubble">{x.texto}</p>
              <small className="ch-time">{x.hora}</small>
            </motion.div>
          ),
        )}
        <AnimatePresence>
          {escribiendo && (
            <motion.div className="ch-row" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <p className="ch-bubble ch-typing" aria-label="Escribiendo">
                <span />
                <span />
                <span />
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="ch-compose">
        <div className="ch-suggest">
          {SUGERENCIAS.map((s) => (
            <motion.button key={s} type="button" whileTap={{ scale: 0.95 }} onClick={() => enviar(s)}>
              {s}
            </motion.button>
          ))}
        </div>
        <form
          className="ch-input"
          onSubmit={(e) => {
            e.preventDefault()
            enviar(texto)
          }}
        >
          <input placeholder="Escribe un mensaje…" value={texto} onChange={(e) => setTexto(e.target.value)} enterKeyHint="send" />
          <motion.button type="submit" className="ch-send" whileTap={{ scale: 0.9 }} aria-label="Enviar" animate={{ scale: texto.trim() ? 1 : 0.94, opacity: texto.trim() ? 1 : 0.9 }}>
            <Icon name="send" size={20} />
          </motion.button>
        </form>
      </div>

      <HojaFecha abierta={hoja} anfitrion={a} onClose={() => setHoja(false)} onEnviar={proponer} />
    </div>
  )
}
