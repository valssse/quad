import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Icon from '../../components/Icon.jsx'
import { fadeUp, stagger } from '../../components/motion.js'
import { BotonFiltros, BotonIcono, Encabezado, Filtros, QuadCard } from './ui.jsx'
import { FILTROS_RAPIDOS, SECCIONES, filtrar, quad, saludo } from '../../data/quads.js'
import { TarjetaSolicitud } from './Solicitudes.jsx'
import sofia from '../../assets/personas/sofia.jpg'

/** 02 · Explorar quads — saludo, buscador, filtros rápidos y carruseles. */
export default function Explorar({ perfil, ir, nFiltros, activas = [], abrirSolicitud, sinLeer = 0 }) {
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
            <BotonIcono icon="bell" label="Notificaciones" className="bell-btn" onClick={() => ir('notificaciones')}>
              <AnimatePresence>
                {sinLeer > 0 && (
                  <motion.span
                    className="bell-dot"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 16, delay: 0.5 }}
                  />
                )}
              </AnimatePresence>
            </BotonIcono>
          </motion.header>

          <motion.div className="search-row" variants={fadeUp}>
            <motion.button type="button" className="search-box" whileTap={{ scale: 0.99 }} onClick={() => ir('buscar')}>
              <Icon name="search" size={20} />
              Busca por colonia o calle
            </motion.button>
            <BotonFiltros n={nFiltros} ir={ir} iconSize={22} size={52} className="icon-btn--square" />
          </motion.div>

          <motion.div variants={fadeUp} className="explore-chips">
            <Filtros opciones={FILTROS_RAPIDOS} valor={filtro} onChange={setFiltro} className="filters--bleed" />
          </motion.div>
        </div>

        <AnimatePresence initial={false}>
          {activas.length > 0 && (
            <motion.section key="activas" className="home-section" variants={stagger} initial="hidden" animate="show" exit={{ opacity: 0, height: 0 }}>
              <motion.div variants={fadeUp}>
                <Encabezado
                  titulo="Solicitudes activas"
                  sub={activas.length === 1 ? '1 solicitud en curso' : `${activas.length} solicitudes en curso`}
                  onVerTodo={() => ir('solicitudes')}
                />
              </motion.div>
              <motion.div className="carousel" variants={stagger}>
                {activas.map((s) => (
                  <TarjetaSolicitud key={s.quadId} solicitud={s} solo={activas.length === 1} onOpen={() => abrirSolicitud(s)} />
                ))}
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>

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
                  <QuadCard key={q.id} quad={q} onOpen={() => ir('quad', q.id)} />
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
