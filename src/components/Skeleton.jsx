import { motion } from 'motion/react'
import './skeleton.css'

const B = ({ w = '100%', h = 14, r = 8, className = '', style }) => <span className={`sk ${className}`} style={{ width: w, height: h, borderRadius: r, ...style }} />

function Estudiante() {
  return (
    <>
      <div className="sk-row">
        <B w={44} h={44} r={999} />
        <span className="sk-col">
          <B w={110} h={11} />
          <B w={190} h={15} />
        </span>
        <B w={44} h={44} r={999} />
      </div>
      <B h={52} r={999} />
      <div className="sk-row sk-row--tight">
        <B w={92} h={36} r={999} />
        <B w={110} h={36} r={999} />
        <B w={84} h={36} r={999} />
        <B w={70} h={36} r={999} />
      </div>
      <div className="sk-row sk-row--between">
        <B w={150} h={18} />
        <B w={60} h={13} />
      </div>
      {[0, 1].map((i) => (
        <div key={i} className="sk-col sk-col--card">
          <B h={220} r={20} />
          <B w="70%" h={16} />
          <B w="45%" h={12} />
          <B w="30%" h={16} />
        </div>
      ))}
    </>
  )
}

function Anfitrion() {
  return (
    <>
      <div className="sk-row">
        <B w={44} h={44} r={999} />
        <span className="sk-col">
          <B w={120} h={11} />
          <B w={210} h={15} />
        </span>
        <B w={44} h={44} r={999} />
      </div>
      <B h={151} r={24} />
      <div className="sk-row sk-row--between">
        <B w={110} h={18} />
        <B w={50} h={12} />
      </div>
      <div className="sk-grid">
        <B h={89} r={16} />
        <B h={89} r={16} />
        <B h={89} r={16} />
      </div>
      <B h={196} r={24} />
      <B w={120} h={18} />
      <div className="sk-row sk-row--card">
        <B w={44} h={44} r={999} />
        <span className="sk-col">
          <B w={90} h={11} />
          <B w={150} h={15} />
          <B w={180} h={11} />
        </span>
      </div>
    </>
  )
}

/**
 * Skeleton de carga de referencia: se muestra un momento al entrar a la app
 * (estudiante o anfitrión) y luego se desvanece. No carga nada de verdad.
 */
export default function Skeleton({ tipo = 'estudiante' }) {
  return (
    <motion.div className="sk-screen" aria-busy="true" aria-label="Cargando" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.35 } }}>
      <div className="sk-body">{tipo === 'anfitrion' ? <Anfitrion /> : <Estudiante />}</div>
    </motion.div>
  )
}
