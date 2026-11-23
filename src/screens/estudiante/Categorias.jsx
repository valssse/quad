import { motion } from 'motion/react'
import Chip from '../../components/Chip.jsx'
import { fadeUp } from '../../components/motion.js'

/** Etiqueta de sección con subcategorías de chips grises (E06 intereses y E11 preferencias). */
export default function Categorias({ titulo, grupos, seleccion, onToggle }) {
  return (
    <motion.div className="section" variants={fadeUp}>
      <p className="section-label">{titulo}</p>
      <div className="cats">
        {grupos.map((g) => (
          <div key={g.titulo} className="cat">
            <p className="cat__label">{g.titulo}</p>
            <div className="chips">
              {g.items.map((i) => (
                <Chip
                  key={i.id}
                  tone="gray"
                  label={i.label}
                  icon={i.icon}
                  iconSelected={i.iconSel}
                  selected={seleccion.includes(i.id)}
                  onToggle={() => onToggle(i.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
