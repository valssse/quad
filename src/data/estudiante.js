/**
 * Datos del onboarding de estudiante (sección "Estudiante · Onboarding y primeras pantallas").
 * Opciones, pasos y estado inicial. Las selecciones únicas arrancan como en Figma;
 * las selecciones múltiples arrancan vacías para que la persona elija.
 */
import uca from '../assets/universidades/uca.png'
import ues from '../assets/universidades/ues.png'
import ufg from '../assets/universidades/ufg.png'
import esen from '../assets/universidades/esen.png'

/* ---------- Pasos (14 en la barra de progreso) ---------- */
export const TOTAL_PASOS = 14

export const PASOS = [
  { id: 'universidad', paso: 1 },
  { id: 'verificar', paso: 2 },
  { id: 'codigo', paso: 3 },
  { id: 'verificado', paso: 3, sinBarra: true },
  { id: 'foto', paso: 4 },
  { id: 'tu-foto', paso: 4 },
  { id: 'datos', paso: 5 },
  { id: 'solicitud', paso: 5 },
  { id: 'sobre-ti', paso: 6 },
  { id: 'presupuesto', paso: 7 },
  { id: 'referencia', paso: 8 },
  { id: 'tipo', paso: 9 },
  { id: 'servicios', paso: 10 },
  { id: 'convivencia', paso: 11 },
  { id: 'mudanza', paso: 12 },
  { id: 'perfil', paso: 13 },
  { id: 'listo', paso: 14 },
]

/* ---------- E01 · Universidades ---------- */
export const UNIVERSIDADES = [
  { id: 'uca', nombre: 'Universidad Centroamericana (UCA)', corto: 'UCA', lugar: 'Antiguo Cuscatlán, La Libertad', logo: uca, w: 18.5, h: 25.308, dominio: 'uca.edu.sv' },
  { id: 'ues', nombre: 'Universidad de El Salvador (UES)', corto: 'UES', lugar: 'San Salvador, San Salvador', logo: ues, w: 23, h: 28.682, dominio: 'ues.edu.sv' },
  { id: 'ufg', nombre: 'Universidad Francisco Gavidia (UFG)', corto: 'UFG', lugar: 'San Salvador, San Salvador', logo: ufg, w: 28.059, h: 28.059, dominio: 'ufg.edu.sv' },
  { id: 'esen', nombre: 'Escuela Superior de Economía y Negocios (ESEN)', corto: 'ESEN', lugar: 'Zaragoza, La Libertad', logo: esen, w: 26.882, h: 26.29, dominio: 'esen.edu.sv' },
]

/* ---------- E02 · Métodos de verificación ---------- */
export const METODOS = [
  { id: 'correo', titulo: 'Con tu correo universitario', desc: 'Te llega un código al instante', icon: 'mail', iconSel: 'hero-envelope-solid' },
  { id: 'carne', titulo: 'Con tu carné estudiantil', desc: 'Sube una foto; lo revisamos en 24 horas', icon: 'media-image', iconSel: 'hero-photo-solid' },
]

/* ---------- E05d · Año ---------- */
export const ANIOS = [
  { id: '1', label: '1.º' },
  { id: '2', label: '2.º' },
  { id: '3', label: '3.º' },
  { id: '4', label: '4.º' },
  { id: '5', label: '5.º o más' },
]

/* ---------- E06 · Intereses ---------- */
export const INTERESES = [
  { id: 'musica', label: 'Música', icon: 'hero-musical-note', iconSel: 'hero-musical-note-solid' },
  { id: 'deportes', label: 'Deportes', icon: 'hero-trophy', iconSel: 'hero-trophy-solid' },
  { id: 'cocinar', label: 'Cocinar', icon: 'cutlery', iconSel: 'cutlery-fill' },
  { id: 'lectura', label: 'Lectura', icon: 'hero-book-open', iconSel: 'hero-book-open-solid' },
  { id: 'videojuegos', label: 'Videojuegos', icon: 'hero-puzzle-piece', iconSel: 'hero-puzzle-piece-solid' },
  { id: 'arte', label: 'Arte', icon: 'hero-paint-brush', iconSel: 'hero-paint-brush-solid' },
  { id: 'voluntariado', label: 'Voluntariado', icon: 'heart', iconSel: 'heart-solid' },
  { id: 'cine', label: 'Cine', icon: 'hero-film', iconSel: 'hero-film-solid' },
  { id: 'viajes', label: 'Viajes', icon: 'hero-globe-americas', iconSel: 'hero-globe-americas-solid' },
  { id: 'fotografia', label: 'Fotografía', icon: 'hero-camera', iconSel: 'hero-camera-solid' },
  { id: 'tecnologia', label: 'Tecnología', icon: 'hero-computer-desktop', iconSel: 'hero-computer-desktop-solid' },
  { id: 'naturaleza', label: 'Naturaleza', icon: 'hero-sun', iconSel: 'hero-sun-solid' },
  { id: 'mascotas', label: 'Mascotas', icon: 'paw-fill', iconSel: 'paw-fill' },
  { id: 'idiomas', label: 'Idiomas', icon: 'hero-language', iconSel: 'hero-language-solid' },
]

/* ---------- E07 · Presupuesto ---------- */
export const PRESUPUESTO = { min: 50, max: 300, paso: 10 }
export const ATAJOS = [
  { id: 'bajo', label: 'Hasta $100', rango: [50, 100] },
  { id: 'medio', label: '$100 – $150', rango: [100, 150] },
  { id: 'alto', label: 'Más de $150', rango: [150, 300] },
]

/* ---------- E08 · Punto de referencia ---------- */
export const ENTRADAS = [
  { id: 'peatonal', titulo: 'Portón peatonal', desc: 'Calle de acceso a pie', icon: 'walking', iconSel: 'walking-fill' },
  { id: 'principal', titulo: 'Portón principal', desc: 'Entrada vehicular', icon: 'map-pin', iconSel: 'map-pin-fill' },
  { id: 'mapa', titulo: 'Otro punto en el mapa', desc: 'Elige un lugar exacto', icon: 'map-pin', iconSel: 'map-pin-fill' },
]
export const TRANSPORTES = [
  { id: 'caminando', label: 'Caminando', icon: 'walking', iconSel: 'walking-fill' },
  { id: 'bus', label: 'En bus', icon: 'bus', iconSel: 'bus-fill' },
  { id: 'carro', label: 'En carro', icon: 'car', iconSel: 'car-fill' },
]

/* ---------- E09 · Tipo de quad ---------- */
export const TIPOS = [
  { id: 'familia', titulo: 'Casa de familia', corto: 'casa de familia', desc: 'Vives con una familia y compartes espacios comunes', icon: 'group', iconSel: 'group-fill' },
  { id: 'independiente', titulo: 'Cuarto independiente', corto: 'cuarto independiente', desc: 'Entrada propia o anexo dentro de una casa', icon: 'bed', iconSel: 'bed-fill' },
  { id: 'compartido', titulo: 'Cuarto compartido', corto: 'cuarto compartido', desc: 'Compartes cuarto con otro estudiante', icon: 'community', iconSel: 'community-fill' },
  { id: 'apartamento', titulo: 'Apartamento con estudiantes', corto: 'apartamento', desc: 'Cuarto propio, áreas compartidas con otros universitarios', icon: 'home', iconSel: 'home-solid' },
]

/* ---------- E10 · Servicios imprescindibles ---------- */
export const SERVICIOS = [
  {
    titulo: 'Servicios',
    items: [
      { id: 'cocina', label: 'Uso de cocina', icon: 'cutlery', iconSel: 'cutlery-fill' },
      { id: 'lavanderia', label: 'Lavandería', icon: 'washing-machine', iconSel: 'washing-fill' },
      { id: 'wifi', label: 'Wi‑Fi', icon: 'wifi', iconSel: 'wifi-fill' },
      { id: 'agua-luz', label: 'Agua y luz incluidas', icon: 'hero-bolt', iconSel: 'hero-bolt-solid' },
      { id: 'bano', label: 'Baño privado', icon: 'lock', iconSel: 'hero-lock-closed-solid' },
    ],
  },
  {
    titulo: 'En el cuarto',
    items: [
      { id: 'cama', label: 'Cama y clóset', icon: 'hero-archive-box', iconSel: 'hero-archive-box-solid' },
      { id: 'escritorio', label: 'Escritorio', icon: 'hero-computer-desktop', iconSel: 'hero-computer-desktop-solid' },
      { id: 'ventilador', label: 'Ventilador o aire', icon: 'hero-cloud', iconSel: 'hero-cloud-solid' },
      { id: 'ventana', label: 'Ventana al exterior', icon: 'hero-sun', iconSel: 'hero-sun-solid' },
    ],
  },
  {
    titulo: 'Extras',
    items: [
      { id: 'parqueo', label: 'Estacionamiento', icon: 'car', iconSel: 'car-fill' },
      { id: 'parada', label: 'Cerca de parada de bus', icon: 'bus', iconSel: 'bus-fill' },
      { id: 'segura', label: 'Zona segura', icon: 'shield-check', iconSel: 'shield-check-fill' },
    ],
  },
]

/* ---------- E11 · Convivencia ---------- */
export const CONVIVENCIA = [
  {
    titulo: 'Preferencias',
    items: [
      { id: 'mujeres', label: 'Solo mujeres', corto: 'solo mujeres', icon: 'female', iconSel: 'female-fill' },
      { id: 'hombres', label: 'Solo hombres', corto: 'solo hombres', icon: 'user', iconSel: 'user-solid' },
      { id: 'mascotas', label: 'Acepto mascotas', corto: 'con mascotas', icon: 'paw-fill', iconSel: 'paw-fill' },
      { id: 'no-fumadores', label: 'No fumadores', corto: 'sin fumar', icon: 'no-smoking-fill', iconSel: 'no-smoking-fill' },
      { id: 'tranquilo', label: 'Ambiente tranquilo', corto: 'tranquilo', icon: 'moon-fill', iconSel: 'moon-fill' },
    ],
  },
  {
    titulo: 'Tu rutina',
    items: [
      { id: 'noche', label: 'Estudio de noche', icon: 'moon-fill', iconSel: 'moon-fill' },
      { id: 'tarde', label: 'A veces llego tarde', icon: 'clock', iconSel: 'clock-fill' },
      { id: 'madrugo', label: 'Madrugo', icon: 'hero-sun', iconSel: 'hero-sun-solid' },
      { id: 'fines', label: 'Paso fines de semana fuera', icon: 'map-pin', iconSel: 'map-pin-fill' },
    ],
  },
]

/* ---------- E12 · Mudanza ---------- */
export const FECHAS = [
  { id: 'ya', titulo: 'Lo antes posible', desc: 'Quads disponibles desde ya', icon: 'clock', iconSel: 'clock-fill' },
  { id: 'ciclo1', titulo: 'Ciclo 01 · 2027', desc: 'Enero – junio', icon: 'calendar', iconSel: 'calendar-fill' },
  { id: 'ciclo2', titulo: 'Ciclo 02 · 2027', desc: 'Julio – diciembre', icon: 'calendar', iconSel: 'calendar-fill' },
]
export const DURACIONES = [
  { id: 'ciclo', label: '1 ciclo', texto: 'por 1 ciclo' },
  { id: 'anio', label: '1 año', texto: 'por 1 año' },
  { id: 'carrera', label: 'Toda la carrera', texto: 'por toda la carrera' },
  { id: 'nose', label: 'Aún no sé', texto: 'tiempo por definir' },
]

/* ---------- Estado inicial ---------- */
export const ESTUDIANTE_INICIAL = {
  universidad: 'uca',
  metodo: 'correo',
  correoUni: '',
  foto: null,
  carrera: '',
  anio: '2',
  ciudad: '',
  sobreMi: '',
  intereses: [],
  presupuesto: [100, 150],
  serviciosIncluidos: true,
  entrada: 'peatonal',
  transporte: [],
  tipos: [],
  servicios: [],
  convivencia: [],
  convivirFamilia: true,
  mudanza: 'ciclo1',
  duracion: 'anio',
}

/* ---------- Utilidades ---------- */
export const buscar = (lista, id) => lista.find((x) => x.id === id)
export const todosLosItems = (grupos) => grupos.flatMap((g) => g.items)
export const formatoRango = ([a, b]) => `$${a} – $${b >= PRESUPUESTO.max ? `${PRESUPUESTO.max}+` : b}`

/** Une una lista en español: "a", "a o b", "a, b o c". */
export const unir = (items, conector = 'o') =>
  items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} ${conector} ${items[items.length - 1]}`

export const capitalizar = (t) => (t ? t.charAt(0).toUpperCase() + t.slice(1) : t)
