import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Step from './Step.jsx'
import Heading from './Heading.jsx'
import Button from '../../components/Button.jsx'
import SelectCard from '../../components/SelectCard.jsx'
import Chip from '../../components/Chip.jsx'
import Icon from '../../components/Icon.jsx'
import { fadeUp } from '../../components/motion.js'
import { ENTRADAS, TRANSPORTES } from '../../data/estudiante.js'
import { UCA } from '../../data/geo.js'

const TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'

/** Mapa para fijar un punto: el pin queda fijo al centro y se mueve el mapa. */
function MapaPunto({ punto, onCambio }) {
  const lienzo = useRef(null)
  useEffect(() => {
    const m = L.map(lienzo.current, {
      center: punto || UCA.pos,
      zoom: 16,
      zoomControl: false,
      attributionControl: false,
      tapTolerance: 20,
    })
    L.tileLayer(TILES, { maxZoom: 19, detectRetina: true, className: 'tiles-gris' }).addTo(m)
    m.on('moveend', () => {
      const c = m.getCenter()
      onCambio([Number(c.lat.toFixed(5)), Number(c.lng.toFixed(5))])
    })
    // El contenedor crece con animación: recalcula el tamaño al terminar
    const t = setTimeout(() => m.invalidateSize(), 420)
    return () => {
      clearTimeout(t)
      m.remove()
    }
    // El mapa se crea una sola vez; el punto inicial solo se usa al montar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="pick-map">
      <div ref={lienzo} className="pick-map__canvas" />
      <Icon name="map-pin-fill" size={36} className="pick-map__pin" />
      <span className="pick-map__hint">Mueve el mapa para fijar tu punto</span>
    </div>
  )
}

/** E08 / E08b · ¿Desde dónde medimos distancias? — entrada del campus, punto en el mapa y cómo te mueves. */
export default function Referencia({ datos, actualizar, alternar, siguiente }) {
  const enMapa = datos.entrada === 'mapa'
  return (
    <Step className={enMapa ? 'step--long' : ''} actions={<Button onClick={siguiente}>Continuar</Button>}>
      <Heading title="¿Desde dónde medimos distancias?">Elige la entrada de tu campus que más usas.</Heading>

      <div className="heading" role="radiogroup" aria-label="Entrada" style={{ gap: 10 }}>
        {ENTRADAS.map((e) => (
          <SelectCard
            key={e.id}
            title={e.titulo}
            description={e.desc}
            icon={e.icon}
            iconSelected={e.iconSel}
            selected={datos.entrada === e.id}
            onSelect={() => actualizar({ entrada: e.id })}
          />
        ))}
      </div>

      <AnimatePresence initial={false}>
        {enMapa && (
          <motion.div
            key="mapa"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <MapaPunto punto={datos.puntoMapa} onCambio={(p) => actualizar({ puntoMapa: p })} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="section" variants={fadeUp} layout="position">
        <p className="section-label">¿Cómo te mueves?</p>
        <div className="chips">
          {TRANSPORTES.map((t) => (
            <Chip
              key={t.id}
              label={t.label}
              icon={t.icon}
              iconSelected={t.iconSel}
              selected={datos.transporte.includes(t.id)}
              onToggle={() => alternar('transporte', t.id)}
            />
          ))}
        </div>
      </motion.div>
    </Step>
  )
}
