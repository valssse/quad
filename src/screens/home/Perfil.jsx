import { motion } from 'motion/react'
import Icon from '../../components/Icon.jsx'
import { fadeUp, stagger } from '../../components/motion.js'
import sofia from '../../assets/personas/sofia.jpg'

const GRUPOS = [
  {
    titulo: 'Mi alquiler',
    items: [
      { icon: 'hero-envelope-solid', titulo: 'Mis solicitudes', desc: '1 solicitud en revisión' },
      { icon: 'home-solid', titulo: 'Mi estancia', desc: 'Aún no tienes una estancia activa' },
      { icon: 'dollar-circle-fill', titulo: 'Pagos y recibos', desc: 'Sin pagos pendientes' },
    ],
  },
  {
    titulo: 'Mi búsqueda',
    items: [
      { icon: 'filter-list', titulo: 'Preferencias de búsqueda', desc: '$100–$150 · Casa de familia · Peatonal' },
      { icon: 'shield-check-fill', titulo: 'Verificación', desc: 'Correo UCA verificado' },
      { icon: 'star-fill', titulo: 'Mis reseñas', desc: 'Aún no tienes reseñas' },
    ],
  },
  {
    titulo: 'Cuenta',
    items: [
      { icon: 'hero-lock-closed-solid', titulo: 'Ajustes', desc: 'Datos, notificaciones y privacidad' },
      { icon: 'info-circle-fill', titulo: 'Centro de ayuda', desc: 'Preguntas frecuentes y soporte' },
    ],
  },
]

/** 09 · Perfil del estudiante. */
export default function Perfil({ perfil, onAnfitrion, onCerrarSesion }) {
  return (
    <div className="home-screen">
      <motion.div className="home-scroll profile" variants={stagger} initial="hidden" animate="show">
        <motion.h1 className="profile__title" variants={fadeUp}>
          Perfil
        </motion.h1>

        <motion.section className="profile-card" variants={fadeUp}>
          <motion.img
            src={perfil.foto || sofia}
            alt=""
            className="profile-card__avatar"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.1 }}
          />
          <div className="profile-card__name">
            <h2>{perfil.nombreCompleto}</h2>
            <p>{perfil.detalle}</p>
          </div>
          <motion.button type="button" className="small-btn" whileTap={{ scale: 0.98 }}>
            Ver mi perfil público
          </motion.button>
        </motion.section>

        <motion.button type="button" className="host-cta" variants={fadeUp} whileTap={{ scale: 0.99 }} onClick={onAnfitrion}>
          <span className="host-cta__icon">
            <Icon name="home-solid" size={22} />
          </span>
          <span className="option__texts">
            <span className="option__title">¿Tienes un cuarto libre?</span>
            <span className="option__desc">Cambia a modo anfitrión y publica tu quad</span>
          </span>
          <Icon name="nav-arrow-right" size={18} className="host-cta__chevron" />
        </motion.button>

        {GRUPOS.map((g) => (
          <motion.section key={g.titulo} className="profile-group" variants={fadeUp}>
            <p className="profile-group__label">{g.titulo}</p>
            {g.items.map((i) => (
              <motion.button key={i.titulo} type="button" className="action-row" whileTap={{ scale: 0.99 }}>
                <Icon name={i.icon} size={24} className="action-row__icon" />
                <span className="option__texts">
                  <span className="option__title">{i.titulo}</span>
                  <span className="option__desc">{i.desc}</span>
                </span>
                <Icon name="nav-arrow-right" size={18} className="action-row__chevron" />
              </motion.button>
            ))}
          </motion.section>
        ))}

        <motion.button type="button" className="logout" variants={fadeUp} onClick={onCerrarSesion}>
          Cerrar sesión
        </motion.button>
      </motion.div>
    </div>
  )
}
