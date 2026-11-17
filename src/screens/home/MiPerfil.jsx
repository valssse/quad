import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Icon from '../../components/Icon.jsx'
import Button from '../../components/Button.jsx'
import Chip from '../../components/Chip.jsx'
import { fadeUp, stagger } from '../../components/motion.js'
import PerfilMini from '../estudiante/PerfilMini.jsx'
import { resumir } from '../estudiante/resumen.js'
import { ANIOS, INTERESES, UNIVERSIDADES, buscar } from '../../data/estudiante.js'
import '../estudiante/estudiante.css'
import './perfil.css'

const MAX = 300

/** Barra superior: atrás + título centrado. */
function Cabecera({ titulo }) {
  return (
    <div className="hc-header">
      <motion.button type="button" className="dt-round dt-round--border dt-round--plain" whileTap={{ scale: 0.9 }} aria-label="Atrás" onClick={() => window.history.back()}>
        <Icon name="nav-arrow-left" size={20} />
      </motion.button>
      <h1>{titulo}</h1>
      <span className="mp-spacer" />
    </div>
  )
}

function Seccion({ titulo, children }) {
  return (
    <motion.section className="profile-section" variants={fadeUp}>
      <h2 className="profile-section__title">{titulo}</h2>
      {children}
    </motion.section>
  )
}

function Tags({ items }) {
  if (!items.length) return <p className="profile-section__empty">Aún no agregas nada aquí.</p>
  return (
    <div className="chips">
      {items.map((i) => (
        <span key={i.id} className="tag">
          <Icon name={i.iconSel} size={14} />
          {i.label}
        </span>
      ))}
    </div>
  )
}

/** 09a · Mi perfil público (y 09c, con el aviso "Cambios guardados"). */
export function MiPerfil({ yo, ir, aviso, cerrarAviso }) {
  const r = resumir(yo)
  const uni = buscar(UNIVERSIDADES, yo.universidad)
  const hechos = [
    { icon: 'dollar-circle-fill', label: 'Presupuesto', valor: `${r.presupuesto} al mes` },
    { icon: 'home-solid', label: 'Tipo de quad', valor: r.tipoLargo },
    { icon: 'calendar-fill', label: 'Mudanza', valor: r.mudanzaLarga },
    { icon: 'map-pin-fill', label: 'Punto de referencia', valor: r.referencia || 'Sin definir' },
  ]
  const insignias = [
    { icon: 'shield-check-fill', label: 'Estudiante verificada' },
    { icon: 'hero-envelope-solid', label: `Correo ${uni?.corto || 'UCA'}` },
    { icon: 'shield-check-fill', label: 'Teléfono confirmado' },
  ]

  // El aviso se va solo
  useEffect(() => {
    if (!aviso) return
    const t = setTimeout(cerrarAviso, 2600)
    return () => clearTimeout(t)
  }, [aviso, cerrarAviso])

  return (
    <div className="home-screen mp">
      <Cabecera titulo="Mi perfil público" />

      <AnimatePresence>
        {aviso && (
          <motion.div
            className="mp-toast"
            role="status"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          >
            <Icon name="check-circle-fill" size={20} />
            Cambios guardados
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="home-scroll mp-scroll" variants={stagger} initial="hidden" animate="show">
        <motion.header className="mp-head" variants={fadeUp}>
          <h2>Así te ven las familias</h2>
          <p>Esto aparece cuando escribes a una familia o le envías una solicitud.</p>
        </motion.header>

        <PerfilMini datos={yo} cuenta={{ name: yo.nombre }} />

        <motion.div className="mp-badges" variants={fadeUp}>
          {insignias.map((b) => (
            <span key={b.label} className="mp-badge">
              <Icon name={b.icon} size={14} />
              {b.label}
            </span>
          ))}
        </motion.div>

        <Seccion titulo="Sobre mí">
          {yo.sobreMi ? <p className="profile-section__text">{yo.sobreMi}</p> : <p className="profile-section__empty">Aún no escribes tu presentación.</p>}
        </Seccion>

        <Seccion titulo="Intereses">
          <Tags items={r.intereses} />
        </Seccion>

        <Seccion titulo="Cómo me gusta convivir">
          <Tags items={r.convivenciaTags} />
        </Seccion>

        <Seccion titulo="Qué no puede faltar">
          <Tags items={r.serviciosTags} />
        </Seccion>

        <Seccion titulo="Lo que busco">
          <div className="facts">
            {hechos.map((h) => (
              <div key={h.label} className="fact">
                <Icon name={h.icon} size={22} />
                <span>
                  <span className="fact__label">{h.label}</span>
                  <span className="fact__value">{h.valor}</span>
                </span>
              </div>
            ))}
          </div>
        </Seccion>

        <Seccion titulo="Reseñas de anfitriones">
          <p className="profile-section__text">Aún no tienes reseñas. Aparecerán cuando termines tu primera estancia.</p>
        </Seccion>
      </motion.div>

      <div className="mp-bar">
        <Button onClick={() => ir('editar-perfil')}>Editar perfil</Button>
      </div>
    </div>
  )
}

/** Campo de texto del Figma (Campo · Tipo=Texto). */
function Campo({ label, children }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <span className="field__control">{children}</span>
    </label>
  )
}

/** 09b · Editar perfil. */
export function EditarPerfil({ yo, guardar }) {
  const [b, setB] = useState(yo)
  const archivo = useRef(null)
  const cambiar = (cambios) => setB((x) => ({ ...x, ...cambios }))
  const alternar = (id) => cambiar({ intereses: b.intereses.includes(id) ? b.intereses.filter((x) => x !== id) : [...b.intereses, id] })

  const elegirFoto = (e) => {
    const f = e.target.files?.[0]
    if (f) cambiar({ foto: URL.createObjectURL(f) })
    e.target.value = ''
  }

  const listo = b.nombre.trim() !== ''

  return (
    <div className="home-screen mp">
      <Cabecera titulo="Editar perfil" />

      <motion.div className="home-scroll mp-scroll mp-scroll--edit" variants={stagger} initial="hidden" animate="show">
        <motion.header className="mp-head" variants={fadeUp}>
          <h2>Tu información</h2>
          <p>Los cambios se verán en tu perfil público y en tus próximas solicitudes.</p>
        </motion.header>

        <motion.div className="mp-photo" variants={fadeUp}>
          <span className="mp-photo__img">
            <AnimatePresence initial={false} mode="popLayout">
              {b.foto ? (
                <motion.img key={b.foto} src={b.foto} alt="" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} />
              ) : (
                <motion.span key="vacio" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Icon name="user-solid" size={34} />
                </motion.span>
              )}
            </AnimatePresence>
          </span>
          <span className="mp-photo__text">
            <span>Foto de perfil</span>
            <button type="button" className="mp-link" onClick={() => archivo.current?.click()}>
              {b.foto ? 'Cambiar foto' : 'Agregar foto'}
            </button>
          </span>
          <input ref={archivo} type="file" accept="image/*" hidden onChange={elegirFoto} />
        </motion.div>

        <motion.div className="mp-fields" variants={fadeUp}>
          <Campo label="Nombre">
            <input className="field__input" value={b.nombre} onChange={(e) => cambiar({ nombre: e.target.value })} placeholder="Tu nombre" autoComplete="name" />
          </Campo>
          <Campo label="Carrera">
            <input className="field__input" value={b.carrera} onChange={(e) => cambiar({ carrera: e.target.value })} placeholder="Ej. Ingeniería Industrial" />
          </Campo>
          <Campo label="Año de carrera">
            <select className="field__input mp-select" value={b.anio} onChange={(e) => cambiar({ anio: e.target.value })}>
              {ANIOS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label} año
                </option>
              ))}
            </select>
            <Icon name="nav-arrow-down" size={18} className="mp-select__chevron" />
          </Campo>
          <Campo label="¿De dónde eres?">
            <input className="field__input" value={b.ciudad} onChange={(e) => cambiar({ ciudad: e.target.value })} placeholder="Ej. Santa Ana" />
          </Campo>
        </motion.div>

        <motion.div className="section" variants={fadeUp} style={{ gap: 8 }}>
          <label className="section-label" htmlFor="mp-sobre">
            Sobre mí
          </label>
          <textarea id="mp-sobre" className="textarea" maxLength={MAX} value={b.sobreMi} placeholder="Unas líneas sobre tu rutina y cómo eres en casa." onChange={(e) => cambiar({ sobreMi: e.target.value })} />
          <p className="counter">
            {b.sobreMi.length}/{MAX}
          </p>
        </motion.div>

        <motion.div className="section" variants={fadeUp}>
          <p className="mp-label">Tus intereses</p>
          <div className="chips">
            {INTERESES.map((i) => (
              <Chip key={i.id} tone="gray" label={i.label} icon={i.icon} iconSelected={i.iconSel} selected={b.intereses.includes(i.id)} onToggle={() => alternar(i.id)} />
            ))}
          </div>
        </motion.div>
      </motion.div>

      <div className="mp-bar">
        <Button disabled={!listo} onClick={() => guardar({ ...b, nombre: b.nombre.trim() })}>
          Guardar cambios
        </Button>
      </div>
    </div>
  )
}
