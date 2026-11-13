import { motion } from 'motion/react'
import Step from './Step.jsx'
import Button from '../../components/Button.jsx'
import QuadLogo from '../../components/QuadLogo.jsx'
import { fadeUp } from '../../components/motion.js'
import { resumir } from './resumen.js'

/** E13 · Tu quad te está esperando — cierre con resumen de preferencias. */
export default function TodoListo({ datos, ir, onFinish }) {
  const r = resumir(datos)
  const filas = [
    ['Universidad', r.universidad],
    ['Presupuesto', `${r.presupuesto} /mes`],
    ['Tipo', r.tipoCorto],
    ['Mudanza', r.mudanza],
    ['Convivencia', r.convivencia],
  ]

  return (
    <Step
      actions={
        <>
          <Button onClick={onFinish}>Ver quads para mí</Button>
          <button type="button" className="link" onClick={() => ir('perfil')}>
            Editar preferencias
          </button>
        </>
      }
    >
      <div className="done">
        <QuadLogo size={88} tone="blue" delay={0.15} />
        <motion.h1 className="text-h1" variants={fadeUp}>
          Tu quad te está esperando
        </motion.h1>
        <motion.p className="text-p" variants={fadeUp}>
          Ya preparamos recomendaciones con lo que nos contaste.
        </motion.p>
        <motion.dl className="summary" variants={fadeUp}>
          {filas.map(([k, v]) => (
            <div key={k} className="summary__row">
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </Step>
  )
}
