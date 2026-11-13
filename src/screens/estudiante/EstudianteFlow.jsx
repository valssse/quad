import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import StatusBar from '../../components/StatusBar.jsx'
import BackButton from '../../components/BackButton.jsx'
import ProgressBar from '../../components/ProgressBar.jsx'
import { screenVariants } from '../../components/motion.js'
import { PASOS, TOTAL_PASOS } from '../../data/estudiante.js'
import PhotoSheet from './PhotoSheet.jsx'
import Universidad from './Universidad.jsx'
import Verificar from './Verificar.jsx'
import Codigo from './Codigo.jsx'
import Verificado from './Verificado.jsx'
import Foto from './Foto.jsx'
import TuFoto from './TuFoto.jsx'
import Datos from './Datos.jsx'
import Solicitud from './Solicitud.jsx'
import SobreTi from './SobreTi.jsx'
import Presupuesto from './Presupuesto.jsx'
import Referencia from './Referencia.jsx'
import Tipo from './Tipo.jsx'
import Servicios from './Servicios.jsx'
import Convivencia from './Convivencia.jsx'
import Mudanza from './Mudanza.jsx'
import Perfil from './Perfil.jsx'
import TodoListo from './TodoListo.jsx'
import './estudiante.css'

const PANTALLAS = {
  universidad: Universidad,
  verificar: Verificar,
  codigo: Codigo,
  verificado: Verificado,
  foto: Foto,
  'tu-foto': TuFoto,
  datos: Datos,
  solicitud: Solicitud,
  'sobre-ti': SobreTi,
  presupuesto: Presupuesto,
  referencia: Referencia,
  tipo: Tipo,
  servicios: Servicios,
  convivencia: Convivencia,
  mudanza: Mudanza,
  perfil: Perfil,
  listo: TodoListo,
}

/**
 * Estudiante · Onboarding y primeras pantallas.
 * La barra superior (atrás + progreso n/14) es persistente: al cambiar de paso
 * solo se desliza el contenido y la barra avanza animada.
 */
export default function EstudianteFlow({ pasoId, datos, setDatos, cuenta, navigate, onFinish }) {
  const indice = Math.max(0, PASOS.findIndex((p) => p.id === pasoId))
  const paso = PASOS[indice]

  // Dirección de la transición (adelante / atrás) según el orden de los pasos
  const [previo, setPrevio] = useState(indice)
  const [direccion, setDireccion] = useState(1)
  if (previo !== indice) {
    setDireccion(indice > previo ? 1 : -1)
    setPrevio(indice)
  }

  const [hoja, setHoja] = useState(false)

  const ir = (id) => navigate(`estudiante/${id}`)
  const siguiente = () => ir(PASOS[Math.min(indice + 1, PASOS.length - 1)].id)
  const atras = () => window.history.back()

  const actualizar = (cambios) => setDatos((d) => ({ ...d, ...cambios }))
  const alternar = (campo, id) =>
    setDatos((d) => ({
      ...d,
      [campo]: d[campo].includes(id) ? d[campo].filter((x) => x !== id) : [...d[campo], id],
    }))

  // Foto elegida en la hoja inferior → vista previa
  const elegirFoto = (url) => {
    setHoja(false)
    actualizar({ foto: url })
    ir('tu-foto')
  }

  const Pantalla = PANTALLAS[paso.id]
  const props = { datos, actualizar, alternar, siguiente, ir, cuenta, abrirHoja: () => setHoja(true), onFinish }

  return (
    <div className="screen est">
      <StatusBar />
      <div className="safe-top" />

      {/* Barra superior persistente: se oculta solo en E04 */}
      <motion.header
        className="topbar est__topbar"
        animate={{ opacity: paso.sinBarra ? 0 : 1 }}
        transition={{ duration: 0.25 }}
        style={{ pointerEvents: paso.sinBarra ? 'none' : 'auto' }}
        aria-hidden={paso.sinBarra}
      >
        <BackButton onClick={atras} />
        <ProgressBar step={paso.paso} total={TOTAL_PASOS} />
      </motion.header>

      <div className="est__stage">
        <AnimatePresence initial={false} custom={direccion}>
          <motion.div
            key={paso.id}
            className="screen-layer"
            custom={direccion}
            variants={screenVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <Pantalla {...props} />
          </motion.div>
        </AnimatePresence>
      </div>

      <PhotoSheet open={hoja} onClose={() => setHoja(false)} onPick={elegirFoto} />
    </div>
  )
}
