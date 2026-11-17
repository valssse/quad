import { useEffect, useId, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { UCA, osmEmbed } from '../../data/geo.js'
import logoUca from '../../assets/universidades/uca.png'
import { AnimatePresence, motion, useDragControls } from 'motion/react'
import Icon from '../../components/Icon.jsx'
import Switch from '../../components/Switch.jsx'
import Button from '../../components/Button.jsx'
import { fadeUp } from '../../components/motion.js'

/* Piezas reutilizadas por las pantallas del anfitrión. */

/** Campo con etiqueta e ícono de la librería ("Campo" de Figma). */
export function Campo({ label, icon, hint, children, ...inputProps }) {
  const id = useId()
  return (
    <motion.div className="field" variants={fadeUp}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <div className="field__control">
        {icon && <Icon name={icon} size={20} className="field__icon field__icon--svg" />}
        {children ? children(id) : <input id={id} className="field__input" {...inputProps} />}
      </div>
      {hint}
    </motion.div>
  )
}

/** Fila con ícono, textos y switch (A10, A16c–f, A18, A19). */
export function FilaSwitch({ icon, titulo, desc, checked, onChange }) {
  return (
    <motion.div className="perm-row" variants={fadeUp}>
      <Icon name={icon} size={24} className="host-row__icon" />
      <div className="option__texts">
        <span className="option__title">{titulo}</span>
        <span className="option__desc">{desc}</span>
      </div>
      <Switch checked={checked} onChange={onChange} label={titulo} />
    </motion.div>
  )
}

/** Contador – n + (mascotas y capacidad). */
export function Contador({ valor, onChange, min = 0, max = 20, grande = false, label }) {
  return (
    <div className={`counter-ctl ${grande ? 'counter-ctl--lg' : ''}`} role="group" aria-label={label}>
      <motion.button
        type="button"
        className="counter-ctl__btn"
        whileTap={{ scale: 0.9 }}
        onClick={() => onChange(Math.max(min, valor - 1))}
        disabled={valor <= min}
        aria-label="Quitar uno"
      >
        –
      </motion.button>
      <span className="counter-ctl__value" aria-live="polite">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={valor}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {valor}
          </motion.span>
        </AnimatePresence>
      </span>
      <motion.button
        type="button"
        className="counter-ctl__btn counter-ctl__btn--plus"
        whileTap={{ scale: 0.9 }}
        onClick={() => onChange(Math.min(max, valor + 1))}
        disabled={valor >= max}
        aria-label="Agregar uno"
      >
        +
      </motion.button>
    </div>
  )
}

/** Botón punteado "Agregar …" (A07). */
export function BotonAgregar({ icon, children, onClick }) {
  return (
    <motion.button type="button" className="add-btn" variants={fadeUp} whileTap={{ scale: 0.98 }} onClick={onClick}>
      <Icon name={icon} size={18} />
      {children}
    </motion.button>
  )
}

/**
 * Fila para subir una foto (A02 documento, A07b foto de persona).
 * Abre la cámara/galería del teléfono; al cargar pasa al estado "Foto cargada".
 */
export function FilaFoto({ titulo, desc, descCargada = 'Foto cargada', iconoVacio = 'hero-photo-solid', valor, onChange, captura }) {
  const input = useRef(null)
  const cargada = Boolean(valor)
  const elegir = (e) => {
    const file = e.target.files?.[0]
    if (file) onChange(URL.createObjectURL(file))
    e.target.value = ''
  }
  return (
    <motion.button
      type="button"
      className={`upload-row ${cargada ? 'upload-row--done' : ''}`}
      variants={fadeUp}
      whileTap={{ scale: 0.99 }}
      onClick={() => input.current.click()}
    >
      <span className="upload-row__icon">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={cargada ? 'ok' : 'vacio'}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: 'spring', stiffness: 420, damping: 24 }}
          >
            {cargada && typeof valor === 'string' ? (
              <img src={valor} alt="" className="upload-row__thumb" />
            ) : (
              <Icon name={cargada ? 'check-circle-fill' : iconoVacio} size={28} />
            )}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="option__texts">
        <span className="option__title">{titulo}</span>
        <span className={`option__desc ${cargada ? 'upload-row__ok' : ''}`}>{cargada ? descCargada : desc}</span>
      </span>
      <input ref={input} type="file" accept="image/*" capture={captura} hidden onChange={elegir} />
    </motion.button>
  )
}

/**
 * Hoja inferior genérica (A03b, A07b–d, A16b–f).
 * Fondo atenuado + hoja con resorte; se cierra tocando el fondo, con "Cancelar"
 * o arrastrándola hacia abajo desde la manija.
 */
export function Hoja({ abierta, titulo, sub, onClose, children, accion, onAccion, accionDisabled, cancelar = 'Cancelar', cancelarComoBoton }) {
  const arrastre = useDragControls()
  return (
    <AnimatePresence>
      {abierta && (
        <div className="sheet-layer" role="dialog" aria-modal="true" aria-label={titulo}>
          <motion.div
            className="sheet-dim"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
          <motion.div
            className="sheet host-sheet"
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
            <span className="host-sheet__grip" onPointerDown={(e) => arrastre.start(e)}>
              <span className="sheet__handle" />
            </span>
            <div className="host-sheet__scroll">
              <motion.div className="host-sheet__content" variants={{ show: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } } }} initial="hidden" animate="show">
                <motion.div className="heading host-sheet__head" variants={fadeUp}>
                  <h2 className="sheet__title">{titulo}</h2>
                  {sub && <p className="text-p">{sub}</p>}
                </motion.div>
                {children}
              </motion.div>
            </div>
            <div className="host-sheet__footer">
              {accion && (
                <Button onClick={onAccion} disabled={accionDisabled}>
                  {accion}
                </Button>
              )}
              {cancelarComoBoton ? (
                <Button variant="outline" onClick={onClose}>
                  {cancelar}
                </Button>
              ) : (
                <button type="button" className="link" onClick={onClose}>
                  {cancelar}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

/** Vista previa "Así se verá en tu quad" dentro de las hojas de reglas. */
export function VistaRegla({ icon, titulo, texto }) {
  return (
    <motion.div className="rule-preview" variants={fadeUp}>
      <span className="rule-preview__label">Así se verá en tu quad</span>
      <div className="rule-preview__row">
        <Icon name={icon} size={22} />
        <div className="option__texts">
          <span className="rule-preview__title">{titulo}</span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={texto}
              className="option__desc"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
            >
              {texto}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

/* Ubicación del quad del anfitrión (se recuerda mientras la app esté abierta). */
let posCasa = [13.6768, -89.2385] // Jardines de Guadalupe, Antiguo Cuscatlán

/**
 * Mapa real de OpenStreetMap ("Dónde está el Quad").
 * - Normal: iframe de OpenStreetMap con el quad y la UCA.
 * - Ajustable: mapa interactivo (Leaflet) con el pin arrastrable.
 */
export function Mapa({ ajustable = false }) {
  const caja = useRef(null)
  const [pos, setPos] = useState(posCasa)

  useEffect(() => {
    if (!ajustable || !caja.current) return
    const m = L.map(caja.current, { center: pos, zoom: 17, zoomControl: false, attributionControl: true })
    m.attributionControl.setPrefix(false)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap', className: 'tiles-gris' }).addTo(m)
    L.marker(UCA.pos, { icon: L.divIcon({ className: 'qpin', html: '<span class="uca-pin"><img src="' + logoUca + '" alt="" />UCA</span>', iconSize: [0, 0] }), interactive: false }).addTo(m)
    const pin = L.marker(pos, {
      draggable: true,
      autoPan: true,
      icon: L.divIcon({ className: 'qpin', html: '<span class="map__pin map__pin--real"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11.47 3.84a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.06l-8.69-8.69a2.25 2.25 0 0 0-3.18 0l-8.69 8.69a.75.75 0 0 0 1.06 1.06l8.69-8.69Z"/><path d="m12 5.43 8.16 8.16c.03.03.06.06.09.08v6.2c0 1.04-.84 1.88-1.88 1.88H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.63a1.88 1.88 0 0 1-1.88-1.88v-6.2l.09-.08L12 5.43Z"/></svg></span>', iconSize: [0, 0] }),
    }).addTo(m)
    pin.on('dragend', () => {
      const ll = pin.getLatLng()
      posCasa = [ll.lat, ll.lng]
      setPos(posCasa)
    })
    m.on('click', (e) => {
      pin.setLatLng(e.latlng)
      posCasa = [e.latlng.lat, e.latlng.lng]
      setPos(posCasa)
    })
    const t = setTimeout(() => m.invalidateSize(), 300)
    return () => {
      clearTimeout(t)
      m.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ajustable])

  return (
    <div className={`map map--real ${ajustable ? 'map--edit' : ''}`}>
      {ajustable ? (
        <div className="map__leaflet" ref={caja} />
      ) : (
        <iframe className="map__frame" title="Ubicación del quad en OpenStreetMap" src={osmEmbed(pos)} loading="lazy" />
      )}
    </div>
  )
}
