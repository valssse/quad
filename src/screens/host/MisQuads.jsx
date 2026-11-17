import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Icon from '../../components/Icon.jsx'
import Button from '../../components/Button.jsx'
import { fadeUp, stagger } from '../../components/motion.js'
import { INCLUYE_DESTACADO, PLANES, TARJETA } from '../../data/host.js'
import { Badge, Cabecera, Estado, Hoja, Tarjeta } from './ui.jsx'

const FILTROS = [
  { id: 'todos', label: 'Todos' },
  { id: 'publicado', label: 'Publicados' },
  { id: 'revision', label: 'En revisión' },
  { id: 'pausado', label: 'Pausados' },
]

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
/** "17 nov – 2 dic" a partir de hoy. */
function rangoDesdeHoy(dias) {
  const a = new Date()
  const b = new Date(a.getTime() + dias * 86400000)
  return a.getMonth() === b.getMonth() ? `${a.getDate()} – ${b.getDate()} de ${MESES[b.getMonth()]}` : `${a.getDate()} ${MESES[a.getMonth()]} – ${b.getDate()} ${MESES[b.getMonth()]}`
}

/** Mini tarjeta del quad (cabecera de Destacar y Pagar). */
function QuadMini({ q }) {
  return (
    <Tarjeta className="mq-mini">
      <img src={q.foto} alt="" />
      <span>
        <b>{q.titulo}</b>
        <small>${q.precio} /mes · Jardines de Guadalupe</small>
      </span>
    </Tarjeta>
  )
}

/** Q02 · Hoja para pausar o eliminar. */
function HojaOpciones({ q, onClose, onPausar, onEliminar }) {
  return (
    <Hoja abierta={!!q} onClose={onClose} etiqueta="Opciones del quad">
      {q && (
        <>
          <div className="ch-sheet__head">
            <h2>{q.titulo}</h2>
            <p>¿Qué quieres hacer con este quad?</p>
          </div>
          <div className="hs-list">
            <motion.button type="button" className="mq-option" whileTap={{ scale: 0.98 }} onClick={onPausar}>
              <Icon name="clock-fill" size={22} className="mq-option__icon" />
              <span>
                <b>Pausar publicación</b>
                <small>No aparecerá en Explorar. Puedes reactivarlo cuando quieras.</small>
              </span>
              <Icon name="nav-arrow-right" size={18} className="hs-chevron" />
            </motion.button>
            <motion.button type="button" className="mq-option mq-option--danger" whileTap={{ scale: 0.98 }} onClick={onEliminar}>
              <Icon name="info-circle-fill" size={22} className="mq-option__icon" />
              <span>
                <b>Eliminar quad</b>
                <small>Se borra de forma permanente con sus fotos y estadísticas.</small>
              </span>
              <Icon name="nav-arrow-right" size={18} className="hs-chevron" />
            </motion.button>
          </div>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </>
      )}
    </Hoja>
  )
}

/** Q01 · Mis quads (Q03 con aviso de pausado). */
export function MisQuads({ quads, ir, pausar, reactivar, eliminar }) {
  const [filtro, setFiltro] = useState('todos')
  const [opciones, setOpciones] = useState(null)
  const publicados = quads.filter((q) => q.estado === 'publicado').length
  const visibles = filtro === 'todos' ? quads : quads.filter((q) => q.estado === filtro)

  return (
    <div className="home-screen hs">
      <div className="hs-tenants__head">
        <div className="hs-title">
          <h1>Mis quads</h1>
          <p>
            {quads.length} {quads.length === 1 ? 'quad' : 'quads'} · {publicados ? `${publicados} ${publicados === 1 ? 'publicado' : 'publicados'}` : 'ninguno publicado'}
          </p>
        </div>
        <div className="mq-filters">
          {FILTROS.map((f) => (
            <motion.button key={f.id} type="button" className={`mq-filter ${f.id === filtro ? 'mq-filter--on' : ''}`} whileTap={{ scale: 0.95 }} onClick={() => setFiltro(f.id)}>
              {f.label}
            </motion.button>
          ))}
        </div>
      </div>

      <motion.div key={filtro} className="home-scroll hs-tenants__list" variants={stagger} initial="hidden" animate="show">
        <AnimatePresence initial={false}>
          {visibles.map((q) => (
            <motion.div key={q.id} layout variants={fadeUp} exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}>
              <Tarjeta className="mq-card">
                <div className="mq-card__top">
                  <img src={q.foto} alt="" />
                  <div className="mq-card__info">
                    {(q.estado !== 'publicado' || q.destacado) && (q.destacado && q.estado === 'publicado' ? <Badge tono="amber" icon="star-fill">Destacado</Badge> : <Estado id={q.estado} />)}
                    <p className="mq-card__title">{q.titulo}</p>
                    <p className="hs-quad__price">
                      ${q.precio}
                      <small>/mes</small>
                    </p>
                    <p className="hs-quad__meta">
                      <Icon name={q.estado === 'publicado' ? 'eye' : 'clock-fill'} size={14} />
                      {q.datos}
                    </p>
                  </div>
                </div>
                <div className="mq-card__actions">
                  {q.estado === 'publicado' && (
                    <>
                      <motion.button type="button" className="hs-btn-soft" whileTap={{ scale: 0.97 }} onClick={() => ir('editar-quad', q.id)}>
                        Editar
                      </motion.button>
                      <motion.button type="button" className="hs-btn-soft" whileTap={{ scale: 0.97 }} onClick={() => setOpciones(q)}>
                        Pausar
                      </motion.button>
                      {q.destacado ? (
                        <span className="hs-btn-soft mq-done">
                          <Icon name="star-fill" size={14} />
                          Destacado
                        </span>
                      ) : (
                        <motion.button type="button" className="hs-small-btn" whileTap={{ scale: 0.97 }} onClick={() => ir('destacar', q.id)}>
                          Destacar
                        </motion.button>
                      )}
                    </>
                  )}
                  {q.estado === 'revision' && (
                    <motion.button type="button" className="hs-btn-soft" whileTap={{ scale: 0.97 }} onClick={() => ir('editar-quad', q.id)}>
                      Ver detalle
                    </motion.button>
                  )}
                  {q.estado === 'pausado' && (
                    <>
                      <motion.button type="button" className="hs-btn-soft" whileTap={{ scale: 0.97 }} onClick={() => ir('editar-quad', q.id)}>
                        Editar
                      </motion.button>
                      <motion.button type="button" className="hs-small-btn mq-reactivar" whileTap={{ scale: 0.97 }} onClick={() => reactivar(q)}>
                        Reactivar
                      </motion.button>
                    </>
                  )}
                </div>
              </Tarjeta>
            </motion.div>
          ))}
        </AnimatePresence>
        {!visibles.length && <p className="hs-empty">No tienes quads en esta lista.</p>}
        <motion.button type="button" className="hs-publish" variants={fadeUp} whileTap={{ scale: 0.98 }} onClick={() => ir('publicar')}>
          <Icon name="bed-fill" size={20} />
          Publicar un quad nuevo
        </motion.button>
      </motion.div>

      <HojaOpciones
        q={opciones}
        onClose={() => setOpciones(null)}
        onPausar={() => {
          pausar(opciones)
          setOpciones(null)
        }}
        onEliminar={() => {
          eliminar(opciones)
          setOpciones(null)
        }}
      />
    </div>
  )
}

/** Q04 · Editar quad (Q05 con aviso de cambios guardados). */
export function EditarQuad({ q, guardar, agregarFoto, verComoEstudiante }) {
  const archivo = useRef(null)
  return (
    <div className="home-screen hs hs--stack">
      <Cabecera titulo="Editar quad" />
      <motion.div className="home-scroll hs-detail hs-detail--gap16" variants={stagger} initial="hidden" animate="show">
        <motion.div className="mq-photos" variants={fadeUp}>
          {q.fotos.map((f, i) => (
            <motion.img key={`${f}-${i}`} src={f} alt="" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} />
          ))}
          <motion.button type="button" className="mq-add" whileTap={{ scale: 0.95 }} onClick={() => archivo.current?.click()}>
            <Icon name="hero-camera-solid" size={22} />
            Agregar
          </motion.button>
          <input
            ref={archivo}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) agregarFoto(q, URL.createObjectURL(f))
              e.target.value = ''
            }}
          />
        </motion.div>
        <motion.div className="mq-state" variants={fadeUp}>
          <Estado id={q.estado} />
          <span>{q.semana}</span>
        </motion.div>
        <div className="hs-list">
          {q.secciones.map((s) => (
            <motion.button key={s.titulo} type="button" className="hs-pend mq-section" variants={fadeUp} whileTap={{ scale: 0.98 }}>
              <Icon name={s.icon} size={22} className="mq-section__icon" />
              <span className="hs-pend__text">
                <b>{s.titulo}</b>
                <span>{s.texto}</span>
              </span>
              <Icon name="nav-arrow-right" size={18} className="hs-chevron" />
            </motion.button>
          ))}
        </div>
      </motion.div>
      <div className="hs-bar">
        <Button variant="outline" onClick={verComoEstudiante}>
          Ver como estudiante
        </Button>
        <Button onClick={guardar}>Guardar cambios</Button>
      </div>
    </div>
  )
}

/** Q06 · Destacar · Elegir plan. */
export function Destacar({ q, plan, setPlan, ir }) {
  const p = PLANES[plan]
  return (
    <div className="home-screen hs hs--stack">
      <Cabecera titulo="Destacar tu quad" />
      <motion.div className="home-scroll hs-detail hs-detail--gap16" variants={stagger} initial="hidden" animate="show">
        <motion.div variants={fadeUp}>
          <QuadMini q={q} />
        </motion.div>
        <motion.h2 className="mq-h2" variants={fadeUp}>
          ¿Por cuánto tiempo?
        </motion.h2>
        <div className="hs-list" role="radiogroup">
          {PLANES.map((x, i) => {
            const on = i === plan
            return (
              <motion.button key={x.dias} type="button" role="radio" aria-checked={on} className={`mq-plan ${on ? 'mq-plan--on' : ''}`} variants={fadeUp} whileTap={{ scale: 0.98 }} onClick={() => setPlan(i)}>
                <span className="hs-radio mq-plan__radio">
                  <AnimatePresence>{on && <motion.span className="mq-plan__dot" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} />}</AnimatePresence>
                </span>
                <span className="mq-plan__text">
                  <span className="mq-plan__name">
                    <b>{x.dias} días</b>
                    {x.popular && (
                      <Badge tono="blue" icon="star-fill">
                        Más elegido
                      </Badge>
                    )}
                  </span>
                  <small>{x.alcance}</small>
                </span>
                <b className="mq-plan__price">${x.precio}</b>
              </motion.button>
            )
          })}
        </div>
        <motion.div variants={fadeUp}>
          <Tarjeta className="mq-includes">
            <b>Qué incluye</b>
            {INCLUYE_DESTACADO.map((t) => (
              <span key={t}>
                <Icon name="check-circle-fill" size={18} />
                {t}
              </span>
            ))}
          </Tarjeta>
        </motion.div>
      </motion.div>
      <div className="hs-bar">
        <Button onClick={() => ir('pagar', q.id)}>Continuar · ${p.precio}</Button>
      </div>
    </div>
  )
}

/** Q07 · Confirmar pago (Q08 con la hoja de éxito). */
export function Pagar({ q, plan, pagar, irInicio, irQuads }) {
  const p = PLANES[plan]
  const [listo, setListo] = useState(false)
  const [pagando, setPagando] = useState(false)
  const fin = rangoDesdeHoy(p.dias)

  return (
    <div className="home-screen hs hs--stack">
      <Cabecera titulo="Confirmar pago" />
      <motion.div className="home-scroll hs-detail hs-detail--gap16" variants={stagger} initial="hidden" animate="show">
        <motion.div variants={fadeUp}>
          <QuadMini q={q} />
        </motion.div>
        <motion.div variants={fadeUp}>
          <Tarjeta className="hs-table">
            <div className="hs-dato">
              <span>Plan</span>
              <b>Destacado · {p.dias} días</b>
            </div>
            <div className="hs-dato hs-dato--line">
              <span>Fechas</span>
              <b>{fin}</b>
            </div>
            <div className="hs-dato hs-dato--line">
              <span>Subtotal</span>
              <b>${p.precio}</b>
            </div>
            <div className="hs-dato hs-dato--line mq-total">
              <span>Total</span>
              <b>${p.precio}</b>
            </div>
          </Tarjeta>
        </motion.div>
        <motion.h2 className="mq-h2 mq-h2--small" variants={fadeUp}>
          Método de pago
        </motion.h2>
        <motion.button type="button" className="hs-pend" variants={fadeUp} whileTap={{ scale: 0.98 }}>
          <Icon name="dollar-circle-fill" size={24} className="mq-section__icon" />
          <span className="hs-pend__text">
            <b>{TARJETA.nombre}</b>
            <span>{TARJETA.vence}</span>
          </span>
          <Icon name="nav-arrow-right" size={18} className="hs-chevron" />
        </motion.button>
        <motion.p className="mq-note" variants={fadeUp}>
          <Icon name="hero-envelope-solid" size={16} />
          Verás el cobro como QUAD*DESTACADO. No se renueva solo.
        </motion.p>
      </motion.div>
      <div className="hs-bar">
        <Button
          disabled={pagando}
          onClick={() => {
            setPagando(true)
            setTimeout(() => {
              pagar(q, p, fin)
              setListo(true)
            }, 900)
          }}
        >
          {pagando && !listo ? (
            <span className="mq-spinner" aria-label="Procesando" />
          ) : (
            <>Pagar ${p.precio}</>
          )}
        </Button>
      </div>

      <Hoja abierta={listo} onClose={irQuads} etiqueta="Quad destacado" className="hs-sheet--center">
        <motion.span className="hs-success mq-star" initial={{ scale: 0.6, opacity: 0, rotate: -20 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 0.12 }}>
          <Icon name="star-fill" size={34} />
        </motion.span>
        <div className="ch-sheet__head">
          <h2>¡Tu quad ya está destacado!</h2>
          <p>Aparecerá primero en Explorar hasta el {fin.split('– ')[1]}. Te avisaremos cómo le va cada semana.</p>
        </div>
        <div className="hs-sheet__actions">
          <Button onClick={irQuads}>Ver mis quads</Button>
          <Button variant="outline" onClick={irInicio}>
            Volver al inicio
          </Button>
        </div>
      </Hoja>
    </div>
  )
}

