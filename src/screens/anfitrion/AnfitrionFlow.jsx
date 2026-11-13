import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import StatusBar from '../../components/StatusBar.jsx'
import BackButton from '../../components/BackButton.jsx'
import ProgressBar from '../../components/ProgressBar.jsx'
import { screenVariants } from '../../components/motion.js'
import PhotoSheet from '../estudiante/PhotoSheet.jsx'
import { PASOS, TIPOS_REGLA } from '../../data/anfitrion.js'
import {
  Ambiente,
  Casa,
  CodigoSms,
  Identidad,
  PerfilListo,
  Presentacion,
  Privacidad,
  RevisarSelfie,
  Selfie,
  Telefono,
  Tipo,
  Universidades,
} from './Perfil.jsx'
import { Familia, HojaMascota, HojaPersona } from './Familia.jsx'
import { Fotos, HojaAgregarRegla, HojaRegla, HojaReglaExtra, Incluye, Reglas, TipoCuarto } from './Cuarto.jsx'
import { CasiListo, Cobro, Disponibilidad, Precio, Revision, Ubicacion, VistaPrevia } from './Publicar.jsx'
import '../estudiante/estudiante.css'
import './anfitrion.css'

const PANTALLAS = {
  tipo: Tipo,
  identidad: Identidad,
  selfie: Selfie,
  'revisar-selfie': RevisarSelfie,
  telefono: Telefono,
  codigo: CodigoSms,
  casa: Casa,
  familia: Familia,
  ambiente: Ambiente,
  presentacion: Presentacion,
  privacidad: Privacidad,
  universidades: Universidades,
  'perfil-listo': PerfilListo,
  fotos: Fotos,
  cuarto: TipoCuarto,
  incluye: Incluye,
  reglas: Reglas,
  ubicacion: Ubicacion,
  precio: Precio,
  disponibilidad: Disponibilidad,
  'casi-listo': CasiListo,
  'vista-previa': VistaPrevia,
  cobro: Cobro,
  revision: Revision,
}

const TEXTOS_SELFIE = {
  titulo: 'Agregar selfie de validación',
  camara: 'Tomar una selfie',
  camaraDesc: 'Usa la cámara frontal de tu teléfono',
  galeria: 'Elegir de la galería',
  galeriaDesc: 'Sube una selfie reciente',
}

const REGLAS_DETALLADAS = ['llegada', 'visitas', 'cocina', 'convivencia']

/**
 * Onboarding · Anfitrión.
 * Parte 1 (n/12): perfil y verificación. Parte 2 (n/9): publicar el quad.
 * La barra superior es persistente: el progreso se anima entre pasos y, al
 * empezar la parte 2, se reinicia hacia 1/9. Las hojas inferiores viven aquí
 * para que el fondo atenuado cubra toda la pantalla.
 */
export default function AnfitrionFlow({ pasoId, datos, setDatos, navigate, onFinish }) {
  const indice = Math.max(0, PASOS.findIndex((p) => p.id === pasoId))
  const paso = PASOS[indice]

  // Hoja abierta: { tipo, dato }
  const [hoja, setHoja] = useState(null)
  const [previo, setPrevio] = useState(indice)
  const [direccion, setDireccion] = useState(1)
  if (previo !== indice) {
    setDireccion(indice > previo ? 1 : -1)
    setPrevio(indice)
    if (hoja?.tipo) setHoja(null) // al cambiar de paso (p. ej. botón atrás) se cierra la hoja
  }

  const abrir = (tipo, dato = null) => setHoja({ tipo, dato })
  const cerrar = () => setHoja((h) => (h ? { ...h, tipo: null } : null))

  // Escape cierra la hoja abierta (teclado en escritorio)
  useEffect(() => {
    const alPresionar = (e) => e.key === 'Escape' && cerrar()
    window.addEventListener('keydown', alPresionar)
    return () => window.removeEventListener('keydown', alPresionar)
  }, [])

  const ir = (id) => navigate(`anfitrion/${id}`)
  const siguiente = () => ir(PASOS[Math.min(indice + 1, PASOS.length - 1)].id)
  const atras = () => window.history.back()

  const actualizar = (cambios) => setDatos((d) => ({ ...d, ...cambios }))
  const alternar = (campo, id) =>
    setDatos((d) => ({
      ...d,
      [campo]: d[campo].includes(id) ? d[campo].filter((x) => x !== id) : [...d[campo], id],
    }))

  const elegirSelfie = (url) => {
    setHoja(null)
    actualizar({ selfie: url })
    ir('revisar-selfie')
  }

  // A16b → abre el editor de la regla elegida
  const elegirRegla = (id) => {
    if (REGLAS_DETALLADAS.includes(id)) return abrir(`regla-${id}`)
    const tipo = TIPOS_REGLA.find((t) => t.id === id)
    abrir('regla-extra', { id: `r${Date.now()}`, tipo: id, titulo: tipo.label, texto: '' })
  }

  const Pantalla = PANTALLAS[paso.id]
  const props = { datos, actualizar, alternar, siguiente, ir, abrir, onFinish }
  const sinBarra = paso.sinBarra || paso.pantallaCompleta
  const t = hoja?.tipo
  const comun = { datos, actualizar, onClose: cerrar }

  return (
    <div className={`screen est host ${paso.pantallaCompleta ? 'host--full' : ''}`}>
      {/* En la vista previa la galería ocupa también la zona del status bar */}
      <motion.div
        className="host__chrome"
        initial={false}
        animate={{ height: paso.pantallaCompleta ? 0 : 'auto' }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <StatusBar />
        <div className="safe-top" />
      </motion.div>

      {/* Barra superior persistente (oculta en la vista previa y en "en revisión") */}
      <motion.header
        className="topbar est__topbar host__topbar"
        initial={false}
        animate={{ opacity: sinBarra ? 0 : 1, height: paso.pantallaCompleta ? 0 : 44 }}
        transition={{ duration: 0.25 }}
        style={{ pointerEvents: sinBarra ? 'none' : 'auto' }}
        aria-hidden={sinBarra}
      >
        <BackButton onClick={atras} />
        <ProgressBar key={paso.total} step={paso.paso} total={paso.total} />
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

      {/* Hojas inferiores */}
      <PhotoSheet open={t === 'selfie'} onClose={cerrar} onPick={elegirSelfie} textos={TEXTOS_SELFIE} />
      <HojaPersona abierta={t === 'persona'} persona={hoja?.dato} {...comun} />
      <HojaMascota abierta={t === 'mascota'} {...comun} />
      <HojaAgregarRegla abierta={t === 'agregar-regla'} onClose={cerrar} onElegir={elegirRegla} />
      {REGLAS_DETALLADAS.map((id) => (
        <HojaRegla key={id} tipo={id} abierta={t === `regla-${id}`} {...comun} />
      ))}
      <HojaReglaExtra abierta={t === 'regla-extra'} regla={hoja?.dato} {...comun} />
    </div>
  )
}
