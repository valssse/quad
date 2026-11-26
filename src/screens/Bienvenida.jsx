import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import StatusBar from '../components/StatusBar.jsx'
import Button from '../components/Button.jsx'
import Icon from '../components/Icon.jsx'
import Iniciales from '../components/Iniciales.jsx'
import BackButton from '../components/BackButton.jsx'
import logoQuad from '../assets/icons/logo-blue.svg'
import bienvenidas from '../data/bienvenidas.js'
import './Bienvenida.css'

/**
 * 01d · 01e · 01f — Bienvenida (Rediseño B).
 * Ilustraciones animadas con motion: entradas suaves, resortes en círculos y chips,
 * flotación continua y, en la 3, columnas de fotos en bucle vertical infinito (solo imágenes).
 * Respeta prefers-reduced-motion por el MotionConfig de App.
 */
const SALIDA = [0.22, 1, 0.36, 1]
const RESORTE = { type: 'spring', stiffness: 140, damping: 20 }

/** Transición entre bienvenidas: fundido con desplazamiento horizontal corto. */
const slide = {
  enter: (dir) => ({ opacity: 0, x: dir >= 0 ? 28 : -28 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.4, ease: SALIDA } },
  exit: (dir) => ({ opacity: 0, x: dir >= 0 ? -28 : 28, transition: { duration: 0.28, ease: SALIDA } }),
}

/** Flotación sutil y continua (±px), con desfase para que no se vea mecánica. */
const flotar = (i, amp = 6) => ({
  y: [0, i % 2 ? amp : -amp],
  transition: { duration: 4 + (i % 3), ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse', delay: 0.9 + i * 0.15 },
})

function Chip({ icon, x, y, i }) {
  return (
    <motion.span
      className="wb-chip"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ...RESORTE, delay: 0.55 + i * 0.1 }}
    >
      <motion.span animate={flotar(i + 2, 4)} style={{ display: 'grid' }}>
        <Icon name={icon} size={18} />
      </motion.span>
    </motion.span>
  )
}

/* ---------- 01d · Bienvenida 1 ---------- */
function Ilustracion1({ b }) {
  return (
    <>
      <motion.span className="wb-orbit wb-orbit--out" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 0.7, scale: 1 }} transition={{ duration: 0.8, ease: SALIDA }} />
      <motion.span className="wb-orbit wb-orbit--in" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: SALIDA, delay: 0.08 }} />
      {b.fotos.map((f, i) => (
        <motion.span
          key={i}
          className="wb-photo"
          style={{ left: f.x, top: f.y, width: f.d, height: f.d }}
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ ...RESORTE, delay: 0.2 + i * 0.08 }}
        >
          <motion.img src={f.src} alt="" draggable="false" animate={flotar(i)} />
        </motion.span>
      ))}
      <motion.span
        className="wb-pill"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: SALIDA, delay: 0.05 }}
      >
        <img className="wb-pill__logo" src={logoQuad} alt="" draggable="false" />
        Quad cerca de la U
      </motion.span>
      {b.chips.map((c, i) => (
        <Chip key={c.icon} {...c} i={i} />
      ))}
    </>
  )
}

/** Checkbox que se rellena y dibuja el check, en bucle suave. */
function CheckAnimado({ delay }) {
  const ciclo = { duration: 4.2, times: [0, 0.14, 0.7, 0.85, 1], ease: 'easeInOut', repeat: Infinity, delay }
  return (
    <svg className="wb-card__box" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <motion.rect x="1" y="1" width="18" height="18" rx="5.5" strokeWidth="1.5" stroke="var(--brand-primary)" initial={{ fill: 'rgba(38,103,255,0)' }} animate={{ fill: ['rgba(38,103,255,0)', 'rgba(38,103,255,1)', 'rgba(38,103,255,1)', 'rgba(38,103,255,0)', 'rgba(38,103,255,0)'] }} transition={ciclo} />
      <motion.path d="M5.5 10.4 8.6 13.4 14.5 7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 1, 0, 0] }} transition={{ ...ciclo, times: [0.04, 0.2, 0.7, 0.85, 1] }} />
    </svg>
  )
}

/* ---------- 01e · Bienvenida 2 ---------- */
function Ilustracion2({ b }) {
  // Las tarjetas aparecen una tras otra; luego los avatares en cascada
  const PASO = 0.35
  const inicioAvatares = 0.25 + b.tarjetas.length * PASO + 0.2
  return (
    <>
      <motion.span className="wb-phone" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: SALIDA }}>
        <span>9:41</span>
      </motion.span>
      {b.tarjetas.map((t, i) => (
        <motion.div
          key={t.id}
          className={`wb-card ${t.check ? 'wb-card--check' : ''}`}
          style={{ left: t.x, top: t.y, width: t.w }}
          initial={{ opacity: 0, y: 24, scale: 0.96, rotate: 0 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotate: t.rot }}
          transition={{ duration: 0.6, ease: SALIDA, delay: 0.25 + i * PASO }}
        >
          {t.check ? (
            <>
              <CheckAnimado delay={0.25 + i * PASO + 0.7} />
              <b>{t.titulo}</b>
            </>
          ) : (
            <>
              <span className="wb-card__bar" style={{ background: t.barra }} />
              {t.foto ? <img src={t.foto} alt="" draggable="false" /> : <Iniciales nombre={t.nombre} tono={t.tono} className="wb-card__ini" />}
              <span className="wb-card__text">
                <b>{t.titulo}</b>
                <small>{t.texto}</small>
              </span>
            </>
          )}
        </motion.div>
      ))}
      <span className="wb-fade" />
      {b.personas.map((p, i) => (
        <motion.span
          key={i}
          className="wb-photo wb-photo--person"
          style={{ left: p.x, top: p.y, width: p.d, height: p.d }}
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ ...RESORTE, delay: inicioAvatares + i * 0.08 }}
        >
          <motion.span className="wb-photo__ini" animate={flotar(i, 4)}>
            <Iniciales nombre={p.nombre} tono={p.tono} style={{ color: p.color, fontSize: Math.round(p.d * 0.36) }} />
          </motion.span>
        </motion.span>
      ))}
    </>
  )
}

/* ---------- 01f · Bienvenida 3 ---------- */
function Columna({ c, i }) {
  // Se duplica la lista y se desplaza media pista: el bucle no tiene cortes
  const pista = [...c.fotos, ...c.fotos]
  const y = c.dir === 'abajo' ? ['-50%', '0%'] : ['0%', '-50%']
  return (
    <motion.div
      className="wb-col"
      style={{ left: c.x }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: SALIDA, delay: 0.1 + i * 0.12 }}
    >
      <motion.div className="wb-col__track" style={{ top: c.y - 180 }} animate={{ y }} transition={{ duration: c.dur, ease: 'linear', repeat: Infinity }}>
        {pista.map((f, k) => (
          <img key={k} src={f.src} alt="" draggable="false" style={{ height: f.h }} />
        ))}
      </motion.div>
    </motion.div>
  )
}

function Ilustracion3({ b }) {
  return (
    <>
      {b.columnas.map((c, i) => (
        <Columna key={i} c={c} i={i} />
      ))}
      <span className="wb-fade wb-fade--top" />
      <span className="wb-fade wb-fade--bottom" />
    </>
  )
}

const ILUSTRACIONES = [Ilustracion1, Ilustracion2, Ilustracion3]

/**
 * retraso (ms): al abrir la app, la ilustración y el texto esperan a que la máscara
 * del splash empiece a abrirse, así su animación de entrada se ve completa.
 */
export default function Bienvenida({ index, direction, onChange, onSkip, onFinish, retraso = 0 }) {
  const [visible, setVisible] = useState(retraso === 0)
  useEffect(() => {
    if (visible) return
    const t = setTimeout(() => setVisible(true), retraso)
    return () => clearTimeout(t)
  }, [visible, retraso])

  const b = bienvenidas[index]
  const isLast = index === bienvenidas.length - 1
  const next = () => (isLast ? onFinish() : onChange(index + 1))
  const prev = () => index > 0 && onChange(index - 1)
  const Ilustracion = ILUSTRACIONES[index]

  const alSoltar = (_, info) => {
    if (info.offset.x < -60 || info.velocity.x < -400) next()
    else if (info.offset.x > 60 || info.velocity.x > 400) prev()
  }

  return (
    <motion.div className="screen wb" animate={{ backgroundColor: index === 0 ? '#ffffff' : '#f5f7fb' }} transition={{ duration: 0.4, ease: SALIDA }}>
      {/* Degradado tenue arriba solo en la primera */}
      <motion.span className="wb-glow" aria-hidden="true" animate={{ opacity: index === 0 ? 1 : 0 }} transition={{ duration: 0.5, ease: SALIDA }} />

      <StatusBar />
      <div className="safe-top" />

      <header className="wb-top">
        <AnimatePresence initial={false}>
          {index > 0 && (
            <motion.span key="back" initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 40 }} exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.3, ease: SALIDA }}>
              <BackButton onClick={prev} />
            </motion.span>
          )}
        </AnimatePresence>
        <div className="wb-steps" role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={index + 1} aria-label={`Bienvenida ${index + 1} de 3`}>
          {bienvenidas.map((_, i) => (
            <span key={i} className={`wb-step ${index === 0 ? 'wb-step--light' : ''}`}>
              <motion.span className="wb-step__fill" initial={false} animate={{ scaleX: i <= index ? 1 : 0 }} transition={{ duration: 0.5, ease: SALIDA }} />
            </span>
          ))}
        </div>
        <AnimatePresence initial={false}>
          {index === 1 && (
            <motion.button key="skip" type="button" className="wb-skip" onClick={onSkip} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              Omitir
            </motion.button>
          )}
        </AnimatePresence>
      </header>

      <main className="wb-stage">
        <AnimatePresence mode="popLayout" custom={direction}>
          {visible && (
            <motion.div
              key={index}
              className="wb-slide"
              custom={direction}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={alSoltar}
            >
              <div className={`wb-art wb-art--${index + 1}`} aria-hidden="true">
                <Ilustracion b={b} />
              </div>
              <div className="wb-text">
                <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: SALIDA, delay: 0.15 }}>
                  {b.title}
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: SALIDA, delay: 0.24 }}>
                  {b.text}
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="actionbar wb-actions">
        <Button onClick={next}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={b.cta} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }}>
              {b.cta}
            </motion.span>
          </AnimatePresence>
        </Button>
      </footer>
    </motion.div>
  )
}
