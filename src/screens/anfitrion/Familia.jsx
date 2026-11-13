import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Step from '../estudiante/Step.jsx'
import Heading from '../estudiante/Heading.jsx'
import Button from '../../components/Button.jsx'
import Chip from '../../components/Chip.jsx'
import Icon from '../../components/Icon.jsx'
import Note from '../../components/Note.jsx'
import { fadeUp } from '../../components/motion.js'
import { BotonAgregar, Campo, Contador, FilaFoto, FilaSwitch, Hoja } from './ui.jsx'
import { MASCOTAS, PARENTESCOS, buscar, iniciales } from '../../data/anfitrion.js'

/** Texto secundario de una persona: "Mamá · Anfitriona principal". */
const rolDe = (p) => {
  const parentesco = buscar(PARENTESCOS, p.parentesco)
  const extra = p.principal ? (parentesco?.icon === 'female' ? 'Anfitriona principal' : 'Anfitrión principal') : p.rol
  return [parentesco?.label, extra].filter(Boolean).join(' · ')
}

/** A07 · ¿Quiénes viven en la casa? — personas y mascotas. */
export function Familia({ datos, actualizar, siguiente, abrir }) {
  const cambiarMascota = (id, cantidad) =>
    actualizar({
      mascotas: cantidad <= 0 ? datos.mascotas.filter((m) => m.id !== id) : datos.mascotas.map((m) => (m.id === id ? { ...m, cantidad } : m)),
    })

  return (
    <Step className="step--long" actions={<Button onClick={siguiente}>Continuar</Button>}>
      <Heading title="¿Quiénes viven en la casa?">Los estudiantes quieren saber con quién convivirán.</Heading>

      <div className="heading" style={{ gap: 12 }}>
        <AnimatePresence initial={false}>
          {datos.personas.map((p) => (
            <motion.div
              key={p.id}
              className="person-row"
              layout
              variants={fadeUp}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, height: 0, marginTop: -12 }}
            >
              <span className="person-row__avatar">{p.foto ? <img src={p.foto} alt="" /> : iniciales(p.nombre)}</span>
              <span className="option__texts">
                <span className="option__title">{p.nombre}</span>
                <span className="option__desc">{rolDe(p)}</span>
              </span>
              <button type="button" className="link link--small" onClick={() => abrir('persona', p)}>
                Editar
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        <BotonAgregar icon="user-plus" onClick={() => abrir('persona')}>
          Agregar persona
        </BotonAgregar>
      </div>

      <motion.div className="section-head" variants={fadeUp}>
        <p className="section-label">Mascotas</p>
        <p className="section-hint">Cantidad en la casa</p>
      </motion.div>

      <div className="heading" style={{ gap: 12 }}>
        <AnimatePresence initial={false}>
          {datos.mascotas.map((m) => {
            const tipo = buscar(MASCOTAS, m.id)
            return (
              <motion.div key={m.id} className="pet-row" layout variants={fadeUp} initial="hidden" animate="show" exit={{ opacity: 0, height: 0, marginTop: -12 }}>
                <Icon name="paw-fill" size={22} className="host-row__icon" />
                <span className="option__texts">
                  <span className="option__title">{tipo.plural}</span>
                  {m.detalle && <span className="option__desc">{m.detalle}</span>}
                </span>
                <Contador valor={m.cantidad} onChange={(v) => cambiarMascota(m.id, v)} label={`Cantidad de ${tipo.plural.toLowerCase()}`} />
              </motion.div>
            )
          })}
        </AnimatePresence>
        <BotonAgregar icon="paw-fill" onClick={() => abrir('mascota')}>
          Agregar otra mascota
        </BotonAgregar>
      </div>
    </Step>
  )
}

/** A07b / A07c · Hoja "Agregar persona" (también sirve para editar). */
export function HojaPersona({ abierta, persona, datos, actualizar, onClose }) {
  const [form, setForm] = useState(null)
  const [ultima, setUltima] = useState(null)
  // Al abrir la hoja se carga la persona a editar (o un formulario vacío)
  if (abierta && ultima !== (persona?.id ?? 'nueva')) {
    setUltima(persona?.id ?? 'nueva')
    setForm(persona ? { ...persona } : { id: `p${Date.now()}`, nombre: '', parentesco: '', principal: false, foto: null })
  }
  if (!abierta && ultima !== null) setUltima(null)

  const guardar = () => {
    let personas = persona ? datos.personas.map((p) => (p.id === form.id ? form : p)) : [...datos.personas, form]
    if (form.principal) personas = personas.map((p) => (p.id === form.id ? p : { ...p, principal: false }))
    actualizar({ personas })
    onClose()
  }
  const f = form || {}

  return (
    <Hoja
      abierta={abierta}
      titulo={persona ? 'Editar persona' : 'Agregar persona'}
      sub="Cuéntanos quién vive en tu casa. Los estudiantes verán esto en tu perfil."
      onClose={onClose}
      accion={persona ? 'Guardar cambios' : f.parentesco ? 'Agregar a la casa' : 'Agregar persona'}
      onAccion={guardar}
      accionDisabled={!f.nombre?.trim() || !f.parentesco}
    >
      <Campo label="Nombre" icon="user" placeholder="Ej. Rosa Martínez" value={f.nombre || ''} onChange={(e) => setForm({ ...f, nombre: e.target.value })} />

      <motion.div className="section" variants={fadeUp}>
        <p className="section-label">¿Quién es?</p>
        <div className="chips" role="radiogroup">
          {PARENTESCOS.map((p) => (
            <Chip
              key={p.id}
              label={p.label}
              icon={p.icon}
              iconSelected={p.iconSel}
              selected={f.parentesco === p.id}
              onToggle={() => setForm({ ...f, parentesco: p.id })}
            />
          ))}
        </div>
      </motion.div>

      <motion.div className="section-head" variants={fadeUp}>
        <p className="section-label">Foto</p>
        <p className="section-hint">Opcional</p>
      </motion.div>
      <FilaFoto
        titulo={f.foto ? 'Foto cargada' : 'Agregar foto'}
        desc="Tomar o elegir de la galería"
        descCargada="Toca para cambiarla"
        iconoVacio="hero-camera-solid"
        valor={f.foto}
        onChange={(url) => setForm({ ...f, foto: url })}
      />

      <AnimatePresence initial={false}>
        {f.parentesco && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
            <FilaSwitch
              icon="group-fill"
              titulo={buscar(PARENTESCOS, f.parentesco)?.icon === 'female' ? 'Es la anfitriona principal' : 'Es el anfitrión principal'}
              desc={buscar(PARENTESCOS, f.parentesco)?.icon === 'female' ? 'Los estudiantes le escribirán a ella' : 'Los estudiantes le escribirán a él'}
              checked={Boolean(f.principal)}
              onChange={(v) => setForm({ ...f, principal: v })}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Hoja>
  )
}

/** A07d · Hoja "Agregar mascota". */
export function HojaMascota({ abierta, datos, actualizar, onClose }) {
  const [form, setForm] = useState({ id: 'perro', cantidad: 1, detalle: '' })
  const [abiertaAntes, setAbiertaAntes] = useState(false)
  if (abierta !== abiertaAntes) {
    setAbiertaAntes(abierta)
    if (abierta) {
      const existente = datos.mascotas.find((m) => m.id === 'perro')
      setForm(existente ? { ...existente } : { id: 'perro', cantidad: 1, detalle: '' })
    }
  }
  const tipo = buscar(MASCOTAS, form.id)
  const elegirTipo = (id) => {
    const existente = datos.mascotas.find((m) => m.id === id)
    setForm(existente ? { ...existente } : { id, cantidad: 1, detalle: '' })
  }
  const guardar = () => {
    const hay = datos.mascotas.some((m) => m.id === form.id)
    actualizar({ mascotas: hay ? datos.mascotas.map((m) => (m.id === form.id ? form : m)) : [...datos.mascotas, form] })
    onClose()
  }
  const etiqueta = `${form.cantidad} ${form.cantidad === 1 ? tipo.singular : tipo.plural.toLowerCase()}`

  return (
    <Hoja abierta={abierta} titulo="Agregar mascota" sub="Elige el tipo y cuántas hay en tu casa." onClose={onClose} accion="Agregar mascota" onAccion={guardar}>
      <motion.div className="section" variants={fadeUp}>
        <p className="section-label">Tipo de mascota</p>
        <div className="chips" role="radiogroup">
          {MASCOTAS.map((m) => (
            <Chip key={m.id} label={m.label} icon="paw-fill" selected={form.id === m.id} onToggle={() => elegirTipo(m.id)} />
          ))}
        </div>
      </motion.div>

      <motion.div className="pet-row" variants={fadeUp}>
        <span className="option__texts">
          <span className="option__title">Cantidad de {tipo.plural.toLowerCase()}</span>
          <span className="option__desc">Cuántos viven en la casa</span>
        </span>
        <Contador valor={form.cantidad} min={1} onChange={(v) => setForm({ ...form, cantidad: v })} label="Cantidad" />
      </motion.div>

      <Campo
        label="Detalle (opcional)"
        icon="info-circle"
        placeholder="Ej. 2 labradores y 2 chihuahuas"
        value={form.detalle}
        onChange={(e) => setForm({ ...form, detalle: e.target.value })}
      />

      <Note iconName="info-circle-fill">Los estudiantes verán "{etiqueta}" en tu perfil.</Note>
    </Hoja>
  )
}
