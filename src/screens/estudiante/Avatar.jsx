import { AnimatePresence, motion } from 'motion/react'
import Icon from '../../components/Icon.jsx'

/**
 * Avatar grande de la foto de perfil (176px).
 * variant="add": círculo punteado + insignia de cámara (E05a/b)
 * variant="ready": círculo azul claro o la foto + insignia de check (E05c)
 */
export default function Avatar({ variant = 'add', photo }) {
  const ready = variant === 'ready'
  return (
    <div className="avatar-wrap">
      <div className="avatar">
        {ready ? (
          <svg className="avatar__circle" viewBox="0 0 168 168" aria-hidden="true">
            <circle cx="84" cy="84" r="84" fill="var(--brand-primary-soft-strong)" />
          </svg>
        ) : (
          <svg className="avatar__circle" viewBox="0 0 168 168" aria-hidden="true">
            <circle cx="84" cy="84" r="84" fill="var(--brand-primary-soft)" />
            {/* Borde punteado que gira muy lento: invita a tocar */}
            <motion.circle
              cx="84"
              cy="84"
              r="83"
              fill="none"
              stroke="var(--brand-primary)"
              strokeWidth="2"
              strokeDasharray="8 6"
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '84px 84px' }}
            />
          </svg>
        )}

        <AnimatePresence initial={false}>
          {photo ? (
            <motion.img
              key="photo"
              className="avatar__photo"
              src={photo}
              alt="Tu foto de perfil"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
            />
          ) : (
            <Icon
              key="icon"
              name="user-solid"
              size={ready ? 88 : 72}
              className="avatar__icon"
              style={ready ? { left: 40, top: 44 } : { left: 48, top: 48 }}
            />
          )}
        </AnimatePresence>

        <motion.span
          className="avatar__badge"
          style={ready ? { left: 124, top: 124, width: 44, height: 44 } : { left: 122, top: 122, width: 48, height: 48 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.3 }}
        >
          <Icon name={ready ? 'check' : 'hero-camera-solid'} size={ready ? 22 : 24} />
        </motion.span>
      </div>
    </div>
  )
}
