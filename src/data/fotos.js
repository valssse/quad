/**
 * Fotos reales del proyecto (sesión fotográfica de las casas, carpeta "FOTOS QUAD").
 * Convertidas a WebP: galerías a 1100 px, bienvenida a 640 px y personas/mascotas a 480 px.
 * Ninguna foto se repite en la app: cada una tiene un solo lugar.
 */
const archivos = import.meta.glob('../assets/fotos/**/*.webp', { eager: true, import: 'default' })

/** foto('casa-adrian/cuarto') → URL de la imagen. */
export function foto(ruta) {
  const url = archivos[`../assets/fotos/${ruta}.webp`]
  if (!url) throw new Error(`Falta la foto ${ruta}`)
  return url
}

/** Varias fotos de una misma casa: fotos('casa-tony', ['cuarto', 'sala']). */
export const fotos = (casa, nombres) => nombres.map((n) => foto(`${casa}/${n}`))
