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
  {
    id: 'familia',
    titulo: 'Quad privado en casa de familia',
    precio: 115,
    foto: cuartoFamilia,
    fotos: [cuartoFamilia, fotoSala, fotoFachada],
    estado: 'publicado',
    datos: '48 vistas · 3 solicitudes',
    semana: '48 vistas esta semana',
    pausadoDesde: null,
    secciones: [
      { icon: 'bed-fill', titulo: 'Tipo de quad', texto: 'Quad privado · baño compartido' },
      { icon: 'check-circle-fill', titulo: 'Qué incluye', texto: 'Internet, agua, luz y lavandería' },
      { icon: 'shield-check-fill', titulo: 'Reglas de la casa', texto: '5 reglas · llegada antes de las 10 p. m.' },
      { icon: 'map-pin-fill', titulo: 'Ubicación', texto: 'Jardines de Guadalupe · 4 min a la Peatonal' },
      { icon: 'dollar-circle-fill', titulo: 'Precio y depósito', texto: '$115 al mes · depósito de $115' },
      { icon: 'calendar-fill', titulo: 'Disponibilidad', texto: 'Desde el 5 de enero de 2027' },
    ],
  },
  {
    id: 'escritorio',
    titulo: 'Quad con escritorio',
    precio: 130,
    foto: cuartoBalcon,
    fotos: [cuartoBalcon, fotoSala],
    estado: 'revision',
    datos: 'Lo revisamos en menos de 24 h',
    semana: 'En revisión · aún no aparece en Explorar',
    secciones: [
      { icon: 'bed-fill', titulo: 'Tipo de quad', texto: 'Quad privado · escritorio y balcón' },
      { icon: 'check-circle-fill', titulo: 'Qué incluye', texto: 'Internet, agua y luz' },
      { icon: 'shield-check-fill', titulo: 'Reglas de la casa', texto: '5 reglas · llegada antes de las 10 p. m.' },
      { icon: 'map-pin-fill', titulo: 'Ubicación', texto: 'Jardines de Guadalupe · 4 min a la Peatonal' },
      { icon: 'dollar-circle-fill', titulo: 'Precio y depósito', texto: '$130 al mes · depósito de $130' },
      { icon: 'calendar-fill', titulo: 'Disponibilidad', texto: 'Desde el 10 de enero de 2027' },
    ],
  },
  {
    id: 'pequena',
    titulo: 'Habitación pequeña',
    precio: 95,
    foto: casaTranquila,
    fotos: [casaTranquila, fotoFachada],
    estado: 'pausado',
    datos: 'Pausado desde el 2 de nov',
    semana: 'Pausado · no aparece en Explorar',
    secciones: [
      { icon: 'bed-fill', titulo: 'Tipo de quad', texto: 'Quad privado · baño compartido' },
      { icon: 'check-circle-fill', titulo: 'Qué incluye', texto: 'Internet, agua y luz' },
      { icon: 'shield-check-fill', titulo: 'Reglas de la casa', texto: '5 reglas · llegada antes de las 10 p. m.' },
      { icon: 'map-pin-fill', titulo: 'Ubicación', texto: 'Jardines de Guadalupe · 4 min a la Peatonal' },
      { icon: 'dollar-circle-fill', titulo: 'Precio y depósito', texto: '$95 al mes · depósito de $95' },
      { icon: 'calendar-fill', titulo: 'Disponibilidad', texto: 'Ocupado hasta el 15 de diciembre' },
    ],
  },
]

/* ---------- Destacar (Q06–Q08) ---------- */
export const PLANES = [
  { dias: 7, precio: 4.99, alcance: 'Hasta 2× más visitas' },
  { dias: 15, precio: 8.99, alcance: 'Hasta 3× más visitas', popular: true },
  { dias: 30, precio: 14.99, alcance: 'Hasta 4× más visitas' },
]
export const INCLUYE_DESTACADO = ['Apareces primero en Explorar y en el mapa', 'Etiqueta “Destacado” en tu quad', 'Reporte de vistas y guardados cada semana']
export const TARJETA = { nombre: 'Visa terminada en 4417', vence: 'Vence 08/28 · Toca para cambiar', corta: 'Visa •••• 4417' }

/* ---------- Perfil del anfitrión (P01–P08) ---------- */
export const PERFIL_HOST = {
  nombre: 'Andrea Martínez',
  desde: 'Anfitriona desde 2024',
  rating: 4.9,
  resenas: 12,
}

export const CUENTA_RETIRO = { banco: 'Banco Agrícola •••• 2231', detalle: 'Cuenta de ahorro · Andrea Martínez', corto: 'Banco Agrícola' }

export const MOVIMIENTOS = [
  { icon: 'dollar-circle-fill', tono: 'green', titulo: 'Pago de Marcela Pineda', texto: '1 de nov · Habitación pequeña', monto: 95 },
  { icon: 'dollar-circle-fill', tono: 'green', titulo: 'Pago de Karla Méndez', texto: '1 de oct · Quad con balcón', monto: 135 },
  { icon: 'star-fill', tono: 'gray', titulo: 'Quad destacado · 15 días', texto: '13 de nov · Visa •••• 4417', monto: -8.99 },
  { icon: 'dollar-circle-fill', tono: 'gray', titulo: 'Retiro a Banco Agrícola', texto: '15 de oct', monto: -300 },
]

export const VERIFICACION = [
  { titulo: 'Documento de identidad', texto: 'DUI · verificado el 3 de sep de 2024' },
  { titulo: 'Selfie de validación', texto: 'Coincide con tu documento' },
  { titulo: 'Teléfono', texto: '+503 •••• 4821' },
  { titulo: 'Correo', texto: 'andrea.m••••@gmail.com' },
]

export const RESENAS_RECIBIDAS = {
  promedio: 4.9,
  total: 12,
  barras: [
    [5, 10],
    [4, 2],
    [3, 0],
    [2, 0],
    [1, 0],
  ],
  lista: [
    { iniciales: 'VC', nombre: 'Valeria Cruz', carrera: 'Psicología · UCA', estancia: 'Vivió aquí 2 ciclos', texto: 'Andrea y su familia me hicieron sentir en casa. La cocina siempre estuvo disponible y respetaron mis horarios de estudio.' },
    { iniciales: 'PR', nombre: 'Paola Rivas', carrera: 'Ingeniería Civil · UCA', estancia: 'Vivió aquí 1 ciclo', texto: 'Casa muy tranquila y a minutos de la UCA. Las reglas son claras desde el inicio.' },
    { iniciales: 'GL', nombre: 'Gabriela López', carrera: 'Comunicaciones · UCA', estancia: 'Vivió aquí 1 ciclo', texto: 'Todo muy limpio y ordenado. Recomendado si buscas un lugar para concentrarte.' },
    { iniciales: 'LR', nombre: 'Lucía R.', carrera: 'Ingeniería Industrial · UCA', estancia: 'Vivió aquí 2 ciclos', texto: 'Doña Rosa siempre estuvo pendiente sin ser invasiva. Las reglas estaban claras desde el inicio, eso me dio mucha tranquilidad.' },
  ],
}

export const PERSONAS_CASA = [
  { id: 'rosa', iniciales: 'RM', nombre: 'Rosa Martínez', rol: 'Mamá · Anfitriona principal' },
  { id: 'carlos', iniciales: 'CM', nombre: 'Carlos Martínez', rol: 'Papá' },
  { id: 'andrea', iniciales: 'AM', nombre: 'Andrea Martínez', rol: 'Hija · Estudiante de Contaduría' },
]
export const MASCOTAS_CASA = [
  { id: 'perros', nombre: 'Perros', cantidad: 4 },
  { id: 'gatos', nombre: 'Gatos', cantidad: 1 },
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
    quadCorto: 'Quad privado',
    extracto: 'Hola, Andrea. Soy tranquila y ordenada, estudio casi todo el día…',
    pendiente: 'Quiere entrar el 5 de enero',
    datos: [
      ['Quad', 'Quad privado en casa de familia'],
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
    quadCorto: 'Quad con escritorio',
    extracto: 'Hola, me interesa el quad con escritorio. ¿Está disponible desde enero?',
    pendiente: 'Quiere entrar el 10 de enero',
    datos: [
      ['Quad', 'Quad con escritorio'],
      ['Ingreso', '10 de enero de 2027'],
      ['Duración', '1 ciclo · ciclo 01-2027'],
      ['Pago mensual', '$130'],
      ['Depósito', '$130'],
    ],
    mensaje: 'Hola, me interesa el quad con escritorio. ¿Está disponible desde enero? Vengo de San Miguel y busco un lugar tranquilo para estudiar, cerca de la UCA.',
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
    quadCorto: 'Quad privado',
    extracto: '¡Gracias por aceptarme! Quedo atenta al contrato.',
    datos: [
      ['Quad', 'Quad privado en casa de familia'],
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
  'El quad ya no está disponible',
  'Las fechas no coinciden',
  'No encaja con las reglas de la casa',
  'Otro motivo',
]

/* ---------- Visitas (H15–H16) ---------- */
export const VISITAS = [
  { id: 'carlos', dia: 'Hoy · lunes 9 de nov', hora: '4:00', ampm: 'p. m.', nombre: 'Carlos Rivas', quad: 'Quad con escritorio', confirmada: true, hoy: true },
  { id: 'sofia', dia: 'Miércoles 11 de nov', hora: '4:00', ampm: 'p. m.', nombre: 'Sofía Ramírez', corto: 'Sofía', quad: 'Quad privado en casa de familia', confirmada: false },
  { id: 'daniela', dia: 'Viernes 13 de nov', hora: '10:00', ampm: 'a. m.', nombre: 'Daniela Flores', quad: 'Quad con escritorio', confirmada: true },
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
    quad: 'Quad con balcón',
    contratoCorto: 'Contrato del 1 de sep al 31 de dic',
    pagoTexto: 'Venció el 1 de nov · $135',
    alDia: false,
    avance: 0.62,
    termina: 49,
    vencido: { titulo: 'El pago de noviembre venció hace 12 días', texto: '$135 · Le enviaremos un recordatorio amable de tu parte por la app.', mes: 'noviembre' },
    datos: [
      ['Quad', 'Quad con balcón'],
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
      { icon: 'group-fill', tono: 'gray', titulo: 'Rechazaste a Mario Alvarado', texto: 'Las fechas no coincidían · Quad privado', fecha: '28 oct' },
      { icon: 'calendar-fill', tono: 'amber', titulo: 'Lucía Pérez canceló su visita', texto: 'Quad con escritorio · 3:00 p. m.', fecha: '12 oct' },
    ],
  },
  {
    mes: 'Junio 2026',
    items: [
      { icon: 'home-solid', tono: 'blue', titulo: 'Terminó la estancia de Valeria Cruz', texto: 'Habitación pequeña · ago 2025 – jun 2026', fecha: '30 jun' },
      { icon: 'home-solid', tono: 'blue', titulo: 'Terminó la estancia de Paola Rivas', texto: 'Quad privado · ene – jun 2026', fecha: '30 jun' },
    ],
  },
]

/* ---------- Mensajes del anfitrión (M01–M08) ---------- */
export const FILTROS_MENSAJES_HOST = [
  { id: 'todos', label: 'Todos' },
  { id: 'no-leidos', label: 'No leídos' },
  { id: 'solicitudes', label: 'Solicitudes' },
  { id: 'visitas', label: 'Visitas' },
]

export const CHATS_HOST = [
  {
    id: 'sofia',
    nombre: 'Sofía Ramírez',
    corto: 'Sofía',
    foto: sofia,
    rol: 'Estudiante · Ingeniería Industrial · UCA',
    quadId: 'familia',
    quad: 'Quad privado en casa de familia',
    hora: '9:26 a. m.',
    noLeidos: 1,
    tipo: 'visita',
    mensajes: [
      { de: 'ella', texto: 'Hola, Andrea. ¿Puedo usar la cocina para hacerme la cena después de clases?', hora: '9:15 a. m.' },
      { de: 'yo', texto: 'Sí, la cocina es libre hasta las 9 p. m. y tendrías tu propia repisa en la refri.', hora: '9:20 a. m.' },
      { de: 'ella', texto: '¡Perfecto! ¿Puedo ir a conocer la casa antes de decidir?', hora: '9:21 a. m.' },
    ],
    visita: { visitaId: 'sofia', fecha: 'Mié 11 de nov · 4:00 p. m.' },
  },
  {
    id: 'daniela',
    nombre: 'Daniela Flores',
    corto: 'Daniela',
    iniciales: 'DF',
    rol: 'Estudiante · Psicología · UCA',
    quadId: 'escritorio',
    quad: 'Quad con escritorio',
    hora: '8:40 a. m.',
    noLeidos: 2,
    tipo: 'solicitud',
    mensajes: [
      { de: 'ella', texto: 'Hola, Andrea. Te envié una solicitud para el quad con escritorio.', hora: '8:38 a. m.' },
      { de: 'ella', texto: '¿Está disponible desde enero?', hora: '8:40 a. m.' },
    ],
  },
  {
    id: 'carlos',
    nombre: 'Carlos Rivas',
    corto: 'Carlos',
    iniciales: 'CR',
    rol: 'Estudiante · Ingeniería Civil · UCA',
    quadId: 'escritorio',
    quad: 'Quad con escritorio',
    hora: 'Ayer',
    noLeidos: 0,
    tipo: 'visita',
    mensajes: [
      { de: 'yo', texto: 'Hola, Carlos. Te confirmo la visita para el lunes 9 a las 4:00 p. m.', hora: 'Ayer' },
      { de: 'ella', texto: '¡Perfecto! Nos vemos el lunes a las 4.', hora: 'Ayer' },
    ],
  },
  {
    id: 'gabriela',
    nombre: 'Gabriela Torres',
    corto: 'Gabriela',
    iniciales: 'GT',
    rol: 'Estudiante · Arquitectura · UCA',
    quadId: 'familia',
    quad: 'Quad privado en casa de familia',
    hora: 'Lun',
    noLeidos: 0,
    tipo: 'solicitud',
    mensajes: [
      { de: 'ella', texto: '¡Gracias por aceptarme! Quedo atenta al contrato.', hora: 'Lun' },
      { de: 'yo', texto: 'Te envío el contrato mañana.', hora: 'Lun' },
    ],
  },
  {
    id: 'marcela',
    nombre: 'Marcela Pineda',
    corto: 'Marcela',
    iniciales: 'MP',
    rol: 'Inquilina · Psicología · UCA',
    quadId: 'pequena',
    quad: 'Habitación pequeña · inquilina',
    hora: '2 nov',
    noLeidos: 0,
    tipo: 'inquilina',
    mensajes: [
      { de: 'yo', texto: 'Hola, Marcela. Te recuerdo que el pago de noviembre es el día 1.', hora: '31 oct' },
      { de: 'ella', texto: 'Ya hice el pago de noviembre 🙌', hora: '2 nov' },
    ],
  },
]

export const RESPUESTAS_GUARDADAS = [
  { titulo: 'Horarios de visita', texto: 'Las visitas son de lunes a sábado, de 9 a. m. a 6 p. m.' },
  { titulo: 'Cómo llegar', texto: 'Estamos a 4 minutos caminando del portón peatonal de la UCA.' },
  { titulo: 'Requisitos', texto: 'Pido tu carné de la universidad y un depósito igual a un mes.' },
]
export const RESPUESTAS_RAPIDAS_CHAT = [
  { label: '¡Claro que sí!', texto: '¡Claro que sí!' },
  { label: 'Te comparto cómo llegar', texto: 'Estamos a 4 minutos caminando del portón peatonal de la UCA. Te comparto la ubicación por aquí.' },
  { label: 'Horarios de visita', texto: 'Las visitas son de lunes a sábado, de 9 a. m. a 6 p. m.' },
]
