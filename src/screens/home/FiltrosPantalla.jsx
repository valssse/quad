import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Icon from '../../components/Icon.jsx'
import Switch from '../../components/Switch.jsx'
import { fadeUp, stagger } from '../../components/motion.js'
import { QUADS } from '../../data/quads.js'
import {
  CALIFICACIONES,
  FILTROS_VACIOS,
  PRECIO_MAX,
  PRECIO_MIN,
  SERVICIOS,
  TIEMPOS,
  TRANSPORTES,
  ZONAS_FILTRO,
  aplicarFiltros,
} from '../../data/filtros.js'

const alternar = (lista, id) => (lista.includes(id) ? lista.filter((x) => x !== id) : [...lista, id])

/** Histograma de precios + slider de dos puntos. */
function RangoPrecio({ valor, onChange }) {
  const [min, max] = valor
  const paso = 5
  const barras = []
  for (let p = PRECIO_MIN; p < PRECIO_MAX; p += paso) barras.push({ p, n: QUADS.filter((q) => q.precio >= p && q.precio < p + paso).length })
  const alto = Math.max(...barras.map((b) => b.n), 1)
  const pct = (v) => ((v - PRECIO_MIN) / (PRECIO_MAX - PRECIO_MIN)) * 100

  return (
    <div className="fl-price">
      <div className="fl-histo" aria-hidden="true">
        {barras.map((b) => (
          <motion.span
            key={b.p}
            className={`fl-histo__bar ${b.p >= min && b.p < max ? 'fl-histo__bar--on' : ''}`}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.5, delay: 0.1 + (b.p - PRECIO_MIN) / 400, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: `${18 + (b.n / alto) * 42}px` }}
          />
        ))}
      </div>
      <div className="fl-range">
        <span className="fl-range__track" />
        <span className="fl-range__fill" style={{ left: `${pct(min)}%`, right: `${100 - pct(max)}%` }} />
        <input
          type="range"
          min={PRECIO_MIN}
          max={PRECIO_MAX}
          step={paso}
          value={min}
          aria-label="Precio mínimo"
          onChange={(e) => onChange([Math.min(Number(e.target.value), max - paso), max])}
        />
        <input
          type="range"
          min={PRECIO_MIN}
          max={PRECIO_MAX}
          step={paso}
          value={max}
          aria-label="Precio máximo"
          onChange={(e) => onChange([min, Math.max(Number(e.target.value), min + paso)])}
        />
      </div>
      <div className="fl-price__boxes">
        <span className="fl-box">
          <small>Mínimo</small>
          <b>${min}</b>
        </span>
        <span className="fl-price__dash" />
        <span className="fl-box">
          <small>Máximo</small>
          <b>
            ${max}
            {max === PRECIO_MAX ? '+' : ''}
          </b>
        </span>
      </div>
    </div>
  )
}

function Chip({ on, onClick, icon, children }) {
  return (
    <motion.button type="button" className={`filter-chip ${on ? 'filter-chip--on' : ''}`} whileTap={{ scale: 0.95 }} onClick={onClick} aria-pressed={on}>
      {icon && <Icon name={icon} size={16} />}
      {children}
    </motion.button>
  )
}

function Fila({ icon, titulo, desc, valor, onChange }) {
  return (
    <div className="fl-switch">
      <span className="fl-switch__icon">
        <Icon name={icon} size={20} />
      </span>
      <span className="fl-switch__text">
        <b>{titulo}</b>
        <small>{desc}</small>
      </span>
      <Switch checked={valor} onChange={onChange} label={titulo} />
    </div>
  )
}

/** Filtros — pantalla completa con todos los criterios. */
export default function FiltrosPantalla({ filtros, setFiltros, ir, modo }) {
  const [f, setF] = useState(filtros)
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }))
  const total = aplicarFiltros(QUADS, f).length

  return (
    <div className="home-screen fl">
      <div className="fl-header">
        <motion.button type="button" className="dt-round dt-round--border" whileTap={{ scale: 0.9 }} aria-label="Cerrar" onClick={() => window.history.back()}>
          <Icon name="xmark" size={20} />
        </motion.button>
        <h1>Filtros</h1>
        <button type="button" className="dt-link fl-clear" onClick={() => setF(FILTROS_VACIOS)}>
          Limpiar
        </button>
      </div>

      <motion.div className="home-scroll fl-scroll" variants={stagger} initial="hidden" animate="show">
        <motion.section className="fl-section" variants={fadeUp}>
          <div className="fl-title">
            <h2>Precio mensual</h2>
            <p>El promedio cerca de la UCA es $120/mes</p>
          </div>
          <RangoPrecio valor={f.precio} onChange={(v) => set('precio', v)} />
        </motion.section>

        <motion.section className="fl-section" variants={fadeUp}>
          <div className="fl-title">
            <h2>Cómo llegas al campus</h2>
            <p>Puedes elegir más de una opción</p>
          </div>
          <div className="fl-modes">
            {TRANSPORTES.map((t) => {
              const on = f.transporte.includes(t.id)
              return (
                <motion.button
                  key={t.id}
                  type="button"
                  className={`fl-mode ${on ? 'fl-mode--on' : ''}`}
                  whileTap={{ scale: 0.96 }}
                  aria-pressed={on}
                  onClick={() => set('transporte', alternar(f.transporte, t.id))}
                >
                  <Icon name={t.icon} size={22} />
                  {t.label}
                </motion.button>
              )
            })}
          </div>
          <div className="fl-chips">
            {TIEMPOS.map((t) => (
              <Chip key={t.id} on={f.tiempo === t.id} onClick={() => set('tiempo', t.id)} icon={t.id === 'cualquiera' ? undefined : 'clock'}>
                {t.label}
              </Chip>
            ))}
          </div>
        </motion.section>

        <motion.section className="fl-section" variants={fadeUp}>
          <div className="fl-title">
            <h2>Servicios incluidos</h2>
          </div>
          <div className="dt-grid">
            {SERVICIOS.map((s) => {
              const on = f.servicios.includes(s.id)
              return (
                <motion.button
                  key={s.id}
                  type="button"
                  className={`dt-service fl-service ${on ? 'fl-service--on' : ''}`}
                  whileTap={{ scale: 0.97 }}
                  aria-pressed={on}
                  onClick={() => set('servicios', alternar(f.servicios, s.id))}
                >
                  <span className="dt-service__icon">
                    <Icon name={s.icon} size={18} />
                  </span>
                  <span>
                    <span className="dt-service__title">{s.label}</span>
                    <span className="dt-service__sub">{s.sub}</span>
                  </span>
                  <AnimatePresence>
                    {on && (
                      <motion.span className="fl-check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 520, damping: 26 }}>
                        <Icon name="check" size={12} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              )
            })}
          </div>
        </motion.section>

        <motion.section className="fl-section" variants={fadeUp}>
          <div className="fl-title">
            <h2>Reglas y convivencia</h2>
          </div>
          <div className="fl-switches">
            <Fila icon="female" titulo="Solo para mujeres" desc="Casas que solo reciben mujeres" valor={f.soloMujeres} onChange={(v) => set('soloMujeres', v)} />
            <Fila icon="user-plus" titulo="Se permiten visitas" desc="Amigos o compañeros de estudio" valor={f.visitas} onChange={(v) => set('visitas', v)} />
            <Fila icon="paw-fill" titulo="Sin mascotas en casa" desc="Ideal si tienes alergias" valor={f.sinMascotas} onChange={(v) => set('sinMascotas', v)} />
            <Fila icon="calendar" titulo="Solo disponibles" desc="Quads libres para este ciclo" valor={f.disponibles} onChange={(v) => set('disponibles', v)} />
          </div>
        </motion.section>

        <motion.section className="fl-section" variants={fadeUp}>
          <div className="fl-title">
            <h2>Calificación</h2>
          </div>
          <div className="fl-chips">
            {CALIFICACIONES.map((c) => (
              <Chip key={c.id} on={f.rating === c.id} onClick={() => set('rating', c.id)} icon={c.id ? 'star-fill' : undefined}>
                {c.label}
              </Chip>
            ))}
          </div>
        </motion.section>

        <motion.section className="fl-section fl-section--last" variants={fadeUp}>
          <div className="fl-title">
            <h2>Zonas</h2>
          </div>
          <div className="fl-chips">
            {ZONAS_FILTRO.map((z) => (
              <Chip key={z.id} on={f.zonas.includes(z.id)} onClick={() => set('zonas', alternar(f.zonas, z.id))}>
                {z.label}
              </Chip>
            ))}
          </div>
        </motion.section>
      </motion.div>

      <div className="dt-bar dt-bar--single">
        <motion.button
          type="button"
          className="hc-write"
          whileTap={{ scale: 0.97 }}
          disabled={total === 0}
          onClick={() => {
            setFiltros(f)
            // Desde el mapa, los resultados vuelven al mapa
            ir(modo === 'mapa' ? 'mapa' : 'resultados', 'filtros', { replace: true })
          }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={total} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              {total === 0 ? 'Sin quads con estos filtros' : `Ver ${total} ${total === 1 ? 'quad' : 'quads'}`}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  )
}
