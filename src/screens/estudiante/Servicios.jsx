import Step from './Step.jsx'
import Heading from './Heading.jsx'
import ChipGroups from './ChipGroups.jsx'
import Button from '../../components/Button.jsx'
import { SERVICIOS } from '../../data/estudiante.js'

/** E10 · ¿Qué no puede faltar? — servicios, cuarto y extras. */
export default function Servicios({ datos, alternar, siguiente }) {
  return (
    <Step className="step--long" actions={<Button onClick={siguiente}>Continuar</Button>}>
      <Heading title="¿Qué no puede faltar?">
        Marca lo que necesitas sí o sí. Lo usamos para filtrar tus resultados.
      </Heading>
      <ChipGroups grupos={SERVICIOS} seleccion={datos.servicios} onToggle={(id) => alternar('servicios', id)} />
    </Step>
  )
}
