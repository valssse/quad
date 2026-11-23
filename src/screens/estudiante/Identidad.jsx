import Step from './Step.jsx'
import Heading from './Heading.jsx'
import Button from '../../components/Button.jsx'
import SelectCard from '../../components/SelectCard.jsx'
import Note from '../../components/Note.jsx'
import { GENEROS } from '../../data/estudiante.js'

/** E10b · ¿Cómo te identificas? — antes de Convivencia; no se muestra en el perfil público. */
export default function Identidad({ datos, actualizar, alternar, siguiente }) {
  const elegir = (id) => {
    // Si cambia, se quita la preferencia "Solo mujeres/hombres" que ya no aplica
    const quitar = { mujer: 'hombres', hombre: 'mujeres', nd: null }[id]
    actualizar({ genero: id })
    if (quitar && datos.convivencia.includes(quitar)) alternar('convivencia', quitar)
    if (id === 'nd') ['mujeres', 'hombres'].forEach((x) => datos.convivencia.includes(x) && alternar('convivencia', x))
  }
  return (
    <Step actions={<Button onClick={siguiente} disabled={!datos.genero}>Continuar</Button>}>
      <Heading title="¿Cómo te identificas?">
        Lo usamos para mostrarte casas donde te sientas cómoda o cómodo. Solo tú lo ves.
      </Heading>
      <div className="heading" role="radiogroup" aria-label="Cómo te identificas" style={{ gap: 10 }}>
        {GENEROS.map((g) => (
          <SelectCard
            key={g.id}
            title={g.titulo}
            description={g.desc}
            icon={g.icon}
            iconSelected={g.iconSel}
            selected={datos.genero === g.id}
            onSelect={() => elegir(g.id)}
          />
        ))}
      </div>
      <Note iconName="hero-lock-closed-solid">No aparece en tu perfil público. Puedes cambiarlo cuando quieras desde tu perfil.</Note>
    </Step>
  )
}
