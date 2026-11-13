import { motion } from 'motion/react'
import Button from '../../components/Button.jsx'
import { UNIVERSIDADES, buscar } from '../../data/estudiante.js'

const ease = [0.16, 1, 0.3, 1]

/** E04 · Estudiante verificado — sello con check que se dibuja. */
export default function Verificado({ datos, siguiente }) {
  const uni = buscar(UNIVERSIDADES, datos.universidad)

  return (
    <div className="verified">
      <div className="verified__center">
        <div className="verified__bubble" style={{ position: 'relative' }}>
          {/* Onda suave que se expande una vez */}
          <motion.span
            className="verified__ring"
            initial={{ scale: 0.4, opacity: 0.9 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1.1, ease, delay: 0.25 }}
          />
          {/* Escudo (shield-check-fill de Figma) con el check dibujándose */}
          <motion.svg
            width="60"
            height="60"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
            style={{ position: 'relative' }}
          >
            <path
              d="M5.00002 18L3.13038 4.91257C3.05648 4.39528 3.39391 3.91251 3.904 3.79916L11.5661 2.09645C11.8519 2.03295 12.1481 2.03295 12.4339 2.09645L20.096 3.79916C20.6061 3.91251 20.9435 4.39528 20.8696 4.91256L19 18C18.9293 18.495 18.5 21.5 12 21.5C5.50002 21.5 5.07073 18.495 5.00002 18Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <motion.path
              d="M8.5 11.5L11.5 14.5L16.5 9.5"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.45, ease, delay: 0.45 }}
            />
          </motion.svg>
        </div>

        <motion.h1
          className="text-h1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.5 }}
        >
          ¡Listo, estás verificado!
        </motion.h1>
        <motion.p
          className="text-p"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.6 }}
        >
          Tu perfil mostrará el sello de estudiante de la {uni?.corto || 'universidad'}. Las familias anfitrionas
          confían más en perfiles verificados.
        </motion.p>
      </div>

      <motion.footer
        className="actionbar"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease, delay: 0.75 }}
      >
        <Button onClick={siguiente}>Continuar</Button>
      </motion.footer>
    </div>
  )
}
