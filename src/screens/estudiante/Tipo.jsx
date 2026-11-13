import Step from './Step.jsx'
import Heading from './Heading.jsx'
import Button from '../../components/Button.jsx'
import SelectCard from '../../components/SelectCard.jsx'
import { TIPOS } from '../../data/estudiante.js'

/** E09 · ¿Qué tipo de Quad buscas? — selección múltiple. */
export default function Tipo({ datos, alternar, siguiente }) {
  return (
    <Step actions={<Button onClick={siguiente}>Continuar</Button>}>
      <Heading title="¿Qué tipo de Quad buscas?">Puedes elegir más de uno.</Heading>

      <div className="heading" aria-label="Tipos de quad" style={{ gap: 10 }}>
        {TIPOS.map((t) => (
          <SelectCard
            key={t.id}
            multiple
            title={t.titulo}
            description={t.desc}
            icon={t.icon}
            iconSelected={t.iconSel}
            selected={datos.tipos.includes(t.id)}
            onSelect={() => alternar('tipos', t.id)}
          />
        ))}
      </div>
    </Step>
  )
}
