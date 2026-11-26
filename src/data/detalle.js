/**
 * Detalle de cada quad (sección "Detalle del Quad" en Figma):
 * 03 Detalle · 04 Perfil de la casa · 05 Conversación · 06 Proponer otra fecha.
 *
 * Cada quad usa las fotos reales de su casa (data/fotos.js), sin repetir ninguna.
 * Las personas sin foto se muestran con sus iniciales.
 */
import { foto, fotos } from './fotos.js'

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
  /* ---------- 1 · Casa Martínez · cuarto con TV (Andrea) ---------- */
  familia: {
    tituloLargo: 'Cuarto con TV en casa de familia',
    tipo: 'Casa de familia',
    resenas: 12,
    trayecto: '4 min al portón peatonal',
    colonia: 'Jardines de Guadalupe',
    municipio: 'Antiguo Cuscatlán',
    departamento: 'La Libertad',
    galeria: [null, ...fotos('casa-martinez', ['sala', 'comedor', 'cocina', 'entrada', 'recibidor', 'fachada'])],
    deposito: '1 mes',
    anfitrion: { nombre: 'Andrea Martínez', corto: 'Andrea', foto: null, rol: 'Anfitriona', detalle: 'Estudiante de 3er año en Contaduría', firma: 'Anfitriona · Estudiante de Contaduría', genero: 'a' },
    incluye: [inc('privado', 'Cama nueva y TV'), inc('cocina', 'Con horario'), inc('lavanderia', '2 veces por semana'), inc('wifi', 'Incluido'), inc('sala', 'Con la familia'), inc('servicios', 'Incluidas')],
    reglas: [
      regla('clock-fill', 'Hora de llegada', 'Hasta las 10:00 p. m. Si llegas más tarde, avisas.'),
      regla('group-fill', 'Visitas', 'Permitidas en la sala hasta las 8:00 p. m.'),
      regla('cutlery-fill', 'Cocina', 'Libre de 6:00 a. m. a 9:00 p. m.'),
      regla('info-circle-fill', 'Convivencia', 'No se fuma dentro de la casa.'),
    ],
    casa: {
      nombre: 'Casa Martínez',
      descripcion: 'Somos una familia tranquila en una casa de dos plantas. Rentamos los dos cuartos de arriba: este tiene TV y cama nueva. Nos gusta que quien llegue se sienta en casa, pero también respetamos su espacio.',
      exinquilinos: 6,
      enQuad: '2 años',
    },
    miembros: [
      { nombre: 'Andrea', rol: 'Hija', foto: null, tono: '#dce6ff' },
      { nombre: 'Rosa', rol: 'Mamá', foto: null, tono: '#fce7f3' },
      { nombre: 'Carlos', rol: 'Papá', foto: null, tono: '#dcfce7' },
    ],
    convivencia: [tag('moon-fill', 'Ambiente tranquilo'), tag('cutlery-fill', 'Almorzamos juntos los domingos'), tag('no-smoking-fill', 'No se fuma'), tag('clock-fill', 'Respetamos horarios de estudio')],
    presentacion:
      'Hola, soy Andrea. Estudio Contaduría en la UCA y casi siempre estoy entre clases, café y números. Soy tranquila, ordenada y me gusta que la casa se sienta cálida. Escucho mucho indie y un poco de cumbia cuando estudio. Los domingos me encanta cocinar con mi mamá. No me gusta el desorden en la cocina ni el ruido tarde en la noche.',
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
    filtros: { visitas: true, mascotas: false, banoPropio: false, wifi: true },
  },

  /* ---------- 2 · Casa Martínez · cuarto con escritorio (Rosa) ---------- */
  amplia: {
    tituloLargo: 'Cuarto con escritorio y ventana',
    tipo: 'Casa de familia',
    resenas: 18,
    trayecto: '4 min al portón peatonal',
    colonia: 'Jardines de Guadalupe',
    municipio: 'Antiguo Cuscatlán',
    departamento: 'La Libertad',
    galeria: [null, ...fotos('casa-martinez', ['sala-2', 'barra', 'cocina-2', 'escaleras', 'pasillo'])],
    deposito: '1 mes',
    anfitrion: { nombre: 'Rosa Martínez', corto: 'Rosa', foto: null, rol: 'Anfitriona', detalle: 'Maestra jubilada · mamá de Andrea', firma: 'Anfitriona · Maestra jubilada', genero: 'a' },
    incluye: [inc('privado', 'Escritorio y silla'), inc('cocina', 'Hasta las 9 p. m.'), inc('lavanderia', 'Los sábados'), inc('wifi', '100 Mbps'), inc('sala', 'Con barra'), inc('servicios', 'Incluidas')],
    reglas: [
      regla('clock-fill', 'Hora de llegada', 'Hasta las 11:00 p. m. entre semana.'),
      regla('group-fill', 'Visitas', 'Solo en la sala y avisando con un día de anticipación.'),
      regla('cutlery-fill', 'Cocina', 'Cada quien lava lo suyo al terminar.'),
      regla('info-circle-fill', 'Convivencia', 'Música con audífonos después de las 9 p. m.'),
    ],
    casa: {
      nombre: 'Casa Martínez',
      descripcion: 'Es el segundo cuarto de arriba de nuestra casa. Tiene escritorio, silla y una ventana grande que da a la calle. Abajo hay sala, barra para desayunar y una cocina compartida.',
      exinquilinos: 9,
      enQuad: '2 años',
    },
    miembros: [
      { nombre: 'Rosa', rol: 'Anfitriona', foto: null, tono: '#fce7f3' },
      { nombre: 'Carlos', rol: 'Esposo', foto: null, tono: '#dcfce7' },
      { nombre: 'Andrea', rol: 'Hija', foto: null, tono: '#dce6ff' },
    ],
    convivencia: [tag('moon-fill', 'Ambiente tranquilo'), tag('clock-fill', 'Respetamos horarios de estudio'), tag('no-smoking-fill', 'No se fuma'), tag('community-fill', 'Casa de dos plantas')],
    presentacion:
      'Hola, soy Rosa. Di clases de Lenguaje por más de 25 años, así que me encanta tener estudiantes en casa. Me levanto temprano, riego mis plantas y hago café para quien quiera. Soy ordenada pero no estricta: solo pido avisar si no vas a llegar a dormir.',
    desglose: { limpieza: 5.0, horarios: 4.8, comunicacion: 4.9, seguridad: 4.9 },
    resena: {
      iniciales: 'MC', nombre: 'Mario C.', carrera: 'Arquitectura · UCA', tiempo: '3 ciclos', fondo: '#dce6ff', color: '#2667ff',
      texto: 'El escritorio queda junto a la ventana y entra muy buena luz para estudiar. Doña Rosa siempre tenía café en las mañanas.',
      textoCasa: 'Doña Rosa es muy atenta y la casa siempre estaba limpia. Andrea me ayudó a ubicarme en la universidad los primeros días.',
    },
    chat: [
      m('anfitrion', '¡Hola, Sofía! Soy Rosa. El cuarto está disponible desde diciembre. ¿Qué te gustaría saber?', '7:48 a. m.'),
      m('yo', 'Hola, doña Rosa. ¿El escritorio queda en el cuarto?', '8:02 a. m.'),
      m('anfitrion', 'Sí, el escritorio y la silla se quedan. La ventana es grande, así que entra luz toda la mañana.', '8:10 a. m.'),
      m('yo', '¿Se puede usar la cocina en la noche?', '8:12 a. m.'),
      m('anfitrion', 'Sí, la cocina se puede usar hasta las 9 p. m.', 'Ayer'),
    ],
    visita: 'Jue 12 de nov · 4:00 p. m.',
    filtros: { visitas: true, mascotas: false, banoPropio: false, wifi: true },
  },

  /* ---------- 3 · Casa Rivas · cuarto con ventana al jardín (Adrián) ---------- */
  'bano-propio': {
    tituloLargo: 'Cuarto con ventana al jardín',
    tipo: 'Casa de hermanos',
    resenas: 9,
    trayecto: '6 min al portón peatonal',
    colonia: 'Col. La Sultana',
    municipio: 'Antiguo Cuscatlán',
    departamento: 'La Libertad',
    galeria: [null, ...fotos('casa-adrian', ['cuarto-cama', 'escritorio', 'comedor', 'cocina', 'lavanderia', 'patio', 'fachada'])],
    deposito: '1 mes',
    anfitrion: { nombre: 'Adrián Rivas', corto: 'Adrián', foto: foto('personas/adrian'), rol: 'Anfitrión', detalle: 'Diseñador gráfico · trabaja desde casa', firma: 'Anfitrión · Diseñador gráfico', genero: 'o' },
    incluye: [inc('privado', 'Cama y escritorio'), inc('cocina', 'Equipada'), inc('lavanderia', 'Lavadora en casa'), inc('wifi', 'Fibra óptica'), inc('sala', 'Patio con jardín', 'Patio compartido'), inc('servicios', 'Incluidas')],
    reglas: [
      regla('clock-fill', 'Hora de llegada', 'Libre. Tienes tu propia llave de la entrada.'),
      regla('group-fill', 'Visitas', 'Permitidas hasta las 9:00 p. m., sin quedarse a dormir.'),
      regla('cutlery-fill', 'Cocina', 'Libre. Cada quien tiene su espacio en la alacena.'),
      regla('info-circle-fill', 'Convivencia', 'Silencio de 10:00 p. m. a 6:00 a. m.'),
    ],
    casa: {
      nombre: 'Casa Rivas',
      descripcion: 'Vivo con mi hermana Mariela y con Max, nuestro rottweiler. Trabajo desde casa, así que valoro la calma. El cuarto tiene una ventana grande que da al jardín y su propio escritorio.',
      exinquilinos: 4,
      enQuad: '1 año',
    },
    miembros: [
      { nombre: 'Adrián', rol: 'Anfitrión', foto: foto('personas/adrian'), tono: '#dcfce7' },
      { nombre: 'Mariela', rol: 'Hermana', foto: null, tono: '#fce7f3' },
      { nombre: 'Max', rol: 'Perro', foto: foto('personas/max'), tono: '#fdebd3' },
    ],
    convivencia: [tag('moon-fill', 'Casa silenciosa'), tag('lock', 'Llave propia'), tag('paw-fill', 'Hay un perro'), tag('no-smoking-fill', 'No se fuma')],
    presentacion:
      'Hola, soy Adrián. Trabajo como diseñador y paso casi todo el día en casa con Mariela y Max, nuestro rottweiler, que es enorme pero muy tranquilo. Nos gusta el café de olla y los domingos de series. El cuarto da al jardín, así que entra luz toda la mañana.',
    desglose: { limpieza: 4.7, horarios: 4.5, comunicacion: 4.6, seguridad: 4.8 },
    resena: {
      iniciales: 'JP', nombre: 'José P.', carrera: 'Ingeniería Eléctrica · UCA', tiempo: '1 ciclo', fondo: '#dcfce7', color: '#15803d',
      texto: 'El cuarto es muy fresco por la ventana al jardín. Adrián y Mariela son muy respetuosos y el internet nunca falló.',
      textoCasa: 'Adrián siempre respondió rápido cuando algo se arruinaba. Max es el perro más tranquilo del mundo.',
    },
    chat: [
      m('anfitrion', 'Hola, Sofía. Soy Adrián. Gracias por tu interés en el cuarto.', '7:55 a. m.'),
      m('yo', 'Hola, Adrián. ¿El escritorio queda en el cuarto?', '8:01 a. m.'),
      m('anfitrion', 'Sí, el escritorio se queda y la ventana da al jardín.', '8:03 a. m.'),
      m('anfitrion', '¿Te gustaría agendar una visita esta semana?', '8:05 a. m.'),
    ],
    visita: 'Vie 13 de nov · 5:00 p. m.',
    filtros: { visitas: true, mascotas: true, banoPropio: false, wifi: true },
  },

  /* ---------- 4 · Pupilaje Aguilar (Carmen) ---------- */
  hogar: {
    tituloLargo: 'Pupilaje con terraza para estudiantes',
    tipo: 'Solo mujeres',
    resenas: 21,
    trayecto: '7 min al portón de La Sultana',
    colonia: 'Antiguo Cuscatlán Centro',
    municipio: 'Antiguo Cuscatlán',
    departamento: 'La Libertad',
    galeria: [null, ...fotos('casa-aguilar', ['cuarto-2', 'sala', 'comedor', 'cocina', 'estudio', 'terraza', 'lavanderia', 'fachada'])],
    deposito: '1 mes',
    anfitrion: { nombre: 'Carmen Aguilar', corto: 'Carmen', foto: null, rol: 'Anfitriona', detalle: 'Enfermera jubilada · vive con su hermana', firma: 'Anfitriona · Enfermera jubilada', genero: 'a' },
    incluye: [inc('privado', 'Cama y ropero'), inc('cocina', 'Horario libre'), inc('lavanderia', 'Lavadora disponible'), inc('wifi', 'Incluido'), inc('sala', 'Terraza y área de estudio'), inc('servicios', 'Incluidas')],
    reglas: [
      regla('clock-fill', 'Hora de llegada', 'Hasta las 10:30 p. m. Los viernes, hasta las 12:00 a. m.'),
      regla('group-fill', 'Visitas', 'Solo amigas, en la sala y hasta las 8:00 p. m.'),
      regla('cutlery-fill', 'Cocina', 'Libre. Cada inquilina tiene su gaveta.'),
      regla('info-circle-fill', 'Convivencia', 'Pupilaje solo para mujeres.'),
    ],
    casa: {
      nombre: 'Pupilaje Aguilar',
      descripcion: 'Somos dos hermanas jubiladas. Desde hace años recibimos estudiantes del interior del país en nuestra casa de dos plantas, con terraza, área de estudio arriba y lavandería.',
      exinquilinos: 14,
      enQuad: '3 años',
    },
    miembros: [
      { nombre: 'Carmen', rol: 'Anfitriona', foto: null, tono: '#fce7f3' },
      { nombre: 'Teresa', rol: 'Hermana', foto: null, tono: '#dce6ff' },
    ],
    convivencia: [tag('community-fill', 'Ambiente familiar'), tag('cutlery-fill', 'Cenamos juntas los viernes'), tag('clock-fill', 'Área de estudio'), tag('no-smoking-fill', 'No se fuma')],
    presentacion:
      'Hola, soy Carmen. Fui enfermera en el Hospital Rosales por 30 años y ahora vivo con mi hermana Teresa. Nos encanta cocinar pupusas los viernes y compartir la mesa con las muchachas. Arriba hay un área de estudio y la terraza es ideal para las tardes.',
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
    filtros: { visitas: true, mascotas: false, banoPropio: false, wifi: true },
  },

  /* ---------- 5 · Casa Hernández (Marta) ---------- */
  tranquila: {
    tituloLargo: 'Cuarto con cama matrimonial',
    tipo: 'Solo mujeres',
    resenas: 15,
    trayecto: '5 min al portón peatonal',
    colonia: 'Jardines de Guadalupe',
    municipio: 'Antiguo Cuscatlán',
    departamento: 'La Libertad',
    galeria: [null, ...fotos('casa-hernandez', ['sala', 'comedor', 'cocina', 'bano', 'fachada'])],
    deposito: '1 mes',
    anfitrion: { nombre: 'Marta Hernández', corto: 'Marta', foto: null, rol: 'Anfitriona', detalle: 'Contadora · mamá de una estudiante UCA', firma: 'Anfitriona · Contadora', genero: 'a' },
    incluye: [inc('privado', 'Cama matrimonial'), inc('cocina', 'Con horario'), inc('lavanderia', 'Una vez por semana'), inc('wifi', 'Incluido'), inc('sala', 'Con la familia'), inc('servicios', 'Incluidas')],
    reglas: [
      regla('clock-fill', 'Hora de llegada', 'Hasta las 10:00 p. m. Si llegas más tarde, avisas por WhatsApp.'),
      regla('group-fill', 'Visitas', 'Solo compañeras de estudio, en el comedor.'),
      regla('cutlery-fill', 'Cocina', 'Libre de 6:00 a. m. a 8:30 p. m.'),
      regla('info-circle-fill', 'Convivencia', 'Casa solo para mujeres. No se fuma.'),
    ],
    casa: {
      nombre: 'Casa Hernández',
      descripcion: 'Somos Marta, Jorge y nuestra hija Camila, que estudia en la UCA. Es una casa sencilla y muy tranquila a pocas cuadras del portón peatonal; ideal para concentrarse.',
      exinquilinos: 8,
      enQuad: '2 años',
    },
    miembros: [
      { nombre: 'Marta', rol: 'Mamá', foto: null, tono: '#fce7f3' },
      { nombre: 'Jorge', rol: 'Papá', foto: null, tono: '#dcfce7' },
      { nombre: 'Camila', rol: 'Hija', foto: null, tono: '#dce6ff' },
    ],
    convivencia: [tag('moon-fill', 'Ambiente tranquilo'), tag('clock-fill', 'Respetamos horarios de estudio'), tag('no-smoking-fill', 'No se fuma'), tag('community-fill', 'Estudiamos juntas')],
    presentacion:
      'Hola, soy Marta. Trabajo como contadora y mi esposo Jorge es profesor de colegio. Camila, nuestra hija, está en segundo año de Psicología, así que en casa todos entendemos las semanas de parciales. Somos ordenados, cenamos temprano y nos gusta el silencio.',
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

  /* ---------- 6 · Casa Portillo · Green House (Ernesto) ---------- */
  madreselva: {
    tituloLargo: 'Suite con baño privado y jardín',
    tipo: 'Casa de huéspedes',
    resenas: 10,
    trayecto: '12 min en bus a Los Próceres',
    colonia: 'Santa Elena',
    municipio: 'Antiguo Cuscatlán',
    departamento: 'La Libertad',
    galeria: [null, ...fotos('casa-portillo', ['bano', 'jardin', 'terraza', 'sala', 'comedor', 'cafe', 'entrada', 'fachada'])],
    deposito: '15 días',
    anfitrion: { nombre: 'Ernesto Portillo', corto: 'Ernesto', foto: foto('personas/ernesto'), rol: 'Anfitrión', detalle: 'Administra la casa de huéspedes Green House', firma: 'Anfitrión · Green House', genero: 'o' },
    incluye: [inc('privado', 'Con baño privado'), inc('cocina', 'Café y desayuno', 'Desayuno incluido'), inc('lavanderia', 'Incluida'), inc('wifi', 'Incluido'), inc('sala', 'Jardín y terraza', 'Jardín compartido'), inc('servicios', 'Aire acondicionado', 'Luz y A/C incluidos')],
    reglas: [
      regla('clock-fill', 'Hora de llegada', 'Hasta las 11:00 p. m. Hay timbre para avisar.'),
      regla('group-fill', 'Visitas', 'Permitidas en el jardín hasta las 9:00 p. m.'),
      regla('cutlery-fill', 'Comida', 'Desayuno y café incluidos todos los días.'),
      regla('info-circle-fill', 'Convivencia', 'No se fuma dentro de la casa.'),
    ],
    casa: {
      nombre: 'Green House',
      descripcion: 'Con mi esposa Patricia administramos Green House, una casa de huéspedes con jardín, terraza y estación de café. Recibimos estudiantes que buscan un lugar cómodo y en calma.',
      exinquilinos: 5,
      enQuad: '1 año',
    },
    miembros: [
      { nombre: 'Ernesto', rol: 'Anfitrión', foto: foto('personas/ernesto'), tono: '#dcfce7' },
      { nombre: 'Patricia', rol: 'Esposa', foto: null, tono: '#fce7f3' },
      { nombre: 'Diego', rol: 'Hijo', foto: null, tono: '#dce6ff' },
    ],
    convivencia: [tag('community-fill', 'Ambiente acogedor'), tag('cutlery-fill', 'Desayuno incluido'), tag('washing-fill', 'Lavandería incluida'), tag('no-smoking-fill', 'No se fuma')],
    presentacion:
      'Hola, soy Ernesto. Con Patricia cuidamos Green House desde hace años. Nos encantan las plantas: el jardín y la terraza son el corazón de la casa. La suite tiene baño privado y aire acondicionado, y en las mañanas siempre hay café recién hecho.',
    desglose: { limpieza: 5.0, horarios: 4.6, comunicacion: 4.8, seguridad: 4.9 },
    resena: {
      iniciales: 'RV', nombre: 'Rodrigo V.', carrera: 'Administración de Empresas · UCA', tiempo: '3 ciclos', fondo: '#fdebd3', color: '#b45309',
      texto: 'Tener baño propio y aire acondicionado cambia todo. Estudiar en el jardín por las tardes es lo mejor.',
      textoCasa: 'Don Ernesto y doña Patricia me hicieron sentir parte de la casa. El café de las mañanas no tiene comparación.',
    },
    chat: [
      m('anfitrion', '¡Hola, Sofía! Soy Ernesto. La suite está lista cuando quieras verla.', '5:30 p. m.'),
      m('yo', 'Hola, don Ernesto. ¿El baño es solo para la suite?', '5:41 p. m.'),
      m('anfitrion', 'Sí, el baño es privado y la lavandería está incluida.', '5:45 p. m.'),
    ],
    visita: 'Dom 15 de nov · 9:00 a. m.',
    filtros: { visitas: true, mascotas: false, banoPropio: true, wifi: true },
  },

  /* ---------- 7 · Casa Castro (Tony) ---------- */
  closet: {
    tituloLargo: 'Cuarto amueblado con escritorio',
    tipo: 'Casa de familia',
    resenas: 11,
    trayecto: '18 min en bus a La Sultana',
    colonia: 'Ciudad Merliot',
    municipio: 'Santa Tecla',
    departamento: 'La Libertad',
    galeria: [null, ...fotos('casa-tony', ['sala', 'sala-tv', 'comedor', 'cocina', 'lavanderia', 'fachada'])],
    deposito: '1 mes',
    anfitrion: { nombre: 'Tony Castro', corto: 'Tony', foto: foto('personas/tony'), rol: 'Anfitrión', detalle: 'Estudiante de Ingeniería · vive con su mamá', firma: 'Anfitrión · Estudiante de Ingeniería', genero: 'o' },
    incluye: [inc('privado', 'Cama, escritorio y silla'), inc('cocina', 'Libre'), inc('lavanderia', 'Lavadora en casa'), inc('wifi', 'Incluido'), inc('sala', 'Dos salas'), inc('servicios', 'Incluidas')],
    reglas: [
      regla('clock-fill', 'Hora de llegada', 'Hasta las 11:00 p. m. La residencial tiene vigilancia.'),
      regla('group-fill', 'Visitas', 'Permitidas en la sala hasta las 9:00 p. m.'),
      regla('cutlery-fill', 'Cocina', 'Libre. Cada quien lava lo suyo.'),
      regla('info-circle-fill', 'Convivencia', 'Hay dos conejos sueltos en el jardín.'),
    ],
    casa: {
      nombre: 'Casa Castro',
      descripcion: 'Vivo con mi mamá Isabel en una residencial cerrada con vigilancia. La casa tiene dos salas, cocina equipada y un jardín donde viven nuestros conejos, Copo y Canela.',
      exinquilinos: 7,
      enQuad: '2 años',
    },
    miembros: [
      { nombre: 'Tony', rol: 'Anfitrión', foto: foto('personas/tony'), tono: '#dce6ff' },
      { nombre: 'Isabel', rol: 'Mamá', foto: null, tono: '#fce7f3' },
      { nombre: 'Copo', rol: 'Conejo', foto: foto('personas/copo'), tono: '#fdebd3' },
      { nombre: 'Canela', rol: 'Coneja', foto: foto('personas/canela'), tono: '#fdebd3' },
    ],
    convivencia: [tag('moon-fill', 'Ambiente tranquilo'), tag('lock', 'Residencial con vigilancia'), tag('paw-fill', 'Hay dos conejos'), tag('no-smoking-fill', 'No se fuma')],
    presentacion:
      'Hola, soy Tony. Estudio Ingeniería y vivo con mi mamá, Isabel. Somos tranquilos: entre semana casi no estamos de día, así que la casa queda en silencio para estudiar. El cuarto ya tiene cama, escritorio y silla. Ah, y en el jardín viven Copo y Canela.',
    desglose: { limpieza: 4.9, horarios: 4.7, comunicacion: 4.8, seguridad: 4.9 },
    resena: {
      iniciales: 'MR', nombre: 'María R.', carrera: 'Mercadeo · UCA', tiempo: '2 ciclos', fondo: '#fce7f3', color: '#be185d',
      texto: 'El cuarto ya venía amueblado y la residencial es muy segura. El bus a la UCA pasa a la entrada.',
      textoCasa: 'Tony y doña Isabel son muy amables. Ver a los conejos en el jardín me alegraba los días de parciales.',
    },
    chat: [
      m('anfitrion', 'Hola, Sofía. Soy Tony. El cuarto se libera en enero, si quieres te aviso.', '4:12 p. m.'),
      m('yo', '¡Gracias! ¿El cuarto tiene escritorio?', '4:20 p. m.'),
      m('anfitrion', 'Sí, tiene escritorio y silla de oficina.', '4:22 p. m.'),
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
