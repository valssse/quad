import { useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Button from '../../components/Button.jsx'
import Icon from '../../components/Icon.jsx'

/**
 * E05b · Hoja inferior "Agregar foto de perfil".
 * Abre la cámara o la galería del teléfono (input de archivo) y devuelve la imagen.
 * Se cierra tocando el fondo, con "Cancelar" o arrastrándola hacia abajo.
 */
const TEXTOS = {
  titulo: 'Agregar foto de perfil',
  camara: 'Tomar una foto',
  camaraDesc: 'Usa la cámara de tu teléfono',
  galeria: 'Elegir de la galería',
  galeriaDesc: 'Sube una foto que ya tengas',
}

export default function PhotoSheet({ open, onClose, onPick, textos = TEXTOS }) {
  const camara = useRef(null)
  const galeria = useRef(null)

  const elegir = (e) => {
    const file = e.target.files?.[0]
    if (file) onPick(URL.createObjectURL(file))
    e.target.value = ''
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="sheet-layer" role="dialog" aria-modal="true" aria-label={textos.titulo}>
          <motion.div
            className="sheet-dim"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
          <motion.div
            className="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => (info.offset.y > 90 || info.velocity.y > 500) && onClose()}
          >
            <span className="sheet__handle" />
            <h2 className="sheet__title">{textos.titulo}</h2>

            <motion.button type="button" className="sheet-option" whileTap={{ scale: 0.98 }} onClick={() => camara.current.click()}>
              <Icon name="hero-camera-solid" />
              <span className="option__texts">
                <span className="option__title">{textos.camara}</span>
                <span className="option__desc">{textos.camaraDesc}</span>
              </span>
              <Icon name="nav-arrow-right" size={18} />
            </motion.button>

            <motion.button type="button" className="sheet-option" whileTap={{ scale: 0.98 }} onClick={() => galeria.current.click()}>
              <Icon name="hero-photo-solid" />
              <span className="option__texts">
                <span className="option__title">{textos.galeria}</span>
                <span className="option__desc">{textos.galeriaDesc}</span>
              </span>
              <Icon name="nav-arrow-right" size={18} />
            </motion.button>

            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>

            <input ref={camara} type="file" accept="image/*" capture="user" hidden onChange={elegir} />
            <input ref={galeria} type="file" accept="image/*" hidden onChange={elegir} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
