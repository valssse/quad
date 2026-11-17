import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import StatusBar from '../../components/StatusBar.jsx'
import Icon from '../../components/Icon.jsx'
import { BotonFiltros, BotonIcono, BotonMapa, Filtros, QuadFila } from './ui.jsx'
import { FILTROS_MAPA, QUADS, ZONAS, filtrar, quadsDe } from '../../data/quads.js'
import { aplicarFiltros } from '../../data/filtros.js'
import { CENTRO_INICIAL, UCA, ZONAS_POS, ZOOM_INICIAL } from '../../data/geo.js'
import logoUca from '../../assets/universidades/uca.png'

const TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const ATRIBUCION = '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>'
// Margen para que los pines no queden debajo de los controles ni del carrusel
const MARGEN = { arriba: 170, abajo: 250, lados: 40 }

const iconoPrecio = (q, activo) =>
  L.divIcon({
    className: 'qpin',
    html: `<span class="price-pin ${activo ? 'price-pin--on' : ''}">$${q.precio}</span>`,
    iconSize: [0, 0],
  })

const iconoUca = L.divIcon({
  className: 'qpin',
  html: '<span class="uca-pin"><img src="' + logoUca + '" alt="" />UCA</span>',
  iconSize: [0, 0],
})

const iconoYo = L.divIcon({ className: 'qpin', html: '<span class="me-halo"></span><span class="me-dot"></span>', iconSize: [0, 0] })

/** Texto del selector de zona según de dónde viene el mapa. */
function etiqueta(sub) {
  if (sub === 'filtros') return 'Con tus filtros'
  const z = ZONAS.find((x) => x.id === sub)
  return z ? z.nombre : 'Cerca de la UCA'
}

/**
 * 11 · Mapa — mapa real de OpenStreetMap (Leaflet): se mueve con el dedo y
 * se acerca/aleja pellizcando. Pines de precio, vista previa y carrusel.
 * `sub`: zona buscada desde el mapa, o "filtros" si se aplicaron filtros aquí.
 */
export default function Mapa({ guardados, alternarGuardado, ir, nFiltros, filtros, sub }) {
  const [filtro, setFiltro] = useState('todos')
  const base = sub === 'filtros' ? aplicarFiltros(QUADS, filtros) : sub ? quadsDe(sub).lista : QUADS
  const lista = filtrar(base, filtro)
  const ids = lista.map((q) => q.id).join(',')

  const [seleccion, setSeleccion] = useState(lista[0]?.id)
  // Al abrir el mapa general se ve todo (la UCA y los pines); la tarjeta sale al tocar un pin
  const [vista, setVista] = useState(!!sub)
  const [punto, setPunto] = useState(null)
  const [tam, setTam] = useState({ w: 390, h: 844 })
  const [animando, setAnimando] = useState(false)

  const lienzo = useRef(null)
  const mapa = useRef(null)
  const pines = useRef({})
  const yo = useRef(null)
  const carrusel = useRef(null)
  const sel = useRef(seleccion)
  sel.current = seleccion

  const q = lista.find((x) => x.id === seleccion)

  // Posición en pantalla del pin elegido (para la tarjeta de vista previa)
  const medir = () => {
    const m = mapa.current
    const elegido = QUADS.find((x) => x.id === sel.current)
    if (!m || !elegido) return
    const p = m.latLngToContainerPoint(elegido.pos)
    const s = m.getSize()
    setPunto({ x: p.x, y: p.y })
    setTam({ w: s.x, h: s.y })
  }

  /* ---------- Crear el mapa una sola vez ---------- */
  useEffect(() => {
    const m = L.map(lienzo.current, {
      center: CENTRO_INICIAL,
      zoom: ZOOM_INICIAL,
      minZoom: 12,
      maxZoom: 19,
      zoomControl: false,
      zoomSnap: 0.25,
      tapTolerance: 20,
      bounceAtZoomLimits: false,
    })
    m.attributionControl.setPrefix(false)
    // Calles en escala de grises (solo la capa del mapa; los pines siguen en color)
    L.tileLayer(TILES, { maxZoom: 19, attribution: ATRIBUCION, detectRetina: true, className: 'tiles-gris' }).addTo(m)
    L.marker(UCA.pos, { icon: iconoUca, keyboard: false, zIndexOffset: -10 })
      .addTo(m)
      .on('click', () => m.flyTo(UCA.pos, 17, { duration: 0.6 }))

    m.on('move zoom resize', medir)
    m.on('zoomanim', () => setAnimando(true))
    m.on('zoomend moveend', () => {
      setAnimando(false)
      medir()
    })
    m.on('click', () => setVista(false))
    mapa.current = m

    // La pantalla entra deslizándose: recalcular el tamaño al terminar
    const t = setTimeout(() => {
      m.invalidateSize()
      medir()
    }, 420)
    return () => {
      clearTimeout(t)
      m.remove()
      mapa.current = null
      yo.current = null
      pines.current = {}
    }
  }, [])

  /* ---------- Encuadre: zona buscada o resultados de filtros ---------- */
  useEffect(() => {
    const m = mapa.current
    if (!m || !sub) return
    const puntos = base.map((x) => x.pos)
    if (puntos.length > 1) {
      m.fitBounds(L.latLngBounds(puntos), {
        paddingTopLeft: [MARGEN.lados, MARGEN.arriba],
        paddingBottomRight: [MARGEN.lados, MARGEN.abajo],
        maxZoom: 16.5,
        animate: false,
      })
    } else if (puntos.length === 1) m.setView(puntos[0], 16.5, { animate: false })
    else if (ZONAS_POS[sub]) m.setView(ZONAS_POS[sub], 16, { animate: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sub])

  /* ---------- Pines de precio ---------- */
  useEffect(() => {
    const m = mapa.current
    if (!m) return
    const actuales = pines.current
    Object.keys(actuales).forEach((id) => {
      if (!lista.some((x) => x.id === id)) {
        actuales[id].remove()
        delete actuales[id]
      }
    })
    lista.forEach((x) => {
      const activo = x.id === seleccion && vista
      if (!actuales[x.id]) {
        actuales[x.id] = L.marker(x.pos, { icon: iconoPrecio(x, activo), riseOnHover: true })
          .addTo(m)
          .on('click', (e) => {
            L.DomEvent.stopPropagation(e)
            elegir(x.id)
          })
      } else actuales[x.id].setIcon(iconoPrecio(x, activo))
      actuales[x.id].setZIndexOffset(activo ? 1000 : 0)
    })
    if (!lista.some((x) => x.id === seleccion) && lista[0]) setSeleccion(lista[0].id)
    medir()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids, seleccion, vista])

  // Al elegir un pin, el carrusel inferior se desplaza hasta ese quad
  useEffect(() => {
    const el = carrusel.current?.querySelector(`[data-quad="${seleccion}"]`)
    el?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
  }, [seleccion, filtro])

  useLayoutEffect(medir, [seleccion])

  /** Elegir un quad: si su pin queda tapado, el mapa se mueve un poco. */
  const elegir = (id) => {
    setSeleccion(id)
    setVista(true)
    const m = mapa.current
    const x = QUADS.find((k) => k.id === id)
    if (!m || !x) return
    const p = m.latLngToContainerPoint(x.pos)
    const s = m.getSize()
    const fuera = p.x < 60 || p.x > s.x - 60 || p.y < MARGEN.arriba + 40 || p.y > s.y - MARGEN.abajo
    if (fuera) m.panTo(x.pos, { animate: true, duration: 0.45 })
  }

  /** "Mi ubicación": usa el GPS si lo permites; si no, vuelve a la UCA. */
  const miUbicacion = () => {
    const m = mapa.current
    const volar = (pos) => {
      // El punto azul de "tú estás aquí" aparece solo al usar este botón
      if (!yo.current && m) yo.current = L.marker(pos, { icon: iconoYo, interactive: false, keyboard: false, zIndexOffset: -20 }).addTo(m)
      yo.current?.setLatLng(pos)
      m?.flyTo(pos, 16.5, { duration: 0.7 })
    }
    if (!navigator.geolocation) return volar(UCA.pos)
    navigator.geolocation.getCurrentPosition(
      (g) => volar([g.coords.latitude, g.coords.longitude]),
      () => volar(UCA.pos),
      { enableHighAccuracy: true, timeout: 6000 },
    )
  }

  /* Tarjeta de vista previa encima (o debajo) del pin */
  const abajo = punto && punto.y < 365
  const izq = punto ? Math.min(Math.max(punto.x - 150, 16), tam.w - 316) : 0
  const visible = vista && q && punto && !animando && punto.x > 0 && punto.x < tam.w && punto.y > 60 && punto.y < tam.h - 120

  return (
    <div className="home-screen map-screen">
      <div className="map-canvas" ref={lienzo} />

      <AnimatePresence>
        {visible && (
          <motion.div
            key={q.id}
            className="map-preview"
            style={{ left: izq, top: abajo ? punto.y + 32 : punto.y - 189 }}
            initial={{ opacity: 0, y: abajo ? -8 : 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.12 } }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
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
                  <Icon name={q.trayecto.modo === 'walking' ? 'walking-fill' : q.trayecto.modo === 'bus' ? 'bus-fill' : 'car-fill'} size={14} />
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
            <svg className={`map-preview__tail ${abajo ? 'map-preview__tail--up' : ''}`} width="22" height="11" viewBox="0 0 22 11" aria-hidden="true" style={{ left: punto.x - 11 - izq }}>
              <path d="M0 0h22L13 9.5a3 3 0 0 1-4 0Z" fill="#fff" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controles superiores */}
      <div className="map-top">
        <StatusBar />
        <div className="safe-top" />
        <div className="map-controls">
          <BotonIcono icon="nav-arrow-left" label="Atrás" className="icon-btn--shadow" onClick={() => window.history.back()} />
          <motion.button type="button" className="zone-select" whileTap={{ scale: 0.98 }} onClick={() => ir('buscar', 'mapa')}>
            <Icon name="map-pin-fill" size={18} />
            <span>{etiqueta(sub)}</span>
            <Icon name="nav-arrow-down" size={16} />
          </motion.button>
          <BotonIcono icon="map-pin" label="Mi ubicación" className="icon-btn--shadow" onClick={miUbicacion} />
          <BotonFiltros n={nFiltros} ir={ir} modo="mapa" className="icon-btn--shadow" />
        </div>
        <Filtros opciones={FILTROS_MAPA} valor={filtro} onChange={setFiltro} sombra className="filters--bleed map-filters" />
      </div>

      {/* Parte inferior: Ver lista + carrusel */}
      <div className="map-bottom">
        <div className="map-bottom__fade" />
        <BotonMapa lista onClick={() => (sub ? ir('resultados', sub, { replace: true }) : window.history.back())} className="map-bottom__btn" />
        <div className="map-carousel" ref={carrusel}>
          {lista.map((item) => (
            <div key={item.id} data-quad={item.id} className="map-carousel__item">
              <QuadFila
                quad={item}
                guardado={guardados.includes(item.id)}
                onToggle={() => alternarGuardado(item.id)}
                onOpen={() => {
                  elegir(item.id)
                  mapa.current?.panTo(item.pos, { animate: true, duration: 0.45 })
                }}
              />
            </div>
          ))}
          {lista.length === 0 && <p className="home-empty map-empty">No hay quads con ese filtro en esta zona.</p>}
        </div>
      </div>
    </div>
  )
}
