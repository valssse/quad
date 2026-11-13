import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Step from '../estudiante/Step.jsx'
import Heading from '../estudiante/Heading.jsx'
import ChipGroups from '../estudiante/ChipGroups.jsx'
import Button from '../../components/Button.jsx'
import Chip from '../../components/Chip.jsx'
import Icon from '../../components/Icon.jsx'
import Note from '../../components/Note.jsx'
import SelectCard from '../../components/SelectCard.jsx'
import { fadeUp } from '../../components/motion.js'
import { Campo, Contador, FilaSwitch, Hoja, VistaRegla } from './ui.jsx'
import {
  BANOS,
  INCLUYE,
  MODOS_VISITA,
  NORMAS_CONVIVENCIA,
  TIPOS_CUARTO,
  TIPOS_REGLA,
  buscar,
  describirRegla,
  hora12,
} from '../../data/anfitrion.js'

/* ================= Parte 2 · Publicar el quad (n/9) ================= */

const MIN_FOTOS = 5
const CASILLAS = 6

/** A13 · Agrega fotos del cuarto — galería de 6 casillas; la primera es la portada. */
export function Fotos({ datos, actualizar, siguiente }) {
  const input = useRef(null)
  const reemplazar = useRef(null)

  const agregar = (e) => {
    const nuevas = [...(e.target.files || [])].map((f, i) => ({ id: `f${Date.now()}${i}`, url: URL.createObjectURL(f) }))
    if (reemplazar.current !== null) {
      const i = reemplazar.current
      actualizar({ fotos: datos.fotos.map((f, j) => (j === i && nuevas[0] ? nuevas[0] : f)) })
    } else if (nuevas.length) {
      actualizar({ fotos: [...datos.fotos, ...nuevas] })
    }
    reemplazar.current = null
    e.target.value = ''
  }
  const abrir = (i = null) => {
    reemplazar.current = i
    input.current.click()
  }

  const total = Math.max(CASILLAS, datos.fotos.length + 1)
  const casillas = Array.from({ length: total }, (_, i) => datos.fotos[i] || null)

  return (
    <Step actions={<Button onClick={siguiente}>Continuar</Button>}>
      <Heading title="Agrega fotos del cuarto">Mínimo {MIN_FOTOS}. La primera será la portada.</Heading>

      <motion.div className="gallery" variants={fadeUp}>
        {casillas.map((foto, i) =>
          foto ? (
            <motion.button
              key={foto.id}
              type="button"
              className="gallery__tile gallery__tile--filled"
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => abrir(i)}
              aria-label={i === 0 ? 'Cambiar portada' : `Cambiar foto ${i + 1}`}
            >
              {foto.url ? <img src={foto.url} alt="" /> : <Icon name="hero-photo-solid" size={24} />}
              {i === 0 && <span className="gallery__badge">Portada</span>}
            </motion.button>
          ) : (
            <motion.button
              key={`vacia-${i}`}
              type="button"
              className="gallery__tile gallery__tile--empty"
              layout
              whileTap={{ scale: 0.97 }}
              onClick={() => abrir()}
              aria-label="Agregar fotos"
            >
              <Icon name="media-image" size={24} />
              {i === total - 1 && <span className="gallery__add">Agregar</span>}
            </motion.button>
          ),
        )}
      </motion.div>

      <Note iconName="hero-sparkles-solid">Usa luz natural y muestra cama, clóset, baño y cocina.</Note>
      <input ref={input} type="file" accept="image/*" multiple hidden onChange={agregar} />
    </Step>
  )
}

/** A14 · ¿Qué tipo de cuarto es? + capacidad. */
export function TipoCuarto({ datos, actualizar, siguiente }) {
  return (
    <Step actions={<Button onClick={siguiente}>Continuar</Button>}>
      <Heading title="¿Qué tipo de cuarto es?" />
      <div className="heading" role="radiogroup" style={{ gap: 10 }}>
        {TIPOS_CUARTO.map((t) => (
          <SelectCard
            key={t.id}
            title={t.titulo}
            description={t.desc}
            icon={t.icon}
            iconSelected={t.iconSel}
            selected={datos.cuarto === t.id}
            onSelect={() => actualizar({ cuarto: t.id, capacidad: t.id === 'compartido' ? Math.max(2, datos.capacidad) : datos.capacidad })}
          />
        ))}
      </div>
      <motion.div className="section" variants={fadeUp}>
        <p className="section-label">Capacidad</p>
        <div className="pet-row">
          <span className="option__texts">
            <span className="option__title">Estudiantes por cuarto</span>
            <span className="option__desc">Máximo permitido</span>
          </span>
          <Contador grande valor={datos.capacidad} min={1} max={6} onChange={(v) => actualizar({ capacidad: v })} label="Estudiantes por cuarto" />
        </div>
      </motion.div>
    </Step>
  )
}

/** A15 · ¿Qué incluye el cuarto? */
export function Incluye({ datos, actualizar, alternar, siguiente }) {
  return (
    <Step className="step--long" actions={<Button onClick={siguiente}>Continuar</Button>}>
      <Heading title="¿Qué incluye el cuarto?">Marca todo lo que entra en el precio.</Heading>
      <ChipGroups grupos={INCLUYE} seleccion={datos.incluye} onToggle={(id) => alternar('incluye', id)} />
      <motion.div className="section" variants={fadeUp}>
        <p className="section-label">Baño</p>
        <div className="chips" role="radiogroup">
          {BANOS.map((b) => (
            <Chip key={b.id} label={b.label} selected={datos.bano === b.id} onToggle={() => actualizar({ bano: b.id })} />
          ))}
        </div>
      </motion.div>
    </Step>
  )
}

/** Íconos de las reglas en la lista A16. */
const iconoRegla = (id) => (id === 'convivencia' ? 'home-solid' : buscar(TIPOS_REGLA, id)?.icon || 'hero-sparkles-solid')

/** A16 · Reglas de la casa. */
export function Reglas({ datos, siguiente, abrir }) {
  const filas = [
    ...datos.reglasActivas.map((id) => ({ id, ...describirRegla(id, datos.reglas), icon: iconoRegla(id) })),
    ...datos.reglasExtra.map((r) => ({ id: r.id, titulo: r.titulo, corta: r.texto, icon: iconoRegla(r.tipo), extra: r })),
  ]
  return (
    <Step className="step--long" actions={<Button onClick={siguiente}>Continuar</Button>}>
      <Heading title="Reglas de la casa">Claras desde el inicio evitan malentendidos. Toca una regla para editarla.</Heading>
      <div className="heading" style={{ gap: 12 }}>
        <AnimatePresence initial={false}>
          {filas.map((f) => (
            <motion.button
              key={f.id}
              type="button"
              className="rule-row"
              layout
              variants={fadeUp}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, height: 0 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => (f.extra ? abrir('regla-extra', f.extra) : abrir(`regla-${f.id}`))}
            >
              <Icon name={f.icon} size={24} className="host-row__icon" />
              <span className="option__texts">
                <span className="option__title">{f.titulo}</span>
                <span className="option__desc">{f.corta}</span>
              </span>
              <Icon name="nav-arrow-right" size={18} className="rule-row__chevron" />
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
      <motion.button type="button" className="link link--start" variants={fadeUp} onClick={() => abrir('agregar-regla')}>
        + Agregar regla
      </motion.button>
    </Step>
  )
}

/* ---------- Hojas de reglas (A16b–f) ---------- */

/** A16b · Agregar regla — cuadrícula de tipos. */
export function HojaAgregarRegla({ abierta, onClose, onElegir }) {
  return (
    <Hoja abierta={abierta} titulo="Agregar regla" sub="Elige qué tipo de regla quieres agregar a tu casa." onClose={onClose}>
      <motion.div className="rule-grid" variants={fadeUp}>
        {TIPOS_REGLA.map((t) => (
          <motion.button key={t.id} type="button" className="rule-tile" whileTap={{ scale: 0.97 }} onClick={() => onElegir(t.id)}>
            <Icon name={t.icon} size={22} />
            {t.label}
          </motion.button>
        ))}
      </motion.div>
    </Hoja>
  )
}

/** Campo de hora con reloj nativo del teléfono, mostrado como "10:00 p. m.". */
function CampoHora({ label, valor, onChange }) {
  return (
    <Campo label={label} icon="clock">
      {(id) => <input id={id} className="field__input field__input--time" type="time" value={valor} onChange={(e) => onChange(e.target.value)} />}
    </Campo>
  )
}

/** Hoja de edición de una regla: guarda un borrador y solo aplica al tocar "Guardar regla". */
function useBorrador(abierta, inicial) {
  const [borrador, setBorrador] = useState(inicial)
  const [antes, setAntes] = useState(false)
  if (abierta !== antes) {
    setAntes(abierta)
    if (abierta) setBorrador(inicial)
  }
  return [borrador, setBorrador]
}

export function HojaRegla({ tipo, abierta, datos, actualizar, onClose }) {
  const [r, setR] = useBorrador(abierta, datos.reglas)
  const guardar = () => {
    const activas = datos.reglasActivas.includes(tipo) ? datos.reglasActivas : [...datos.reglasActivas, tipo]
    actualizar({ reglas: r, reglasActivas: activas })
    onClose()
  }
  const set = (campo, valor) => setR({ ...r, [tipo]: { ...r[tipo], [campo]: valor } })
  const desc = describirRegla(tipo, r)
  const comun = { abierta, onClose, accion: 'Guardar regla', onAccion: guardar }

  if (tipo === 'llegada')
    return (
      <Hoja {...comun} titulo="Hora de llegada" sub="Define hasta qué hora pueden llegar los estudiantes.">
        <CampoHora label="Hora límite" valor={r.llegada.hora} onChange={(v) => set('hora', v)} />
        <FilaSwitch
          icon="hero-bell-solid"
          titulo="Pedir aviso si llegan más tarde"
          desc="El estudiante te escribe antes de llegar"
          checked={r.llegada.aviso}
          onChange={(v) => set('aviso', v)}
        />
        <VistaRegla icon="clock-fill" titulo="Hora de llegada" texto={desc.larga} />
      </Hoja>
    )

  if (tipo === 'visitas')
    return (
      <Hoja {...comun} titulo="Visitas" sub="Elige cómo funcionan las visitas en tu casa.">
        <div className="heading" role="radiogroup" style={{ gap: 10 }}>
          {MODOS_VISITA.map((m) => (
            <SelectCard
              key={m.id}
              title={m.titulo}
              description={m.desc}
              icon={m.icon}
              iconSelected={m.iconSel}
              selected={r.visitas.modo === m.id}
              onSelect={() => set('modo', m.id)}
            />
          ))}
        </div>
        <AnimatePresence initial={false}>
          {r.visitas.modo !== 'no' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
              <CampoHora label="Hasta las" valor={r.visitas.hasta} onChange={(v) => set('hasta', v)} />
            </motion.div>
          )}
        </AnimatePresence>
        <VistaRegla icon="group-fill" titulo="Visitas" texto={desc.larga} />
      </Hoja>
    )

  if (tipo === 'cocina')
    return (
      <Hoja {...comun} titulo="Uso de cocina" sub="Indica el horario en que pueden usar la cocina.">
        <motion.div className="two-cols" variants={fadeUp}>
          <CampoHora label="Desde" valor={r.cocina.desde} onChange={(v) => set('desde', v)} />
          <CampoHora label="Hasta" valor={r.cocina.hasta} onChange={(v) => set('hasta', v)} />
        </motion.div>
        <FilaSwitch
          icon="cutlery-fill"
          titulo="Cada quien guarda su comida"
          desc="Espacio propio en el refrigerador"
          checked={r.cocina.guardar}
          onChange={(v) => set('guardar', v)}
        />
        <FilaSwitch
          icon="clock-fill"
          titulo="Se puede cocinar de noche"
          desc={`Después de las ${hora12(r.cocina.hasta)}`}
          checked={r.cocina.noche}
          onChange={(v) => set('noche', v)}
        />
        <VistaRegla icon="cutlery-fill" titulo="Cocina" texto={desc.larga} />
      </Hoja>
    )

  return (
    <Hoja {...comun} titulo="Convivencia" sub="Marca las normas que se aplican en tu casa.">
      {NORMAS_CONVIVENCIA.map((n) => (
        <FilaSwitch key={n.id} icon={n.icon} titulo={n.titulo} desc={n.desc} checked={r.convivencia[n.id]} onChange={(v) => set(n.id, v)} />
      ))}
      <VistaRegla icon="home-solid" titulo="Convivencia" texto={desc.larga} />
    </Hoja>
  )
}

/** Regla libre (Mascotas, Fumar, Wi‑Fi, Otra regla…): título + descripción. */
export function HojaReglaExtra({ abierta, regla, datos, actualizar, onClose }) {
  const tipo = buscar(TIPOS_REGLA, regla?.tipo) || TIPOS_REGLA[TIPOS_REGLA.length - 1]
  const [texto, setTexto] = useBorrador(abierta, regla?.texto || '')
  const existente = datos.reglasExtra.some((r) => r.id === regla?.id)
  const guardar = () => {
    const nueva = { id: regla.id, tipo: tipo.id, titulo: regla.titulo, texto: texto.trim() }
    actualizar({ reglasExtra: existente ? datos.reglasExtra.map((r) => (r.id === nueva.id ? nueva : r)) : [...datos.reglasExtra, nueva] })
    onClose()
  }
  const quitar = () => {
    actualizar({ reglasExtra: datos.reglasExtra.filter((r) => r.id !== regla.id) })
    onClose()
  }
  return (
    <Hoja
      abierta={abierta}
      titulo={regla?.titulo || tipo.label}
      sub="Escríbela como quieres que la lean los estudiantes."
      onClose={existente ? quitar : onClose}
      cancelar={existente ? 'Quitar regla' : 'Cancelar'}
      accion="Guardar regla"
      onAccion={guardar}
      accionDisabled={!texto.trim()}
    >
      <Campo label="Regla" icon="info-circle" placeholder={tipo.ejemplo} value={texto} onChange={(e) => setTexto(e.target.value)} />
      <VistaRegla icon={tipo.icon} titulo={regla?.titulo || tipo.label} texto={texto.trim() || tipo.ejemplo} />
    </Hoja>
  )
}
