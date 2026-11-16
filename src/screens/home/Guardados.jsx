import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Icon from '../../components/Icon.jsx'
import { fadeUp, stagger } from '../../components/motion.js'
import { Filtros, QuadFila } from './ui.jsx'
import { FILTROS_GUARDADOS, filtrar, quad } from '../../data/quads.js'

/** 07 · Guardados — quads marcados con el corazón. */
export default function Guardados({ guardados, alternarGuardado }) {
  const [filtro, setFiltro] = useState('todos')
  // Los que se quitan quedan visibles hasta salir de la pantalla, para poder deshacer
  const [vistos] = useState(guardados)
  const lista = filtrar(vistos.map(quad), filtro)
  const total = guardados.length

  return (
    <div className="home-screen">
      <motion.div className="home-scroll" variants={stagger} initial="hidden" animate="show">
        <div className="home-top">
          <motion.div className="home-title" variants={fadeUp}>
            <h1>Guardados</h1>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p key={total} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>
                {total === 1 ? '1 quad que te interesa' : `${total} quads que te interesan`}
              </motion.p>
            </AnimatePresence>
          </motion.div>
          <motion.div variants={fadeUp}>
            <Filtros opciones={FILTROS_GUARDADOS} valor={filtro} onChange={setFiltro} className="filters--bleed" />
          </motion.div>
          <motion.div className="note" variants={fadeUp}>
            <Icon name="hero-envelope-solid" size={16} className="note__icon" />
            <p>Te avisamos si alguno baja de precio o deja de estar disponible.</p>
          </motion.div>
        </div>

        <div className="row-list">
          <AnimatePresence initial={false} mode="popLayout">
            {lista.map((q) => (
              <QuadFila
                key={q.id}
                quad={q}
                guardado={guardados.includes(q.id)}
                onToggle={() => alternarGuardado(q.id)}
                layout
                variants={fadeUp}
                exit={{ opacity: 0, scale: 0.96 }}
              />
            ))}
          </AnimatePresence>
          {lista.length === 0 && <p className="home-empty">No hay guardados con ese filtro.</p>}
        </div>
      </motion.div>
    </div>
  )
}
