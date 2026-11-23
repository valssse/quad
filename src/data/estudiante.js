/**
 * Datos del onboarding de estudiante (sección "Estudiante · Onboarding y primeras pantallas").
 * Opciones, pasos y estado inicial. Las selecciones únicas arrancan como en Figma;
 * las selecciones múltiples arrancan vacías para que la persona elija.
 */
import uca from '../assets/universidades/uca.png'
import ues from '../assets/universidades/ues.png'
import ufg from '../assets/universidades/ufg.png'
import esen from '../assets/universidades/esen.png'

/* ---------- Pasos (15 en la barra de progreso) ---------- */
export const TOTAL_PASOS = 15

export const PASOS = [
  { id: 'universidad', paso: 1 },
  { id: 'verificar', paso: 2 },
  { id: 'verificar-correo', paso: 2 },
  { id: 'verificar-carne', paso: 2 },
  { id: 'carne-revision', paso: 2 },
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
  { id: 'identidad', paso: 11 },
  { id: 'convivencia', paso: 12 },
  { id: 'mudanza', paso: 13 },
  { id: 'perfil', paso: 14 },
  { id: 'listo', paso: 15 },
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
  { id: 'correo', titulo: 'Con tu correo universitario', desc: 'Te llega un código al instante', icon: 'hero-envelope-solid', iconSel: 'hero-envelope-solid' },
  { id: 'carne', titulo: 'Con tu carné estudiantil', desc: 'Sube una foto; lo revisamos en 24 horas', icon: 'hero-camera-solid', iconSel: 'hero-camera-solid' },
]

/* ---------- E05d · Año ---------- */
export const ANIOS = [
  { id: '1', label: '1.º' },
  { id: '2', label: '2.º' },
  { id: '3', label: '3.º' },
  { id: '4', label: '4.º' },
  { id: '5', label: '5.º o más' },
]

/* ---------- E05d · Ciudad de origen ---------- */
export const CIUDADES = ['Ahuachapán', 'Cabañas', 'Chalatenango', 'Cuscatlán', 'La Libertad', 'La Paz', 'La Unión', 'Morazán', 'San Miguel', 'San Salvador', 'San Vicente', 'Santa Ana', 'Sonsonate', 'Usulután']
export const OTRA_CIUDAD = 'Otro país'

/* ---------- E06 · Intereses (5 categorías, 28 opciones) ---------- */
const interes = (id, label, icon, iconSel = icon) => ({ id, label, icon, iconSel })
export const INTERESES_GRUPOS = [
  {
    titulo: 'Arte y cultura',
    items: [
      interes('musica', 'Música', 'hero-musical-note', 'hero-musical-note-solid'),
      interes('lectura', 'Lectura', 'hero-book-open', 'hero-book-open-solid'),
      interes('arte', 'Arte', 'hero-paint-brush', 'hero-paint-brush-solid'),
      interes('cine', 'Cine', 'hero-film', 'hero-film-solid'),
      interes('fotografia', 'Fotografía', 'hero-camera', 'hero-camera-solid'),
      interes('idiomas', 'Idiomas', 'hero-language', 'hero-language-solid'),
      interes('teatro', 'Teatro', 'sparks', 'hero-sparkles-solid'),
      interes('baile', 'Baile', 'heart', 'heart-solid'),
    ],
  },
  {
    titulo: 'Deporte y bienestar',
    items: [
      interes('deportes', 'Deportes', 'hero-trophy', 'hero-trophy-solid'),
      interes('gimnasio', 'Gimnasio', 'hero-bolt', 'hero-bolt-solid'),
      interes('yoga', 'Yoga', 'heart', 'heart-solid'),
      interes('correr', 'Correr', 'walking', 'walking-fill'),
      interes('ciclismo', 'Ciclismo', 'map-pin', 'map-pin-fill'),
    ],
  },
  {
    titulo: 'Vida social',
    items: [
      interes('cocinar', 'Cocinar', 'cutlery', 'cutlery-fill'),
      interes('voluntariado', 'Voluntariado', 'heart', 'heart-solid'),
      interes('viajes', 'Viajes', 'hero-globe-americas', 'hero-globe-americas-solid'),
      interes('cafe', 'Café', 'cutlery', 'cutlery-fill'),
      interes('fiestas', 'Fiestas', 'sparks', 'hero-sparkles-solid'),
      interes('juegos-mesa', 'Juegos de mesa', 'hero-puzzle-piece', 'hero-puzzle-piece-solid'),
    ],
  },
  {
    titulo: 'Tecnología y juegos',
    items: [
      interes('videojuegos', 'Videojuegos', 'hero-puzzle-piece', 'hero-puzzle-piece-solid'),
      interes('tecnologia', 'Tecnología', 'hero-computer-desktop', 'hero-computer-desktop-solid'),
      interes('programacion', 'Programación', 'hero-computer-desktop', 'hero-computer-desktop-solid'),
      interes('anime', 'Anime', 'sparks', 'hero-sparkles-solid'),
      interes('diseno', 'Diseño', 'hero-paint-brush', 'hero-paint-brush-solid'),
    ],
  },
  {
    titulo: 'Naturaleza y animales',
    items: [
      interes('naturaleza', 'Naturaleza', 'hero-sun', 'hero-sun-solid'),
      interes('mascotas', 'Mascotas', 'paw-fill'),
      interes('senderismo', 'Senderismo', 'walking', 'walking-fill'),
      interes('jardineria', 'Jardinería', 'hero-sun', 'hero-sun-solid'),
    ],
  },
]

/* ---------- E06 · Intereses (lista plana, para el perfil) ---------- */
export const INTERESES = INTERESES_GRUPOS.flatMap((g) => g.items)

/* ---------- E07 · Presupuesto ---------- */
export const PRESUPUESTO = { min: 50, max: 300, paso: 10 }
export const ATAJOS = [
  { id: 'bajo', label: 'Hasta $100', rango: [50, 100] },
  { id: 'medio', label: '$100 – $150', rango: [100, 150] },
  { id: 'alto', label: 'Más de $150', rango: [150, 300] },
]

/* ---------- E08 · Punto de referencia ---------- */
export const ENTRADAS = [
  { id: 'peatonal', titulo: 'Portón peatonal', desc: 'Calle de acceso a pie', icon: 'walking-fill', iconSel: 'walking-fill' },
  { id: 'principal', titulo: 'Portón principal', desc: 'Entrada vehicular', icon: 'car-fill', iconSel: 'car-fill' },
  { id: 'mapa', titulo: 'Otro punto en el mapa', desc: 'Elige un lugar exacto', icon: 'map-pin-fill', iconSel: 'map-pin-fill' },
]
export const TRANSPORTES = [
  { id: 'caminando', label: 'Caminando', icon: 'walking', iconSel: 'walking-fill' },
  { id: 'bus', label: 'En bus', icon: 'bus', iconSel: 'bus-fill' },
  { id: 'carro', label: 'En carro', icon: 'car', iconSel: 'car-fill' },
]

/* ---------- E09 · Tipo de quad ---------- */
export const TIPOS = [
  { id: 'familia', titulo: 'Casa de familia', corto: 'casa de familia', desc: 'Vives con una familia y compartes espacios comunes', icon: 'group', iconSel: 'group-fill' },
  { id: 'independiente', titulo: 'Quad independiente', corto: 'quad independiente', desc: 'Entrada propia o anexo dentro de una casa', icon: 'bed', iconSel: 'bed-fill' },
  { id: 'compartido', titulo: 'Quad compartido', corto: 'quad compartido', desc: 'Compartes quad con otro estudiante', icon: 'community', iconSel: 'community-fill' },
  { id: 'apartamento', titulo: 'Apartamento con estudiantes', corto: 'apartamento', desc: 'Quad propio, áreas compartidas con otros universitarios', icon: 'home', iconSel: 'home-solid' },
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
    titulo: 'En el quad',
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

/* ---------- E10b · ¿Cómo te identificas? ---------- */
export const GENEROS = [
  { id: 'mujer', titulo: 'Mujer', desc: 'Podrás ver casas “Solo mujeres”', icon: 'female-fill', iconSel: 'female-fill' },
  { id: 'hombre', titulo: 'Hombre', desc: 'Podrás ver casas “Solo hombres”', icon: 'user-solid', iconSel: 'user-solid' },
  { id: 'nd', titulo: 'Prefiero no decirlo', desc: 'Verás casas mixtas', icon: 'shield-check-fill', iconSel: 'shield-check-fill' },
]

/* ---------- E11 · Convivencia ---------- */
export const CONVIVENCIA_PREFERENCIAS = [
  {
    titulo: 'Quién vive en la casa',
    items: [
      { id: 'mujeres', label: 'Solo mujeres', corto: 'solo mujeres', icon: 'female', iconSel: 'female-fill', genero: 'mujer' },
      { id: 'hombres', label: 'Solo hombres', corto: 'solo hombres', icon: 'user', iconSel: 'user-solid', genero: 'hombre' },
      { id: 'mixta', label: 'Casa mixta', corto: 'casa mixta', icon: 'community', iconSel: 'community-fill' },
      { id: 'familia-hijos', label: 'Familia con hijos', corto: 'familia con hijos', icon: 'home', iconSel: 'home-solid' },
    ],
  },
  {
    titulo: 'Servicios cerca',
    items: [
      { id: 'lavanderia-incluida', label: 'Lavandería incluida', corto: 'lavandería incluida', icon: 'washing-machine', iconSel: 'washing-fill' },
      { id: 'lavanderia-cerca', label: 'Lavandería cerca', corto: 'lavandería cerca', icon: 'map-pin', iconSel: 'map-pin-fill' },
      { id: 'wifi-incluido', label: 'Wi-Fi incluido', corto: 'wi-fi incluido', icon: 'wifi', iconSel: 'wifi-fill' },
      { id: 'agua-luz-incluidas', label: 'Agua y luz incluidas', corto: 'agua y luz incluidas', icon: 'hero-bolt', iconSel: 'hero-bolt-solid' },
    ],
  },
  {
    titulo: 'Reglas de la casa',
    items: [
      { id: 'mascotas', label: 'Acepto mascotas', corto: 'con mascotas', icon: 'paw-fill', iconSel: 'paw-fill' },
      { id: 'no-fumadores', label: 'No fumadores', corto: 'sin fumar', icon: 'no-smoking-fill', iconSel: 'no-smoking-fill' },
      { id: 'tranquilo', label: 'Ambiente tranquilo', corto: 'tranquilo', icon: 'moon-fill', iconSel: 'moon-fill' },
      { id: 'sin-fiestas', label: 'Sin fiestas', corto: 'sin fiestas', icon: 'bell', iconSel: 'hero-bell-solid' },
      { id: 'visitas', label: 'Visitas permitidas', corto: 'con visitas', icon: 'user-plus', iconSel: 'user-plus' },
    ],
  },
]
export const RUTINA = {
  titulo: 'Tu rutina',
  items: [
    { id: 'noche', label: 'Estudio de noche', icon: 'moon-fill', iconSel: 'moon-fill' },
    { id: 'tarde', label: 'A veces llego tarde', icon: 'clock', iconSel: 'clock-fill' },
    { id: 'madrugo', label: 'Madrugo', icon: 'hero-sun', iconSel: 'hero-sun-solid' },
    { id: 'fines', label: 'Paso fines de semana fuera', icon: 'map-pin', iconSel: 'map-pin-fill' },
  ],
}
/** Todas las opciones de convivencia (para el resumen del perfil). */
export const CONVIVENCIA = [...CONVIVENCIA_PREFERENCIAS, RUTINA]

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
  carne: false,
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
  genero: 'mujer',
  puntoMapa: null,
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
