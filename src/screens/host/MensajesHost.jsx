import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Icon from '../../components/Icon.jsx'
import Button from '../../components/Button.jsx'
import { fadeUp, stagger } from '../../components/motion.js'
import { Filtros } from '../home/ui.jsx'
import { HojaFecha } from '../home/Chat.jsx'
import { CHATS_HOST, FILTROS_MENSAJES_HOST, MIS_QUADS, RESPUESTAS_RAPIDAS_CHAT } from '../../data/host.js'
import { Avatar, Hoja } from './ui.jsx'

const normalizar = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
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

/* La conversación se guarda mientras la app esté abierta. */
const memoria = {}

/** M01 · Mensajes del anfitrión. */
export function MensajesHost({ ir, leidas, marcarLeida, ultimos, bloqueados }) {
  const [filtro, setFiltro] = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  const conv = CHATS_HOST.filter((c) => !bloqueados.includes(c.id)).map((c) => ({
    ...c,
    noLeidos: leidas.includes(c.id) ? 0 : c.noLeidos,
    ...(ultimos[c.id] || {}),
    ultimo: ultimos[c.id]?.ultimo || c.mensajes[c.mensajes.length - 1],
  }))
  const sinLeer = conv.filter((c) => c.noLeidos).length
  const lista = conv
    .filter((c) => normalizar(c.nombre + c.quad).includes(normalizar(busqueda)))
    .filter((c) => (filtro === 'no-leidos' ? c.noLeidos : filtro === 'todos' ? true : filtro === 'visitas' ? c.tipo === 'visita' : c.tipo === 'solicitud'))

  return (
    <div className="home-screen hs">
      <motion.div className="home-scroll" variants={stagger} initial="hidden" animate="show">
        <div className="home-top">
          <motion.div className="home-title" variants={fadeUp}>
            <h1>Mensajes</h1>
            <p>{sinLeer === 1 ? '1 conversación sin leer' : sinLeer ? `${sinLeer} conversaciones sin leer` : 'Estás al día'}</p>
          </motion.div>
          <motion.label className="search-field" variants={fadeUp}>
            <Icon name="search" size={20} />
            <input type="search" placeholder="Buscar por nombre o quad" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          </motion.label>
          <motion.div variants={fadeUp}>
            <Filtros opciones={FILTROS_MENSAJES_HOST} valor={filtro} onChange={setFiltro} className="filters--bleed" />
          </motion.div>
        </div>

        <motion.div className="home-pad" variants={fadeUp}>
          <div className="chat-list">
            <AnimatePresence initial={false} mode="popLayout">
              {lista.map((c) => (
                <motion.button
                  key={c.id}
                  type="button"
                  layout
                  className={`chat-row ${c.noLeidos ? 'chat-row--unread' : ''}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  whileTap={{ backgroundColor: 'rgba(15, 23, 42, 0.03)' }}
                  onClick={() => {
                    marcarLeida(c.id)
                    ir('chat', c.id)
                  }}
                >
                  <span className="chat-row__avatar">{c.foto ? <img src={c.foto} alt="" /> : c.iniciales}</span>
                  <span className="chat-row__body">
                    <span className="chat-row__top">
                      <span className="chat-row__name">{c.nombre}</span>
                      <span className="chat-row__time">{c.ultimo.hora}</span>
                    </span>
                    <span className="chat-row__quad">{c.quad}</span>
                    <span className="chat-row__bottom">
                      <span className="chat-row__msg">
                        {c.ultimo.de === 'yo' ? 'Tú: ' : ''}
                        {c.ultimo.resumen || c.ultimo.texto}
                      </span>
                      <AnimatePresence>
                        {c.noLeidos > 0 && (
                          <motion.span className="chat-row__badge" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                            {c.noLeidos}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                  </span>
                </motion.button>
              ))}
            </AnimatePresence>
            {lista.length === 0 && <p className="home-empty">No hay conversaciones.</p>}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

/** Tarjeta de visita dentro del chat (la propone la estudiante o la anfitriona). */
function TarjetaVisita({ v, nombre, onConfirmar, onOtra }) {
  const propia = v.de === 'yo'
  const titulo = v.estado === 'confirmada' ? 'Visita confirmada' : propia ? 'Propusiste otra fecha' : `${nombre} propone otra fecha`
  return (
    <div className={`ch-row ${propia ? 'ch-row--me' : ''}`}>
      <div className="ch-visit mh-visit">
        <div className="ch-visit__top">
          <Icon name={v.estado === 'confirmada' ? 'check-circle-fill' : 'calendar-fill'} size={18} />
          <span>
            <b>{titulo}</b>
            <small>{v.fecha}</small>
          </span>
        </div>
        <AnimatePresence initial={false}>
          {v.estado === 'pendiente' && !propia && (
            <motion.div className="ch-visit__actions" exit={{ opacity: 0, height: 0, marginTop: -12 }}>
              <motion.button type="button" className="ch-visit__ok" whileTap={{ scale: 0.96 }} onClick={onConfirmar}>
                Confirmar
              </motion.button>
              <motion.button type="button" className="ch-visit__other" whileTap={{ scale: 0.96 }} onClick={onOtra}>
                Proponer otra
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
        {propia && v.estado === 'pendiente' && (
          <span className="mh-wait">
            <i />
            Esperando respuesta de {nombre}
          </span>
        )}
      </div>
    </div>
  )
}

/** M05 · Hoja de respuestas guardadas (con opción de crear una). */
function HojaGuardadas({ abierta, guardadas, onClose, onUsar, onCrear }) {
  const [creando, setCreando] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [texto, setTexto] = useState('')
  const cerrar = () => {
    setCreando(false)
    onClose()
  }
  return (
    <Hoja abierta={abierta} onClose={cerrar} etiqueta="Respuestas guardadas">
      <div className="ch-sheet__head">
        <h2>Respuestas guardadas</h2>
        <p>Toca una para enviarla. Puedes editarla antes.</p>
      </div>
      <div className="hs-list">
        {guardadas.map((r) => (
          <motion.button key={r.titulo} type="button" className="mq-option" whileTap={{ scale: 0.98 }} onClick={() => onUsar(r.texto)}>
            <Icon name="chat-bubble-fill" size={24} className="mq-option__icon" />
            <span>
              <b>{r.titulo}</b>
              <small>{r.texto}</small>
            </span>
            <Icon name="nav-arrow-right" size={18} className="hs-chevron" />
          </motion.button>
        ))}
      </div>
      <AnimatePresence initial={false} mode="wait">
        {creando ? (
          <motion.div key="form" className="mh-new" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <input className="ch-note" placeholder="Título (ej. Mascotas)" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
            <textarea className="textarea" placeholder="Escribe la respuesta" value={texto} onChange={(e) => setTexto(e.target.value)} />
            <Button
              disabled={!titulo.trim() || !texto.trim()}
              onClick={() => {
                onCrear({ titulo: titulo.trim(), texto: texto.trim() })
                setTitulo('')
                setTexto('')
                setCreando(false)
              }}
            >
              Guardar respuesta
            </Button>
          </motion.div>
        ) : (
          <motion.button key="btn" type="button" className="hs-publish pc-add" whileTap={{ scale: 0.98 }} onClick={() => setCreando(true)}>
            <Icon name="chat-bubble-fill" size={18} />
            Crear respuesta guardada
          </motion.button>
        )}
      </AnimatePresence>
    </Hoja>
  )
}

/** M02 · Conversación del anfitrión (M03–M08 como hojas). */
export function ChatHost({ id, ir, guardadas, crearGuardada, confirmarVisita, visitaConfirmada, actualizarUltimo, bloquear, avisar }) {
  const c = CHATS_HOST.find((x) => x.id === id) || CHATS_HOST[0]
  const q = MIS_QUADS.find((x) => x.id === c.quadId) || MIS_QUADS[0]

  const [items, setItems] = useState(
    () =>
      memoria[c.id] || [
        ...c.mensajes.map((m, i) => ({ id: `m${i}`, tipo: 'msg', ...m })),
        ...(c.visita ? [{ id: 'v0', tipo: 'visita', de: 'ella', fecha: c.visita.fecha, estado: visitaConfirmada ? 'confirmada' : 'pendiente' }] : []),
      ],
  )
  const [texto, setTexto] = useState('')
  const [escribiendo, setEscribiendo] = useState(false)
  const [hoja, setHoja] = useState(null)
  const lista = useRef(null)

  useEffect(() => {
    memoria[c.id] = items
  }, [items, c.id])

  useLayoutEffect(() => {
    const el = lista.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: items.length > c.mensajes.length + 1 ? 'smooth' : 'auto' })
  }, [items, escribiendo, c.mensajes.length])

  const agregar = (x) => {
    const nuevo = { id: `n${Date.now()}${Math.random()}`, hora: ahora(), ...x }
    setItems((l) => [...l, nuevo])
    actualizarUltimo(c.id, { de: nuevo.de, texto: nuevo.texto, resumen: nuevo.resumen, hora: nuevo.hora })
  }
  const respuesta = (t, ms = 1400, extra) => {
    setEscribiendo(true)
    setTimeout(() => {
      setEscribiendo(false)
      agregar({ tipo: 'msg', de: 'ella', texto: t })
      extra?.()
    }, ms)
  }

  const enviar = (t) => {
    const limpio = t.trim()
    if (!limpio) return
    agregar({ tipo: 'msg', de: 'yo', texto: limpio, enviado: true })
    setTexto('')
    respuesta(limpio.includes('?') ? 'Sí, claro. Te cuento en un momento.' : '¡Gracias, Andrea! Me queda claro.')
  }

  const confirmar = (vid) => {
    setItems((l) => l.map((x) => (x.id === vid ? { ...x, estado: 'confirmada' } : x)))
    if (c.visita) confirmarVisita(c.visita.visitaId)
    actualizarUltimo(c.id, { de: 'yo', texto: 'Confirmaste la visita', hora: ahora() })
    respuesta('¡Genial! Ahí estaré. Muchas gracias.')
  }

  const proponer = (fecha) => {
    setHoja(null)
    setItems((l) => l.map((x) => (x.tipo === 'visita' && x.estado === 'pendiente' ? { ...x, estado: 'reemplazada' } : x)))
    const vid = `v${Date.now()}`
    setItems((l) => [...l, { id: vid, tipo: 'visita', de: 'yo', fecha, estado: 'pendiente', hora: ahora() }])
    actualizarUltimo(c.id, { de: 'yo', texto: `Propusiste otra fecha: ${fecha.toLowerCase().replace(' · ', ', ')}`, hora: ahora() })
    respuesta(`¡Me queda perfecto el ${fecha.split(' · ')[0].toLowerCase()}! Nos vemos.`, 2200, () => {
      setItems((l) => l.map((x) => (x.id === vid ? { ...x, estado: 'confirmada' } : x)))
      if (c.visita) confirmarVisita(c.visita.visitaId)
    })
  }

  return (
    <div className="home-screen ch hs-chat">
      <div className="ch-header">
        <div className="ch-header__row">
          <motion.button type="button" className="dt-round dt-round--plain" whileTap={{ scale: 0.9 }} aria-label="Atrás" onClick={() => window.history.back()}>
            <Icon name="nav-arrow-left" size={20} />
          </motion.button>
          <button type="button" className="ch-header__who" onClick={() => setHoja('opciones')}>
            <Avatar foto={c.foto} iniciales={c.iniciales} size={44} />
            <span>
              <b>{c.nombre}</b>
              <AnimatePresence mode="wait" initial={false}>
                <motion.small key={escribiendo ? 'e' : 'r'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {escribiendo ? 'Escribiendo…' : c.rol}
                </motion.small>
              </AnimatePresence>
            </span>
          </button>
        </div>
        <div className="ch-quad-wrap">
          <motion.button type="button" className="ch-quad" whileTap={{ scale: 0.985 }} onClick={() => ir('editar-quad', q.id)}>
            <img src={q.foto} alt="" />
            <span>
              <b>{q.titulo}</b>
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
            <motion.div key={x.id} {...burbuja}>
              <TarjetaVisita v={x.estado === 'reemplazada' ? { ...x, estado: 'cerrada' } : x} nombre={c.corto} onConfirmar={() => confirmar(x.id)} onOtra={() => setHoja('fecha')} />
              {x.hora && x.de === 'yo' && <small className="ch-time mh-time">{x.hora}</small>}
            </motion.div>
          ) : (
            <motion.div key={x.id} className={`ch-row ${x.de === 'yo' ? 'ch-row--me' : ''}`} {...burbuja}>
              <p className="ch-bubble">{x.texto}</p>
              <small className="ch-time">
                {x.hora}
                {x.enviado ? ' · Enviado' : ''}
              </small>
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
          {RESPUESTAS_RAPIDAS_CHAT.map((s) => (
            <motion.button key={s.label} type="button" whileTap={{ scale: 0.95 }} onClick={() => enviar(s.texto)}>
              {s.label}
            </motion.button>
          ))}
          <motion.button type="button" className="mh-saved" whileTap={{ scale: 0.95 }} onClick={() => setHoja('guardadas')}>
            <Icon name="chat-bubble-fill" size={14} />
            Respuestas guardadas
          </motion.button>
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

      <HojaFecha abierta={hoja === 'fecha'} anfitrion={{ corto: c.corto }} diaInicial={12} onClose={() => setHoja(null)} onEnviar={proponer} />

      <HojaGuardadas
        abierta={hoja === 'guardadas'}
        guardadas={guardadas}
        onClose={() => setHoja(null)}
        onCrear={crearGuardada}
        onUsar={(t) => {
          setHoja(null)
          enviar(t)
        }}
      />

      {/* M07 · Reportar o bloquear */}
      <Hoja abierta={hoja === 'opciones'} onClose={() => setHoja(null)} etiqueta={`Opciones de ${c.corto}`}>
        <div className="ch-sheet__head">
          <h2>{c.nombre}</h2>
          <p>
            {c.tipo === 'inquilina' ? 'Inquilina' : 'Estudiante'} · interesada en {q.titulo.split(' en ')[0]}
          </p>
        </div>
        <div className="hs-list">
          <motion.button type="button" className="mq-option" whileTap={{ scale: 0.98 }} onClick={() => setHoja(null)}>
            <Icon name="home-solid" size={22} className="mq-option__icon" />
            <span>
              <b>Ver perfil de {c.corto}</b>
              <small>Su información, intereses y verificaciones</small>
            </span>
            <Icon name="nav-arrow-right" size={18} className="hs-chevron" />
          </motion.button>
          <motion.button type="button" className="mq-option mq-option--danger" whileTap={{ scale: 0.98 }} onClick={() => setHoja('reportado')}>
            <Icon name="info-circle-fill" size={22} className="mq-option__icon" />
            <span>
              <b>Reportar a {c.corto}</b>
              <small>Cuéntanos qué pasó. No sabrá que fuiste tú.</small>
            </span>
            <Icon name="nav-arrow-right" size={18} className="hs-chevron" />
          </motion.button>
          <motion.button
            type="button"
            className="mq-option mq-option--danger"
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setHoja(null)
              bloquear(c)
            }}
          >
            <Icon name="hero-lock-closed-solid" size={22} className="mq-option__icon" />
            <span>
              <b>Bloquear a {c.corto}</b>
              <small>No podrá escribirte ni enviarte solicitudes.</small>
            </span>
            <Icon name="nav-arrow-right" size={18} className="hs-chevron" />
          </motion.button>
        </div>
        <Button variant="outline" onClick={() => setHoja(null)}>
          Cancelar
        </Button>
      </Hoja>

      {/* M08 · Reporte enviado */}
      <Hoja abierta={hoja === 'reportado'} onClose={() => setHoja(null)} etiqueta="Reporte enviado" className="hs-sheet--center">
        <motion.span className="hs-success mh-blue" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 320, damping: 18, delay: 0.12 }}>
          <Icon name="check-circle-fill" size={36} />
        </motion.span>
        <div className="ch-sheet__head">
          <h2>Gracias por avisarnos</h2>
          <p>Revisaremos el caso en menos de 24 horas y te contaremos qué hicimos. Mientras tanto, puedes seguir usando la app con normalidad.</p>
        </div>
        <div className="hs-sheet__actions">
          <Button
            onClick={() => {
              setHoja(null)
              avisar(`Reportaste a ${c.corto}. Te avisaremos qué hicimos.`)
            }}
          >
            Listo
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setHoja(null)
              bloquear(c)
            }}
          >
            Bloquear también a {c.corto}
          </Button>
        </div>
      </Hoja>
    </div>
  )
}
