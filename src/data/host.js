/* Datos de ejemplo del panel del anfitrión (sección "Anfitrión · App" de Figma). */
import andrea from '../assets/personas/andrea.jpg'
import sofia from '../assets/personas/sofia.jpg'
import cuartoFamilia from '../assets/quads/cuarto-familia.jpg'
import cuartoBalcon from '../assets/quads/cuarto-balcon.jpg'
import casaTranquila from '../assets/quads/casa-tranquila.jpg'
import fotoFachada from '../assets/quads/cuarto-madreselva.jpg'
import fotoSala from '../assets/quads/cuarto-bano-propio.jpg'

export const ANFITRIONA = {
  nombre: 'Andrea',
  foto: andrea,
  casa: 'Jardines de Guadalupe',
}

export const SEMANA = {
  rango: '3–9 nov',
  metricas: [
    { valor: '128', label: 'Vistas', delta: '+18%', tono: 'green' },
    { valor: '9', label: 'Guardados', delta: '+3', tono: 'green' },
    { valor: '4', label: 'Mensajes', delta: '2 sin leer', tono: 'blue' },
  ],
}

export const MIS_QUADS = [
  { id: 'familia', titulo: 'Cuarto privado en casa de familia', precio: 115, foto: cuartoFamilia, estado: 'publicado', datos: '48 vistas · 3 solicitudes' },
  { id: 'escritorio', titulo: 'Cuarto con escritorio', precio: 130, foto: cuartoBalcon, estado: 'revision' },
  { id: 'pequena', titulo: 'Habitación pequeña', precio: 95, foto: casaTranquila, estado: 'pausado', datos: 'Pausado desde el 2 de nov' },
]

export const BANNER_FOTO = cuartoBalcon

/* ---------- Solicitudes (H10–H14) ---------- */
const OK = 'ok'
const OJO = 'ojo'

export const SOLICITUDES = [
  {
    id: 'sofia',
    nombre: 'Sofía Ramírez',
    corto: 'Sofía',
    foto: sofia,
    carrera: 'Ingeniería Industrial',
    anio: '2.º año',
    ciudad: 'Santa Ana',
    estado: 'nueva',
    entra: '5 ene',
    duracionCorta: '6 meses',
    quadCorto: 'Cuarto privado',
    extracto: 'Hola, Andrea. Soy tranquila y ordenada, estudio casi todo el día…',
    pendiente: 'Quiere entrar el 5 de enero',
    datos: [
      ['Quad', 'Cuarto privado en casa de familia'],
      ['Ingreso', '5 de enero de 2027'],
      ['Duración', '6 meses · ciclo 01-2027'],
      ['Pago mensual', '$115'],
      ['Depósito', '$115'],
    ],
    mensaje: 'Hola, Andrea. Soy tranquila y ordenada, estudio casi todo el día y los fines de semana me gusta cocinar. Me encantó que la casa esté a 4 minutos de la Peatonal.',
    reglas: [
      { estado: OK, titulo: 'Hora de llegada', texto: 'Tu casa: antes de las 10 p. m. · Sofía suele llegar a las 7 p. m.' },
      { estado: OK, titulo: 'Visitas', texto: 'Solo de día · Sofía recibe visitas ocasionales' },
      { estado: OK, titulo: 'Ruido', texto: 'Ambiente tranquilo · coinciden' },
      { estado: OK, titulo: 'Limpieza', texto: 'Áreas comunes por turnos · coinciden' },
      { estado: OJO, titulo: 'Mascotas', texto: 'Tu casa no acepta mascotas y Sofía busca un lugar que sí', pregunta: 'Preguntarle sobre mascotas' },
    ],
  },
  {
    id: 'daniela',
    nombre: 'Daniela Flores',
    corto: 'Daniela',
    iniciales: 'DF',
    carrera: 'Psicología',
    anio: '3.º año',
    ciudad: 'San Miguel',
    estado: 'nueva',
    entra: '10 ene',
    duracionCorta: '1 ciclo',
    quadCorto: 'Cuarto con escritorio',
    extracto: 'Hola, me interesa el cuarto con escritorio. ¿Está disponible desde enero?',
    pendiente: 'Quiere entrar el 10 de enero',
    datos: [
      ['Quad', 'Cuarto con escritorio'],
      ['Ingreso', '10 de enero de 2027'],
      ['Duración', '1 ciclo · ciclo 01-2027'],
      ['Pago mensual', '$130'],
      ['Depósito', '$130'],
    ],
    mensaje: 'Hola, me interesa el cuarto con escritorio. ¿Está disponible desde enero? Vengo de San Miguel y busco un lugar tranquilo para estudiar, cerca de la UCA.',
    reglas: [
      { estado: OK, titulo: 'Hora de llegada', texto: 'Tu casa: antes de las 10 p. m. · Daniela suele llegar a las 6 p. m.' },
      { estado: OK, titulo: 'Visitas', texto: 'Solo de día · Daniela casi no recibe visitas' },
      { estado: OK, titulo: 'Ruido', texto: 'Ambiente tranquilo · coinciden' },
      { estado: OK, titulo: 'Limpieza', texto: 'Áreas comunes por turnos · coinciden' },
      { estado: OK, titulo: 'Mascotas', texto: 'Ninguna de las dos tiene mascotas · coinciden' },
    ],
  },
  {
    id: 'gabriela',
    nombre: 'Gabriela Torres',
    corto: 'Gabriela',
    iniciales: 'GT',
    carrera: 'Arquitectura',
    anio: '4.º año',
    ciudad: 'Sonsonate',
    estado: 'aceptada',
    entra: '15 ene',
    duracionCorta: '12 meses',
    quadCorto: 'Cuarto privado',
    extracto: '¡Gracias por aceptarme! Quedo atenta al contrato.',
    datos: [
      ['Quad', 'Cuarto privado en casa de familia'],
      ['Ingreso', '15 de enero de 2027'],
      ['Duración', '12 meses · 2027'],
      ['Pago mensual', '$115'],
      ['Depósito', '$115'],
    ],
    mensaje: '¡Gracias por aceptarme! Quedo atenta al contrato. Si necesitas algún documento de la universidad, con gusto te lo envío.',
    reglas: [
      { estado: OK, titulo: 'Hora de llegada', texto: 'Tu casa: antes de las 10 p. m. · Gabriela suele llegar a las 8 p. m.' },
      { estado: OK, titulo: 'Visitas', texto: 'Solo de día · coinciden' },
      { estado: OJO, titulo: 'Ruido', texto: 'A veces trabaja de noche en maquetas', pregunta: 'Preguntarle sobre el horario' },
      { estado: OK, titulo: 'Limpieza', texto: 'Áreas comunes por turnos · coinciden' },
      { estado: OK, titulo: 'Mascotas', texto: 'No tiene mascotas · coinciden' },
    ],
  },
]

export const MOTIVOS_RECHAZO = [
  'El cuarto ya no está disponible',
  'Las fechas no coinciden',
  'No encaja con las reglas de la casa',
  'Otro motivo',
]

/* ---------- Visitas (H15–H16) ---------- */
export const VISITAS = [
  { id: 'carlos', dia: 'Hoy · lunes 9 de nov', hora: '4:00', ampm: 'p. m.', nombre: 'Carlos Rivas', quad: 'Cuarto con escritorio', confirmada: true, hoy: true },
  { id: 'sofia', dia: 'Miércoles 11 de nov', hora: '4:00', ampm: 'p. m.', nombre: 'Sofía Ramírez', corto: 'Sofía', quad: 'Cuarto privado en casa de familia', confirmada: false },
  { id: 'daniela', dia: 'Viernes 13 de nov', hora: '10:00', ampm: 'a. m.', nombre: 'Daniela Flores', quad: 'Cuarto con escritorio', confirmada: true },
]

/* ---------- Estancias (H17, H19) ---------- */
export const ESTANCIAS = [
  {
    id: 'marcela',
    nombre: 'Marcela Pineda',
    corto: 'Marcela',
    iniciales: 'MP',
    carrera: 'Psicología',
    quad: 'Habitación pequeña',
    contratoCorto: 'Contrato del 15 de ago al 15 de dic',
    pagoTexto: 'Próximo pago: $95 · 1 de dic',
    alDia: true,
    avance: 0.73,
    termina: 33,
    datos: [
      ['Quad', 'Habitación pequeña'],
      ['Vigencia', '15 ago – 15 dic 2026'],
      ['Pago mensual', '$95 · cada día 1'],
      ['Depósito', '$95 · en resguardo'],
    ],
    pagos: [
      { mes: 'Diciembre', texto: '$95 · vence el 1 de dic', estado: 'proximo' },
      { mes: 'Noviembre', texto: '$95 · pagado el 1 de nov', estado: 'pagado' },
      { mes: 'Octubre', texto: '$95 · pagado el 30 de sep', estado: 'pagado' },
    ],
    reportes: ['ducha', 'ruido'],
  },
  {
    id: 'karla',
    nombre: 'Karla Méndez',
    corto: 'Karla',
    iniciales: 'KM',
    carrera: 'Arquitectura',
    quad: 'Cuarto con balcón',
    contratoCorto: 'Contrato del 1 de sep al 31 de dic',
    pagoTexto: 'Venció el 1 de nov · $135',
    alDia: false,
    avance: 0.62,
    termina: 49,
    vencido: { titulo: 'El pago de noviembre venció hace 12 días', texto: '$135 · Le enviaremos un recordatorio amable de tu parte por la app.', mes: 'noviembre' },
    datos: [
      ['Quad', 'Cuarto con balcón'],
      ['Vigencia', '1 sep – 31 dic 2026'],
      ['Pago mensual', '$135 · cada día 1'],
      ['Depósito', '$135 · en resguardo'],
    ],
    pagos: [
      { mes: 'Noviembre', texto: '$135 · venció el 1 de nov', estado: 'vencido' },
      { mes: 'Octubre', texto: '$135 · pagado el 1 de oct', estado: 'pagado' },
      { mes: 'Septiembre', texto: '$135 · pagado el 1 de sep', estado: 'pagado' },
    ],
    reportes: [],
  },
]

/* ---------- Reportes (H20–H22) ---------- */
export const REPORTES = {
  ducha: {
    id: 'ducha',
    estanciaId: 'marcela',
    titulo: 'La ducha no calienta',
    tipo: 'Mantenimiento',
    fecha: '10 de nov',
    meta: 'Marcela Pineda · Habitación pequeña · 10 de nov, 7:40 a. m.',
    texto: 'Desde ayer el agua de la ducha sale fría todo el tiempo. Ya revisé el interruptor del calentador y está encendido.',
    fotos: [fotoFachada, fotoSala],
    atendido: false,
    respuesta: '',
    pasos: [
      { titulo: 'Reportado', fecha: '10 de nov, 7:40 a. m.' },
      { titulo: 'Lo viste', fecha: '10 de nov, 8:15 a. m.' },
    ],
    cierre: '10 de nov, 9:02 a. m.',
  },
  ruido: {
    id: 'ruido',
    estanciaId: 'marcela',
    titulo: 'Ruido en la noche',
    tipo: 'Convivencia',
    fecha: '18 de sep',
    meta: 'Marcela Pineda · Habitación pequeña · 18 de sep, 11:20 p. m.',
    texto: 'Los vecinos tienen música muy alta después de las 11 p. m. y no me deja dormir. ¿Se puede hablar con ellos?',
    fotos: [],
    atendido: true,
    respuesta: 'Hola, Marcela. Ya hablé con los vecinos y quedaron en bajar el volumen después de las 10 p. m. Avísame si se repite.',
    pasos: [
      { titulo: 'Reportado', fecha: '18 de sep, 11:20 p. m.' },
      { titulo: 'Lo viste', fecha: '19 de sep, 7:05 a. m.' },
    ],
    cierre: '19 de sep, 9:30 a. m.',
  },
}

export const RESPUESTAS_RAPIDAS = ['Mañana viene el técnico', 'Ya lo revisé', '¿Me envías otra foto?']
export const RESPUESTA_SUGERIDA = 'Hola, Marcela. Mañana a las 10 a. m. viene el técnico a revisar el calentador. Disculpa la molestia.'

/* ---------- Historial (H18) ---------- */
export const HISTORIAL = [
  {
    mes: 'Octubre 2026',
    items: [
      { icon: 'group-fill', tono: 'gray', titulo: 'Rechazaste a Mario Alvarado', texto: 'Las fechas no coincidían · Cuarto privado', fecha: '28 oct' },
      { icon: 'calendar-fill', tono: 'amber', titulo: 'Lucía Pérez canceló su visita', texto: 'Cuarto con escritorio · 3:00 p. m.', fecha: '12 oct' },
    ],
  },
  {
    mes: 'Junio 2026',
    items: [
      { icon: 'home-solid', tono: 'blue', titulo: 'Terminó la estancia de Valeria Cruz', texto: 'Habitación pequeña · ago 2025 – jun 2026', fecha: '30 jun' },
      { icon: 'home-solid', tono: 'blue', titulo: 'Terminó la estancia de Paola Rivas', texto: 'Cuarto privado · ene – jun 2026', fecha: '30 jun' },
    ],
  },
]
