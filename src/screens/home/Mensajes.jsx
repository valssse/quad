import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Icon from '../../components/Icon.jsx'
import { fadeUp, stagger } from '../../components/motion.js'
import { Filtros } from './ui.jsx'
import { CONVERSACIONES, FILTROS_MENSAJES } from '../../data/quads.js'

const normalizar = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const iniciales = (n) =>
  n
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')

/** 08 · Mensajes — conversaciones con anfitriones. */
export default function Mensajes() {
  const [filtro, setFiltro] = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  const [leidas, setLeidas] = useState([])

  const conv = CONVERSACIONES.map((c) => ({ ...c, noLeidos: leidas.includes(c.id) ? 0 : c.noLeidos }))
  const sinLeer = conv.filter((c) => c.noLeidos).length
  const lista = conv
    .filter((c) => normalizar(c.nombre + c.quad).includes(normalizar(busqueda)))
    .filter((c) =>
      filtro === 'no-leidos' ? c.noLeidos : filtro === 'visitas' ? c.tipo === 'visita' : filtro === 'solicitudes' ? c.tipo === 'solicitud' : true,
    )

  return (
    <div className="home-screen">
      <motion.div className="home-scroll" variants={stagger} initial="hidden" animate="show">
        <div className="home-top">
          <motion.div className="home-title" variants={fadeUp}>
            <h1>Mensajes</h1>
            <p>{sinLeer === 1 ? '1 conversación sin leer' : sinLeer ? `${sinLeer} conversaciones sin leer` : 'Estás al día'}</p>
          </motion.div>
          <motion.label className="search-field" variants={fadeUp}>
            <Icon name="search" size={20} />
            <input
              type="search"
              placeholder="Buscar por nombre o quad"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </motion.label>
          <motion.div variants={fadeUp}>
            <Filtros opciones={FILTROS_MENSAJES} valor={filtro} onChange={setFiltro} className="filters--bleed" />
          </motion.div>
        </div>

        <motion.div className="home-pad" variants={fadeUp}>
          <div className="chat-list">
            <AnimatePresence initial={false} mode="popLayout">
              {lista.map((c) => (
                <motion.button
                  key={c.id}
                  type="button"
                  layout
                  className={`chat-row ${c.noLeidos ? 'chat-row--unread' : ''}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  whileTap={{ backgroundColor: 'rgba(15, 23, 42, 0.03)' }}
                  onClick={() => setLeidas((l) => (l.includes(c.id) ? l : [...l, c.id]))}
                >
                  <span className={`chat-row__avatar ${c.marca ? 'chat-row__avatar--brand' : ''}`}>
                    {c.foto ? <img src={c.foto} alt="" /> : c.iniciales || iniciales(c.nombre)}
                  </span>
                  <span className="chat-row__body">
                    <span className="chat-row__top">
                      <span className="chat-row__name">{c.nombre}</span>
                      <span className="chat-row__time">{c.hora}</span>
                    </span>
                    <span className="chat-row__quad">{c.quad}</span>
                    <span className="chat-row__bottom">
                      <span className="chat-row__msg">{c.mensaje}</span>
                      <AnimatePresence>
                        {c.noLeidos > 0 && (
                          <motion.span className="chat-row__badge" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                            {c.noLeidos}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                  </span>
                </motion.button>
              ))}
            </AnimatePresence>
            {lista.length === 0 && <p className="home-empty">No hay conversaciones.</p>}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
