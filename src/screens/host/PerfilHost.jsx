import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Icon from '../../components/Icon.jsx'
import Button from '../../components/Button.jsx'
import { fadeUp, stagger } from '../../components/motion.js'
import { ANFITRIONA, CUENTA_RETIRO, PERFIL_HOST, RESENAS_RECIBIDAS, VERIFICACION } from '../../data/host.js'
import { Cabecera, Hoja, Tarjeta } from './ui.jsx'

const dinero = (n) => `${n < 0 ? '−' : '+'}$${Math.abs(n).toFixed(2)}`

function Fila({ icon, titulo, texto, onClick }) {
  return (
    <motion.button type="button" className="action-row" whileTap={{ scale: 0.99 }} onClick={onClick}>
      <Icon name={icon} size={24} className="action-row__icon" />
      <span className="option__texts">
        <span className="option__title">{titulo}</span>
        <span className="option__desc">{texto}</span>
      </span>
      <Icon name="nav-arrow-right" size={18} className="action-row__chevron" />
    </motion.button>
  )
}

/** P01 · Perfil del anfitrión. */
export function PerfilHost({ ir, saldo, onEstudiante, onCerrarSesion }) {
  const grupos = [
    {
      titulo: 'Mi casa',
      items: [
        { icon: 'home-solid', titulo: 'Perfil de la casa', texto: 'Quiénes viven, convivencia y reglas', to: 'casa' },
        { icon: 'star-fill', titulo: 'Reseñas recibidas', texto: `${PERFIL_HOST.rating} de 5 · ${PERFIL_HOST.resenas} reseñas`, to: 'resenas' },
      ],
    },
    { titulo: 'Dinero', items: [{ icon: 'dollar-circle-fill', titulo: 'Cobros y retiros', texto: saldo > 0 ? `$${saldo.toFixed(2)} disponibles para retirar` : 'Sin saldo por retirar', to: 'cobros' }] },
    {
      titulo: 'Cuenta',
      items: [
        { icon: 'shield-check-fill', titulo: 'Verificación', texto: 'Identidad y teléfono verificados', to: 'verificacion' },
        { icon: 'hero-lock-closed-solid', titulo: 'Ajustes', texto: 'Datos, notificaciones y privacidad' },
        { icon: 'info-circle-fill', titulo: 'Centro de ayuda', texto: 'Preguntas frecuentes y soporte' },
      ],
    },
  ]

  return (
    <div className="home-screen hs">
      <motion.div className="home-scroll profile" variants={stagger} initial="hidden" animate="show">
        <motion.h1 className="profile__title" variants={fadeUp}>
          Perfil
        </motion.h1>

        <motion.section className="profile-card" variants={fadeUp}>
          <motion.img src={ANFITRIONA.foto} alt="" className="profile-card__avatar" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.1 }} />
          <div className="profile-card__name">
            <h2>{PERFIL_HOST.nombre}</h2>
            <p>{PERFIL_HOST.desde}</p>
          </div>
          <span className="hs-badge hs-badge--amber">
            <Icon name="star-fill" size={14} />
            {PERFIL_HOST.rating} · {PERFIL_HOST.resenas} reseñas
          </span>
          <motion.button type="button" className="small-btn" whileTap={{ scale: 0.98 }} onClick={() => ir('casa')}>
            Ver perfil de la casa
          </motion.button>
        </motion.section>

        <motion.button type="button" className="host-cta" variants={fadeUp} whileTap={{ scale: 0.99 }} onClick={onEstudiante}>
          <span className="host-cta__icon">
            <Icon name="user-solid" size={22} />
          </span>
          <span className="option__texts">
            <span className="option__title">¿También buscas cuarto?</span>
            <span className="option__desc">Cambia a modo estudiante con la misma cuenta</span>
          </span>
          <Icon name="nav-arrow-right" size={18} className="host-cta__chevron" />
        </motion.button>

        {grupos.map((g) => (
          <motion.section key={g.titulo} className="profile-group" variants={fadeUp}>
            <p className="profile-group__label">{g.titulo}</p>
            {g.items.map((i) => (
              <Fila key={i.titulo} {...i} onClick={i.to ? () => ir(i.to) : undefined} />
            ))}
          </motion.section>
        ))}

        <motion.button type="button" className="logout" variants={fadeUp} onClick={onCerrarSesion}>
          Cerrar sesión
        </motion.button>
      </motion.div>
    </div>
  )
}

/** P03 · Editar quiénes viven (personas y mascotas). */
export function EditarCasa({ casa, guardar }) {
  const [personas, setPersonas] = useState(casa.personas)
  const [mascotas, setMascotas] = useState(casa.mascotas)
  const [editando, setEditando] = useState(null)
  const [nueva, setNueva] = useState({ nombre: '', rol: '' })

  const abrir = (p) => {
    setEditando(p ? p.id : 'nueva')
    setNueva(p ? { nombre: p.nombre, rol: p.rol } : { nombre: '', rol: '' })
  }
  const listo = () => {
    const nombre = nueva.nombre.trim()
    if (!nombre) return
    const iniciales = nombre.split(' ').map((x) => x[0]).slice(0, 2).join('').toUpperCase()
    if (editando === 'nueva') setPersonas((ps) => [...ps, { id: `p${Date.now()}`, iniciales, nombre, rol: nueva.rol.trim() || 'Vive en la casa' }])
    else setPersonas((ps) => ps.map((p) => (p.id === editando ? { ...p, iniciales, nombre, rol: nueva.rol.trim() || p.rol } : p)))
    setEditando(null)
  }
  const contar = (id, d) => setMascotas((ms) => ms.map((m) => (m.id === id ? { ...m, cantidad: Math.max(0, Math.min(9, m.cantidad + d)) } : m)))
  const otraMascota = () => {
    const opciones = ['Aves', 'Peces', 'Conejos', 'Tortugas']
    const libre = opciones.find((o) => !mascotas.some((m) => m.nombre === o))
    if (libre) setMascotas((ms) => [...ms, { id: libre.toLowerCase(), nombre: libre, cantidad: 1 }])
  }

  return (
    <div className="home-screen hs hs--stack hs--white">
      <Cabecera titulo="Editar convivencia" />
      <motion.div className="home-scroll hs-detail hs-detail--gap16" variants={stagger} initial="hidden" animate="show">
        <motion.header className="mp-head" variants={fadeUp}>
          <h2>¿Quiénes viven en la casa?</h2>
          <p>Los estudiantes quieren saber con quién convivirán.</p>
        </motion.header>
        <div className="hs-list">
          <AnimatePresence initial={false}>
            {personas.map((p) => (
              <motion.div key={p.id} className="hs-card pc-person" layout variants={fadeUp} initial="hidden" animate="show" exit={{ opacity: 0 }}>
                <span className="hs-avatar" style={{ width: 44, height: 44, fontSize: 15 }}>
                  {p.iniciales}
                </span>
                <span className="hs-person__text">
                  <b>{p.nombre}</b>
                  <small>{p.rol}</small>
                </span>
                <button type="button" className="hs-link" onClick={() => abrir(p)}>
                  Editar
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          <motion.button type="button" className="hs-publish pc-add" variants={fadeUp} whileTap={{ scale: 0.98 }} onClick={() => abrir(null)}>
            <Icon name="user-plus" size={20} />
            Agregar persona
          </motion.button>
        </div>

        <motion.div className="pc-pets-head" variants={fadeUp}>
          <b>Mascotas</b>
          <small>Cantidad en la casa</small>
        </motion.div>
        <div className="hs-list">
          {mascotas.map((m) => (
            <motion.div key={m.id} className="hs-card pc-pet" variants={fadeUp} initial="hidden" animate="show">
              <Icon name="paw-fill" size={20} className="pc-pet__icon" />
              <b>{m.nombre}</b>
              <span className="pc-counter">
                <motion.button type="button" whileTap={{ scale: 0.88 }} disabled={m.cantidad === 0} aria-label={`Quitar ${m.nombre}`} onClick={() => contar(m.id, -1)}>
                  <Icon name="minus" size={16} />
                </motion.button>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span key={m.cantidad} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} transition={{ duration: 0.15 }}>
                    {m.cantidad}
                  </motion.span>
                </AnimatePresence>
                <motion.button type="button" className="pc-counter__plus" whileTap={{ scale: 0.88 }} aria-label={`Agregar ${m.nombre}`} onClick={() => contar(m.id, 1)}>
                  <Icon name="plus" size={16} />
                </motion.button>
              </span>
            </motion.div>
          ))}
          <motion.button type="button" className="hs-publish pc-add" variants={fadeUp} whileTap={{ scale: 0.98 }} onClick={otraMascota}>
            <Icon name="paw-fill" size={18} />
            Agregar otra mascota
          </motion.button>
        </div>
      </motion.div>
      <div className="mp-bar">
        <Button onClick={() => guardar({ personas, mascotas })}>Guardar cambios</Button>
      </div>

      <Hoja abierta={!!editando} onClose={() => setEditando(null)} etiqueta="Persona">
        <div className="ch-sheet__head">
          <h2>{editando === 'nueva' ? 'Agregar persona' : 'Editar persona'}</h2>
          <p>Solo se muestra el nombre y el rol en la casa.</p>
        </div>
        <label className="field">
          <span className="field__label">Nombre</span>
          <span className="field__control">
            <input className="field__input" value={nueva.nombre} placeholder="Ej. Sofía Martínez" onChange={(e) => setNueva((n) => ({ ...n, nombre: e.target.value }))} />
          </span>
        </label>
        <label className="field">
          <span className="field__label">Rol en la casa</span>
          <span className="field__control">
            <input className="field__input" value={nueva.rol} placeholder="Ej. Hermana · Estudiante" onChange={(e) => setNueva((n) => ({ ...n, rol: e.target.value }))} />
          </span>
        </label>
        <Button disabled={!nueva.nombre.trim()} onClick={listo}>
          Listo
        </Button>
      </Hoja>
    </div>
  )
}

/** P05 · Verificación. */
export function Verificacion() {
  return (
    <div className="home-screen hs hs--stack">
      <Cabecera titulo="Verificación" />
      <motion.div className="home-scroll hs-detail" variants={stagger} initial="hidden" animate="show">
        <motion.div className="pv-hero" variants={fadeUp}>
          <motion.span className="hs-success" initial={{ scale: 0.7 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 0.15 }}>
            <Icon name="shield-check-fill" size={36} />
          </motion.span>
          <h2>Tu identidad está verificada</h2>
          <p>Los estudiantes ven el sello “Identidad verificada” en tu perfil y en tus quads.</p>
        </motion.div>
        <motion.div variants={fadeUp}>
          <Tarjeta className="hs-box hs-box--plain">
            {VERIFICACION.map((v, i) => (
              <div key={v.titulo} className={`hs-row ${i ? 'hs-row--line' : ''}`}>
                <Icon name="check-circle-fill" size={20} className="hs-green" />
                <span className="hs-row__text">
                  <b>{v.titulo}</b>
                  <small>{v.texto}</small>
                </span>
              </div>
            ))}
          </Tarjeta>
        </motion.div>
        <motion.p className="pv-note" variants={fadeUp}>
          Si cambias de teléfono o de documento, tendrás que verificarlo de nuevo.
        </motion.p>
      </motion.div>
    </div>
  )
}

/** P06 · Cobros y retiros (P07 con la hoja de retiro solicitado). */
export function Cobros({ saldo, movimientos, retirar }) {
  const [hoja, setHoja] = useState(false)
  const [monto, setMonto] = useState(0)

  return (
    <div className="home-screen hs hs--stack">
      <Cabecera titulo="Cobros y retiros" />
      <motion.div className="home-scroll hs-detail" variants={stagger} initial="hidden" animate="show">
        <motion.section className="hs-cobro pc-saldo" variants={fadeUp}>
          <p className="hs-cobro__label">Saldo disponible</p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p key={saldo} className="pc-saldo__total" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
              ${saldo.toFixed(2)}
            </motion.p>
          </AnimatePresence>
          <p className="pc-saldo__note">Cada pago se libera 3 días después de recibirlo.</p>
          <motion.button
            type="button"
            className="pc-saldo__btn"
            disabled={saldo <= 0}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setMonto(saldo)
              retirar()
              setHoja(true)
            }}
          >
            {saldo > 0 ? `Retirar $${saldo.toFixed(2)}` : 'Retiro en camino'}
          </motion.button>
        </motion.section>

        <motion.section className="hs-section" variants={fadeUp}>
          <h2>Cuenta para retiros</h2>
          <motion.button type="button" className="hs-pend" whileTap={{ scale: 0.98 }}>
            <Icon name="dollar-circle-fill" size={24} className="mq-section__icon" />
            <span className="hs-pend__text">
              <b>{CUENTA_RETIRO.banco}</b>
              <span>{CUENTA_RETIRO.detalle}</span>
            </span>
            <Icon name="nav-arrow-right" size={18} className="hs-chevron" />
          </motion.button>
        </motion.section>

        <motion.section className="hs-section" variants={fadeUp}>
          <div className="hs-box__head">
            <h2>Movimientos</h2>
            <button type="button" className="hs-link">
              Ver todos
            </button>
          </div>
          <Tarjeta className="hs-box hs-box--plain">
            <AnimatePresence initial={false}>
              {movimientos.map((m, i) => (
                <motion.div key={m.titulo + m.texto} className={`hs-row ${i ? 'hs-row--line' : ''}`} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <span className={`hs-row__icon hs-row__icon--${m.tono}`}>
                    <Icon name={m.icon} size={22} />
                  </span>
                  <span className="hs-row__text">
                    <b>{m.titulo}</b>
                    <small>{m.texto}</small>
                  </span>
                  <b className={`pc-amount ${m.monto > 0 ? 'hs-green' : ''}`}>{dinero(m.monto)}</b>
                </motion.div>
              ))}
            </AnimatePresence>
          </Tarjeta>
        </motion.section>
      </motion.div>

      <Hoja abierta={hoja} onClose={() => setHoja(false)} etiqueta="Retiro solicitado" className="hs-sheet--center">
        <motion.span className="hs-success" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 320, damping: 18, delay: 0.12 }}>
          <Icon name="check-circle-fill" size={36} />
        </motion.span>
        <div className="ch-sheet__head">
          <h2>Retiro solicitado</h2>
          <p>
            ${monto.toFixed(2)} llegarán a tu cuenta de {CUENTA_RETIRO.banco} en 1 a 2 días hábiles.
          </p>
        </div>
        <div className="hs-sheet__actions">
          <Button onClick={() => setHoja(false)}>Listo</Button>
        </div>
      </Hoja>
    </div>
  )
}

/** P08 · Reseñas recibidas. */
export function Resenas() {
  const r = RESENAS_RECIBIDAS
  const max = Math.max(...r.barras.map(([, n]) => n))
  return (
    <div className="home-screen hs hs--stack">
      <Cabecera titulo="Reseñas" />
      <motion.div className="home-scroll hs-detail hs-detail--gap16" variants={stagger} initial="hidden" animate="show">
        <motion.div variants={fadeUp}>
          <Tarjeta className="pr-summary">
            <span className="pr-summary__avg">
              <b>{r.promedio}</b>
              <span className="pr-stars">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Icon key={i} name="star-fill" size={14} />
                ))}
              </span>
              <small>{r.total} reseñas</small>
            </span>
            <span className="pr-bars">
              {r.barras.map(([e, n], i) => (
                <span key={e} className="pr-bar">
                  <small>{e}</small>
                  <span className="pr-bar__track">
                    <motion.span className="pr-bar__fill" initial={{ scaleX: 0 }} animate={{ scaleX: max ? n / max : 0 }} transition={{ duration: 0.7, delay: 0.2 + i * 0.06, ease: [0.22, 1, 0.36, 1] }} />
                  </span>
                  <small className="pr-bar__n">{n}</small>
                </span>
              ))}
            </span>
          </Tarjeta>
        </motion.div>
        {r.lista.map((x) => (
          <motion.div key={x.nombre} variants={fadeUp}>
            <Tarjeta className="pr-review">
              <div className="pr-review__who">
                <span className="pr-review__avatar">{x.iniciales}</span>
                <span className="hs-person__text">
                  <b>{x.nombre}</b>
                  <small>{x.carrera}</small>
                </span>
              </div>
              <span className="pr-stars pr-stars--row">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Icon key={i} name="star-fill" size={14} />
                ))}
                <small>{x.estancia}</small>
              </span>
              <p>{x.texto}</p>
            </Tarjeta>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

