import locationIcon from '../assets/icons/location-fill-white.svg'
import communityIcon from '../assets/icons/community-fill-white.svg'
import securityIcon from '../assets/icons/security-fill-white.svg'

/** Contenido de las pantallas 01d, 01e y 01f · Bienvenida. */
const bienvenidas = [
  {
    icon: locationIcon,
    title: 'Encuentra un cuarto cerca de tu universidad',
    text: 'Busca por campus, colonia o tiempo de traslado y compara opciones en un solo lugar.',
    cta: 'Siguiente',
  },
  {
    icon: communityIcon,
    title: 'Conoce a la familia antes de llegar',
    text: 'Mira quiénes viven ahí, sus reglas y lo que opinan otros estudiantes. Pregunta todo por chat.',
    cta: 'Siguiente',
  },
  {
    icon: securityIcon,
    title: 'Todo seguro, dentro de Quad',
    text: 'Identidades verificadas, contrato y pagos en la app. Si algo falla, te acompañamos.',
    cta: 'Empezar',
  },
]

export default bienvenidas
