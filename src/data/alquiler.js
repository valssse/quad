/**
 * Flujo de alquiler (R01–R28): visita, solicitud, respuesta, contrato, pago,
 * llegada, estancia activa y cierre. Todo es simulado en memoria.
 *
 * Supuestos por validar (vienen de Figma): 48 horas para responder o firmar,
 * depósito en resguardo de Quad, aviso de salida con 30 días y comisión de $0.
 */
import { quad as buscarQuad } from './quads.js'
import { detalle } from './detalle.js'

/** Quad y anfitriona del flujo de ejemplo (Andrea · casa de familia). */
export const QUAD_ID = 'familia'
export const quadAlquiler = () => buscarQuad(QUAD_ID)
export const anfitriona = () => detalle(quadAlquiler()).anfitrion

/** Pasos en orden: sirve para saber si la transición va hacia adelante o atrás. */
export const PASOS_ALQUILER = [
  'visita', 'recordatorio', 'visita-realizada',
  'solicitud', 'costos', 'enviada',
  'rechazada', 'mas-info', 'aceptada', 'contrato', 'esperando-firma', 'firmado',
  'metodo', 'pagar', 'comprobante', 'apartado', 'pendientes',
  'estancia', 'pagar-mes', 'recibo', 'reportar', 'reporte-enviado',
  'renovar', 'nuevo-contrato', 'salida', 'deposito', 'resena', 'completada',
]

/** Título de la barra superior de cada paso. */
export const TITULOS = {
  visita: 'Visita', recordatorio: 'Visita', 'visita-realizada': 'Visita',
  solicitud: 'Solicitud', costos: 'Solicitud', enviada: 'Solicitud',
  rechazada: 'Solicitud', 'mas-info': 'Solicitud', aceptada: 'Solicitud',
  contrato: 'Contrato', 'esperando-firma': 'Contrato', firmado: 'Contrato',
  metodo: 'Pago', pagar: 'Pago', comprobante: 'Comprobante', apartado: 'Pago',
  pendientes: 'Antes de llegar', estancia: 'Mi estancia', 'pagar-mes': 'Pagar mes', recibo: 'Recibo',
  reportar: 'Reportar', 'reporte-enviado': 'Reportar', renovar: 'Renovar', 'nuevo-contrato': 'Renovar',
  salida: 'Aviso de salida', deposito: 'Depósito', resena: 'Reseña', completada: 'Estancia',
}

/* ---------- R01–R03 · Visita ---------- */
export const VISITA = {
  fechaLarga: 'el sábado 7 de noviembre a las 10:00 a. m.',
  fecha: 'Sáb 7 de nov',
  hora: '10:00 a. m.',
  direccion: 'Col. Jardines de Guadalupe',
  duracion: '30 min aprox.',
}

export const QUE_REVISAR = [
  { id: 'quad', titulo: 'El quad y el clóset', texto: 'Espacio, luz y ventilación' },
  { id: 'bano', titulo: 'Baño y agua caliente', texto: 'Pregunta si es compartido' },
  { id: 'wifi', titulo: 'Señal de wifi', texto: 'Pruébala desde el quad' },
  { id: 'reglas', titulo: 'Reglas y horarios', texto: 'Llegada, visitas y cocina' },
  { id: 'ruta', titulo: 'Ruta a la UCA', texto: 'Tiempo a pie o en bus' },
]

export const DESPUES_DE_VISITA = [
  { id: 'solicitar', icon: 'home-solid', titulo: 'Quiero solicitarlo', texto: (a) => `Enviar mi solicitud a ${a}` },
  { id: 'preguntas', icon: 'chat-bubble-solid', titulo: 'Tengo más preguntas', texto: () => 'Volver a la conversación' },
  { id: 'buscar', icon: 'search', titulo: 'Seguir buscando', texto: () => 'Ver otros quads cerca de la UCA' },
]

/* ---------- R04–R06 · Solicitud ---------- */
export const MENSAJE_SUGERIDO =
  'Hola, Andrea. Me encantó el quad y la casa. Soy tranquila, estudio de noche y casi no cocino. ¿Me lo podrías reservar desde el 1 de diciembre?'

export const FECHAS_SOLICITUD = [
  ['Llegada', '1 de dic 2026'],
  ['Duración', '6 meses · hasta 31 may 2027'],
]

export const COSTOS_AL_FIRMAR = [
  ['Primer mes (diciembre)', '$135'],
  ['Depósito reembolsable', '$135'],
  ['Comisión de Quad', '$0'],
]
export const TOTAL_INICIAL = 270

export const COSTOS_MENSUALES = [
  ['Mensualidad', '$135 · cada día 1'],
  ['Incluye', 'Agua, luz y wifi'],
]

/* ---------- R07–R12 · Respuesta y contrato ---------- */
export const PARECIDOS = [
  { id: 'bano-propio', titulo: 'Cuarto con ventana al jardín · La Sultana', precio: '$110/mes' },
  { id: 'madreselva', titulo: 'Suite con baño privado y jardín · Santa Elena', precio: '$175/mes' },
]

export const PREGUNTA_ANFITRIONA =
  '¿Podrías contarme a qué hora sueles llegar entre semana? Cerramos el portón a las 10:00 p. m.'

export const CONDICIONES = [
  ['Vigencia', '1 dic 2026 – 31 may 2027'],
  ['Mensualidad', '$135 · cada día 1'],
  ['Depósito', '$135 · reembolsable'],
  ['Aviso de salida', '30 días antes'],
]

export const REGLAS_CONTRATO = [
  ['Llegada', 'Antes de las 10:00 p. m.'],
  ['Visitas', 'Solo en áreas comunes'],
  ['Cocina', 'Hasta las 9:00 p. m.'],
]

/* ---------- R13–R17 · Pago y llegada ---------- */
export const METODOS_PAGO = [
  { id: 'tarjeta', icon: 'dollar-circle-fill', titulo: 'Tarjeta de débito o crédito', texto: 'Visa o Mastercard · se acredita al instante' },
  { id: 'transferencia', icon: 'home-solid', titulo: 'Transferencia bancaria', texto: 'Desde tu banca en línea · 1 día hábil' },
  { id: 'efectivo', icon: 'map-pin-fill', titulo: 'Efectivo en agente', texto: 'En agentes y cajas autorizadas' },
]

/** Cómo se muestra cada método en las pantallas de pago. */
export const METODO_RESUMEN = {
  tarjeta: { marca: 'VISA', titulo: 'Visa •••• 4242', texto: 'Débito · vence 08/29', corto: 'Visa •••• 4242' },
  transferencia: { marca: 'BANCO', titulo: 'Transferencia bancaria', texto: 'Se acredita en 1 día hábil', corto: 'Transferencia' },
  efectivo: { marca: 'EFECT.', titulo: 'Efectivo en agente', texto: 'Código de pago válido 48 h', corto: 'Efectivo' },
}

export const DETALLE_PAGO_INICIAL = [
  ['Primer mes (diciembre)', '$135.00'],
  ['Depósito reembolsable', '$135.00'],
  ['Comisión de Quad', '$0.00'],
]

export const LLEGADA = [
  ['Fecha', 'Mar 1 de dic 2026'],
  ['Dirección', 'Col. Jardines de Guadalupe'],
  ['Contacto', 'Andrea Martínez'],
]

/** R17 · Pendientes antes de llegar: 3 de 6 listos al empezar. */
export const PENDIENTES = [
  { id: 'hora', titulo: 'Confirmar hora de llegada', texto: 'Avísale a Andrea a qué hora llegas' },
  { id: 'incluye', titulo: 'Revisar qué incluye el quad', texto: 'Cama, clóset, escritorio y wifi' },
  { id: 'documento', titulo: 'Llevar documento de identidad', texto: 'Andrea lo verificará al entregarte la llave' },
  { id: 'contrato', titulo: 'Contrato firmado' },
  { id: 'pago', titulo: 'Pago del depósito y primer mes' },
  { id: 'emergencia', titulo: 'Contacto de emergencia' },
]
export const PENDIENTES_LISTOS = ['contrato', 'pago', 'emergencia']

/* ---------- R18–R26 · Estancia activa ---------- */
export const ACCIONES_ESTANCIA = [
  { id: 'recibo', icon: 'dollar-circle-fill', titulo: 'Pagos y recibos', texto: 'Historial y comprobantes' },
  { id: 'reportar', icon: 'info-circle-fill', titulo: 'Reportar un problema', texto: 'Agua, luz, wifi, convivencia' },
  { id: 'renovar', icon: 'calendar-fill', titulo: 'Renovar estancia', texto: 'Quédate otro ciclo' },
  { id: 'salida', icon: 'home-solid', titulo: 'Dar aviso de salida', texto: 'Avisa 30 días antes' },
]

export const CATEGORIAS_REPORTE = ['Agua', 'Luz', 'Wifi', 'Limpieza', 'Ruido', 'Convivencia', 'Otro']
export const REPORTE_EJEMPLO = 'La ducha no calienta desde ayer en la mañana.'

export const RENOVACIONES = [
  { id: 'ciclo', titulo: '1 ciclo · 6 meses', texto: '1 jun – 30 nov 2027', hasta: '30 de noviembre de 2027', vigencia: '1 jun – 30 nov 2027' },
  { id: 'tres', titulo: '3 meses', texto: '1 jun – 31 ago 2027', hasta: '31 de agosto de 2027', vigencia: '1 jun – 31 ago 2027' },
  { id: 'anio', titulo: '1 año', texto: '1 jun 2027 – 31 may 2028', hasta: '31 de mayo de 2028', vigencia: '1 jun 2027 – 31 may 2028' },
]

export const MOTIVOS_SALIDA = ['Terminé el ciclo', 'Me mudo de ciudad', 'Encontré otro lugar', 'Otro']
export const MENSAJE_SALIDA = '¡Gracias por todo, Andrea! Fue un gusto vivir con ustedes este ciclo.'

/* ---------- R27–R28 · Cierre ---------- */
export const ETIQUETAS_ESTRELLAS = ['Muy mala', 'Mala', 'Regular', 'Buena', 'Excelente']
export const LO_QUE_GUSTO = ['Limpieza', 'Buena convivencia', 'Respeto a mi espacio', 'Ubicación', 'Comunicación']
export const RESENA_EJEMPLO =
  'Andrea y su familia fueron muy amables. La casa siempre estaba limpia y a 8 minutos del portón peatonal.'

/** Estado inicial del alquiler (en memoria). */
export const ALQUILER_INICIAL = {
  visitaAgregada: false,
  solicitud: null, // null | 'enviada' | 'aceptada'
  respuestaEn: null,
  contratoFirmado: false,
  anfitrionaFirmo: false,
  metodo: 'tarjeta',
  pagado: false,
  pendientes: PENDIENTES_LISTOS,
  pagosMes: [], // meses pagados durante la estancia
  reporte: null,
  renovacion: null,
  salida: null,
  resena: null,
}
