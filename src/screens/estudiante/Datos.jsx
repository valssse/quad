import { useState } from 'react'
import { AnimatePresence, motion, useDragControls } from 'motion/react'
import Step from './Step.jsx'
import Heading from './Heading.jsx'
import Button from '../../components/Button.jsx'
import Chip from '../../components/Chip.jsx'
import Icon from '../../components/Icon.jsx'
import { fadeUp } from '../../components/motion.js'
import { ANIOS, CIUDADES, OTRA_CIUDAD } from '../../data/estudiante.js'

/** Campo de texto con ícono de la librería (Campo/Texto de Figma). */
function Campo({ id, label, icon, ...props }) {
  return (
    <motion.div className="field" variants={fadeUp}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <div className="field__control">
        <Icon name={icon} size={20} className="field__icon field__icon--svg" />
        <input id={id} className="field__input" {...props} />
      </div>
    </motion.div>
  )
}

/** E05d3 · Hoja · Ciudad de origen, con buscador. */
function HojaCiudad({ abierta, valor, onClose, onElegir }) {
  const [q, setQ] = useState('')
  const arrastre = useDragControls()
  const norm = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  const lista = CIUDADES.filter((c) => norm(c).includes(norm(q.trim())))

  return (
    <AnimatePresence onExitComplete={() => setQ('')}>
      {abierta && (
        <div className="sheet-layer" role="dialog" aria-modal="true" aria-label="Ciudad de origen">
          <motion.div className="sheet-dim" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} />
          <motion.div
            className="sheet city-sheet"
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
            <h2>Ciudad de origen</h2>
            <div className="field__control">
              <Icon name="search" size={20} className="field__icon field__icon--svg" />
              <input className="field__input" type="search" placeholder="Busca tu ciudad" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Busca tu ciudad" />
            </div>
            <div className="city-sheet__list">
              {[...lista, OTRA_CIUDAD].map((c) => {
                const on = valor === c
                return (
                  <motion.button
                    key={c}
                    type="button"
                    layout="position"
                    className={`city-sheet__item ${on ? 'city-sheet__item--on' : ''} ${c === OTRA_CIUDAD && !on ? 'city-sheet__item--otra' : ''}`}
                    onClick={() => onElegir(c)}
                    whileTap={{ scale: 0.99 }}
                  >
                    {c}
                    <AnimatePresence>
                      {on && (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 28 }}>
                          <Icon name="check-circle-fill" size={22} />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

/** E05d · Datos académicos — carrera, año y ciudad de origen (selector con hoja). */
export default function Datos({ datos, actualizar, siguiente }) {
  const [hoja, setHoja] = useState(false)
  const completo = datos.carrera.trim() && datos.anio && datos.ciudad

  return (
    <Step
      actions={
        <Button onClick={siguiente} disabled={!completo}>
          Continuar
        </Button>
      }
    >
      <Heading title="Tus datos académicos">Así las familias saben qué estudias y de dónde vienes.</Heading>

      <Campo
        id="carrera"
        label="Carrera"
        icon="sparks"
        placeholder="Ej. Ingeniería Industrial"
        value={datos.carrera}
        onChange={(e) => actualizar({ carrera: e.target.value })}
      />

      <motion.div className="section" variants={fadeUp}>
        <p className="section-label">Año que cursas</p>
        <div className="chips" role="radiogroup" aria-label="Año que cursas">
          {ANIOS.map((a) => (
            <Chip key={a.id} label={a.label} selected={datos.anio === a.id} onToggle={() => actualizar({ anio: a.id })} />
          ))}
        </div>
      </motion.div>

      <motion.div className="field" variants={fadeUp}>
        <span className="field__label" id="ciudad-label">
          Ciudad de origen
        </span>
        <button type="button" className="field__control field__control--select" aria-labelledby="ciudad-label" aria-haspopup="dialog" onClick={() => setHoja(true)}>
          <Icon name="map-pin" size={20} className="field__icon field__icon--svg" />
          <span className={`field__value ${datos.ciudad ? '' : 'field__value--empty'}`}>{datos.ciudad || 'Elige tu ciudad'}</span>
          <Icon name="nav-arrow-down" size={20} className="field__chevron" />
        </button>
      </motion.div>

      <HojaCiudad
        abierta={hoja}
        valor={datos.ciudad}
        onClose={() => setHoja(false)}
        onElegir={(c) => {
          actualizar({ ciudad: c })
          setTimeout(() => setHoja(false), 180)
        }}
      />
    </Step>
  )
}
