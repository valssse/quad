import { motion } from 'motion/react'
import Chip from '../../components/Chip.jsx'
import { fadeUp } from '../../components/motion.js'

/** Grupos de chips grises de selección múltiple (E10 y E11). */
export default function ChipGroups({ grupos, seleccion, onToggle }) {
  return grupos.map((g) => (
    <motion.div key={g.titulo} className="section" variants={fadeUp}>
      <p className="section-label">{g.titulo}</p>
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
    </motion.div>
  ))
}
