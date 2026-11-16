/**
 * Detalle de cada quad (sección "Detalle del Quad" en Figma):
 * 03 Detalle · 04 Perfil de la casa · 05 Conversación · 06 Proponer otra fecha.
 *
 * El quad "familia" usa los textos y fotos del Figma (Casa Martínez).
 * Los demás tienen su propia casa, familia y reglas; las fotos de las personas,
 * mascotas y espacios vienen de Unsplash (licencia Unsplash, uso libre).
 */
import casaMartinez from '../assets/detalle/casa-martinez.jpg'
import rosa from '../assets/detalle/rosa.jpg'
import carlos from '../assets/detalle/carlos.jpg'
import toby from '../assets/detalle/toby.jpg'
import andrea from '../assets/personas/andrea.jpg'

/** Foto de Unsplash recortada (las caras quedan centradas en los avatares). */
const u = (id, w = 160, h = w, caras = true) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop${caras ? '&crop=faces' : ''}&auto=format&q=70`
const espacio = (id) => u(id, 780, 640, false)

/* Espacios para las galerías (Unsplash) */
const E = {
  cuarto1: espacio('1615874959474-d609969a20ed'),
  cuarto2: espacio('1522771739844-6a9f6d5f14af'),
  cuarto3: espacio('1765464184843-105e144bd54b'),
  cuarto4: espacio('1541004995602-b3e898709909'),
  cuarto5: espacio('1781249144056-ec397e444dfa'),
  cuarto6: espacio('1734599505058-6653a0d8d3ff'),
  cocina1: espacio('1556911220-bff31c812dba'),
  cocina2: espacio('1484154218962-a197022b5858'),
  cocina3: espacio('1565538810643-b5bdb714032a'),
  cocina4: espacio('1628797285815-453c1d0d21e3'),
  cocina5: espacio('1757387240036-d7eb9b096c40'),
  bano1: espacio('1628602813485-4e8b09442e98'),
  bano2: espacio('1564540579594-0930edb6de43'),
  bano3: espacio('1668910227848-8b604673e051'),
  bano4: espacio('1560448075-bb485b067938'),
  sala1: espacio('1641232458416-feace752b346'),
  sala2: espacio('1632119580908-ae947d4c7691'),
  sala3: espacio('1770736158887-9a0f3702416e'),
  sala4: espacio('1774199679021-db3b421867c3'),
  sala5: espacio('1651407825801-eec2dcbd86bd'),
  fachada1: espacio('1773861540606-e5df23583620'),
  fachada2: espacio('1760726299430-ec5a2513acb3'),
  fachada3: espacio('1780094188572-05986dce64e3'),
  fachada4: espacio('1775531575244-4c3081ae756b'),
  fachada5: espacio('1773859891703-bbfb32dc3827'),
  lavado1: espacio('1626806819282-2c1dc01a5e0c'),
  lavado2: espacio('1626806787461-102c1bfaaea1'),
  lavado3: espacio('1688302740525-021cd48a1c2f'),
}

/* Personas y mascotas (Unsplash) */
const P = {
  rosaLopez: u('1568236645308-b332c0acb6db'),
  daniel: u('1525457136159-8878648a7ad0'),
  luna: u('1536589961747-e239b2abbec2', 160, 160, false),
  carlosRivas: u('1594823825986-a3e022974919'),
  mariela: u('1614007011277-c03a6e6915c7'),
  max: u('1558788353-f76d92427f16', 160, 160, false),
  carmen: u('1544179932-fadfa08128a5'),
  teresa: u('1634089916298-9fa27180526c'),
  michi: u('1583795128727-6ec3642408f8', 160, 160, false),
  gabriela: u('1706830009088-f29059eb0a10'),
  valeria: u('1790597038097-3f4c242c61e7'),
  marta: u('1727470287932-cdd5e4784bb1'),
  jorge: u('1595275116400-2767aafb4db1'),
  camila: u('1544725176-7c40e5a71c5e'),
  patricia: u('1519927552442-842916d2c055'),
  ernesto: u('1608681299041-cc19878f79f1'),
  diego: u('1508341591423-4347099e1f19'),
  canela: u('1772606270537-6eb199b55aed', 160, 160, false),
  roberto: u('1535643302794-19c3804b874b'),
  silvia: u('1581185930112-260544657ffd'),
  isabel: u('1758600434620-6b18b2abba6a'),
  fernanda: u('1519965501869-1954ff18db96'),
  coco: u('1629740067905-bd3f515aa739', 160, 160, false),
}

/* Íconos de "Qué incluye" y de las reglas (relleno, como en Figma) */
const I = {
  privado: { icon: 'bed-fill', titulo: 'Quad privado' },
  cocina: { icon: 'cutlery-fill', titulo: 'Uso de cocina' },
  lavanderia: { icon: 'washing-fill', titulo: 'Lavandería' },
  wifi: { icon: 'wifi-fill', titulo: 'Wi-Fi' },
  sala: { icon: 'community-fill', titulo: 'Sala compartida' },
  servicios: { icon: 'check-circle-fill', titulo: 'Agua y luz' },
}
const inc = (k, detalle, titulo) => ({ ...I[k], detalle, ...(titulo ? { titulo } : {}) })
const regla = (icon, titulo, detalle) => ({ icon, titulo, detalle })
const tag = (icon, label) => ({ icon, label })

/** Mensajes: de = 'anfitrion' | 'yo'. visita = tarjeta "Visita propuesta". */
const m = (de, texto, hora) => ({ de, texto, hora })

export const DETALLES = {
  /* ---------- 1 · Casa Martínez (textos del Figma) ---------- */
  familia: {
    tituloLargo: 'Cuarto privado en casa de familia',
    tipo: 'Casa de familia',
    resenas: 12,
    trayecto: '8 min al portón peatonal',
    colonia: 'Jardines de Guadalupe',
    municipio: 'Antiguo Cuscatlán',
    departamento: 'La Libertad',
    galeria: [casaMartinez, null, E.cuarto2, E.cocina1, E.bano1, E.sala1, E.lavado1, E.fachada2],
    deposito: '1 mes',
    anfitrion: { nombre: 'Andrea Martínez', corto: 'Andrea', foto: andrea, rol: 'Anfitriona', detalle: 'Estudiante de 3er año en Contaduría', firma: 'Anfitriona · Estudiante de Contaduría', genero: 'a' },
    incluye: [inc('privado', 'Cama y clóset'), inc('cocina', 'Con horario'), inc('lavanderia', '2 veces por semana'), inc('wifi', 'Incluido'), inc('sala', 'Con la familia'), inc('servicios', 'Incluidas')],
    reglas: [
      regla('clock-fill', 'Hora de llegada', 'Hasta las 10:00 p. m. Si llegas más tarde, avisas.'),
      regla('group-fill', 'Visitas', 'Permitidas en la sala hasta las 8:00 p. m.'),
      regla('cutlery-fill', 'Cocina', 'Libre de 6:00 a. m. a 9:00 p. m.'),
      regla('info-circle-fill', 'Convivencia', 'No se fuma dentro de la casa.'),
    ],
    casa: {
      nombre: 'Casa Martínez',
      descripcion: 'Somos una familia tranquila. Rentamos el cuarto de mi hermano que se fue a estudiar fuera. Nos gusta que quien llegue se sienta en casa, pero también respetamos su espacio.',
      exinquilinos: 6,
      enQuad: '2 años',
    },
    miembros: [
      { nombre: 'Andrea', rol: 'Hija', foto: andrea, tono: '#dce6ff' },
      { nombre: 'Rosa', rol: 'Mamá', foto: rosa, tono: '#fce7f3' },
      { nombre: 'Carlos', rol: 'Papá', foto: carlos, tono: '#dcfce7' },
      { nombre: 'Toby', rol: 'Perro', foto: toby, tono: '#fdebd3' },
    ],
    convivencia: [tag('moon-fill', 'Ambiente tranquilo'), tag('cutlery-fill', 'Almorzamos juntos los domingos'), tag('no-smoking-fill', 'No se fuma'), tag('paw-fill', 'Hay una mascota'), tag('clock-fill', 'Respetamos horarios de estudio')],
    presentacion:
      'Hola, soy Andrea. Estudio Contaduría en la UCA y casi siempre estoy entre clases, café y números. Soy tranquila, ordenada y me gusta que la casa se sienta cálida. Escucho mucho indie y un poco de cumbia cuando estudio. Los domingos me encanta cocinar y ver el atardecer desde el balcón. No me gusta el desorden en la cocina ni el ruido tarde en la noche.',
    desglose: { limpieza: 4.9, horarios: 4.7, comunicacion: 4.8, seguridad: 5.0 },
    resena: {
      iniciales: 'LR', nombre: 'Lucía R.', carrera: 'Ingeniería Industrial · UCA', tiempo: '2 ciclos', fondo: '#fdebd3', color: '#b45309',
      texto: 'La familia respetó mucho mis horarios de estudio. Me sentí segura desde el primer día y la cocina siempre estuvo disponible.',
      textoCasa: 'Doña Rosa siempre estuvo pendiente sin ser invasiva. Las reglas estaban claras desde el inicio, eso me dio mucha tranquilidad.',
    },
    chat: [
      m('anfitrion', '¡Hola, Sofía! Vi que te interesó el cuarto. Pregúntame lo que necesites.', '9:12 a. m.'),
      m('yo', 'Hola, Andrea. ¿Puedo usar la cocina para hacerme la cena después de clases?', '9:15 a. m.'),
      m('anfitrion', 'Sí, la cocina es libre hasta las 9 p. m. y tendrías tu propia repisa en la refri.', '9:20 a. m.'),
      m('yo', '¡Perfecto! ¿Puedo ir a conocer la casa antes de decidir?', '9:21 a. m.'),
    ],
    visita: 'Sáb 7 de nov · 10:00 a. m.',
    filtros: { visitas: true, mascotas: true, banoPropio: false, wifi: true },
  },

  /* ---------- 2 · Habitación amplia (Rosa López) ---------- */
  amplia: {
    tituloLargo: 'Habitación amplia y luminosa',
    tipo: 'Casa de familia',
    resenas: 18,
    trayecto: '9 min al portón peatonal',
    colonia: 'Col. Antiguo Cuscatlán',
    municipio: 'Antiguo Cuscatlán',
    departamento: 'La Libertad',
    galeria: [null, E.cuarto1, E.sala2, E.cocina2, E.bano2, E.fachada1],
    deposito: '1 mes',
    anfitrion: { nombre: 'Rosa López', corto: 'Rosa', foto: P.rosaLopez, rol: 'Anfitriona', detalle: 'Maestra jubilada · vive con su hijo', firma: 'Anfitriona · Maestra jubilada', genero: 'a' },
    incluye: [inc('privado', 'Cama queen y escritorio'), inc('cocina', 'Hasta las 9 p. m.'), inc('lavanderia', 'Los sábados'), inc('wifi', '100 Mbps'), inc('sala', 'Con terraza'), inc('servicios', 'Incluidas')],
    reglas: [
      regla('clock-fill', 'Hora de llegada', 'Hasta las 11:00 p. m. entre semana.'),
      regla('group-fill', 'Visitas', 'Solo en la sala y avisando con un día de anticipación.'),
      regla('cutlery-fill', 'Cocina', 'Cada quien lava lo suyo al terminar.'),
      regla('info-circle-fill', 'Convivencia', 'Música con audífonos después de las 9 p. m.'),
    ],
    casa: {
      nombre: 'Casa López',
      descripcion: 'Soy maestra jubilada y vivo con mi hijo Daniel, que estudia Arquitectura. La casa es grande y entra mucha luz; nos gusta el orden y conversar en la terraza por las tardes.',
      exinquilinos: 9,
      enQuad: '3 años',
    },
    miembros: [
      { nombre: 'Rosa', rol: 'Anfitriona', foto: P.rosaLopez, tono: '#fce7f3' },
      { nombre: 'Daniel', rol: 'Hijo', foto: P.daniel, tono: '#dce6ff' },
      { nombre: 'Luna', rol: 'Gata', foto: P.luna, tono: '#fdebd3' },
    ],
    convivencia: [tag('moon-fill', 'Ambiente tranquilo'), tag('clock-fill', 'Respetamos horarios de estudio'), tag('paw-fill', 'Hay una gata'), tag('no-smoking-fill', 'No se fuma')],
    presentacion:
      'Hola, soy Rosa. Di clases de Lenguaje por más de 25 años, así que me encanta tener estudiantes en casa. Me levanto temprano, riego mis plantas y hago café para quien quiera. Soy ordenada pero no estricta: solo pido avisar si no vas a llegar a dormir. En las tardes leo en la terraza con Luna, mi gata.',
    desglose: { limpieza: 5.0, horarios: 4.8, comunicacion: 4.9, seguridad: 4.9 },
    resena: {
      iniciales: 'MC', nombre: 'Mario C.', carrera: 'Arquitectura · UCA', tiempo: '3 ciclos', fondo: '#dce6ff', color: '#2667ff',
      texto: 'El cuarto es enorme y tiene muy buena luz para estudiar. Doña Rosa siempre tenía café en las mañanas.',
      textoCasa: 'Doña Rosa es muy atenta y la casa siempre estaba limpia. Daniel me ayudó a ubicarme en la universidad los primeros días.',
    },
    chat: [
      m('anfitrion', '¡Hola, Sofía! Soy Rosa. El cuarto está disponible desde diciembre. ¿Qué te gustaría saber?', '7:48 a. m.'),
      m('yo', 'Hola, doña Rosa. ¿El escritorio queda en el cuarto?', '8:02 a. m.'),
      m('anfitrion', 'Sí, el escritorio y la silla se quedan. La ventana da al jardín, así que entra luz toda la mañana.', '8:10 a. m.'),
      m('yo', '¿Se puede usar la cocina en la noche?', '8:12 a. m.'),
      m('anfitrion', 'Sí, la cocina se puede usar hasta las 9 p. m.', 'Ayer'),
    ],
    visita: 'Jue 12 de nov · 4:00 p. m.',
    filtros: { visitas: true, mascotas: true, banoPropio: false, wifi: true },
  },

  /* ---------- 3 · Cuarto con baño propio (Carlos Rivas) ---------- */
  'bano-propio': {
    tituloLargo: 'Cuarto con baño propio',
    tipo: 'Casa de pareja joven',
    resenas: 9,
    trayecto: '6 min al portón peatonal',
    colonia: 'Urb. Madreselva',
    municipio: 'Antiguo Cuscatlán',
    departamento: 'La Libertad',
    galeria: [null, E.bano3, E.cuarto3, E.sala3, E.fachada3],
    deposito: '1 mes',
    anfitrion: { nombre: 'Carlos Rivas', corto: 'Carlos', foto: P.carlosRivas, rol: 'Anfitrión', detalle: 'Ingeniero en sistemas · trabaja desde casa', firma: 'Anfitrión · Ingeniero en sistemas', genero: 'o' },
    incluye: [inc('privado', 'Con baño propio'), inc('cocina', 'No incluida', 'Sin cocina'), inc('lavanderia', 'Lavandería cercana', 'Lavandería'), inc('wifi', 'Fibra óptica'), inc('sala', 'Patio con hamaca', 'Patio compartido'), inc('servicios', 'Incluidas')],
    reglas: [
      regla('clock-fill', 'Hora de llegada', 'Libre. Tienes tu propia llave de la entrada.'),
      regla('group-fill', 'Visitas', 'Permitidas hasta las 9:00 p. m., sin quedarse a dormir.'),
      regla('cutlery-fill', 'Comida', 'Puedes tener microondas y mini refri en el cuarto.'),
      regla('info-circle-fill', 'Convivencia', 'Silencio de 10:00 p. m. a 6:00 a. m.'),
    ],
    casa: {
      nombre: 'Casa Rivas',
      descripcion: 'Somos Carlos y Mariela, una pareja joven. Trabajamos desde casa, así que valoramos la calma. El cuarto tiene entrada independiente y su propio baño.',
      exinquilinos: 4,
      enQuad: '1 año',
    },
    miembros: [
      { nombre: 'Carlos', rol: 'Anfitrión', foto: P.carlosRivas, tono: '#dcfce7' },
      { nombre: 'Mariela', rol: 'Esposa', foto: P.mariela, tono: '#fce7f3' },
      { nombre: 'Max', rol: 'Perro', foto: P.max, tono: '#fdebd3' },
    ],
    convivencia: [tag('moon-fill', 'Casa silenciosa'), tag('lock', 'Entrada independiente'), tag('paw-fill', 'Hay un perro'), tag('no-smoking-fill', 'No se fuma')],
    presentacion:
      'Hola, soy Carlos. Trabajo como desarrollador y paso casi todo el día en casa con Mariela y Max, nuestro golden. Nos gusta la tranquilidad, el café de olla y los domingos de series. El cuarto tiene su propio baño y entrada, para que tengas privacidad total. Lo único que pedimos es silencio en la noche.',
    desglose: { limpieza: 4.7, horarios: 4.5, comunicacion: 4.6, seguridad: 4.8 },
    resena: {
      iniciales: 'JP', nombre: 'José P.', carrera: 'Ingeniería Eléctrica · UCA', tiempo: '1 ciclo', fondo: '#dcfce7', color: '#15803d',
      texto: 'Tener baño propio cambia todo. Carlos y Mariela son muy respetuosos y el internet nunca falló.',
      textoCasa: 'Carlos siempre respondió rápido cuando algo se arruinaba. Max es el perro más tranquilo del mundo.',
    },
    chat: [
      m('anfitrion', 'Hola, Sofía. Soy Carlos. Gracias por tu interés en el cuarto.', '7:55 a. m.'),
      m('yo', 'Hola, Carlos. ¿El baño es solo para el cuarto?', '8:01 a. m.'),
      m('anfitrion', 'Sí, el baño es solo tuyo y tiene agua caliente.', '8:03 a. m.'),
      m('anfitrion', '¿Te gustaría agendar una visita esta semana?', '8:05 a. m.'),
    ],
    visita: 'Vie 13 de nov · 5:00 p. m.',
    filtros: { visitas: true, mascotas: true, banoPropio: true, wifi: true },
  },

  /* ---------- 4 · Hogar espacioso (Carmen Aguilar) ---------- */
  hogar: {
    tituloLargo: 'Hogar espacioso para estudiantes',
    tipo: 'Solo mujeres',
    resenas: 21,
    trayecto: '7 min al portón de La Sultana',
    colonia: 'Col. La Sultana',
    municipio: 'Antiguo Cuscatlán',
    departamento: 'La Libertad',
    galeria: [null, E.sala4, E.cuarto4, E.cocina3, E.bano4, E.lavado2, E.fachada4],
    deposito: '1 mes',
    anfitrion: { nombre: 'Carmen Aguilar', corto: 'Carmen', foto: P.carmen, rol: 'Anfitriona', detalle: 'Enfermera jubilada · vive con su hermana', firma: 'Anfitriona · Enfermera jubilada', genero: 'a' },
    incluye: [inc('privado', 'Cama y ropero'), inc('cocina', 'Horario libre'), inc('lavanderia', 'Lavadora disponible'), inc('wifi', 'Incluido'), inc('sala', 'Con las anfitrionas'), inc('servicios', 'Incluidas')],
    reglas: [
      regla('clock-fill', 'Hora de llegada', 'Hasta las 10:30 p. m. Los viernes, hasta las 12:00 a. m.'),
      regla('group-fill', 'Visitas', 'Solo amigas, en la sala y hasta las 8:00 p. m.'),
      regla('cutlery-fill', 'Cocina', 'Libre. Cada inquilina tiene su gaveta.'),
      regla('info-circle-fill', 'Convivencia', 'Casa solo para mujeres.'),
    ],
    casa: {
      nombre: 'Casa Aguilar',
      descripcion: 'Somos dos hermanas jubiladas. Desde hace años recibimos estudiantes del interior del país; nos gusta que la casa tenga vida y que las muchachas se sientan acompañadas.',
      exinquilinos: 14,
      enQuad: '3 años',
    },
    miembros: [
      { nombre: 'Carmen', rol: 'Anfitriona', foto: P.carmen, tono: '#fce7f3' },
      { nombre: 'Teresa', rol: 'Hermana', foto: P.teresa, tono: '#dce6ff' },
      { nombre: 'Michi', rol: 'Gato', foto: P.michi, tono: '#fdebd3' },
    ],
    convivencia: [tag('community-fill', 'Ambiente familiar'), tag('cutlery-fill', 'Cenamos juntas los viernes'), tag('paw-fill', 'Hay un gato'), tag('no-smoking-fill', 'No se fuma')],
    presentacion:
      'Hola, soy Carmen. Fui enfermera en el Hospital Rosales por 30 años y ahora vivo con mi hermana Teresa. Nos encanta cocinar pupusas los viernes y compartir la mesa con las muchachas. Somos tranquilas y nos gusta que cada una tenga su espacio para estudiar. Michi, el gato, es el verdadero dueño de la casa.',
    desglose: { limpieza: 4.9, horarios: 4.8, comunicacion: 5.0, seguridad: 5.0 },
    resena: {
      iniciales: 'KM', nombre: 'Karla M.', carrera: 'Psicología · UCA', tiempo: '4 ciclos', fondo: '#fce7f3', color: '#be185d',
      texto: 'Me sentí como en casa de mis abuelas. Siempre había comida y nunca me sentí sola, aunque soy de Chalatenango.',
      textoCasa: 'Doña Carmen y doña Teresa son un amor. Me cuidaron cuando me enfermé y me ayudaron con todo.',
    },
    chat: [
      m('anfitrion', '¡Hola, Sofía! Qué gusto. Soy Carmen. Tenemos un cuarto libre desde enero.', '6:40 p. m.'),
      m('yo', 'Hola, doña Carmen. ¿Cuántas estudiantes viven ahí?', '6:52 p. m.'),
      m('anfitrion', 'Ahora vive una muchacha de Usulután; serían dos contigo. Las dos estudian en la UCA.', '7:05 p. m.'),
    ],
    visita: 'Sáb 14 de nov · 10:00 a. m.',
    filtros: { visitas: true, mascotas: true, banoPropio: false, wifi: true },
  },

  /* ---------- 5 · Cuarto con balcón (Gabriela Flores) ---------- */
  balcon: {
    tituloLargo: 'Cuarto con balcón y vista',
    tipo: 'Solo mujeres',
    resenas: 7,
    trayecto: '12 min en bus a Los Próceres',
    colonia: 'Santa Elena',
    municipio: 'Antiguo Cuscatlán',
    departamento: 'La Libertad',
    galeria: [null, E.cuarto5, E.sala5, E.cocina4, E.bano1],
    deposito: '1 mes',
    anfitrion: { nombre: 'Gabriela Flores', corto: 'Gabriela', foto: P.gabriela, rol: 'Anfitriona', detalle: 'Diseñadora gráfica · comparte apartamento', firma: 'Anfitriona · Diseñadora gráfica', genero: 'a' },
    incluye: [inc('privado', 'Con balcón'), inc('cocina', 'Sin horario', 'Cocina compartida'), inc('lavanderia', 'En el edificio'), inc('wifi', '200 Mbps'), inc('sala', 'Con 2 inquilinas'), inc('servicios', 'Luz aparte', 'Agua incluida')],
    reglas: [
      regla('clock-fill', 'Hora de llegada', 'Libre. El edificio tiene vigilancia 24 h.'),
      regla('group-fill', 'Visitas', 'Solo mujeres, hasta las 10:00 p. m.'),
      regla('cutlery-fill', 'Cocina', 'Turnos para limpiar cada semana.'),
      regla('info-circle-fill', 'Convivencia', 'Apartamento solo para mujeres.'),
    ],
    casa: {
      nombre: 'Apartamento Flores',
      descripcion: 'Apartamento en tercer piso con vista al volcán. Vivo con otra estudiante y buscamos a alguien ordenado, que disfrute un ambiente creativo y relajado.',
      exinquilinos: 3,
      enQuad: '8 meses',
    },
    miembros: [
      { nombre: 'Gabriela', rol: 'Anfitriona', foto: P.gabriela, tono: '#fce7f3' },
      { nombre: 'Valeria', rol: 'Inquilina', foto: P.valeria, tono: '#dce6ff' },
    ],
    convivencia: [tag('community-fill', 'Ambiente creativo'), tag('lock', 'Vigilancia 24 h'), tag('no-smoking-fill', 'No se fuma'), tag('clock-fill', 'Turnos de limpieza')],
    presentacion:
      'Hola, soy Gabriela. Trabajo como diseñadora y comparto el apartamento con Valeria, que estudia Psicología. Nos gustan las plantas, el café de especialidad y ver películas los viernes. El cuarto tiene un balcón donde da el sol de la tarde. Buscamos a alguien respetuoso con el espacio y los turnos de limpieza.',
    desglose: { limpieza: 4.6, horarios: 4.4, comunicacion: 4.5, seguridad: 4.7 },
    resena: {
      iniciales: 'DS', nombre: 'Daniela S.', carrera: 'Comunicaciones · UCA', tiempo: '2 ciclos', fondo: '#ede9fe', color: '#6d28d9',
      texto: 'El balcón es lo mejor. Gaby es súper buena onda y el edificio es muy seguro para llegar de noche.',
      textoCasa: 'Muy buen ambiente entre compañeras. Los turnos de limpieza se respetan y eso evita problemas.',
    },
    chat: [
      m('anfitrion', 'Hola, Sofía. El cuarto ya está apartado hasta febrero, pero te aviso si se libera.', '3:15 p. m.'),
      m('yo', '¡Gracias! Me encantaría que me avises.', '3:20 p. m.'),
    ],
    visita: 'Mié 11 de nov · 6:00 p. m.',
    filtros: { visitas: true, mascotas: false, banoPropio: false, wifi: true },
  },

  /* ---------- 6 · Casa tranquila (Familia Hernández) ---------- */
  tranquila: {
    tituloLargo: 'Habitación en casa tranquila',
    tipo: 'Casa de familia',
    resenas: 15,
    trayecto: '5 min al portón peatonal',
    colonia: 'Jardines de Guadalupe',
    municipio: 'Antiguo Cuscatlán',
    departamento: 'La Libertad',
    galeria: [null, E.cuarto6, E.cocina5, E.sala1, E.bano2, E.fachada5],
    deposito: '1 mes',
    anfitrion: { nombre: 'Marta Hernández', corto: 'Marta', foto: P.marta, rol: 'Anfitriona', detalle: 'Contadora · mamá de una estudiante UCA', firma: 'Anfitriona · Contadora', genero: 'a' },
    incluye: [inc('privado', 'Cama y escritorio'), inc('cocina', 'Con horario'), inc('lavanderia', 'Una vez por semana'), inc('wifi', 'Incluido'), inc('sala', 'Con la familia'), inc('servicios', 'Incluidas')],
    reglas: [
      regla('clock-fill', 'Hora de llegada', 'Hasta las 10:00 p. m. Si llegas más tarde, avisas por WhatsApp.'),
      regla('group-fill', 'Visitas', 'Solo compañeras de estudio, en el comedor.'),
      regla('cutlery-fill', 'Cocina', 'Libre de 6:00 a. m. a 8:30 p. m.'),
      regla('info-circle-fill', 'Convivencia', 'Casa solo para mujeres. No se fuma.'),
    ],
    casa: {
      nombre: 'Casa Hernández',
      descripcion: 'Somos Marta, Jorge y nuestra hija Camila, que estudia en la UCA. La casa está a pocas cuadras del portón peatonal y es muy tranquila; ideal para concentrarse.',
      exinquilinos: 8,
      enQuad: '2 años',
    },
    miembros: [
      { nombre: 'Marta', rol: 'Mamá', foto: P.marta, tono: '#fce7f3' },
      { nombre: 'Jorge', rol: 'Papá', foto: P.jorge, tono: '#dcfce7' },
      { nombre: 'Camila', rol: 'Hija', foto: P.camila, tono: '#dce6ff' },
    ],
    convivencia: [tag('moon-fill', 'Ambiente tranquilo'), tag('clock-fill', 'Respetamos horarios de estudio'), tag('no-smoking-fill', 'No se fuma'), tag('community-fill', 'Estudiamos juntas')],
    presentacion:
      'Hola, soy Marta. Trabajo como contadora y mi esposo Jorge es profesor de colegio. Camila, nuestra hija, está en segundo año de Psicología, así que en casa todos entendemos las semanas de parciales. Somos ordenados, cenamos temprano y nos gusta el silencio por la noche.',
    desglose: { limpieza: 4.8, horarios: 4.9, comunicacion: 4.7, seguridad: 4.9 },
    resena: {
      iniciales: 'AG', nombre: 'Ana G.', carrera: 'Ingeniería Química · UCA', tiempo: '2 ciclos', fondo: '#dce6ff', color: '#2667ff',
      texto: 'Está a cinco minutos caminando de la UCA. Camila me prestaba sus apuntes y estudiábamos juntas.',
      textoCasa: 'Doña Marta es muy organizada y todo estaba claro desde el inicio. Una casa ideal para estudiar.',
    },
    chat: [
      m('anfitrion', 'Hola, Sofía. Soy Marta. Con gusto te cuento del cuarto.', '10:02 a. m.'),
      m('yo', 'Hola, doña Marta. ¿Está muy cerca del portón?', '10:10 a. m.'),
      m('anfitrion', 'Son cinco minutos caminando. Camila va todos los días a pie.', '10:14 a. m.'),
    ],
    visita: 'Sáb 14 de nov · 11:00 a. m.',
    filtros: { visitas: true, mascotas: false, banoPropio: false, wifi: true },
  },

  /* ---------- 7 · Madreselva (Familia Portillo) ---------- */
  madreselva: {
    tituloLargo: 'Cuarto en casa de familia',
    tipo: 'Casa de familia',
    resenas: 10,
    trayecto: '8 min al portón de La Sultana',
    colonia: 'Urb. Madreselva',
    municipio: 'Antiguo Cuscatlán',
    departamento: 'La Libertad',
    galeria: [null, E.cuarto2, E.cocina1, E.lavado3, E.sala2, E.fachada1],
    deposito: '15 días',
    anfitrion: { nombre: 'Patricia Portillo', corto: 'Patricia', foto: P.patricia, rol: 'Anfitriona', detalle: 'Dueña de una panadería · vive con su familia', firma: 'Anfitriona · Panadera', genero: 'a' },
    incluye: [inc('privado', 'Cama y clóset'), inc('cocina', 'Libre'), inc('lavanderia', 'Incluida'), inc('wifi', 'Incluido'), inc('sala', 'Con la familia'), inc('servicios', 'Incluidas')],
    reglas: [
      regla('clock-fill', 'Hora de llegada', 'Hasta las 11:00 p. m. Hay timbre para avisar.'),
      regla('group-fill', 'Visitas', 'Permitidas en la sala hasta las 9:00 p. m.'),
      regla('cutlery-fill', 'Cocina', 'Libre. Pan dulce todas las mañanas.'),
      regla('info-circle-fill', 'Convivencia', 'Se comparten las tareas los sábados.'),
    ],
    casa: {
      nombre: 'Casa Portillo',
      descripcion: 'Familia alegre y trabajadora. Tenemos una panadería en la colonia, así que en casa siempre huele a pan. Nos gusta que quien llegue se integre, pero respetamos su tiempo de estudio.',
      exinquilinos: 5,
      enQuad: '1 año',
    },
    miembros: [
      { nombre: 'Patricia', rol: 'Mamá', foto: P.patricia, tono: '#fce7f3' },
      { nombre: 'Ernesto', rol: 'Papá', foto: P.ernesto, tono: '#dcfce7' },
      { nombre: 'Diego', rol: 'Hijo', foto: P.diego, tono: '#dce6ff' },
      { nombre: 'Canela', rol: 'Perra', foto: P.canela, tono: '#fdebd3' },
    ],
    convivencia: [tag('community-fill', 'Ambiente alegre'), tag('cutlery-fill', 'Desayuno incluido los domingos'), tag('paw-fill', 'Hay una mascota'), tag('washing-fill', 'Lavandería incluida')],
    presentacion:
      'Hola, soy Patricia. Con Ernesto tenemos la panadería de la esquina desde hace 15 años. Diego, nuestro hijo, estudia Economía en la UCA y es muy buen compañero. Somos una familia alegre: los domingos desayunamos juntos y Canela, la perrita, siempre recibe a todos en la puerta.',
    desglose: { limpieza: 4.6, horarios: 4.6, comunicacion: 4.8, seguridad: 4.7 },
    resena: {
      iniciales: 'RV', nombre: 'Rodrigo V.', carrera: 'Administración de Empresas · UCA', tiempo: '3 ciclos', fondo: '#fdebd3', color: '#b45309',
      texto: 'La lavandería incluida me ahorró mucho tiempo. Y el pan de doña Patricia no tiene comparación.',
      textoCasa: 'Me sentí parte de la familia. Diego me presentó a sus amigos y me ayudó a adaptarme a San Salvador.',
    },
    chat: [
      m('anfitrion', '¡Hola, Sofía! Soy Patricia. El cuarto está listo cuando quieras verlo.', '5:30 p. m.'),
      m('yo', 'Hola, doña Patricia. ¿La lavandería está incluida en el precio?', '5:41 p. m.'),
      m('anfitrion', 'Sí, la lavadora y la secadora se pueden usar cuando quieras.', '5:45 p. m.'),
    ],
    visita: 'Dom 15 de nov · 9:00 a. m.',
    filtros: { visitas: true, mascotas: true, banoPropio: false, wifi: true },
  },

  /* ---------- 8 · Merliot (Roberto Mejía) ---------- */
  merliot: {
    tituloLargo: 'Cuarto cerca de Plaza Merliot',
    tipo: 'Casa de familia',
    resenas: 6,
    trayecto: '18 min en bus a La Sultana',
    colonia: 'Ciudad Merliot',
    municipio: 'Santa Tecla',
    departamento: 'La Libertad',
    galeria: [null, E.cuarto3, E.cocina2, E.lavado1, E.sala3, E.fachada2],
    deposito: '1 mes',
    anfitrion: { nombre: 'Roberto Mejía', corto: 'Roberto', foto: P.roberto, rol: 'Anfitrión', detalle: 'Mecánico jubilado · vive con su esposa', firma: 'Anfitrión · Mecánico jubilado', genero: 'o' },
    incluye: [inc('privado', 'Cama y ropero'), inc('cocina', 'Con horario'), inc('lavanderia', 'Pila y tendedero'), inc('wifi', 'Incluido'), inc('sala', 'Con la pareja'), inc('servicios', 'Incluidas')],
    reglas: [
      regla('clock-fill', 'Hora de llegada', 'Hasta las 10:00 p. m. Portón con candado.'),
      regla('group-fill', 'Visitas', 'Solo de día y avisando antes.'),
      regla('cutlery-fill', 'Cocina', 'De 6:00 a. m. a 8:00 p. m.'),
      regla('info-circle-fill', 'Convivencia', 'No se fuma ni se toma dentro de la casa.'),
    ],
    casa: {
      nombre: 'Casa Mejía',
      descripcion: 'Somos una pareja de jubilados. Nuestros hijos ya se casaron y la casa quedó grande. La parada del bus a la UCA está a dos cuadras y Plaza Merliot a cinco.',
      exinquilinos: 3,
      enQuad: '10 meses',
    },
    miembros: [
      { nombre: 'Roberto', rol: 'Anfitrión', foto: P.roberto, tono: '#dcfce7' },
      { nombre: 'Silvia', rol: 'Esposa', foto: P.silvia, tono: '#fce7f3' },
    ],
    convivencia: [tag('moon-fill', 'Ambiente tranquilo'), tag('no-smoking-fill', 'No se fuma'), tag('cutlery-fill', 'Almuerzo los domingos'), tag('clock-fill', 'Casa de horarios tempranos')],
    presentacion:
      'Hola, soy Roberto. Trabajé 35 años como mecánico y ahora disfruto del jardín y de las mañanas tranquilas con Silvia, mi esposa. Nos gusta conversar y ayudar en lo que se pueda; si necesitas que te llevemos a la parada un día de lluvia, con gusto. Lo único que pedimos es respeto por los horarios de la casa.',
    desglose: { limpieza: 4.5, horarios: 4.3, comunicacion: 4.6, seguridad: 4.6 },
    resena: {
      iniciales: 'EM', nombre: 'Ernesto M.', carrera: 'Ingeniería Civil · UCA', tiempo: '1 ciclo', fondo: '#dcfce7', color: '#15803d',
      texto: 'Es el más barato que encontré y la parada queda cerca. Don Roberto y doña Silvia son muy amables.',
      textoCasa: 'Una casa tranquila y segura. Los horarios son algo estrictos, pero todo se habla.',
    },
    chat: [m('anfitrion', 'Buenas tardes, Sofía. Soy Roberto. Si quieres venir a ver el cuarto, estamos todo el día.', '2:10 p. m.')],
    visita: 'Jue 12 de nov · 2:00 p. m.',
    filtros: { visitas: false, mascotas: false, banoPropio: false, wifi: true },
  },

  /* ---------- 9 · Escalón (Isabel Castro) ---------- */
  closet: {
    tituloLargo: 'Habitación con clóset grande',
    tipo: 'Casa de familia',
    resenas: 11,
    trayecto: '22 min en carro a Los Próceres',
    colonia: 'Col. Escalón',
    municipio: 'San Salvador',
    departamento: 'San Salvador',
    galeria: [null, E.cuarto6, E.bano3, E.cocina3, E.lavado2, E.sala4, E.fachada3],
    deposito: '1 mes',
    anfitrion: { nombre: 'Isabel Castro', corto: 'Isabel', foto: P.isabel, rol: 'Anfitriona', detalle: 'Abogada · vive con su hija', firma: 'Anfitriona · Abogada', genero: 'a' },
    incluye: [inc('privado', 'Clóset de pared'), inc('cocina', 'Libre'), inc('lavanderia', 'Incluida'), inc('wifi', 'Incluido'), inc('sala', 'Con terraza'), inc('servicios', 'Incluidas')],
    reglas: [
      regla('clock-fill', 'Hora de llegada', 'Libre, con aviso si llegas después de medianoche.'),
      regla('group-fill', 'Visitas', 'Permitidas hasta las 10:00 p. m.'),
      regla('cutlery-fill', 'Cocina', 'Libre. Hay una refri para inquilinos.'),
      regla('info-circle-fill', 'Convivencia', 'No se fuma dentro de la casa.'),
    ],
    casa: {
      nombre: 'Casa Castro',
      descripcion: 'Vivo con mi hija Fernanda, que trabaja en una agencia de publicidad. La casa está en una calle cerrada con vigilancia y cerca de supermercados y cafés.',
      exinquilinos: 7,
      enQuad: '2 años',
    },
    miembros: [
      { nombre: 'Isabel', rol: 'Mamá', foto: P.isabel, tono: '#fce7f3' },
      { nombre: 'Fernanda', rol: 'Hija', foto: P.fernanda, tono: '#dce6ff' },
      { nombre: 'Coco', rol: 'Perro', foto: P.coco, tono: '#fdebd3' },
    ],
    convivencia: [tag('lock', 'Calle con vigilancia'), tag('community-fill', 'Ambiente relajado'), tag('paw-fill', 'Hay una mascota'), tag('no-smoking-fill', 'No se fuma')],
    presentacion:
      'Hola, soy Isabel. Soy abogada y vivo con Fernanda, mi hija, y con Coco, un perrito muy juguetón. Salimos temprano y volvemos de noche, así que la casa es tranquila durante el día para estudiar. El cuarto tiene un clóset enorme y mucha luz. Nos gusta que haya confianza y buena comunicación.',
    desglose: { limpieza: 4.9, horarios: 4.7, comunicacion: 4.8, seguridad: 4.9 },
    resena: {
      iniciales: 'MR', nombre: 'María R.', carrera: 'Mercadeo · UCA', tiempo: '2 ciclos', fondo: '#fce7f3', color: '#be185d',
      texto: 'Queda un poco lejos, pero la zona es muy segura y el cuarto es precioso. Coco me esperaba todas las tardes.',
      textoCasa: 'Isabel y Fernanda son muy respetuosas y confiadas. Me trataron como una más de la casa.',
    },
    chat: [
      m('anfitrion', 'Hola, Sofía. Soy Isabel. ¿Tienes carro o vas a viajar en bus?', '11:20 a. m.'),
      m('yo', 'Hola, Isabel. Voy en bus, ¿hay alguna ruta cerca?', '11:26 a. m.'),
      m('anfitrion', 'Sí, la 44 pasa a una cuadra y te deja frente a la UCA.', '11:30 a. m.'),
    ],
    visita: 'Vie 13 de nov · 6:00 p. m.',
    filtros: { visitas: true, mascotas: true, banoPropio: false, wifi: true },
  },
}

/** Detalle completo de un quad (une los datos de la tarjeta con los de la casa). */
export function detalle(quad) {
  const d = DETALLES[quad.id] || DETALLES.familia
  const galeria = d.galeria.map((f) => f || quad.foto)
  return { ...d, galeria, calificacion: quad.rating }
}

/** Atajos de preguntas en el chat. */
export const SUGERENCIAS = ['¿Se permiten visitas?', '¿Hay hora de llegada?', '¿Qué servicios incluye?']

/** Respuesta automática del anfitrión a una pregunta sugerida (usa sus reglas). */
export function responder(d, pregunta) {
  const r = (t) => d.reglas.find((x) => x.titulo === t)?.detalle
  if (pregunta.includes('visitas')) return r('Visitas')
  if (pregunta.includes('llegada')) return r('Hora de llegada')
  return `Incluye ${d.incluye
    .filter((i) => !/^No|Sin|aparte/.test(i.detalle + i.titulo))
    .slice(0, 4)
    .map((i) => i.titulo.toLowerCase())
    .join(', ')}.`
}

/* ---------- 06 · Proponer otra fecha ---------- */
export const DIAS = [
  { id: 9, corto: 'Lun', largo: 'Lun' },
  { id: 10, corto: 'Mar', largo: 'Mar' },
  { id: 11, corto: 'Mié', largo: 'Mié' },
  { id: 12, corto: 'Jue', largo: 'Jue' },
  { id: 13, corto: 'Vie', largo: 'Vie' },
  { id: 14, corto: 'Sáb', largo: 'Sáb' },
  { id: 15, corto: 'Dom', largo: 'Dom' },
]
export const HORAS = ['8:00 a. m.', '10:00 a. m.', '12:00 m.', '2:00 p. m.', '4:00 p. m.', '6:00 p. m.']
export const HORAS_OCUPADAS = ['8:00 a. m.']
