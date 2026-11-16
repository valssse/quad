import { AnimatePresence, motion } from 'motion/react'
import Icon from '../../components/Icon.jsx'
import { fadeUp } from '../../components/motion.js'
import { ICONO_TRAYECTO } from '../../data/quads.js'

/* Piezas compartidas del Home (componentes "Card", "Quad · Fila", "Chip · Filtro"…). */

/** Corazón de guardar con un pequeño rebote al marcar. */
export function Corazon({ guardado, onToggle, size = 36, className = '' }) {
  return (
    <motion.button
      type="button"
      className={`save-btn ${guardado ? 'save-btn--on' : ''} ${className}`}
      style={{ width: size, height: size }}
      aria-pressed={guardado}
      aria-label={guardado ? 'Quitar de guardados' : 'Guardar'}
      whileTap={{ scale: 0.86 }}
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={guardado ? 'on' : 'off'}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 520, damping: 20 }}
        >
          <Icon name={guardado ? 'heart-solid' : 'heart'} size={18} />
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}

/** Fila de chips de filtro con desplazamiento horizontal ("Filtros rápidos"). */
export function Filtros({ opciones, valor, onChange, sombra = false, className = '' }) {
  return (
    <div className={`filters ${sombra ? 'filters--shadow' : ''} ${className}`} role="radiogroup">
      {opciones.map((o) => {
        const activo = valor === o.id
        return (
          <motion.button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={activo}
            className={`filter-chip ${activo ? 'filter-chip--on' : ''}`}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(o.id)}
          >
            {o.icon && <Icon name={o.icon} size={16} />}
            {o.label}
          </motion.button>
        )
      })}
    </div>
  )
}

/** Ícono y texto del trayecto al campus. */
export function Trayecto({ quad, size = 14 }) {
  return (
    <span className="meta-row">
      <Icon name={ICONO_TRAYECTO[quad.trayecto.modo]} size={size} />
      <span>{quad.trayecto.texto}</span>
    </span>
  )
}

/** Card grande con foto (carruseles de Explorar). */
export function QuadCard({ quad, onOpen }) {
  return (
    <motion.article className="quad-card" variants={fadeUp} whileTap={{ scale: 0.985 }} onClick={onOpen}>
      <img className="quad-card__img" src={quad.foto} alt="" loading="lazy" draggable="false" />
      <span className="quad-card__shade" />
      <div className="quad-card__top">
        <span className="glass-pill">
          <Icon name="star-fill" size={13} className="star" />
          {quad.rating.toFixed(1)}
        </span>
        <motion.button
          type="button"
          className="glass-circle"
          aria-label="Compartir"
          whileTap={{ scale: 0.88 }}
          onClick={(e) => {
            e.stopPropagation()
            navigator.share?.({ title: quad.titulo, text: `${quad.titulo} · $${quad.precio}/mes en Quad` }).catch(() => {})
          }}
        >
          <Icon name="share" size={16} />
        </motion.button>
      </div>
      <div className="quad-card__bottom">
        <div className="quad-card__info">
          <h3>{quad.titulo}</h3>
          <span className="meta-row meta-row--sm">
            <Icon name="map-pin-fill" size={13} />
            <span>{quad.zona}</span>
          </span>
          <span className="meta-row meta-row--sm meta-row--medium">
            <Icon name={ICONO_TRAYECTO[quad.trayecto.modo]} size={14} />
            <span>{quad.trayecto.texto}</span>
          </span>
        </div>
        <div className="quad-card__price">
          <span>Precio</span>
          <p>
            ${quad.precio}
            <small>/mes</small>
          </p>
        </div>
      </div>
    </motion.article>
  )
}

/** "Quad · Fila": foto, calificación, zona, trayecto, precio y corazón. */
export function QuadFila({ quad, guardado, onToggle, onOpen, className = '', ...props }) {
  return (
    <motion.article className={`quad-row ${className}`} onClick={onOpen} whileTap={{ scale: 0.99 }} {...props}>
      <img className="quad-row__img" src={quad.foto} alt="" loading="lazy" draggable="false" />
      <div className="quad-row__info">
        <span className="rating">
          <Icon name="star-fill" size={14} className="star" />
          {quad.rating.toFixed(1)}
        </span>
        <h3>{quad.titulo}</h3>
        <span className="meta-row">
          <Icon name="map-pin-fill" size={14} />
          <span>{quad.zona}</span>
        </span>
        <Trayecto quad={quad} />
        <p className="price">
          ${quad.precio}
          <small>/mes</small>
        </p>
      </div>
      <Corazon guardado={guardado} onToggle={onToggle} />
    </motion.article>
  )
}

/** Botón azul "Ver Mapa" / "Ver lista". */
export function BotonMapa({ lista = false, onClick, className = '' }) {
  return (
    <motion.button
      type="button"
      className={`map-btn ${lista ? 'map-btn--list' : ''} ${className}`}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
    >
      <Icon name={lista ? 'filter-list' : 'map-fill'} size={lista ? 18 : 24} />
      {lista ? 'Ver lista' : 'Ver Mapa'}
    </motion.button>
  )
}

/** Botón circular blanco con borde ("Botón ícono · Superficie con borde"). */
export function BotonIcono({ icon, size = 44, iconSize = 20, label, onClick, children, className = '' }) {
  return (
    <motion.button
      type="button"
      className={`icon-btn ${className}`}
      style={{ width: size, height: size }}
      aria-label={label}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
    >
      <Icon name={icon} size={iconSize} />
      {children}
    </motion.button>
  )
}

/** Botón de filtros (abre la pantalla Filtros) con el número de filtros activos. */
export function BotonFiltros({ n = 0, ir, modo, size = 44, iconSize = 20, className = '' }) {
  return (
    <BotonIcono icon="filter-list" iconSize={iconSize} size={size} label="Filtros" className={className} onClick={() => ir('filtros', modo)}>
      <AnimatePresence>
        {n > 0 && (
          <motion.span className="filter-count" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 22 }}>
            {n}
          </motion.span>
        )}
      </AnimatePresence>
    </BotonIcono>
  )
}

/** Encabezado de sección con "Ver todo". */
export function Encabezado({ titulo, sub, onVerTodo }) {
  return (
    <div className="section-header">
      <div>
        <h2>{titulo}</h2>
        <p>{sub}</p>
      </div>
      <button type="button" className="see-all" onClick={onVerTodo}>
        Ver todo
        <Icon name="nav-arrow-right" size={16} />
      </button>
    </div>
  )
}
