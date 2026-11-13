import { motion } from 'motion/react'
import backIcon from '../assets/icons/back.svg'
import { press } from './motion.js'

/** Botón circular "Atrás" (40 × 40). */
export default function BackButton({ onClick, label = 'Atrás' }) {
  return (
    <motion.button type="button" className="back-btn" onClick={onClick} aria-label={label} {...press}>
      <img src={backIcon} width="20" height="20" alt="" />
    </motion.button>
  )
}
