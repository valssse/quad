import { AnimatePresence, motion } from 'motion/react'
import Step from './Step.jsx'
import Heading from './Heading.jsx'
import Button from '../../components/Button.jsx'
import SelectCard from '../../components/SelectCard.jsx'
import TextField from '../../components/TextField.jsx'
import Note from '../../components/Note.jsx'
import { METODOS, UNIVERSIDADES, buscar } from '../../data/estudiante.js'
import mailIcon from '../../assets/icons/email.svg'

/** E02 · Verifica que eres estudiante — correo universitario o carné. */
export default function Verificar({ datos, actualizar, ir }) {
  const uni = buscar(UNIVERSIDADES, datos.universidad)
  const porCorreo = datos.metodo === 'correo'
  const correoValido = /^\S+@\S+\.\S+$/.test(datos.correoUni)

  // El carné se revisa en 24 h: se sigue con la foto de perfil mientras tanto
  const continuar = () => ir(porCorreo ? 'codigo' : 'foto')

  return (
    <Step
      actions={
        <Button onClick={continuar} disabled={porCorreo && !correoValido}>
          {porCorreo ? 'Enviar código' : 'Continuar'}
        </Button>
      }
    >
      <Heading title="Verifica que eres estudiante">
        Elige cómo comprobarlo. Con esto tu perfil muestra el sello de verificado.
      </Heading>

      <div className="heading" role="radiogroup" aria-label="Método" style={{ gap: 10 }}>
        {METODOS.map((m) => (
          <SelectCard
            key={m.id}
            title={m.titulo}
            description={m.desc}
            icon={m.icon}
            iconSelected={m.iconSel}
            selected={datos.metodo === m.id}
            onSelect={() => actualizar({ metodo: m.id })}
          />
        ))}
      </div>

      <AnimatePresence initial={false}>
        {porCorreo && (
          <motion.div
            key="correo"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28 }}
            style={{ overflow: 'hidden' }}
          >
            <TextField
              label="Correo universitario"
              icon={mailIcon}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder={`nombre@${uni?.dominio || 'uca.edu.sv'}`}
              value={datos.correoUni}
              onChange={(e) => actualizar({ correoUni: e.target.value })}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Note iconName="hero-lock-closed-solid">
        Solo lo usamos para confirmar que estudias. No se muestra en tu perfil.
      </Note>
    </Step>
  )
}
