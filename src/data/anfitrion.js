/**
 * Datos del onboarding de anfitrión (sección "Onboarding · Anfitrión" en Figma).
 * Parte 1 (n/12): perfil y verificación del anfitrión.
 * Parte 2 (n/9): publicar el cuarto (quad).
 * El estado inicial reproduce los valores que muestra Figma.
 */
export { UNIVERSIDADES } from './estudiante.js'

/* ---------- Pasos ---------- */
export const PASOS = [
  // Parte 1 · Perfil (12)
  { id: 'tipo', paso: 1, total: 12 },
  { id: 'identidad', paso: 2, total: 12 },
  { id: 'selfie', paso: 3, total: 12 },
  { id: 'revisar-selfie', paso: 3, total: 12 },
  { id: 'telefono', paso: 4, total: 12 },
  { id: 'codigo', paso: 5, total: 12 },
  { id: 'casa', paso: 6, total: 12 },
  { id: 'familia', paso: 7, total: 12 },
  { id: 'ambiente', paso: 8, total: 12 },
  { id: 'presentacion', paso: 9, total: 12 },
  { id: 'privacidad', paso: 10, total: 12 },
  { id: 'universidades', paso: 11, total: 12 },
  { id: 'perfil-listo', paso: 12, total: 12 },
  // Parte 2 · Publicar el quad (9)
  { id: 'fotos', paso: 1, total: 9 },
  { id: 'cuarto', paso: 2, total: 9 },
  { id: 'incluye', paso: 3, total: 9 },
  { id: 'reglas', paso: 4, total: 9 },
  { id: 'ubicacion', paso: 5, total: 9 },
  { id: 'precio', paso: 6, total: 9 },
  { id: 'disponibilidad', paso: 7, total: 9 },
  { id: 'casi-listo', paso: 8, total: 9 },
  { id: 'vista-previa', paso: 8, total: 9, pantallaCompleta: true },
  { id: 'cobro', paso: 9, total: 9 },
  { id: 'revision', paso: 9, total: 9, sinBarra: true },
]

/* ---------- A01 · Cómo ofreces tu espacio ---------- */
export const TIPOS_ANFITRION = [
  { id: 'familia', titulo: 'Familia anfitriona', desc: 'Rentas uno o más cuartos dentro de tu casa', icon: 'group', iconSel: 'group-fill' },
  { id: 'estudiante', titulo: 'Estudiante con cuarto libre', desc: 'Compartes tu casa o apartamento con otro universitario', icon: 'user', iconSel: 'user-solid' },
  { id: 'propietario', titulo: 'Propietario', desc: 'Tienes cuartos o un edificio pensado para estudiantes', icon: 'home', iconSel: 'home-solid' },
]

/* ---------- A02 · Documento ---------- */
export const DOCUMENTOS = [
  { id: 'dui', label: 'DUI' },
  { id: 'pasaporte', label: 'Pasaporte' },
  { id: 'residente', label: 'Carné de residente' },
]

/* ---------- A07 · Familia ---------- */
export const PARENTESCOS = [
  { id: 'mama', label: 'Mamá', icon: 'female', iconSel: 'female-fill' },
  { id: 'papa', label: 'Papá', icon: 'user', iconSel: 'user-solid' },
  { id: 'hermana', label: 'Hermana', icon: 'female', iconSel: 'female-fill' },
  { id: 'hermano', label: 'Hermano', icon: 'user', iconSel: 'user-solid' },
  { id: 'hija', label: 'Hija', icon: 'female', iconSel: 'female-fill' },
  { id: 'hijo', label: 'Hijo', icon: 'user', iconSel: 'user-solid' },
  { id: 'abuela', label: 'Abuela', icon: 'female', iconSel: 'female-fill' },
  { id: 'abuelo', label: 'Abuelo', icon: 'user', iconSel: 'user-solid' },
  { id: 'tia', label: 'Tía', icon: 'female', iconSel: 'female-fill' },
  { id: 'tio', label: 'Tío', icon: 'user', iconSel: 'user-solid' },
  { id: 'prima', label: 'Prima', icon: 'female', iconSel: 'female-fill' },
  { id: 'primo', label: 'Primo', icon: 'user', iconSel: 'user-solid' },
  { id: 'otro', label: 'Otro familiar', icon: 'group', iconSel: 'group-fill' },
]

export const MASCOTAS = [
  { id: 'perro', label: 'Perro', plural: 'Perros', singular: 'perro' },
  { id: 'gato', label: 'Gato', plural: 'Gatos', singular: 'gato' },
  { id: 'ave', label: 'Ave', plural: 'Aves', singular: 'ave' },
  { id: 'pez', label: 'Pez', plural: 'Peces', singular: 'pez' },
  { id: 'conejo', label: 'Conejo', plural: 'Conejos', singular: 'conejo' },
  { id: 'otro', label: 'Otro', plural: 'Otras mascotas', singular: 'mascota' },
]

/* ---------- A08 · Vivir en tu casa ---------- */
export const VIDA_EN_CASA = [
  {
    titulo: 'Ambiente',
    items: [
      { id: 'tranquilo', label: 'Ambiente tranquilo', icon: 'moon-fill' },
      { id: 'ninos', label: 'Casa con niños', icon: 'group', iconSel: 'group-fill' },
      { id: 'musica', label: 'Música a volumen bajo', icon: 'hero-musical-note', iconSel: 'hero-musical-note-solid' },
      { id: 'horarios', label: 'Respetamos horarios de estudio', icon: 'clock', iconSel: 'clock-fill' },
      { id: 'familiar', label: 'Ambiente familiar', icon: 'heart', iconSel: 'heart-solid' },
      { id: 'social', label: 'Ambiente social', icon: 'community', iconSel: 'community-fill' },
      { id: 'teletrabajo', label: 'Trabajo desde casa', icon: 'hero-computer-desktop', iconSel: 'hero-computer-desktop-solid' },
      { id: 'mayores', label: 'Casa con adultos mayores', icon: 'user', iconSel: 'user-solid' },
      { id: 'ingles', label: 'Se habla inglés', icon: 'hero-language', iconSel: 'hero-language-solid' },
      { id: 'ordenado', label: 'Ambiente ordenado', icon: 'sparks', iconSel: 'hero-sparkles-solid' },
      { id: 'mascotas', label: 'Casa con mascotas', icon: 'paw-fill' },
      { id: 'sin-ruido', label: 'Sin ruido de noche', icon: 'moon-fill' },
    ],
  },
  {
    titulo: 'Costumbres',
    items: [
      { id: 'almuerzo', label: 'Almorzamos juntos los domingos', icon: 'cutlery', iconSel: 'cutlery-fill' },
      { id: 'cocina-propia', label: 'Cada quien cocina lo suyo', icon: 'cutlery', iconSel: 'cutlery-fill' },
      { id: 'no-fumar', label: 'No se fuma', icon: 'no-smoking-fill' },
      { id: 'visitas', label: 'Se permiten visitas', icon: 'group', iconSel: 'group-fill' },
      { id: 'cena', label: 'Cenamos juntos', icon: 'cutlery', iconSel: 'cutlery-fill' },
      { id: 'limpieza', label: 'Turnos de limpieza', icon: 'sparks', iconSel: 'hero-sparkles-solid' },
      { id: 'no-fiestas', label: 'No se permiten fiestas', icon: 'bell', iconSel: 'hero-bell-solid' },
      { id: 'lavanderia', label: 'Lavandería compartida', icon: 'washing-machine', iconSel: 'washing-fill' },
      { id: 'wifi', label: 'Wi‑Fi compartido', icon: 'wifi', iconSel: 'wifi-fill' },
      { id: 'areas', label: 'Cuidamos las áreas comunes', icon: 'home', iconSel: 'home-solid' },
      { id: 'reciclaje', label: 'Reciclamos', icon: 'hero-globe-americas', iconSel: 'hero-globe-americas-solid' },
      { id: 'privacidad', label: 'Respetamos la privacidad', icon: 'shield-check', iconSel: 'shield-check-fill' },
    ],
  },
]

/* ---------- A10 · Qué se muestra ---------- */
export const PRIVACIDAD = [
  { id: 'familia', icon: 'group-fill', titulo: 'Quiénes viven aquí', desc: 'Nombres y parentesco de la familia' },
  { id: 'fotos', icon: 'hero-photo-solid', titulo: 'Fotos de la familia', desc: 'Solo se ven después de aceptar una solicitud' },
  { id: 'ocupacion', icon: 'user-solid', titulo: 'Ocupación del anfitrión', desc: 'Ej. Trabaja desde casa' },
  { id: 'contacto', icon: 'chat-bubble-solid', titulo: 'Contacto de exinquilinos', desc: 'Que futuros estudiantes puedan escribirles' },
]

/* ---------- A11 · Distancias a cada campus ---------- */
export const DISTANCIAS = {
  uca: '8 min caminando al portón peatonal',
  ues: '15 min en bus',
  ufg: '20 min en bus',
  esen: '30 min en carro',
}

/* ---------- A12 · Ten a la mano ---------- */
export const TEN_A_LA_MANO = [
  '5 fotos o más del cuarto y áreas comunes',
  'Precio mensual y depósito',
  'Reglas de la casa',
  'Fecha desde la que está libre',
]

/* ---------- A14 · Tipo de cuarto ---------- */
export const TIPOS_CUARTO = [
  { id: 'privado', titulo: 'Cuarto privado', desc: 'Solo para un estudiante', icon: 'bed', iconSel: 'bed-fill' },
  { id: 'compartido', titulo: 'Cuarto compartido', desc: 'Dos o más estudiantes en el mismo cuarto', icon: 'community', iconSel: 'community-fill' },
  { id: 'anexo', titulo: 'Anexo independiente', desc: 'Entrada propia dentro de la propiedad', icon: 'home', iconSel: 'home-solid' },
]

/* ---------- A15 · Qué incluye ---------- */
export const INCLUYE = [
  {
    titulo: 'Mobiliario',
    items: [
      { id: 'cama', label: 'Cama', icon: 'bed', iconSel: 'bed-fill' },
      { id: 'closet', label: 'Clóset', icon: 'hero-archive-box', iconSel: 'hero-archive-box-solid' },
      { id: 'escritorio', label: 'Escritorio', icon: 'hero-computer-desktop', iconSel: 'hero-computer-desktop-solid' },
      { id: 'silla', label: 'Silla', icon: 'user', iconSel: 'user-solid' },
      { id: 'ventilador', label: 'Ventilador', icon: 'hero-cloud', iconSel: 'hero-cloud-solid' },
      { id: 'aire', label: 'Aire acondicionado', icon: 'sparks', iconSel: 'hero-sparkles-solid' },
    ],
  },
  {
    titulo: 'Servicios',
    items: [
      { id: 'wifi', label: 'Wi‑Fi', icon: 'wifi', iconSel: 'wifi-fill' },
      { id: 'agua-luz', label: 'Agua y luz', icon: 'hero-bolt', iconSel: 'hero-bolt-solid' },
      { id: 'lavanderia', label: 'Lavandería', icon: 'washing-machine', iconSel: 'washing-fill' },
      { id: 'cocina', label: 'Uso de cocina', icon: 'cutlery', iconSel: 'cutlery-fill' },
      { id: 'limpieza', label: 'Limpieza de áreas comunes', icon: 'sparks', iconSel: 'hero-sparkles-solid' },
    ],
  },
]

export const BANOS = [
  { id: 'privado', label: 'Privado' },
  { id: 'compartido', label: 'Compartido' },
]

/* ---------- A16b · Tipos de regla ---------- */
export const TIPOS_REGLA = [
  { id: 'llegada', label: 'Hora de llegada', icon: 'clock-fill' },
  { id: 'visitas', label: 'Visitas', icon: 'group-fill' },
  { id: 'cocina', label: 'Uso de cocina', icon: 'cutlery-fill' },
  { id: 'convivencia', label: 'Convivencia', icon: 'home-solid' },
  { id: 'mascotas', label: 'Mascotas', icon: 'paw-fill', ejemplo: 'Ej. Se permiten gatos con aviso previo' },
  { id: 'fumar', label: 'Fumar', icon: 'no-smoking-fill', ejemplo: 'Ej. Solo en el patio' },
  { id: 'ruido', label: 'Ruido y música', icon: 'hero-musical-note-solid', ejemplo: 'Ej. Volumen bajo después de las 9:00 p. m.' },
  { id: 'lavanderia', label: 'Lavandería', icon: 'washing-fill', ejemplo: 'Ej. Martes y sábados por la mañana' },
  { id: 'wifi', label: 'Wi‑Fi', icon: 'wifi-fill', ejemplo: 'Ej. Se apaga a la medianoche' },
  { id: 'areas', label: 'Áreas comunes', icon: 'community-fill', ejemplo: 'Ej. Cada quien lava sus platos' },
  { id: 'estacionamiento', label: 'Estacionamiento', icon: 'car-fill', ejemplo: 'Ej. Espacio para una moto' },
  { id: 'otra', label: 'Otra regla', icon: 'hero-sparkles-solid', ejemplo: 'Describe la regla con tus palabras' },
]

export const MODOS_VISITA = [
  { id: 'no', titulo: 'No se permiten visitas', desc: 'Solo viven quienes están en el contrato', icon: 'home', iconSel: 'home-solid' },
  { id: 'comunes', titulo: 'Solo en áreas comunes', desc: 'Sala o patio, sin entrar al cuarto', icon: 'group', iconSel: 'group-fill' },
  { id: 'cuarto', titulo: 'También en el cuarto', desc: 'Con aviso previo a la familia', icon: 'bed', iconSel: 'bed-fill' },
]

export const NORMAS_CONVIVENCIA = [
  { id: 'fumar', icon: 'no-smoking-fill', titulo: 'No se fuma dentro de la casa', desc: 'Humo y vapeo' },
  { id: 'fiestas', icon: 'hero-musical-note-solid', titulo: 'No se permiten fiestas', desc: 'Reuniones grandes o con ruido' },
  { id: 'silencio', icon: 'hero-bell-solid', titulo: 'Silencio después de las 10:00 p. m.', desc: 'Música y llamadas a volumen bajo' },
  { id: 'mascotas', icon: 'paw-fill', titulo: 'No se permiten mascotas de estudiantes', desc: 'Solo las de la familia' },
]

/* ---------- A18 / A19 ---------- */
export const DEPOSITOS = [
  { id: '0', label: 'Sin depósito', corto: 'Sin depósito' },
  { id: '1', label: '1 mes', corto: '1 mes' },
  { id: '2', label: '2 meses', corto: '2 meses' },
]
export const COMISION = 0.08

export const ESTANCIAS = [
  { id: 'ciclo', label: '1 ciclo' },
  { id: '6m', label: '6 meses' },
  { id: '1a', label: '1 año' },
  { id: 'libre', label: 'Sin mínimo' },
]

/* ---------- A21 · Bancos ---------- */
export const BANCOS = [
  'Banco Agrícola',
  'Banco Cuscatlán',
  'BAC Credomatic',
  'Banco Davivienda',
  'Banco Promerica',
  'Banco Hipotecario',
  'Banco Azul',
  'Banco Atlántida',
]

/* ---------- Estado inicial (valores de Figma) ---------- */
export const ANFITRION_INICIAL = {
  tipo: 'familia',
  documento: 'dui',
  docFrente: null,
  docReverso: null,
  selfie: null,
  telefono: '',
  nombreCasa: '',
  zona: '',
  descripcion: '',
  personas: [
    { id: 'p1', nombre: 'Rosa Martínez', parentesco: 'mama', principal: true, foto: null, rol: 'Anfitriona principal' },
    { id: 'p2', nombre: 'Carlos Martínez', parentesco: 'papa', principal: false, foto: null },
    { id: 'p3', nombre: 'Andrea Martínez', parentesco: 'hija', principal: false, foto: null, rol: 'Estudiante de Contaduría' },
  ],
  mascotas: [
    { id: 'perro', cantidad: 4, detalle: '' },
    { id: 'gato', cantidad: 1, detalle: '' },
  ],
  vida: ['tranquilo', 'musica', 'horarios', 'almuerzo', 'no-fumar'],
  vidaExtra: [],
  presentacion: '',
  fotoAnfitrion: null,
  privacidad: { familia: true, fotos: false, ocupacion: true, contacto: true },
  universidades: ['uca', 'ues'],
  publicar: 'ahora',
  fotos: [
    { id: 'f1', url: null },
    { id: 'f2', url: null },
  ],
  cuarto: 'privado',
  capacidad: 1,
  incluye: ['cama', 'closet', 'escritorio', 'ventilador', 'wifi', 'agua-luz', 'lavanderia', 'cocina'],
  bano: 'compartido',
  reglas: {
    llegada: { hora: '22:00', aviso: true },
    visitas: { modo: 'comunes', hasta: '20:00' },
    cocina: { desde: '06:00', hasta: '21:00', guardar: true, noche: false },
    convivencia: { fumar: true, fiestas: true, silencio: false, mascotas: false },
  },
  reglasActivas: ['llegada', 'visitas', 'cocina', 'convivencia'],
  reglasExtra: [],
  direccion: 'Calle Los Pinos #12, Jardines de Guadalupe',
  precio: 115,
  deposito: '1',
  serviciosIncluidos: true,
  desde: '2027-01-15',
  estancia: 'ciclo',
  cortas: false,
  renovacion: true,
  banco: '',
  titular: '',
  cuenta: '',
}

/* ---------- Ayudantes ---------- */
export const buscar = (lista, id) => lista.find((x) => x.id === id)

/** "22:00" → "10:00 p. m." (formato de Figma). */
export function hora12(valor) {
  if (!valor) return ''
  const [h, m] = valor.split(':').map(Number)
  const sufijo = h >= 12 ? 'p. m.' : 'a. m.'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(m).padStart(2, '0')} ${sufijo}`
}

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
/** "2027-01-15" → "15 de enero de 2027". */
export function fechaLarga(iso) {
  if (!iso) return ''
  const [a, m, d] = iso.split('-').map(Number)
  return `${d} de ${MESES[m - 1]} de ${a}`
}

export const dinero = (n) => `$${n.toFixed(2)}`

/** Iniciales para el avatar: "Rosa Martínez" → "RM". */
export const iniciales = (nombre) =>
  nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('')

/** Descripción corta de cada regla (A16 y vista previa A20). */
export function describirRegla(id, r, extra) {
  switch (id) {
    case 'llegada':
      return {
        titulo: 'Hora de llegada',
        corta: `Hasta las ${hora12(r.llegada.hora)}${r.llegada.aviso ? ', avisando si llegas tarde' : ''}`,
        larga: `Hasta las ${hora12(r.llegada.hora)}.${r.llegada.aviso ? ' Si llegas más tarde, avisas.' : ''}`,
      }
    case 'visitas': {
      const v = r.visitas
      const corta =
        v.modo === 'no'
          ? 'No se permiten visitas'
          : v.modo === 'comunes'
            ? `En la sala, hasta las ${hora12(v.hasta)}`
            : `También en el cuarto, hasta las ${hora12(v.hasta)}`
      const larga =
        v.modo === 'no'
          ? 'No se permiten visitas.'
          : v.modo === 'comunes'
            ? `Permitidas en la sala hasta las ${hora12(v.hasta)}.`
            : `Permitidas también en el cuarto, con aviso, hasta las ${hora12(v.hasta)}.`
      return { titulo: 'Visitas', corta, larga }
    }
    case 'cocina':
      return {
        titulo: 'Uso de cocina',
        tituloCorto: 'Cocina',
        corta: `De ${hora12(r.cocina.desde)} a ${hora12(r.cocina.hasta)}`,
        larga: `Libre de ${hora12(r.cocina.desde)} a ${hora12(r.cocina.hasta)}.`,
      }
    case 'convivencia': {
      const activas = NORMAS_CONVIVENCIA.filter((n) => r.convivencia[n.id]).map((n) => n.titulo)
      return {
        titulo: 'Convivencia',
        corta: activas[0] || 'Sin normas especiales',
        larga: activas.length ? activas.map((t) => `${t}.`).join(' ') : 'Sin normas especiales.',
      }
    }
    default:
      return { titulo: extra?.titulo, corta: extra?.texto, larga: extra?.texto }
  }
}
