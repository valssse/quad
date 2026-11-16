import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Icon from '../../components/Icon.jsx'
import { fadeUp, stagger } from '../../components/motion.js'
import { BotonFiltros, BotonIcono, BotonMapa, Filtros, QuadFila } from './ui.jsx'
import { aplicarFiltros } from '../../data/filtros.js'
import { QUADS } from '../../data/quads.js'
import { FILTROS_RAPIDOS, ZONAS, filtrar, quadsDe } from '../../data/quads.js'

const normalizar = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

/** Barra superior del buscador: atrás + campo + filtros. */
function BarraBusqueda({ valor, onChange, onTap, autoFocus, onEnter, ir, nFiltros, modo }) {
  const input = useRef(null)
  useEffect(() => {
    if (autoFocus) input.current?.focus({ preventScroll: true })
  }, [autoFocus])
  return (
    <div className="search-bar">
      <BotonIcono icon="nav-arrow-left" size={40} label="Atrás" className="icon-btn--plain" onClick={() => window.history.back()} />
      <label className="search-field search-field--active" onClick={onTap}>
        <Icon name="search" size={20} />
        <input
          ref={input}
          type="search"
          enterKeyHint="search"
          placeholder="Busca por colonia o calle"
          value={valor}
          readOnly={!onChange}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onEnter?.()}
        />
      </label>
      <BotonFiltros n={nFiltros} ir={ir} modo={modo} />
    </div>
  )
}

/** Nombre de la zona con la parte buscada resaltada en azul. */
function Resaltado({ texto, busqueda }) {
  const i = normalizar(texto).indexOf(normalizar(busqueda))
  if (!busqueda || i < 0) return texto
  return (
    <>
      {texto.slice(0, i)}
      <mark>{texto.slice(i, i + busqueda.length)}</mark>
      {texto.slice(i + busqueda.length)}
    </>
  )
}

/** 10 · Búsqueda — sugerencias de zonas mientras escribes. */
export function Buscar({ consulta, setConsulta, ir, nFiltros, modo }) {
  const zonas = ZONAS.filter((z) => normalizar(z.nombre).includes(normalizar(consulta)))
  const abrir = (z) => {
    setConsulta(z.nombre)
    // Si la búsqueda empezó en el mapa, los resultados se ven en el mapa
    if (modo === 'mapa') ir('mapa', z.id, { replace: true })
    else ir('resultados', z.id)
  }

  return (
    <div className="home-screen">
      <BarraBusqueda valor={consulta} onChange={setConsulta} autoFocus onEnter={() => zonas[0] && abrir(zonas[0])} ir={ir} nFiltros={nFiltros} modo={modo} />
      <div className="home-scroll home-scroll--flat">
        <motion.div className="zones" variants={stagger} initial="hidden" animate="show">
          <motion.p className="zones__label" variants={fadeUp}>
            Zonas
          </motion.p>
          <AnimatePresence initial={false} mode="popLayout">
            {zonas.map((z) => (
              <motion.button
                key={z.id}
                type="button"
                className="zone-row"
                layout
                variants={fadeUp}
                exit={{ opacity: 0 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => abrir(z)}
              >
                <span className="zone-row__icon">
                  <Icon name="map-pin" size={18} />
                </span>
                <span className="option__texts">
                  <span className="zone-row__name">
                    <Resaltado texto={z.nombre} busqueda={consulta} />
                  </span>
                  <span className="option__desc">
                    {z.detalle} · {z.total} quads
                  </span>
                </span>
                <Icon name="nav-arrow-right" size={16} className="zone-row__chevron" />
              </motion.button>
            ))}
          </AnimatePresence>
          {zonas.length === 0 && <p className="home-empty">No encontramos esa zona.</p>}
          <hr className="home-divider" />
        </motion.div>
      </div>
      {modo !== 'mapa' && (
        <div className="floating-map">
          <BotonMapa onClick={() => ir('mapa')} />
        </div>
      )}
    </div>
  )
}

/** 10 · Búsqueda · Resultados — quads de una zona (o de "Ver todo"). */
export function Resultados({ id, consulta, guardados, alternarGuardado, ir, filtros, nFiltros }) {
  const [filtro, setFiltro] = useState('todos')
  const conFiltros = id === 'filtros'
  const avanzados = conFiltros ? aplicarFiltros(QUADS, filtros) : null
  const { titulo, sub, lista, zona } = conFiltros
    ? { titulo: 'Quads con tus filtros', sub: `${avanzados.length} ${avanzados.length === 1 ? 'resultado' : 'resultados'} · ${nFiltros} ${nFiltros === 1 ? 'filtro activo' : 'filtros activos'}`, lista: avanzados }
    : quadsDe(id)
  const visibles = filtrar(lista, filtro)

  return (
    <div className="home-screen">
      <BarraBusqueda valor={zona ? consulta || zona.nombre : titulo} onTap={() => ir('buscar')} ir={ir} nFiltros={nFiltros} />
      <hr className="home-divider home-divider--top" />
      <motion.div className="home-scroll home-scroll--flat" variants={stagger} initial="hidden" animate="show">
        <div className="results-head">
          <motion.div className="results-title" variants={fadeUp}>
            <h1>{titulo}</h1>
            <p>{sub}</p>
          </motion.div>
          <motion.div variants={fadeUp}>
            <Filtros opciones={FILTROS_RAPIDOS} valor={filtro} onChange={setFiltro} className="filters--bleed" />
          </motion.div>
        </div>
        <div className="row-list row-list--results">
          <AnimatePresence initial={false} mode="popLayout">
            {visibles.map((q) => (
              <QuadFila
                key={q.id}
                quad={q}
                guardado={guardados.includes(q.id)}
                onToggle={() => alternarGuardado(q.id)}
                onOpen={() => ir('quad', q.id)}
                layout
                variants={fadeUp}
                exit={{ opacity: 0 }}
              />
            ))}
          </AnimatePresence>
          {visibles.length === 0 && <p className="home-empty">No hay quads con ese filtro.</p>}
        </div>
      </motion.div>
      <div className="home__fade" />
      <div className="floating-map">
        <BotonMapa onClick={() => ir('mapa', id, { replace: true })} />
      </div>
    </div>
  )
}
