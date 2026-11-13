import {
  CONVIVENCIA, DURACIONES, ENTRADAS, FECHAS, INTERESES, SERVICIOS, TIPOS, TRANSPORTES, UNIVERSIDADES,
  buscar, capitalizar, formatoRango, todosLosItems, unir,
} from '../../data/estudiante.js'

/** Textos de resumen calculados a partir de lo que eligió la persona (E12b y E13). */
export function resumir(datos) {
  const uni = buscar(UNIVERSIDADES, datos.universidad)
  const entrada = buscar(ENTRADAS, datos.entrada)
  const fecha = buscar(FECHAS, datos.mudanza)
  const duracion = buscar(DURACIONES, datos.duracion)
  const tipos = TIPOS.filter((t) => datos.tipos.includes(t.id))
  const transporte = TRANSPORTES.filter((t) => datos.transporte.includes(t.id)).map((t) => t.label.toLowerCase())
  const preferencias = CONVIVENCIA[0].items.filter((i) => datos.convivencia.includes(i.id))

  return {
    universidad: [uni?.corto, entrada?.titulo].filter(Boolean).join(' · '),
    presupuesto: formatoRango(datos.presupuesto),
    tipoLargo: tipos.length ? capitalizar(unir(tipos.map((t, i) => (i ? t.titulo.toLowerCase() : t.titulo)))) : 'Cualquier tipo',
    tipoCorto: tipos.length ? capitalizar(tipos.map((t) => t.corto).join(', ')) : 'Cualquiera',
    mudanza: fecha?.titulo || '—',
    mudanzaLarga: [fecha?.titulo, duracion?.texto].filter(Boolean).join(', '),
    referencia: [entrada?.titulo, transporte.length ? unir(transporte) : null].filter(Boolean).join(' · '),
    convivencia: preferencias.length ? capitalizar(preferencias.map((p) => p.corto).join(', ')) : 'Sin preferencias',
    intereses: INTERESES.filter((i) => datos.intereses.includes(i.id)),
    convivenciaTags: todosLosItems(CONVIVENCIA).filter((i) => datos.convivencia.includes(i.id)),
    serviciosTags: todosLosItems(SERVICIOS).filter((i) => datos.servicios.includes(i.id)),
  }
}
