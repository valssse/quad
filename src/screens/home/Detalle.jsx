import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useDragControls } from 'motion/react'
import StatusBar from '../../components/StatusBar.jsx'
import Icon from '../../components/Icon.jsx'
import Button from '../../components/Button.jsx'
import { fadeUp, stagger } from '../../components/motion.js'
import { Corazon } from './ui.jsx'
import { quad as buscarQuad } from '../../data/quads.js'
import { detalle } from '../../data/detalle.js'
import { UCA, distanciaKm, osmEmbed, osmRuta, textoDistancia } from '../../data/geo.js'

const compartir = (q) => navigator.share?.({ title: q.titulo, text: `${q.titulo} · $${q.precio}/mes en Quad` }).catch(() => {})

/** Foto redonda con respaldo de iniciales si la imagen no carga. */
export function Avatar({ src, nombre, size = 48, tono = '#dce6ff', className = '' }) {
  const [error, setError] = useState(false)
  const ini = nombre
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
  return (
    <span className={`avatar-img ${className}`} style={{ width: size, height: size, background: tono }}>
      {src && !error ? <img src={src} alt="" loading="lazy" onError={() => setError(true)} /> : <span>{ini}</span>}
    </span>
  )
}

/** Estrellas de calificación. */
export function Estrellas({ n = 5, size = 13 }) {
  return (
    <span className="stars" style={{ gap: size > 14 ? 2 : 2 }}>
      {Array.from({ length: n }, (_, i) => (
        <Icon key={i} name="star-fill" size={size} className="star" />
      ))}
    </span>
  )
}

/** Título de sección con enlace opcional ("Ver todo"). */
function Titulo({ children, enlace, onEnlace }) {
  return (
    <div className="dt-title">
      <h2>{children}</h2>
      {enlace && (
        <button type="button" className="dt-link" onClick={onEnlace}>
          {enlace}
        </button>
      )}
    </div>
  )
}

/** Tarjeta de reseña (Lucía R. en Figma). */
export function Resena({ r, texto, children }) {
  return (
    <motion.article className="dt-review" variants={fadeUp}>
      <div className="dt-review__who">
        <span className="dt-review__avatar" style={{ background: r.fondo, color: r.color }}>
          {r.iniciales}
        </span>
        <div>
          <p className="dt-review__name">{r.nombre}</p>
          <p className="dt-review__meta">{r.carrera}</p>
        </div>
      </div>
      <div className="dt-review__stars">
        <Estrellas />
        <span>· Vivió aquí {r.tiempo}</span>
      </div>
      <p className="dt-review__text">{texto}</p>
      {children}
    </motion.article>
  )
}

/** Galería deslizable con contador "1 / 8". */
function Galeria({ fotos, onAbrir }) {
  const [i, setI] = useState(0)
  const pista = useRef(null)
  return (
    <div className="dt-gallery">
      <div
        ref={pista}
        className="dt-gallery__track"
        onScroll={(e) => {
          const el = e.currentTarget
          setI(Math.round(el.scrollLeft / el.clientWidth))
        }}
      >
        {fotos.map((f, k) => (
          <img key={k} src={f} alt="" draggable="false" loading={k < 2 ? 'eager' : 'lazy'} onClick={() => onAbrir(k)} />
        ))}
      </div>
      <span className="dt-gallery__shade" />
      <span className="dt-gallery__count">
        {i + 1} / {fotos.length}
      </span>
    </div>
  )
}

/**
 * Mapa real (iframe de OpenStreetMap) centrado en el quad, en escala de grises,
 * con el pin azul del Figma encima. Debajo: a cuánto queda de la UCA.
 */
function MapaQuad({ q, d }) {
  const [cargado, setCargado] = useState(false)
  return (
    <div className="dt-map">
      <iframe
        title={`Mapa de ${d.colonia} y la UCA`}
        src={osmEmbed(q.pos)}
        loading="lazy"
        tabIndex={-1}
        onLoad={() => setCargado(true)}
        className={cargado ? 'dt-map__frame dt-map__frame--on' : 'dt-map__frame'}
      />
      <span className="dt-map__halo" />
      <span className="dt-map__pin">
        <Icon name="home-solid" size={20} />
      </span>
      <span className="dt-map__credit">© OpenStreetMap</span>
    </div>
  )
}

/** Fotos en pantalla completa: se deslizan con el dedo; botón atrás arriba a la izquierda. */
function VisorFotos({ fotos, inicio, onCerrar }) {
  const [i, setI] = useState(inicio)
  const pista = useRef(null)
  useLayoutEffect(() => {
    const el = pista.current
    if (el) el.scrollLeft = inicio * el.clientWidth
  }, [inicio])
  useEffect(() => {
    const tecla = (e) => {
      if (e.key === 'Escape') onCerrar()
      const el = pista.current
      if (!el) return
      if (e.key === 'ArrowRight') el.scrollBy({ left: el.clientWidth, behavior: 'smooth' })
      if (e.key === 'ArrowLeft') el.scrollBy({ left: -el.clientWidth, behavior: 'smooth' })
    }
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  }, [onCerrar])
  return (
    <motion.div
      className="viewer"
      role="dialog"
      aria-modal="true"
      aria-label="Fotos del quad"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
    >
      <motion.div
        ref={pista}
        className="viewer__track"
        initial={{ scale: 0.94 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onScroll={(e) => setI(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
      >
        {fotos.map((f, k) => (
          <div key={k} className="viewer__slide">
            <img src={f} alt={`Foto ${k + 1} de ${fotos.length}`} draggable="false" />
          </div>
        ))}
      </motion.div>
      <div className="viewer__top">
        <StatusBar tone="light" />
        <div className="safe-top" />
        <div className="viewer__bar">
          <motion.button type="button" className="viewer__back" whileTap={{ scale: 0.9 }} aria-label="Volver" onClick={onCerrar}>
            <Icon name="nav-arrow-left" size={20} />
          </motion.button>
          <span className="viewer__count">
            {i + 1} / {fotos.length}
          </span>
          <span className="viewer__spacer" />
        </div>
      </div>
      <div className="viewer__dots" aria-hidden="true">
        {fotos.map((_, k) => (
          <span key={k} className={k === i ? 'on' : ''} />
        ))}
      </div>
    </motion.div>
  )
}

function Iniciales({ nombre }) {
  const ini = (nombre || '').split(' ').filter(Boolean).slice(0, 2).map((x) => x[0]).join('')
  return <span className="dt-sheet__ph">{ini}</span>
}

/** 07 · Hoja · Enviar tu perfil: confirma antes de mandar la solicitud. */
function HojaEnviarPerfil({ abierta, anfitrion, perfil, onClose, onEnviar }) {
  const arrastre = useDragControls()
  const yo = perfil || {}
  return (
    <AnimatePresence>
      {abierta && (
        <div className="sheet-layer" role="dialog" aria-modal="true" aria-label={`Enviaremos tu perfil a ${anfitrion.corto}`}>
          <motion.div className="sheet-dim" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} />
          <motion.div
            className="sheet dt-sheet"
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
            <div className="dt-sheet__pair">
              {yo.foto ? <img src={yo.foto} alt="" /> : <Iniciales nombre={yo.nombreCompleto} />}
              <Icon name="nav-arrow-right" size={22} />
              <img src={anfitrion.foto} alt="" />
            </div>
            <div className="dt-sheet__text">
              <h2>Enviaremos tu perfil a {anfitrion.corto}</h2>
              <p>
                {anfitrion.corto} verá tu foto, carrera, año e intereses, y que eres estudiante verificado. No verá tu correo ni tu teléfono.
              </p>
            </div>
            <div className="dt-sheet__card" aria-label="Así te verá">
              {yo.foto ? <img src={yo.foto} alt="" /> : <Iniciales nombre={yo.nombreCompleto} />}
              <span>
                <b>{yo.nombreCompleto}</b>
                <small>{yo.detalle}</small>
              </span>
            </div>
            <Button onClick={onEnviar}>Enviar solicitud</Button>
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

/** 03 · Detalle del quad. */
export function Detalle({ id, guardados, alternarGuardado, ir, perfil, solicitar, alquiler }) {
  const q = buscarQuad(id) || buscarQuad('familia')
  const d = detalle(q)
  const a = d.anfitrion
  const [solicitado, setSolicitado] = useState(q.id === 'familia' && !!alquiler?.solicitud)
  const [hoja, setHoja] = useState(false)
  const [aviso, setAviso] = useState(false)
  // Al pasar la galería, la barra superior se vuelve blanca (como un header normal)
  const [solido, setSolido] = useState(false)
  useEffect(() => {
    if (!aviso) return
    const t = setTimeout(() => setAviso(false), 2600)
    return () => clearTimeout(t)
  }, [aviso])
  const modo = q.trayecto.modo
  const ruta = osmRuta(q.pos, modo)
  const [visor, setVisor] = useState(null)

  return (
    <div className="home-screen dt">
      <div className="home-scroll dt-scroll" onScroll={(e) => setSolido(e.currentTarget.scrollTop > 230)}>
        <Galeria fotos={d.galeria} onAbrir={setVisor} />

        <motion.div className="dt-body" variants={stagger} initial="hidden" animate="show">
          <div className="dt-head">
            <motion.div className="dt-badges" variants={fadeUp}>
              <span className="dt-badge dt-badge--green">
                <Icon name="home-solid" size={14} />
                {d.tipo}
              </span>
              <span className="dt-badge dt-badge--amber">
                <Icon name="star-fill" size={14} />
                {q.rating.toFixed(1)} · {d.resenas} reseñas
              </span>
              <span className="dt-badge">
                <Icon name={modo === 'walking' ? 'walking-fill' : modo === 'bus' ? 'bus-fill' : 'car-fill'} size={14} />
                {d.trayecto}
              </span>
            </motion.div>
            <motion.h1 variants={fadeUp}>{d.tituloLargo}</motion.h1>
            <motion.p className="dt-place" variants={fadeUp}>
              <Icon name="map-pin-fill" size={13} />
              {d.colonia}, {d.municipio}
            </motion.p>
          </div>

          <motion.button type="button" className="dt-host" variants={fadeUp} whileTap={{ scale: 0.985 }} onClick={() => ir('casa', q.id)}>
            <Avatar src={a.foto} nombre={a.nombre} size={48} />
            <span className="dt-host__text">
              <span className="dt-host__name">{a.nombre}</span>
              <span className="dt-host__sub">{a.detalle}</span>
            </span>
            <Icon name="nav-arrow-right" size={16} className="dt-chevron" />
          </motion.button>

          <motion.button type="button" className="dt-outline" variants={fadeUp} whileTap={{ scale: 0.985 }} onClick={() => ir('casa', q.id)}>
            <span>Ver el Perfil de la casa</span>
            <Icon name="nav-arrow-right" size={16} className="dt-chevron" />
          </motion.button>

          <motion.section className="dt-section" variants={fadeUp}>
            <Titulo enlace="Ver todo">Qué incluye el Quad</Titulo>
            <div className="dt-grid">
              {d.incluye.map((s) => (
                <div key={s.titulo} className="dt-service">
                  <span className="dt-service__icon">
                    <Icon name={s.icon} size={18} />
                  </span>
                  <span>
                    <span className="dt-service__title">{s.titulo}</span>
                    <span className="dt-service__sub">{s.detalle}</span>
                  </span>
                </div>
              ))}
            </div>
          </motion.section>

          <hr className="dt-divider" />

          <motion.section className="dt-section dt-section--rules" variants={fadeUp}>
            <Titulo enlace="Ver todas">Reglas de la casa</Titulo>
            {d.reglas.map((r) => (
              <div key={r.titulo} className="dt-rule">
                <span className="dt-rule__icon">
                  <Icon name={r.icon} size={20} />
                </span>
                <span>
                  <span className="dt-rule__title">{r.titulo}</span>
                  <span className="dt-rule__sub">{r.detalle}</span>
                </span>
              </div>
            ))}
          </motion.section>

          <hr className="dt-divider" />

          <motion.section className="dt-section dt-section--map" variants={fadeUp}>
            <Titulo>Dónde está el Quad</Titulo>
            <MapaQuad q={q} d={d} />
            <p className="dt-map__distance">
              Este quad está a <b>{textoDistancia(distanciaKm(q.pos, UCA.pos))}</b> de la UCA, en línea recta.
            </p>
            <div className="dt-address">
              <Icon name="map-pin-fill" size={16} />
              <span>
                <span className="dt-rule__title">{d.colonia}</span>
                <span className="dt-address__sub">
                  {d.municipio}, {d.departamento}
                </span>
              </span>
              <a className="dt-outline dt-outline--small" href={ruta} target="_blank" rel="noreferrer">
                Abrir en Maps
              </a>
            </div>
          </motion.section>

          <hr className="dt-divider" />

          <motion.section className="dt-section" variants={fadeUp}>
            <div className="dt-score">
              <div className="dt-score__main">
                <span className="dt-score__num">{q.rating.toFixed(1)}</span>
                <span>
                  <Estrellas size={16} />
                  <span className="dt-score__sub">Solo estancias completadas</span>
                </span>
              </div>
              <button type="button" className="dt-link" onClick={() => ir('casa', q.id)}>
                Ver todo
              </button>
            </div>
            <Resena r={d.resena} texto={d.resena.texto} />
          </motion.section>
        </motion.div>
      </div>

      {/* Acciones sobre la galería */}
      <div className={`dt-top ${solido ? 'dt-top--solid' : ''}`}>
        <StatusBar tone={solido ? 'dark' : 'light'} />
        <div className="safe-top" />
        <div className="dt-top__row">
          <motion.button type="button" className="dt-round" whileTap={{ scale: 0.9 }} aria-label="Atrás" onClick={() => window.history.back()}>
            <Icon name="nav-arrow-left" size={20} />
          </motion.button>
          <div className="dt-top__right">
            <motion.button type="button" className="dt-round" whileTap={{ scale: 0.9 }} aria-label="Compartir" onClick={() => compartir(q)}>
              <Icon name="share" size={20} />
            </motion.button>
            <Corazon className="dt-round dt-heart" size={44} guardado={guardados.includes(q.id)} onToggle={() => alternarGuardado(q.id)} />
          </div>
        </div>
      </div>

      {/* Barra inferior fija */}
      <div className="dt-bar">
        <div className="dt-bar__price">
          <p>
            ${q.precio}
            <small>/mes</small>
          </p>
          <span>Depósito: {d.deposito}</span>
        </div>
        <div className="dt-bar__actions">
          <motion.button type="button" className="dt-btn" whileTap={{ scale: 0.96 }} onClick={() => ir('chat', q.id)}>
            <Icon name="chat-bubble-fill" size={16} className="dt-btn__icon" />
            Preguntar
          </motion.button>
          <motion.button
            type="button"
            className={`dt-btn dt-btn--primary ${solicitado ? 'dt-btn--done' : ''}`}
            whileTap={{ scale: 0.96 }}
            disabled={!q.disponible}
            onClick={() => !solicitado && setHoja(true)}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={solicitado ? 's' : q.disponible ? 'n' : 'x'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                {!q.disponible ? 'No disponible' : solicitado ? 'Solicitado' : 'Solicitar'}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      <HojaEnviarPerfil
        abierta={hoja}
        anfitrion={a}
        perfil={perfil}
        onClose={() => setHoja(false)}
        onEnviar={() => {
          setHoja(false)
          setSolicitado(true)
          setAviso(true)
          solicitar?.(q.id)
        }}
      />

      <AnimatePresence>{visor !== null && <VisorFotos fotos={d.galeria} inicio={visor} onCerrar={() => setVisor(null)} />}</AnimatePresence>

      <AnimatePresence>
        {aviso && (
          <motion.div className="dt-toast" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}>
            <Icon name="check-circle-fill" size={20} />
            Enviamos tu perfil a {a.corto}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/** 04 · Perfil de la casa. */
export function PerfilCasa({ id, ir, anfitrion }) {
  const q = buscarQuad(id) || buscarQuad('familia')
  const d = detalle(q)
  const a = d.anfitrion
  const c = d.casa
  const barras = [
    ['Limpieza', d.desglose.limpieza],
    ['Respeto de horarios', d.desglose.horarios],
    ['Comunicación', d.desglose.comunicacion],
    ['Seguridad', d.desglose.seguridad],
  ]

  return (
    <div className="home-screen hc">
      <div className="hc-header">
        <motion.button type="button" className="dt-round dt-round--border" whileTap={{ scale: 0.9 }} aria-label="Atrás" onClick={() => window.history.back()}>
          <Icon name="nav-arrow-left" size={20} />
        </motion.button>
        <h1>Perfil de la casa</h1>
        <motion.button type="button" className="dt-round dt-round--border" whileTap={{ scale: 0.9 }} aria-label="Compartir" onClick={() => compartir(q)}>
          <Icon name="share-ios" size={20} />
        </motion.button>
      </div>

      <motion.div className="home-scroll hc-scroll" variants={stagger} initial="hidden" animate="show">
        <div className="hc-top">
          <motion.div className="hc-card" variants={fadeUp}>
            <div className="hc-card__text">
              <h2>{c.nombre}</h2>
              <p>{c.descripcion}</p>
              <span className="hc-note">
                <Icon name="info-circle" size={14} />
                La familia decide qué información compartir
              </span>
            </div>
            <div className="hc-stats">
              <span>
                <b>{q.rating.toFixed(1)}</b>Calificación
              </span>
              <span>
                <b>{c.exinquilinos}</b>Exinquilinos
              </span>
              <span>
                <b>{c.enQuad}</b>En Quad
              </span>
            </div>
          </motion.div>

          <motion.section className="hc-section" variants={fadeUp}>
            <Titulo>Quiénes viven aquí</Titulo>
            <div className="hc-people">
              {d.miembros.map((p) => (
                <div key={p.nombre} className="hc-person">
                  <Avatar src={p.foto} nombre={p.nombre} size={44} tono={p.tono} />
                  <span className="hc-person__name">{p.nombre}</span>
                  <span className="hc-person__role">{p.rol}</span>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        <motion.section className="hc-section" variants={fadeUp}>
          <Titulo>Cómo es la convivencia</Titulo>
          <div className="hc-tags">
            {d.convivencia.map((t) => (
              <span key={t.label} className="hc-tag">
                <Icon name={t.icon} size={14} />
                {t.label}
              </span>
            ))}
          </div>
        </motion.section>

        <motion.section className="hc-section" variants={fadeUp}>
          <Titulo>{a.corto} se presenta</Titulo>
          <div className="hc-quote">
            <span className="hc-quote__mark">“</span>
            <p>{d.presentacion}</p>
            <div className="hc-quote__author">
              <Avatar src={a.foto} nombre={a.nombre} size={44} />
              <span>
                <b>{a.nombre}</b>
                <small>{a.firma}</small>
              </span>
            </div>
          </div>
        </motion.section>

        <motion.section className="hc-section" variants={fadeUp}>
          <Titulo enlace={`Ver ${d.resenas}`}>Reseñas de exinquilinos</Titulo>
          <div className="hc-bars">
            {barras.map(([k, v]) => (
              <div key={k} className="hc-bar">
                <span className="hc-bar__label">{k}</span>
                <span className="hc-bar__track">
                  <motion.span className="hc-bar__fill" initial={{ scaleX: 0 }} animate={{ scaleX: v / 5 }} transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }} />
                </span>
                <span className="hc-bar__num">{v.toFixed(1)}</span>
              </div>
            ))}
          </div>
          <Resena r={d.resena} texto={d.resena.textoCasa}>
            <span className="hc-contact">
              <Icon name="chat-bubble" size={16} />
              Aceptó que futuros inquilinos le escriban
            </span>
          </Resena>
        </motion.section>
      </motion.div>

      {anfitrion ? (
        <div className="dt-bar dt-bar--single hc-bar--host">
          <Button variant="outline" onClick={anfitrion.verComoEstudiante}>
            Ver como estudiante
          </Button>
          <Button onClick={anfitrion.editar}>Editar convivencia</Button>
        </div>
      ) : (
        <div className="dt-bar dt-bar--single">
          <motion.button type="button" className="hc-write" whileTap={{ scale: 0.97 }} onClick={() => ir('chat', q.id)}>
            <Icon name="chat-bubble-fill" size={20} />
            Escribir a {a.corto}
          </motion.button>
        </div>
      )}
    </div>
  )
}
