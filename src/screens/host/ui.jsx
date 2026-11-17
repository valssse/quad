import { AnimatePresence, motion, useDragControls } from 'motion/react'
import Icon from '../../components/Icon.jsx'
import logoUca from '../../assets/universidades/uca.png'

/** Badge de Figma: green (Destacado) · amber (Calificación) · blue (Marca) · gray (Contorno). */
export function Badge({ tono = 'gray', icon, children }) {
  return (
    <span className={`hs-badge hs-badge--${tono}`}>
      {icon === 'uca' ? <img src={logoUca} alt="" width="13" height="18" /> : icon && <Icon name={icon} size={14} className={icon.includes('envelope') ? 'hs-badge__blue' : ''} />}
      {children}
    </span>
  )
}

const BADGES = {
  nueva: { tono: 'blue', icon: 'hero-bell-solid', texto: 'Nueva' },
  aceptada: { tono: 'green', icon: 'check-circle-fill', texto: 'Aceptada' },
  publicado: { tono: 'green', icon: 'check-circle-fill', texto: 'Publicado' },
  revision: { tono: 'amber', icon: 'clock-fill', texto: 'En revisión' },
  pausado: { tono: 'gray', icon: 'clock-fill', texto: 'Pausado' },
  pagado: { tono: 'green', icon: 'check-circle-fill', texto: 'Pagado' },
  proximo: { tono: 'gray', icon: 'calendar-fill', texto: 'Próximo' },
  vencido: { tono: 'amber', icon: 'clock-fill', texto: 'Vencido' },
  alDia: { tono: 'green', icon: 'check-circle-fill', texto: 'Al día' },
  pendiente: { tono: 'amber', icon: 'clock-fill', texto: 'Pago pendiente' },
  abierto: { tono: 'amber', icon: 'clock-fill', texto: 'Abierto' },
  atendido: { tono: 'green', icon: 'check-circle-fill', texto: 'Atendido' },
}

export function Estado({ id }) {
  const b = BADGES[id]
  return (
    <Badge tono={b.tono} icon={b.icon}>
      {b.texto}
    </Badge>
  )
}

/** Avatar con foto o iniciales sobre azul claro. */
export function Avatar({ foto, iniciales, size = 48 }) {
  return (
    <span className="hs-avatar" style={{ width: size, height: size, fontSize: size >= 56 ? 17 : 15 }}>
      {foto ? <img src={foto} alt="" /> : iniciales}
    </span>
  )
}

/** Barra superior de las pantallas apiladas: atrás + título. */
export function Cabecera({ titulo }) {
  return (
    <div className="hs-top">
      <motion.button type="button" className="dt-round dt-round--border dt-round--plain" whileTap={{ scale: 0.9 }} aria-label="Atrás" onClick={() => window.history.back()}>
        <Icon name="nav-arrow-left" size={20} />
      </motion.button>
      <h1>{titulo}</h1>
      <span className="hs-top__spacer" />
    </div>
  )
}

/** Tabla de datos con divisores (Su solicitud, Contrato). */
export function Datos({ filas }) {
  return filas.map(([k, v], i) => (
    <div key={k} className={`hs-dato ${i ? 'hs-dato--line' : ''}`}>
      <span>{k}</span>
      <b>{v}</b>
    </div>
  ))
}

/** Hoja inferior con scrim y arrastre para cerrar. */
export function Hoja({ abierta, onClose, etiqueta, children, className = '' }) {
  const arrastre = useDragControls()
  return (
    <AnimatePresence>
      {abierta && (
        <div className="sheet-layer" role="dialog" aria-modal="true" aria-label={etiqueta}>
          <motion.div className="sheet-dim hs-dim" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} />
          <motion.div
            className={`sheet ch-sheet hs-sheet ${className}`}
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
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

/** Aviso oscuro (toast) con acción opcional. */
export function Aviso({ aviso, arriba }) {
  return (
    <AnimatePresence>
      {aviso && (
        <motion.div
          key={aviso.id}
          className={`hs-toast ${arriba ? 'hs-toast--top' : ''}`}
          role="status"
          initial={{ opacity: 0, y: arriba ? -12 : 12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: arriba ? -12 : 12, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        >
          <span className="hs-toast__check">
            <Icon name="check" size={13} />
          </span>
          <span className="hs-toast__text">{aviso.texto}</span>
          {aviso.accion && (
            <button type="button" className="hs-toast__action" onClick={aviso.accion.fn}>
              {aviso.accion.label}
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Tarjeta blanca con borde (r20). */
export function Tarjeta({ className = '', children, ...props }) {
  return (
    <div className={`hs-card ${className}`} {...props}>
      {children}
    </div>
  )
}
