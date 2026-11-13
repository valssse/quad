/** Indicador de pasos de la bienvenida: el activo se estira a 22px. */
export default function Pagination({ total, current }) {
  return (
    <div className="pagination" role="tablist" aria-label="Paso de bienvenida">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          role="tab"
          aria-selected={i === current}
          aria-label={`Paso ${i + 1} de ${total}`}
          className={`pagination__dot ${i === current ? 'pagination__dot--active' : ''}`}
        />
      ))}
    </div>
  )
}
