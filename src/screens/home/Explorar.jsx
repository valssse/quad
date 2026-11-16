import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Icon from '../../components/Icon.jsx'
import { fadeUp, stagger } from '../../components/motion.js'
import { BotonIcono, Encabezado, Filtros, QuadCard } from './ui.jsx'
import { FILTROS_RAPIDOS, SECCIONES, filtrar, quad, saludo } from '../../data/quads.js'
import sofia from '../../assets/personas/sofia.jpg'

/** 02 · Explorar quads — saludo, buscador, filtros rápidos y carruseles. */
export default function Explorar({ perfil, ir }) {
  const [filtro, setFiltro] = useState('todos')
  const secciones = SECCIONES.map((s) => ({ ...s, lista: filtrar(s.quads.map(quad), filtro) })).filter((s) => s.lista.length)

  return (
    <div className="home-screen">
      <motion.div className="home-scroll" variants={stagger} initial="hidden" animate="show">
        <div className="explore-top">
          <motion.header className="explore-header" variants={fadeUp}>
            <motion.button type="button" className="avatar-btn" whileTap={{ scale: 0.94 }} onClick={() => ir('perfil')} aria-label="Tu perfil">
              <img src={perfil.foto || sofia} alt="" />
            </motion.button>
            <div className="explore-header__center">
              <p>
                {saludo()}, {perfil.nombre}
              </p>
              <button type="button" className="location-btn">
                <Icon name="map-pin-fill" size={18} />
                Av.Sultana
                <Icon name="nav-arrow-down" size={16} />
              </button>
            </div>
            <BotonIcono icon="bell" label="Notificaciones" className="bell-btn">
              <motion.span
                className="bell-dot"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 16, delay: 0.5 }}
              />
            </BotonIcono>
          </motion.header>

          <motion.div className="search-row" variants={fadeUp}>
            <motion.button type="button" className="search-box" whileTap={{ scale: 0.99 }} onClick={() => ir('buscar')}>
              <Icon name="search" size={20} />
              Busca por colonia o calle
            </motion.button>
            <BotonIcono icon="filter-list" iconSize={22} size={52} label="Filtros" className="icon-btn--square" />
          </motion.div>

          <motion.div variants={fadeUp} className="explore-chips">
            <Filtros opciones={FILTROS_RAPIDOS} valor={filtro} onChange={setFiltro} className="filters--bleed" />
          </motion.div>
        </div>

        <AnimatePresence mode="popLayout" initial={false}>
          {secciones.map((s) => (
            <motion.section
              key={`${s.id}-${filtro}`}
              className="home-section"
              variants={stagger}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              <motion.div variants={fadeUp}>
                <Encabezado titulo={s.titulo} sub={s.sub} onVerTodo={() => ir('resultados', s.id)} />
              </motion.div>
              <motion.div className="carousel" variants={stagger}>
                {s.lista.map((q) => (
                  <QuadCard key={q.id} quad={q} />
                ))}
              </motion.div>
            </motion.section>
          ))}
        </AnimatePresence>
        {secciones.length === 0 && <p className="home-empty">Aún no hay quads con ese filtro.</p>}
      </motion.div>
    </div>
  )
}
