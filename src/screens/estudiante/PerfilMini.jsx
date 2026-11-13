import { motion } from 'motion/react'
import Icon from '../../components/Icon.jsx'
import { fadeUp } from '../../components/motion.js'
import { ANIOS, buscar } from '../../data/estudiante.js'

/** Perfil · Mini — tarjeta que ve una familia al recibir la solicitud. */
export default function PerfilMini({ datos, cuenta }) {
  const anio = buscar(ANIOS, datos.anio)
  const meta = [datos.carrera || 'Tu carrera', anio && `${anio.label} año`].filter(Boolean).join(' · ')

  return (
    <motion.div className="mini" variants={fadeUp}>
      <span className="mini__avatar">
        {datos.foto ? <img src={datos.foto} alt="" /> : <Icon name="user-solid" size={30} />}
      </span>
      <span className="mini__texts">
        <span className="mini__name">{cuenta?.name || 'Tu nombre'}</span>
        <span className="mini__meta">{meta}</span>
        <span className="mini__city">
          <Icon name="map-pin-fill" size={13} />
          {datos.ciudad ? `De ${datos.ciudad}` : 'Tu ciudad de origen'}
        </span>
      </span>
    </motion.div>
  )
}
