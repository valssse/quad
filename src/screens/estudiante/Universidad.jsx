import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Step from './Step.jsx'
import Heading from './Heading.jsx'
import Button from '../../components/Button.jsx'
import SelectCard from '../../components/SelectCard.jsx'
import Icon from '../../components/Icon.jsx'
import { fadeUp } from '../../components/motion.js'
import { UNIVERSIDADES } from '../../data/estudiante.js'

/** Quita tildes y pasa a minúsculas para buscar sin importar acentos. */
const normalizar = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

/** E01 · ¿Dónde estudias? — buscador + lista de universidades. */
export default function Universidad({ datos, actualizar, siguiente }) {
  const [busqueda, setBusqueda] = useState('')
  const resultados = UNIVERSIDADES.filter((u) => normalizar(u.nombre + u.lugar).includes(normalizar(busqueda)))

  return (
    <Step actions={<Button onClick={siguiente} disabled={!datos.universidad}>Continuar</Button>}>
      <Heading title="¿Dónde estudias?">
        Así te mostramos quads cerca de tu campus y validamos que eres estudiante.
      </Heading>

      <motion.div className="field" variants={fadeUp}>
        <label className="field__label" htmlFor="buscar-uni">
          Universidad
        </label>
        <div className="field__control">
          <Icon name="search" size={20} className="field__icon field__icon--svg" />
          <input
            id="buscar-uni"
            className="field__input"
            type="search"
            placeholder="Busca tu universidad"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </motion.div>

      <div className="heading" role="radiogroup" aria-label="Universidades" style={{ gap: 10 }}>
        <AnimatePresence initial={false}>
          {resultados.map((u) => (
            <motion.div
              key={u.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
            >
              <SelectCard
                title={u.nombre}
                description={u.lugar}
                selected={datos.universidad === u.id}
                onSelect={() => actualizar({ universidad: u.id })}
                leading={
                  <span className="uni-logo">
                    <img src={u.logo} width={u.w} height={u.h} alt="" />
                  </span>
                }
              />
            </motion.div>
          ))}
        </AnimatePresence>
        {resultados.length === 0 && <p className="empty">No encontramos esa universidad.</p>}
      </div>

      <motion.p className="resend" variants={fadeUp}>
        ¿No aparece la tuya?
        <button type="button" className="link">
          Agrégala
        </button>
      </motion.p>
    </Step>
  )
}
