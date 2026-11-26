import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import StatusBar from '../../components/StatusBar.jsx'
import Icon from '../../components/Icon.jsx'
import Button from '../../components/Button.jsx'
import { ease, fadeUp, stagger } from '../../components/motion.js'
import { osmRuta } from '../../data/geo.js'
import { quad as buscarQuad } from '../../data/quads.js'
import { detalle } from '../../data/detalle.js'
import {
  ACCIONES_ESTANCIA,
  CATEGORIAS_REPORTE,
  CONDICIONES,
  COSTOS_AL_FIRMAR,
  COSTOS_MENSUALES,
  DESPUES_DE_VISITA,
  DETALLE_PAGO_INICIAL,
  ETIQUETAS_ESTRELLAS,
  FECHAS_SOLICITUD,
  LLEGADA,
  LO_QUE_GUSTO,
  MENSAJE_SALIDA,
  MENSAJE_SUGERIDO,
  METODOS_PAGO,
  METODO_RESUMEN,
  MOTIVOS_SALIDA,
  PARECIDOS,
  PASOS_ALQUILER,
  PENDIENTES,
  PREGUNTA_ANFITRIONA,
  QUE_REVISAR,
  QUAD_ID,
  REGLAS_CONTRATO,
  RENOVACIONES,
  REPORTE_EJEMPLO,
  RESENA_EJEMPLO,
  TITULOS,
  TOTAL_INICIAL,
  VISITA,
  anfitriona,
  quadAlquiler,
} from '../../data/alquiler.js'
import './alquiler.css'

/* ==========================================================
   Piezas compartidas del flujo (Figma: secciones "Alquiler · …")
   ========================================================== */

const iniciales = (n = '') =>
  n
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((x) => x[0])
    .join('')
    .toUpperCase()

/** Barra superior: atrás · título centrado · espaciador. */
function Barra({ titulo }) {
  return (
    <div className="al-top">
      <motion.button type="button" className="al-back" whileTap={{ scale: 0.9 }} aria-label="Atrás" onClick={() => window.history.back()}>
        <Icon name="nav-arrow-left" size={20} />
      </motion.button>
      <AnimatePresence mode="wait" initial={false}>
        <motion.h1 key={titulo} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }}>
          {titulo}
        </motion.h1>
      </AnimatePresence>
      <span className="al-top__space" />
    </div>
  )
}

/** Encabezado con ilustración circular (ícono 40 sobre círculo de 80). */
function Hero({ icon, tono = 'azul', titulo, children }) {
  return (
    <motion.div className="al-hero" variants={fadeUp}>
      <motion.span
        className={`al-hero__icon al-hero__icon--${tono}`}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 160, damping: 18, delay: 0.05 }}
      >
        <Icon name={icon} size={40} />
      </motion.span>
      <h2>{titulo}</h2>
      {children && <p>{children}</p>}
    </motion.div>
  )
}

/** Encabezado alineado a la izquierda (con "Paso n de 2" opcional). */
function Titulo({ paso, titulo, children }) {
  return (
    <motion.div className="al-title" variants={fadeUp}>
      {paso && <span className="al-title__step">{paso}</span>}
      <h2>{titulo}</h2>
      {children && <p>{children}</p>}
    </motion.div>
  )
}

/** Quad en conversación: foto, nombre y precio; abre el detalle. */
function QuadCard({ ir }) {
  const q = quadAlquiler()
  return (
    <motion.button type="button" className="al-quad" variants={fadeUp} whileTap={{ scale: 0.985 }} onClick={() => ir('quad', q.id)}>
      <img src={q.foto} alt="" />
      <span>
        <b>{detalle(q).tituloLargo}</b>
        <small>${q.precio}/mes</small>
      </span>
      <Icon name="nav-arrow-right" size={18} />
    </motion.button>
  )
}

/** Tarjeta blanca con encabezado y enlace opcional. */
function Card({ titulo, enlace, onEnlace, className = '', children }) {
  return (
    <motion.section className={`al-card ${className}`} variants={fadeUp}>
      {(titulo || enlace) && (
        <div className="al-card__head">
          <h3>{titulo}</h3>
          {enlace && (
            <button type="button" className="al-link" onClick={onEnlace}>
              {enlace}
            </button>
          )}
        </div>
      )}
      {children}
    </motion.section>
  )
}

/** Filas "dato = valor" con divisores. La fila total va resaltada. */
function Datos({ filas, total }) {
  return (
    <div className="al-datos">
      {filas.map(([k, v]) => (
        <div key={k} className="al-dato">
          <span>{k}</span>
          <b>{v}</b>
        </div>
      ))}
      {total && (
        <div className="al-dato al-dato--total">
          <span>{total[0]}</span>
          <b>{total[1]}</b>
        </div>
      )}
    </div>
  )
}

/** Indicador de paso: listo (check), actual (anillo azul) o pendiente (anillo gris). */
function Marca({ estado }) {
  return (
    <span className={`al-mark al-mark--${estado}`}>
      <AnimatePresence initial={false} mode="popLayout">
        {estado === 'ok' ? (
          <motion.span key="ok" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 420, damping: 24 }}>
            <Icon name="check-circle-fill" size={22} />
          </motion.span>
        ) : (
          <motion.span key="ring" className="al-mark__ring" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} />
        )}
      </AnimatePresence>
    </span>
  )
}

/** Lista de pasos (estado de la solicitud, pendientes, devolución…). */
function Pasos({ items, onToggle }) {
  return (
    <div className="al-pasos">
      {items.map((p) => {
        const Tag = onToggle && p.toggle !== false ? motion.button : 'div'
        return (
          <Tag
            key={p.id || p.titulo}
            type={Tag === 'div' ? undefined : 'button'}
            className={`al-paso ${p.estado === 'pendiente' ? 'al-paso--muted' : ''}`}
            onClick={Tag === 'div' ? undefined : () => onToggle(p.id)}
            whileTap={Tag === 'div' ? undefined : { scale: 0.98 }}
          >
            <Marca estado={p.estado} />
            <span>
              <b>{p.titulo}</b>
              {p.texto && <small>{p.texto}</small>}
            </span>
          </Tag>
        )
      })}
    </div>
  )
}

function Nota({ children, icon = 'hero-envelope-solid' }) {
  return (
    <motion.div className="note al-note" variants={fadeUp}>
      <Icon name={icon} size={16} className="note__icon" />
      <p>{children}</p>
    </motion.div>
  )
}

function Badge({ tono = 'green', icon, children }) {
  return (
    <span className={`al-badge al-badge--${tono}`}>
      {icon && <Icon name={icon} size={14} />}
      {children}
    </span>
  )
}

/** Persona: avatar (foto o iniciales) + nombre + detalle + insignia opcional. */
function Persona({ foto, nombre, texto, badge }) {
  return (
    <div className="al-persona">
      {foto ? <img src={foto} alt="" /> : <span className="al-persona__ini">{iniciales(nombre)}</span>}
      <span>
        <b>{nombre}</b>
        <small>{texto}</small>
      </span>
      <AnimatePresence mode="wait" initial={false}>
        {badge && (
          <motion.span key={badge.key} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }} transition={{ type: 'spring', stiffness: 420, damping: 26 }}>
            {badge.node}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Opción grande con ícono en caja, textos y check / radio (R03, R13). */
function Opcion({ icon, titulo, texto, selected, onSelect }) {
  return (
    <motion.button type="button" role="radio" aria-checked={selected} className={`al-opt ${selected ? 'al-opt--on' : ''}`} variants={fadeUp} whileTap={{ scale: 0.99 }} onClick={onSelect}>
      {icon && (
        <span className="al-opt__icon">
          <Icon name={icon} size={20} />
        </span>
      )}
      <span className="al-opt__text">
        <b>{titulo}</b>
        <small>{texto}</small>
      </span>
      <span className="al-opt__check">
        <AnimatePresence initial={false} mode="popLayout">
          {selected ? (
            <motion.span key="on" initial={{ scale: 0.4 }} animate={{ scale: 1 }} exit={{ scale: 0.4, opacity: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 26 }}>
              <Icon name="check-circle-fill" size={22} />
            </motion.span>
          ) : (
            <motion.span key="off" className="al-mark__ring" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          )}
        </AnimatePresence>
      </span>
    </motion.button>
  )
}

/** Chips de filtro (azules al seleccionar). */
function Chips({ opciones, seleccion, onToggle, label }) {
  return (
    <div className="al-chips" role="group" aria-label={label}>
      {opciones.map((o) => {
        const on = seleccion.includes(o)
        return (
          <motion.button key={o} type="button" aria-pressed={on} className={`al-chip ${on ? 'al-chip--on' : ''}`} whileTap={{ scale: 0.95 }} onClick={() => onToggle(o)}>
            {o}
          </motion.button>
        )
      })}
    </div>
  )
}

function Campo({ label, children }) {
  return (
    <motion.div className="al-field" variants={fadeUp}>
      <span className="al-field__label">{label}</span>
      {children}
    </motion.div>
  )
}

/** Método de pago elegido (tarjeta pequeña + textos + "Cambiar"). */
function MetodoElegido({ metodo, ir }) {
  const m = METODO_RESUMEN[metodo]
  return (
    <Card titulo="Método de pago">
      <div className="al-metodo">
        <span className="al-metodo__card">{m.marca}</span>
        <span>
          <b>{m.titulo}</b>
          <small>{m.texto}</small>
        </span>
        <button type="button" className="al-link" onClick={() => ir('alquiler', 'metodo')}>
          Cambiar
        </button>
      </div>
    </Card>
  )
}

/** Cuerpo desplazable + barra de acciones (uno o dos botones). */
function Pantalla({ children, acciones }) {
  return (
    <>
      <div className="al-scroll">
        <motion.div className="al-body" variants={stagger} initial="hidden" animate="show">
          {children}
        </motion.div>
      </div>
      {acciones && <div className="al-actions">{acciones}</div>}
    </>
  )
}

/** Botón principal con estado de carga (para pagos y firmas simuladas). */
function BotonCarga({ cargando, children, ...props }) {
  return (
    <Button {...props} className={cargando ? 'btn--loading' : ''} disabled={props.disabled || cargando}>
      <AnimatePresence mode="wait" initial={false}>
        {cargando ? (
          <motion.span key="c" className="al-spinner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-label="Procesando" />
        ) : (
          <motion.span key="t" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  )
}

/* ==========================================================
   Pantallas R01–R28
   ========================================================== */

function R01Visita({ ir, a, estado, set, avisar }) {
  const q = quadAlquiler()
  return (
    <Pantalla
      acciones={
        <>
          <Button
            onClick={() => {
              set({ visitaAgregada: true })
              avisar('Agregamos la visita a tu calendario')
              // Simulación: llega el recordatorio del día de la visita
              setTimeout(() => avisar(`Recordatorio: tu visita es hoy a las ${VISITA.hora}`, { texto: 'Ver', alHacer: () => ir('alquiler', 'recordatorio') }, 6000), 2600)
            }}
          >
            {estado.visitaAgregada ? 'Agregada al calendario' : 'Agregar al calendario'}
          </Button>
          <Button variant="outline" onClick={() => window.open(osmRuta(q.pos, 'walking'), '_blank', 'noreferrer')}>
            Cómo llegar
          </Button>
        </>
      }
    >
      <Hero icon="calendar-fill" titulo="Tu visita está confirmada">
        {a.corto} te espera {VISITA.fechaLarga}.
      </Hero>
      <QuadCard ir={ir} />
      <Card titulo="Detalles de la visita">
        <Datos
          filas={[
            ['Fecha', VISITA.fecha],
            ['Hora', VISITA.hora],
            ['Dirección', VISITA.direccion],
            ['Duración', VISITA.duracion],
          ]}
        />
      </Card>
      <Nota>Te recordaremos un día antes y una hora antes de la visita.</Nota>
    </Pantalla>
  )
}

function R02Recordatorio({ ir }) {
  const [hechos, setHechos] = useState([])
  const alternar = (id) => setHechos((h) => (h.includes(id) ? h.filter((x) => x !== id) : [...h, id]))
  return (
    <Pantalla
      acciones={
        <>
          <Button onClick={() => ir('alquiler', 'visita-realizada')}>Ya llegué</Button>
          <Button variant="outline" onClick={() => ir('chat', QUAD_ID)}>
            Reprogramar
          </Button>
        </>
      }
    >
      <motion.div className="al-banner" variants={fadeUp}>
        <Icon name="clock-fill" size={22} />
        <span>
          <b>Tu visita es hoy a las {VISITA.hora}</b>
          <small>Faltan 2 horas · {VISITA.direccion}</small>
        </span>
      </motion.div>
      <QuadCard ir={ir} />
      <Card titulo="Qué revisar en la visita">
        <Pasos items={QUE_REVISAR.map((x) => ({ ...x, estado: hechos.includes(x.id) ? 'ok' : 'pendiente' }))} onToggle={alternar} />
      </Card>
    </Pantalla>
  )
}

function R03VisitaRealizada({ ir, a }) {
  const [opcion, setOpcion] = useState('solicitar')
  const seguir = () => {
    if (opcion === 'solicitar') ir('alquiler', 'solicitud')
    else if (opcion === 'preguntas') ir('chat', QUAD_ID)
    else ir('explorar')
  }
  return (
    <Pantalla acciones={<Button onClick={seguir}>Continuar</Button>}>
      <Hero icon="check-circle-fill" titulo="¿Qué te pareció el quad?">
        Si te gustó, puedes enviar tu solicitud a {a.corto} desde aquí.
      </Hero>
      <div className="al-opts" role="radiogroup" aria-label="Qué quieres hacer">
        {DESPUES_DE_VISITA.map((o) => (
          <Opcion key={o.id} icon={o.icon} titulo={o.titulo} texto={o.texto(a.corto)} selected={opcion === o.id} onSelect={() => setOpcion(o.id)} />
        ))}
      </div>
    </Pantalla>
  )
}

function R04Solicitud({ ir, a, yo, estado, set }) {
  const mensaje = estado.mensaje ?? MENSAJE_SUGERIDO
  return (
    <Pantalla
      acciones={
        <Button onClick={() => ir('alquiler', 'costos')} disabled={!mensaje.trim()}>
          Continuar
        </Button>
      }
    >
      <Titulo paso="Paso 1 de 2" titulo="Preséntate con la familia">
        {a.corto} verá tu perfil verificado junto con este mensaje.
      </Titulo>
      <Card className="al-card--tight">
        <Persona foto={yo.foto} nombre={yo.nombreCompleto} texto={yo.corto} badge={{ key: 'v', node: <Badge icon="check-circle-fill">{yo.verificada}</Badge> }} />
      </Card>
      <motion.textarea
        className="textarea al-textarea"
        variants={fadeUp}
        aria-label={`Mensaje para ${a.corto}`}
        maxLength={300}
        value={mensaje}
        onChange={(e) => set({ mensaje: e.target.value })}
      />
      <Card titulo="Fechas">
        <Datos filas={FECHAS_SOLICITUD} />
      </Card>
    </Pantalla>
  )
}

function R05Costos({ ir, a, set }) {
  return (
    <Pantalla
      acciones={
        <Button
          onClick={() => {
            set({ solicitud: 'enviada', respuestaEn: Date.now() })
            ir('alquiler', 'enviada', { replace: true })
          }}
        >
          Enviar solicitud
        </Button>
      }
    >
      <Titulo paso="Paso 2 de 2" titulo="Revisa los costos" />
      <QuadCard ir={ir} />
      <Card titulo="Al firmar el contrato">
        <Datos filas={COSTOS_AL_FIRMAR} total={['Total', `$${TOTAL_INICIAL}`]} />
      </Card>
      <Card titulo="Cada mes">
        <Datos filas={COSTOS_MENSUALES} />
      </Card>
      <Nota>No pagas nada ahora. Solo pagarás si {a.corto} acepta y las dos firman el contrato.</Nota>
    </Pantalla>
  )
}

function R06Enviada({ ir, a, estado, set, avisar }) {
  const aceptada = estado.solicitud === 'aceptada'
  // Simulación: la anfitriona responde a los pocos segundos
  useEffect(() => {
    if (estado.solicitud !== 'enviada') return
    const t = setTimeout(() => {
      set({ solicitud: 'aceptada' })
      avisar(`${a.corto} aceptó tu solicitud`, { texto: 'Ver', alHacer: () => ir('alquiler', 'aceptada') }, 6000)
    }, 4200)
    return () => clearTimeout(t)
  }, [estado.solicitud]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Pantalla
      acciones={
        <>
          <Button onClick={() => (aceptada ? ir('alquiler', 'aceptada') : ir('perfil'))}>Ver mis solicitudes</Button>
          <Button variant="outline" onClick={() => ir('explorar')}>
            Volver al inicio
          </Button>
        </>
      }
    >
      <Hero icon="check-circle-fill" titulo="Solicitud enviada">
        {a.corto} suele responder en menos de 24 horas. Te avisaremos en cuanto lo haga.
      </Hero>
      <Card titulo="Estado de tu solicitud">
        <Pasos
          items={[
            { titulo: 'Solicitud enviada', texto: 'Hoy, 9:24 a. m.', estado: 'ok' },
            { titulo: `Respuesta de ${a.corto}`, texto: aceptada ? 'Aceptó tu solicitud' : 'Esperando respuesta', estado: aceptada ? 'ok' : 'actual' },
            { titulo: 'Contrato', texto: 'Revisar y firmar', estado: aceptada ? 'actual' : 'pendiente' },
            { titulo: 'Pago', texto: 'Depósito y primer mes', estado: 'pendiente' },
          ]}
        />
      </Card>
    </Pantalla>
  )
}

function R07Rechazada({ ir, respuesta }) {
  const q = buscarQuad(respuesta?.quadId) || quadAlquiler()
  const h = detalle(q).anfitrion
  return (
    <Pantalla
      acciones={
        <>
          <Button onClick={() => ir('resultados', q.zonaId)}>Ver quads parecidos</Button>
          <Button variant="outline" onClick={() => ir('explorar')}>
            Volver al inicio
          </Button>
        </>
      }
    >
      <Hero icon="info-circle-fill" tono="gris" titulo={`${h.corto} no aceptó tu solicitud`}>
        Ya tiene a alguien para esas fechas. No te desanimes: hay quads parecidos cerca de la UCA.
      </Hero>
      <Card titulo="Motivo">
        <p className="al-texto">Las fechas no coinciden con su disponibilidad.</p>
      </Card>
      <Card titulo="Quads parecidos" enlace="Ver todos" onEnlace={() => ir('resultados', q.zonaId)}>
        <div className="al-datos">
          {PARECIDOS.filter((p) => p.id !== q.id).map((p) => (
            <motion.button key={p.id} type="button" className="al-dato al-dato--link" whileTap={{ scale: 0.99 }} onClick={() => ir('quad', p.id)}>
              <span>{p.titulo}</span>
              <b>{p.precio}</b>
            </motion.button>
          ))}
        </div>
      </Card>
    </Pantalla>
  )
}

function R08MasInfo({ ir, respuesta }) {
  const q = buscarQuad(respuesta?.quadId) || quadAlquiler()
  const h = detalle(q).anfitrion
  return (
    <Pantalla acciones={<Button onClick={() => ir('chat', q.id)}>Responder en el chat</Button>}>
      <Hero icon="chat-bubble-solid" titulo={`${h.corto} quiere saber algo más`}>
        Tu solicitud sigue activa. Respóndele para que pueda decidir.
      </Hero>
      <Card>
        <Persona foto={h.foto} nombre={h.nombre} texto={`${h.rol} · hace 10 min`} />
        <p className="al-bubble">{PREGUNTA_ANFITRIONA}</p>
      </Card>
      <Nota>Si no respondes en 48 horas, la solicitud se cancela y {h.corto} podrá aceptar a otra persona.</Nota>
    </Pantalla>
  )
}

function R09Aceptada({ ir, a }) {
  return (
    <Pantalla acciones={<Button onClick={() => ir('alquiler', 'contrato')}>Revisar contrato</Button>}>
      <Hero icon="check-circle-fill" tono="verde" titulo={`¡${a.corto} aceptó tu solicitud!`}>
        El siguiente paso es revisar y firmar el contrato. Tienes 48 horas para hacerlo.
      </Hero>
      <QuadCard ir={ir} />
      <Card titulo="Tu proceso">
        <Pasos
          items={[
            { titulo: 'Solicitud enviada', texto: '7 de nov', estado: 'ok' },
            { titulo: `${a.corto} aceptó`, texto: 'Hoy, 8:40 a. m.', estado: 'ok' },
            { titulo: 'Contrato', texto: 'Revisar y firmar', estado: 'actual' },
            { titulo: 'Pago', texto: `Depósito y primer mes · $${TOTAL_INICIAL}`, estado: 'pendiente' },
          ]}
        />
      </Card>
    </Pantalla>
  )
}

function R10Contrato({ ir, a, yo, estado, set, avisar }) {
  const [acepto, setAcepto] = useState(estado.contratoFirmado)
  return (
    <Pantalla
      acciones={
        estado.contratoFirmado ? (
          <Button variant="outline" onClick={() => window.history.back()}>
            Volver
          </Button>
        ) : (
          <Button
            disabled={!acepto}
            onClick={() => {
              set({ contratoFirmado: true })
              ir('alquiler', 'esperando-firma', { replace: true })
            }}
          >
            Firmar contrato
          </Button>
        )
      }
    >
      <Titulo titulo="Contrato de alquiler">Revisa los puntos clave antes de firmar. También puedes leer el documento completo.</Titulo>
      <Card titulo="Partes">
        <Persona foto={a.foto} nombre={a.nombre} texto={`${a.rol} · identidad verificada`} />
        <Persona foto={yo.foto} nombre={yo.nombreCompleto} texto={`Estudiante · ${yo.carreraUni}`} />
      </Card>
      <Card titulo="Condiciones">
        <Datos filas={CONDICIONES} />
      </Card>
      <Card titulo="Reglas de la casa">
        <Datos filas={REGLAS_CONTRATO} />
      </Card>
      <motion.button type="button" className="al-pdf" variants={fadeUp} whileTap={{ scale: 0.99 }} onClick={() => avisar('Descargamos el contrato en PDF')}>
        Leer contrato completo (PDF)
      </motion.button>
      {!estado.contratoFirmado && (
        <motion.button type="button" role="checkbox" aria-checked={acepto} className="al-accept" variants={fadeUp} onClick={() => setAcepto((v) => !v)}>
          <span className={`al-box ${acepto ? 'al-box--on' : ''}`}>
            <AnimatePresence>
              {acepto && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 26 }}>
                  <Icon name="check-circle-fill" size={22} />
                </motion.span>
              )}
            </AnimatePresence>
          </span>
          Leí y acepto el contrato y las reglas de la casa.
        </motion.button>
      )}
    </Pantalla>
  )
}

const BADGE_FIRMADO = { key: 'f', node: <Badge icon="check-circle-fill">Firmado</Badge> }
const BADGE_PENDIENTE = { key: 'p', node: <Badge tono="amber" icon="clock-fill">Pendiente</Badge> }

function R11EsperandoFirma({ ir, a, yo, estado, set }) {
  // Simulación: la anfitriona firma y se pasa a "Contrato firmado"
  useEffect(() => {
    if (estado.anfitrionaFirmo) return
    const t1 = setTimeout(() => set({ anfitrionaFirmo: true }), 3600)
    return () => clearTimeout(t1)
  }, [estado.anfitrionaFirmo]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!estado.anfitrionaFirmo) return
    const t2 = setTimeout(() => ir('alquiler', 'firmado', { replace: true }), 1300)
    return () => clearTimeout(t2)
  }, [estado.anfitrionaFirmo]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Pantalla
      acciones={
        <>
          <Button onClick={() => ir('alquiler', 'contrato')}>Ver contrato</Button>
          <Button variant="outline" onClick={() => ir('explorar')}>
            Volver al inicio
          </Button>
        </>
      }
    >
      <Hero icon="clock-fill" tono="amarillo" titulo="Ya firmaste el contrato">
        Ahora falta la firma de {a.corto}. Te avisaremos en cuanto firme.
      </Hero>
      <Card titulo="Firmas">
        <Persona foto={yo.foto} nombre={yo.nombreCompleto} texto="Firmó hoy, 9:24 a. m." badge={BADGE_FIRMADO} />
        <Persona foto={a.foto} nombre={a.nombre} texto={estado.anfitrionaFirmo ? 'Firmó hoy, 9:26 a. m.' : a.rol} badge={estado.anfitrionaFirmo ? BADGE_FIRMADO : BADGE_PENDIENTE} />
      </Card>
      <Nota>{a.corto} tiene 48 horas para firmar. Si no lo hace, la solicitud se cancela sin costo para ti.</Nota>
    </Pantalla>
  )
}

function R12Firmado({ ir, a, yo, avisar }) {
  return (
    <Pantalla acciones={<Button onClick={() => ir('alquiler', 'metodo')}>Pagar ${TOTAL_INICIAL}</Button>}>
      <Hero icon="check-circle-fill" tono="verde" titulo="Contrato firmado">
        Las dos firmaron. Para apartar el quad, paga el depósito y el primer mes.
      </Hero>
      <Card titulo="Firmas" enlace="Ver PDF" onEnlace={() => avisar('Descargamos el contrato en PDF')}>
        <Persona foto={yo.foto} nombre={yo.nombreCompleto} texto="Firmó el 19 de nov" badge={BADGE_FIRMADO} />
        <Persona foto={a.foto} nombre={a.nombre} texto="Firmó el 19 de nov" badge={BADGE_FIRMADO} />
      </Card>
      <Card titulo="Por pagar">
        <Datos filas={COSTOS_AL_FIRMAR.slice(0, 2)} total={['Total · vence en 48 h', `$${TOTAL_INICIAL}`]} />
      </Card>
    </Pantalla>
  )
}

function R13Metodo({ ir, estado, set }) {
  return (
    <Pantalla acciones={<Button onClick={() => (estado.pagado ? window.history.back() : ir('alquiler', 'pagar'))}>Continuar</Button>}>
      <Titulo titulo="¿Cómo quieres pagar?">Usarás el mismo método para tus pagos mensuales. Puedes cambiarlo cuando quieras.</Titulo>
      <div className="al-opts" role="radiogroup" aria-label="Método de pago">
        {METODOS_PAGO.map((m) => (
          <Opcion key={m.id} icon={m.icon} titulo={m.titulo} texto={m.texto} selected={estado.metodo === m.id} onSelect={() => set({ metodo: m.id })} />
        ))}
      </div>
      <Nota>Quad guarda tu depósito durante toda la estancia y te lo devuelve al salir si todo está en orden.</Nota>
    </Pantalla>
  )
}

/** Pago simulado: unos segundos "procesando" y luego el comprobante. */
function usePago(alTerminar) {
  const [cargando, setCargando] = useState(false)
  const pagar = () => {
    setCargando(true)
    setTimeout(alTerminar, 1400)
  }
  return [cargando, pagar]
}

function R14Pagar({ ir, a, estado, set }) {
  const [cargando, pagar] = usePago(() => {
    set({ pagado: true })
    ir('alquiler', 'comprobante', { replace: true })
  })
  return (
    <Pantalla
      acciones={
        <BotonCarga cargando={cargando} onClick={pagar}>
          Pagar ${TOTAL_INICIAL}.00
        </BotonCarga>
      }
    >
      <motion.div className="al-monto" variants={fadeUp}>
        <span>Total a pagar</span>
        <b>${TOTAL_INICIAL}.00</b>
        <small>Depósito y primer mes</small>
      </motion.div>
      <QuadCard ir={ir} />
      <Card titulo="Detalle">
        <Datos filas={DETALLE_PAGO_INICIAL} total={['Total', `$${TOTAL_INICIAL}.00`]} />
      </Card>
      <MetodoElegido metodo={estado.metodo} ir={ir} />
      <Nota icon="shield-check-fill">Pago protegido. {a.corto} recibe el primer mes cuando confirmes tu llegada.</Nota>
    </Pantalla>
  )
}

/** Comprobante o recibo con check, monto y datos. */
function Comprobante({ monto, sub, filas }) {
  return (
    <motion.section className="al-card al-receipt" variants={fadeUp}>
      <div className="al-receipt__head">
        <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}>
          <Icon name="check-circle-fill" size={40} />
        </motion.span>
        <b>{monto}</b>
        <small>{sub}</small>
      </div>
      <Datos filas={filas.slice(0, -1)} total={filas[filas.length - 1]} />
    </motion.section>
  )
}

function R15Comprobante({ ir, a, yo, estado, avisar }) {
  return (
    <Pantalla
      acciones={
        <>
          <Button onClick={() => ir('alquiler', 'apartado', { replace: true })}>Continuar</Button>
          <Button variant="outline" onClick={() => avisar('Descargamos el comprobante en PDF')}>
            Descargar PDF
          </Button>
        </>
      }
    >
      <Comprobante
        monto={`$${TOTAL_INICIAL}.00`}
        sub="Pago aprobado · 19 nov 2026, 9:31 a. m."
        filas={[
          ['N.º de comprobante', 'QD-2026-1187'],
          ['Pagado por', yo.nombreCompleto],
          ['Para', a.nombre],
          ['Concepto', 'Depósito y primer mes'],
          ['Quad', detalle(quadAlquiler()).tituloLargo],
          ['Método', METODO_RESUMEN[estado.metodo].corto],
          ['Total', `$${TOTAL_INICIAL}.00`],
        ]}
      />
    </Pantalla>
  )
}

function R16Apartado({ ir, a, estado }) {
  const faltan = PENDIENTES.length - estado.pendientes.length
  return (
    <Pantalla acciones={<Button onClick={() => ir('alquiler', 'pendientes')}>Ver qué falta antes de llegar</Button>}>
      <Hero icon="check-circle-fill" tono="verde" titulo="¡Tu quad está apartado!">
        {a.corto} ya sabe que pagaste. Te espera el 1 de diciembre.
      </Hero>
      <QuadCard ir={ir} />
      <Card titulo="Tu llegada">
        <Datos filas={LLEGADA} />
      </Card>
      <Card titulo="Tu proceso">
        <Pasos
          items={[
            { titulo: 'Contrato firmado', estado: 'ok' },
            { titulo: 'Pago realizado', texto: `$${TOTAL_INICIAL}.00`, estado: 'ok' },
            { titulo: 'Antes de llegar', texto: faltan ? `${faltan} pendientes` : 'Todo listo', estado: faltan ? 'actual' : 'ok' },
          ]}
        />
      </Card>
    </Pantalla>
  )
}

function R17Pendientes({ ir, a, estado, set, avisar }) {
  const listos = estado.pendientes
  const todo = listos.length === PENDIENTES.length
  const alternar = (id) => set({ pendientes: listos.includes(id) ? listos.filter((x) => x !== id) : [...listos, id] })
  const pendientes = PENDIENTES.filter((p) => !listos.includes(p.id))
  const hechos = PENDIENTES.filter((p) => listos.includes(p.id))
  const primero = pendientes[0]

  const accion = () => {
    if (todo) return ir('alquiler', 'estancia')
    alternar(primero.id)
    if (primero.id === 'hora') avisar(`Le avisamos a ${a.corto} que llegas a las 2:00 p. m.`)
  }

  return (
    <Pantalla acciones={<Button onClick={accion}>{todo ? 'Ir a mi estancia' : primero.titulo}</Button>}>
      <Titulo titulo="Faltan 12 días para tu llegada">Completa estos pendientes para que tu primer día sea tranquilo.</Titulo>
      <Card titulo={`${listos.length} de ${PENDIENTES.length} listos`} className="al-card--tight">
        <div className="al-progress">
          <motion.span initial={false} animate={{ width: `${(listos.length / PENDIENTES.length) * 100}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
        </div>
      </Card>
      <AnimatePresence initial={false}>
        {pendientes.length > 0 && (
          <motion.div key="p" exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease }}>
            <Card titulo="Pendientes">
              <Pasos items={pendientes.map((p, i) => ({ ...p, estado: i === 0 ? 'actual' : 'pendiente' }))} onToggle={alternar} />
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      <Card titulo="Listos">
        <Pasos items={hechos.map((p) => ({ id: p.id, titulo: p.titulo, estado: 'ok' }))} onToggle={alternar} />
      </Card>
    </Pantalla>
  )
}

function R18Estancia({ ir, a, estado, avisar }) {
  const q = quadAlquiler()
  const eneroPagado = estado.pagosMes.includes('enero')
  const fin = estado.renovacion?.firmada ? estado.renovacion.vigencia.split(' – ')[1] : '31 may 2027'
  const dias = estado.renovacion?.firmada ? 132 + { ciclo: 183, tres: 92, anio: 366 }[estado.renovacion.id] : 132
  return (
    <Pantalla>
      <Card className="al-card--tight">
        <div className="al-persona al-persona--quad">
          {a.foto ? <img src={a.foto} alt="" /> : <span className="al-persona__ini">{iniciales(a.nombre)}</span>}
          <span>
            <b>{detalle(q).tituloLargo}</b>
            <small>
              {a.nombre} · {a.rol}
            </small>
          </span>
          <Badge icon="check-circle-fill">Al día</Badge>
        </div>
      </Card>
      <Card titulo="Contrato" enlace="Ver PDF" onEnlace={() => avisar('Descargamos el contrato en PDF')}>
        <div className="al-progress al-progress--label">
          <motion.span initial={{ width: 0 }} animate={{ width: `${Math.max(8, 100 - (dias / 182) * 100)}%` }} transition={{ duration: 0.8, ease }} />
        </div>
        <span className="al-progress__text">Termina en {dias} días</span>
        <Datos
          filas={[
            ['Vigencia', `1 dic 2026 – ${fin}`],
            ['Mensualidad', '$115 · cada día 1'],
            ['Depósito', '$115 · en resguardo'],
          ]}
        />
      </Card>
      <motion.section className="al-next" variants={fadeUp}>
        <div className="al-next__row">
          <Icon name="calendar-fill" size={22} />
          <span>
            <b>{eneroPagado ? 'Próximo pago: 1 de febrero' : 'Próximo pago: 1 de enero'}</b>
            <small>$115 · se cobra a tu {METODO_RESUMEN[estado.metodo].corto}</small>
          </span>
        </div>
        {!eneroPagado && (
          <motion.button type="button" className="al-small-btn" whileTap={{ scale: 0.98 }} onClick={() => ir('alquiler', 'pagar-mes')}>
            Pagar ahora
          </motion.button>
        )}
      </motion.section>
      <div className="al-acciones">
        {ACCIONES_ESTANCIA.map((x) => (
          <motion.button key={x.id} type="button" className="option option--action" variants={fadeUp} whileTap={{ scale: 0.99 }} onClick={() => ir('alquiler', x.id)}>
            <Icon name={x.icon} size={24} className="option__icon option__icon--svg" />
            <span className="option__texts">
              <span className="option__title">{x.titulo}</span>
              <span className="option__desc">{x.texto}</span>
            </span>
            <Icon name="nav-arrow-right" size={18} className="option__chevron" />
          </motion.button>
        ))}
      </div>
      <Card titulo="Pagos" enlace="Ver todos" onEnlace={() => ir('alquiler', 'recibo')}>
        <div className="al-pagos">
          {[
            eneroPagado
              ? { mes: 'Febrero', texto: '$115 · vence el 1 de feb', estado: 'proximo' }
              : { mes: 'Enero', texto: '$115 · vence el 1 de ene', estado: 'proximo' },
            ...(eneroPagado ? [{ mes: 'Enero', texto: '$115 · pagado el 28 de dic', estado: 'pagado' }] : []),
            { mes: 'Diciembre', texto: '$115 · pagado el 19 de nov', estado: 'pagado' },
          ].map((p) => (
            <motion.button key={p.mes} type="button" layout className="al-pago" whileTap={{ scale: 0.99 }} onClick={() => ir('alquiler', p.estado === 'pagado' ? 'recibo' : 'pagar-mes')}>
              <span className={`al-pago__icon al-pago__icon--${p.estado}`}>
                <Icon name="dollar-circle-fill" size={20} />
              </span>
              <span>
                <b>{p.mes}</b>
                <small>{p.texto}</small>
              </span>
              {p.estado === 'pagado' ? (
                <Badge tono="green-strong" icon="check-circle-fill">
                  Pagado
                </Badge>
              ) : (
                <Badge tono="outline" icon="calendar-fill">
                  Próximo
                </Badge>
              )}
            </motion.button>
          ))}
        </div>
      </Card>
    </Pantalla>
  )
}

function R19PagarMes({ ir, estado, set }) {
  const [cargando, pagar] = usePago(() => {
    set({ pagosMes: [...estado.pagosMes, 'enero'] })
    ir('alquiler', 'recibo', { replace: true })
  })
  return (
    <Pantalla
      acciones={
        <BotonCarga cargando={cargando} onClick={pagar}>
          Pagar $115.00
        </BotonCarga>
      }
    >
      <motion.div className="al-monto" variants={fadeUp}>
        <span>Pago de enero</span>
        <b>$115.00</b>
        <Badge tono="amber" icon="clock-fill">
          Vence el 1 de ene
        </Badge>
      </motion.div>
      <Card titulo="Detalle">
        <Datos
          filas={[
            ['Mensualidad de enero', '$115.00'],
            ['Recargo por atraso', '$0.00'],
          ]}
          total={['Total', '$115.00']}
        />
      </Card>
      <MetodoElegido metodo={estado.metodo} ir={ir} />
      <Nota>Puedes activar el pago automático para no preocuparte cada mes.</Nota>
    </Pantalla>
  )
}

function R20Recibo({ a, yo, estado, avisar }) {
  const enero = estado.pagosMes.includes('enero')
  return (
    <Pantalla
      acciones={
        <>
          <Button onClick={() => window.history.back()}>Volver a mi estancia</Button>
          <Button variant="outline" onClick={() => avisar('Descargamos el recibo en PDF')}>
            Descargar recibo
          </Button>
        </>
      }
    >
      <Comprobante
        monto="$115.00"
        sub={enero ? 'Pago de enero · 28 dic 2026, 7:02 p. m.' : 'Pago de diciembre · 19 nov 2026, 9:31 a. m.'}
        filas={[
          ['N.º de recibo', enero ? 'QD-2026-1342' : 'QD-2026-1187'],
          ['Pagado por', yo.nombreCompleto],
          ['Para', a.nombre],
          ['Periodo', enero ? '1 – 31 ene 2027' : '1 – 31 dic 2026'],
          ['Método', METODO_RESUMEN[estado.metodo].corto],
          ['Total', '$115.00'],
        ]}
      />
    </Pantalla>
  )
}

function R21Reportar({ ir, a, set }) {
  const [cat, setCat] = useState('Agua')
  const [texto, setTexto] = useState(REPORTE_EJEMPLO)
  const [fotos, setFotos] = useState(0)
  return (
    <Pantalla
      acciones={
        <Button
          disabled={!texto.trim()}
          onClick={() => {
            set({ reporte: { categoria: cat, texto: texto.trim() } })
            ir('alquiler', 'reporte-enviado', { replace: true })
          }}
        >
          Enviar reporte
        </Button>
      }
    >
      <Titulo titulo="¿Qué está pasando?">{a.corto} recibirá tu reporte. Si es urgente, el equipo de Quad también te contactará.</Titulo>
      <Campo label="Categoría">
        <Chips label="Categoría" opciones={CATEGORIAS_REPORTE} seleccion={[cat]} onToggle={setCat} />
      </Campo>
      <Campo label="Cuéntanos más">
        <textarea className="textarea al-textarea al-textarea--short" aria-label="Cuéntanos más" maxLength={300} value={texto} onChange={(e) => setTexto(e.target.value)} />
      </Campo>
      <Campo label="Fotos (opcional)">
        <div className="al-fotos">
          {[0, 1].map((i) => (
            <motion.button key={i} type="button" className={`al-foto ${i < fotos ? 'al-foto--on' : ''}`} whileTap={{ scale: 0.95 }} onClick={() => setFotos((n) => (i < n ? i : i + 1))} aria-label={i < fotos ? 'Quitar foto' : 'Agregar foto'}>
              <Icon name={i < fotos ? 'check-circle-fill' : 'hero-camera-solid'} size={22} />
            </motion.button>
          ))}
        </div>
      </Campo>
    </Pantalla>
  )
}

const TITULO_REPORTE = { Agua: 'La ducha no calienta', Luz: 'Se va la luz', Wifi: 'El wifi no funciona', Limpieza: 'Limpieza de áreas comunes', Ruido: 'Mucho ruido en la noche', Convivencia: 'Tema de convivencia', Otro: 'Otro problema' }

function R22ReporteEnviado({ a, estado }) {
  const r = estado.reporte || { categoria: 'Agua' }
  return (
    <Pantalla acciones={<Button onClick={() => window.history.back()}>Volver a mi estancia</Button>}>
      <Hero icon="check-circle-fill" tono="verde" titulo="Reporte enviado">
        {a.corto} ya lo recibió. Te avisaremos cuando responda.
      </Hero>
      <Card>
        <div className="al-card__head">
          <h3>{TITULO_REPORTE[r.categoria]}</h3>
          <Badge tono="amber" icon="clock-fill">
            Abierto
          </Badge>
        </div>
        <Datos
          filas={[
            ['Categoría', r.categoria],
            ['Enviado', 'Hoy, 8:12 a. m.'],
            ['Respuesta esperada', 'Menos de 24 horas'],
          ]}
        />
      </Card>
      <Nota>Si no recibes respuesta en 24 horas, podrás pedir ayuda al equipo de Quad desde este reporte.</Nota>
    </Pantalla>
  )
}

function R23Renovar({ ir, a, set, avisar }) {
  const [opcion, setOpcion] = useState('ciclo')
  const [cargando, setCargando] = useState(false)
  const enviar = () => {
    setCargando(true)
    avisar(`Enviamos tu solicitud de renovación a ${a.corto}`)
    setTimeout(() => {
      set({ renovacion: { ...RENOVACIONES.find((r) => r.id === opcion), firmada: false } })
      ir('alquiler', 'nuevo-contrato', { replace: true })
    }, 2400)
  }
  return (
    <Pantalla
      acciones={
        <BotonCarga cargando={cargando} onClick={enviar}>
          Enviar solicitud de renovación
        </BotonCarga>
      }
    >
      <Titulo titulo="¿Quieres quedarte más tiempo?">Tu contrato termina el 31 de mayo. Elige cuánto quieres renovar; {a.corto} tendrá que aceptarlo.</Titulo>
      <div className="al-opts" role="radiogroup" aria-label="Duración">
        {RENOVACIONES.map((r) => (
          <Opcion key={r.id} titulo={r.titulo} texto={r.texto} selected={opcion === r.id} onSelect={() => setOpcion(r.id)} />
        ))}
      </div>
      <Card titulo="Condiciones">
        <Datos
          filas={[
            ['Mensualidad', '$115 · sin cambios'],
            ['Depósito', 'Se mantiene en resguardo'],
            [`Respuesta de ${a.corto}`, 'En menos de 48 h'],
          ]}
        />
      </Card>
    </Pantalla>
  )
}

function R24NuevoContrato({ ir, a, estado, set, avisar }) {
  const r = estado.renovacion || RENOVACIONES[0]
  const [cargando, setCargando] = useState(false)
  return (
    <Pantalla
      acciones={
        <BotonCarga
          cargando={cargando}
          onClick={() => {
            setCargando(true)
            setTimeout(() => {
              set({ renovacion: { ...r, firmada: true } })
              avisar('Firmaste el nuevo contrato', undefined, 2800, true)
              window.history.back()
            }, 1200)
          }}
        >
          Firmar nuevo contrato
        </BotonCarga>
      }
    >
      <Hero icon="check-circle-fill" tono="verde" titulo={`${a.corto} aceptó tu renovación`}>
        Firma el nuevo contrato para seguir en tu quad hasta el {r.hasta}.
      </Hero>
      <QuadCard ir={ir} />
      <Card titulo="Nuevo contrato" enlace="Ver PDF" onEnlace={() => avisar('Descargamos el contrato en PDF')}>
        <Datos
          filas={[
            ['Vigencia', r.vigencia],
            ['Mensualidad', '$115 · cada día 1'],
            ['Depósito', '$115 · en resguardo'],
            ['Aviso de salida', '30 días antes'],
          ]}
        />
      </Card>
    </Pantalla>
  )
}

function R25Salida({ ir, a, set }) {
  const [motivo, setMotivo] = useState('Terminé el ciclo')
  const [mensaje, setMensaje] = useState(MENSAJE_SALIDA)
  return (
    <Pantalla
      acciones={
        <Button
          onClick={() => {
            set({ salida: { motivo, mensaje } })
            ir('alquiler', 'deposito', { replace: true })
          }}
        >
          Enviar aviso
        </Button>
      }
    >
      <Titulo titulo="¿Cuándo te vas?">Avisa al menos 30 días antes para recuperar tu depósito completo.</Titulo>
      <Card>
        <Datos
          filas={[
            ['Fecha de salida', 'Lun 31 de may 2027'],
            ['Días de aviso', '45 días · a tiempo'],
          ]}
        />
      </Card>
      <Campo label="Motivo">
        <Chips label="Motivo" opciones={MOTIVOS_SALIDA} seleccion={[motivo]} onToggle={setMotivo} />
      </Campo>
      <Campo label={`Mensaje para ${a.corto} (opcional)`}>
        <textarea className="textarea al-textarea" aria-label={`Mensaje para ${a.corto}`} maxLength={300} value={mensaje} onChange={(e) => setMensaje(e.target.value)} />
      </Campo>
      <Nota>El día de salida, {a.corto} revisará el quad contigo antes de devolverte el depósito.</Nota>
    </Pantalla>
  )
}

function R26Deposito({ ir, a, estado }) {
  return (
    <Pantalla acciones={<Button onClick={() => ir('alquiler', 'resena')}>Dejar reseña</Button>}>
      <Hero icon="dollar-circle-fill" tono="verde" titulo="Tu depósito va en camino">
        {a.corto} revisó el quad y todo está en orden.
      </Hero>
      <Card titulo="Devolución">
        <Datos
          filas={[
            ['Depósito', '$115.00'],
            ['Descuentos', '$0.00'],
          ]}
          total={['A devolver', '$115.00']}
        />
      </Card>
      <Card titulo="Estado">
        <Pasos
          items={[
            { titulo: 'Aviso de salida', texto: 'Enviado el 16 de abr', estado: 'ok' },
            { titulo: 'Revisión del quad', texto: '31 de may · sin daños', estado: 'ok' },
            { titulo: 'Devolución en proceso', texto: `Llega a tu ${METODO_RESUMEN[estado.metodo].corto.split(' ')[0]} en 3 a 5 días hábiles`, estado: 'actual' },
            { titulo: 'Depósito devuelto', estado: 'pendiente' },
          ]}
        />
      </Card>
    </Pantalla>
  )
}

function R27Resena({ ir, a, set }) {
  const [estrellas, setEstrellas] = useState(5)
  const [gusto, setGusto] = useState(['Limpieza', 'Buena convivencia'])
  const [texto, setTexto] = useState(RESENA_EJEMPLO)
  return (
    <Pantalla
      acciones={
        <Button
          disabled={!estrellas}
          onClick={() => {
            set({ resena: { estrellas, gusto, texto } })
            ir('alquiler', 'completada', { replace: true })
          }}
        >
          Publicar reseña
        </Button>
      }
    >
      <Titulo titulo={`¿Cómo fue vivir con ${a.corto}?`}>{a.corto} también te dejará una reseña. Las dos se publican al mismo tiempo.</Titulo>
      <Card className="al-stars-card">
        <div className="al-stars" role="radiogroup" aria-label="Calificación">
          {[1, 2, 3, 4, 5].map((n) => (
            <motion.button key={n} type="button" role="radio" aria-checked={estrellas === n} aria-label={`${n} estrellas`} className={`al-star ${n <= estrellas ? 'al-star--on' : ''}`} whileTap={{ scale: 0.85 }} onClick={() => setEstrellas(n)}>
              <motion.span animate={{ scale: n <= estrellas ? 1 : 0.92 }} transition={{ type: 'spring', stiffness: 500, damping: 22, delay: n * 0.02 }} style={{ display: 'grid' }}>
                <Icon name="star-fill" size={36} />
              </motion.span>
            </motion.button>
          ))}
        </div>
        <span className="al-stars__label">{ETIQUETAS_ESTRELLAS[estrellas - 1]}</span>
      </Card>
      <Campo label="Lo que más te gustó">
        <Chips label="Lo que más te gustó" opciones={LO_QUE_GUSTO} seleccion={gusto} onToggle={(o) => setGusto((g) => (g.includes(o) ? g.filter((x) => x !== o) : [...g, o]))} />
      </Campo>
      <Campo label="Tu reseña">
        <textarea className="textarea al-textarea" aria-label="Tu reseña" maxLength={300} value={texto} onChange={(e) => setTexto(e.target.value)} />
      </Campo>
    </Pantalla>
  )
}

function R28Completada({ ir, estado }) {
  const nota = (estado.resena?.estrellas || 5).toFixed(1)
  return (
    <Pantalla
      acciones={
        <>
          <Button onClick={() => ir('explorar')}>Buscar otro quad</Button>
          <Button variant="outline" onClick={() => ir('perfil')}>
            Ver mi historial
          </Button>
        </>
      }
    >
      <Hero icon="hero-trophy-solid" titulo="¡Estancia completada!">
        Gracias por vivir con Quad. Tu reseña ayuda a otros estudiantes a encontrar su lugar.
      </Hero>
      <QuadCard ir={ir} />
      <Card titulo="Tu estancia">
        <Datos
          filas={[
            ['Periodo', '1 dic 2026 – 31 may 2027'],
            ['Pagos a tiempo', '6 de 6'],
            ['Depósito devuelto', '$115.00'],
            ['Tu calificación', `${nota} ★`],
          ]}
        />
      </Card>
    </Pantalla>
  )
}

const PANTALLAS = {
  visita: R01Visita,
  recordatorio: R02Recordatorio,
  'visita-realizada': R03VisitaRealizada,
  solicitud: R04Solicitud,
  costos: R05Costos,
  enviada: R06Enviada,
  rechazada: R07Rechazada,
  'mas-info': R08MasInfo,
  aceptada: R09Aceptada,
  contrato: R10Contrato,
  'esperando-firma': R11EsperandoFirma,
  firmado: R12Firmado,
  metodo: R13Metodo,
  pagar: R14Pagar,
  comprobante: R15Comprobante,
  apartado: R16Apartado,
  pendientes: R17Pendientes,
  estancia: R18Estancia,
  'pagar-mes': R19PagarMes,
  recibo: R20Recibo,
  reportar: R21Reportar,
  'reporte-enviado': R22ReporteEnviado,
  renovar: R23Renovar,
  'nuevo-contrato': R24NuevoContrato,
  salida: R25Salida,
  deposito: R26Deposito,
  resena: R27Resena,
  completada: R28Completada,
}

const variantes = {
  enter: (dir) => ({ opacity: 0, x: dir >= 0 ? 28 : -28 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.36, ease } },
  exit: (dir) => ({ opacity: 0, x: dir >= 0 ? -20 : 20, transition: { duration: 0.18, ease } }),
}

/**
 * Flujo de alquiler (R01–R28). Ruta: #/app/alquiler/<paso>.
 * El estado vive en HomeShell para que sobreviva al ir y volver del chat o del perfil.
 */
export default function Alquiler({ sub, ir, perfil, alquiler, setAlquiler, respuesta }) {
  const paso = PANTALLAS[sub] ? sub : 'visita'
  const P = PANTALLAS[paso]
  const a = anfitriona()
  const set = (cambios) => setAlquiler((s) => ({ ...s, ...cambios }))

  // Dirección de la transición según el orden de los pasos
  const orden = PASOS_ALQUILER.indexOf(paso)
  const [previo, setPrevio] = useState(orden)
  const [dir, setDir] = useState(1)
  if (previo !== orden) {
    setDir(orden >= previo ? 1 : -1)
    setPrevio(orden)
  }

  // Aviso inferior (con acción opcional)
  const [toast, setToast] = useState(null)
  const timer = useRef(null)
  // sigue: el aviso se mantiene al cambiar de pantalla (p. ej. al volver a "Mi estancia")
  const avisar = (texto, accion, ms = 2800, sigue = false) => {
    clearTimeout(timer.current)
    setToast({ texto, accion, id: Date.now(), paso, sigue })
    timer.current = setTimeout(() => setToast(null), ms)
  }
  useEffect(() => () => clearTimeout(timer.current), [])
  // Al cambiar de paso se descartan los avisos de la pantalla anterior
  if (toast && toast.paso !== paso) setToast(toast.sigue ? { ...toast, paso, sigue: false } : null)

  const yo = {
    ...perfil,
    corto: perfil.detalle.split(' · ').filter((x, i) => i !== 1).join(' · '),
    carreraUni: perfil.detalle.split(' · ').filter((x, i) => i !== 1).join(', '),
    verificada: perfil.genero === 'mujer' ? 'Verificada' : 'Verificado',
  }

  return (
    <div className="home-screen al">
      <div className="al-status">
        <StatusBar />
        <div className="safe-top" />
        <Barra titulo={TITULOS[paso]} />
      </div>
      <div className="al-stage">
        <AnimatePresence initial={false} custom={dir}>
          <motion.div key={paso} className="al-layer" custom={dir} variants={variantes} initial="enter" animate="center" exit="exit">
            <P ir={ir} a={a} yo={yo} estado={alquiler} set={set} avisar={avisar} respuesta={respuesta} />
          </motion.div>
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {toast && (
          <motion.div key={toast.id} className={`dt-toast al-toast ${paso === 'estancia' ? 'al-toast--low' : ''}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} role="status">
            <Icon name="check-circle-fill" size={20} />
            <span>{toast.texto}</span>
            {toast.accion && (
              <button
                type="button"
                className="al-toast__btn"
                onClick={() => {
                  setToast(null)
                  toast.accion.alHacer()
                }}
              >
                {toast.accion.texto}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
