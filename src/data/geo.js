/**
 * Ubicaciones reales (OpenStreetMap / Nominatim) para el mapa y los iframes.
 * Coordenadas en [latitud, longitud].
 */

/** Universidad Centroamericana José Simeón Cañas (Bulevar Los Próceres, Antiguo Cuscatlán). */
export const UCA = { nombre: 'UCA', pos: [13.68065, -89.23588] }

/** Vista inicial del mapa: alrededor de la UCA y las colonias cercanas. */
export const CENTRO_INICIAL = [13.6762, -89.2412]
export const ZOOM_INICIAL = 15.25

/** Centro de cada zona del buscador (para "Ver en el mapa"). */
export const ZONAS_POS = {
  'antiguo-cuscatlan': [13.6765, -89.2395],
  'antiguo-cuscatlan-centro': [13.6728, -89.2466],
  'jardines-de-guadalupe': [13.677, -89.2378],
  'la-sultana': [13.6789, -89.2409],
  'santa-elena': [13.6732, -89.2554],
  'ciudad-merliot': [13.6805, -89.2735],
  escalon: [13.7025, -89.243],
}

/** Distancia en km (haversine). */
export function distanciaKm([la1, lo1], [la2, lo2]) {
  const r = (g) => (g * Math.PI) / 180
  const dLa = r(la2 - la1)
  const dLo = r(lo2 - lo1)
  const a = Math.sin(dLa / 2) ** 2 + Math.cos(r(la1)) * Math.cos(r(la2)) * Math.sin(dLo / 2) ** 2
  return 6371 * 2 * Math.asin(Math.sqrt(a))
}

export const textoDistancia = (km) => (km < 1 ? `${Math.round((km * 1000) / 10) * 10} m` : `${km.toFixed(1)} km`)

/**
 * iframe de OpenStreetMap centrado en el quad (el pin azul lo dibuja la app justo en el centro)
 * y con espacio suficiente para que la UCA también se vea.
 */
export function osmEmbed(pos) {
  const medLa = Math.max(Math.abs(UCA.pos[0] - pos[0]) * 1.9, 0.0022)
  const medLo = Math.max(Math.abs(UCA.pos[1] - pos[1]) * 1.9, 0.0032)
  const bbox = [pos[1] - medLo, pos[0] - medLa, pos[1] + medLo, pos[0] + medLa].map((n) => n.toFixed(5)).join(',')
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik`
}

/** Ruta del quad a la UCA en openstreetmap.org (a pie o en carro). */
export function osmRuta(pos, modo = 'walking') {
  const motor = modo === 'walking' ? 'fossgis_osrm_foot' : 'fossgis_osrm_car'
  return `https://www.openstreetmap.org/directions?engine=${motor}&route=${pos[0]}%2C${pos[1]}%3B${UCA.pos[0]}%2C${UCA.pos[1]}`
}
