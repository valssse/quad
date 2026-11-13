import { useId, useRef } from 'react'
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

/**
 * Mapa ilustrado de Figma ("Mapa · iframe Google Maps (reemplazar en desarrollo)").
 * La ruta punteada se dibuja, el pin cae y el halo respira.
 */
export function Mapa({ ajustable = false }) {
  const caja = useRef(null)
  return (
    <div className={`map ${ajustable ? 'map--edit' : ''}`} ref={caja}>
      <svg className="map__base" viewBox="0 0 350 210" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="350" height="210" fill="#F1EEE8" />
        <rect x="-10" y="-10" width="170" height="86" rx="10" fill="#DCEBD6" />
        <rect x="196" y="140" width="76" height="52" rx="10" fill="#D3E8D6" />
        <rect x="296" y="96" width="60" height="44" rx="10" fill="#D3E8D6" />
        <rect x="20" y="150" width="80" height="44" rx="8" fill="#E8E3DA" />
        {[
          ['M-10 150C70 128 150 118 360 76', 14, 11],
          ['M64 -10C84 60 96 130 72 220', 11, 8],
          ['M-10 100L360 112', 9, 6],
          ['M176 -10L196 220', 9, 6],
          ['M262 -10L274 220', 9, 6],
          ['M-10 194L360 184', 9, 6],
          ['M120 -10L110 100', 8, 5],
        ].map(([d, a, b]) => (
          <g key={d} strokeLinecap="round" fill="none">
            <path d={d} stroke="#D9D5CB" strokeWidth={a} />
            <path d={d} stroke="#fff" strokeWidth={b} />
          </g>
        ))}
        <path d="M232 116V84H176V48H96" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <motion.path
          d="M232 116V84H176V48H96"
          stroke="#2667FF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="0.1 7"
          fill="none"
          initial={{ clipPath: 'inset(0 0 0 100%)' }}
          animate={{ clipPath: 'inset(0 0 0 0%)' }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <motion.div
        className="map__marker"
        drag={ajustable}
        dragConstraints={caja}
        dragMomentum={false}
        dragElastic={0.1}
        animate={ajustable ? { scale: 1.08 } : { scale: 1 }}
      >
        <motion.span
          className="map__halo"
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: [1, 1.12, 1], opacity: 1 }}
          transition={{ scale: { duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }, opacity: { duration: 0.3, delay: 0.3 } }}
        />
        <motion.span
          className="map__pin"
          initial={{ y: -18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 420, damping: 16, delay: 0.25 }}
        >
          <Icon name="home-solid" size={20} />
        </motion.span>
      </motion.div>
      <div className="map__zoom" aria-hidden="true">
        <span>+</span>
        <span>–</span>
      </div>
    </div>
  )
}
