import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import StatusBar from '../../components/StatusBar.jsx'
import Icon from '../../components/Icon.jsx'
import { BotonFiltros, BotonIcono, BotonMapa, Filtros, QuadFila } from './ui.jsx'
import { FILTROS_MAPA, MI_UBICACION, PINES, filtrar, quad } from '../../data/quads.js'
import mapa from '../../assets/mapa/mapa-uca.jpg'

/* Coordenadas del marco de Figma (390 × 844) → porcentaje del mapa */
const px = (x) => `${(x / 390) * 100}%`
const py = (y) => `${(y / 844) * 100}%`

/** 11 · Mapa — pines de precio, vista previa del quad y carrusel inferior. */
export default function Mapa({ guardados, alternarGuardado, ir, nFiltros }) {
  const [filtro, setFiltro] = useState('todos')
  const [seleccion, setSeleccion] = useState('familia')
  const [vista, setVista] = useState(true)
  const carrusel = useRef(null)

  const visibles = PINES.filter((p) => filtrar([quad(p.quad)], filtro === 'precio' ? 'todos' : filtro).length)
  const lista = filtrar(visibles.map((p) => quad(p.quad)), filtro)
  const pin = visibles.find((p) => p.quad === seleccion)
  const q = pin && quad(pin.quad)
  const abajo = pin && pin.y < 330 // si el pin está muy arriba, la tarjeta va debajo

  // Al elegir un pin, el carrusel inferior se desplaza hasta ese quad
  useEffect(() => {
    const el = carrusel.current?.querySelector(`[data-quad="${seleccion}"]`)
    el?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
  }, [seleccion, filtro])

  const elegir = (id) => {
    setSeleccion(id)
    setVista(true)
  }

  return (
    <div className="home-screen map-screen">
      <div className="map-canvas" onClick={() => setVista(false)}>
        <img src={mapa} alt="" className="map-canvas__img" draggable="false" />

        {/* Mi ubicación */}
        <motion.span
          className="me-halo"
          style={{ left: px(MI_UBICACION.x), top: py(MI_UBICACION.y) }}
          animate={{ scale: [1, 1.15, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="me-dot" style={{ left: px(MI_UBICACION.x), top: py(MI_UBICACION.y) }} />

        {/* Pines de precio */}
        {visibles.map((p, i) => {
          const activo = p.quad === seleccion && vista
          return (
            <motion.button
              key={p.quad}
              type="button"
              className={`price-pin ${activo ? 'price-pin--on' : ''}`}
              style={{ left: px(p.x), top: py(p.y) }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 420, damping: 22, delay: 0.15 + i * 0.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={(e) => {
                e.stopPropagation()
                elegir(p.quad)
              }}
            >
              ${quad(p.quad).precio}
            </motion.button>
          )
        })}

        {/* Vista previa del quad seleccionado */}
        <AnimatePresence>
          {vista && q && (
            <motion.div
              key={q.id}
              className="map-preview"
              style={{
                left: `clamp(16px, calc(${px(pin.x)} - 150px), calc(100% - 316px))`,
                top: abajo ? `calc(${py(pin.y)} + 32px)` : `calc(${py(pin.y)} - 189px)`,
              }}
              initial={{ opacity: 0, y: abajo ? -8 : 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="map-preview__quad">
                <img src={q.foto} alt="" />
                <div className="map-preview__info">
                  <h3>{q.titulo}</h3>
                  <span className="meta-row">
                    <Icon name="star-fill" size={14} className="star" />
                    <span className="map-preview__rating">{q.rating.toFixed(1)}</span>
                    <span>· {q.zona}</span>
                  </span>
                  <span className="meta-row">
                    <Icon name="walking-fill" size={14} />
                    <span>{q.trayecto.texto}</span>
                  </span>
                  <p className="price">
                    ${q.precio}
                    <small>/mes</small>
                  </p>
                </div>
              </div>
              <div className="map-preview__actions">
                <motion.button type="button" className="small-btn" whileTap={{ scale: 0.97 }} onClick={() => alternarGuardado(q.id)}>
                  {guardados.includes(q.id) ? 'Guardado' : 'Guardar'}
                </motion.button>
                <motion.button type="button" className="small-btn small-btn--primary" whileTap={{ scale: 0.97 }} onClick={() => ir('quad', q.id)}>
                  Ver quad
                </motion.button>
              </div>
              <svg className={`map-preview__tail ${abajo ? 'map-preview__tail--up' : ''}`} width="22" height="11" viewBox="0 0 22 11" aria-hidden="true" style={{ left: `calc(${px(pin.x)} - 11px - clamp(16px, calc(${px(pin.x)} - 150px), calc(100% - 316px)))` }}>
                <path d="M0 0h22L13 9.5a3 3 0 0 1-4 0Z" fill="#fff" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controles superiores */}
      <div className="map-top">
        <StatusBar />
        <div className="safe-top" />
        <div className="map-controls">
          <BotonIcono icon="nav-arrow-left" label="Atrás" className="icon-btn--shadow" onClick={() => window.history.back()} />
          <motion.button type="button" className="zone-select" whileTap={{ scale: 0.98 }} onClick={() => ir('buscar')}>
            <Icon name="map-pin-fill" size={18} />
            <span>Cerca de la UCA</span>
            <Icon name="nav-arrow-down" size={16} />
          </motion.button>
          <BotonIcono icon="map-pin" label="Mi ubicación" className="icon-btn--shadow" />
          <BotonFiltros n={nFiltros} ir={ir} className="icon-btn--shadow" />
        </div>
        <Filtros opciones={FILTROS_MAPA} valor={filtro} onChange={setFiltro} sombra className="filters--bleed map-filters" />
      </div>

      {/* Parte inferior: Ver lista + carrusel */}
      <div className="map-bottom">
        <div className="map-bottom__fade" />
        <BotonMapa lista onClick={() => window.history.back()} className="map-bottom__btn" />
        <div className="map-carousel" ref={carrusel}>
          {lista.map((item) => (
            <div key={item.id} data-quad={item.id} className="map-carousel__item">
              <QuadFila
                quad={item}
                guardado={guardados.includes(item.id)}
                onToggle={() => alternarGuardado(item.id)}
                onOpen={() => elegir(item.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
