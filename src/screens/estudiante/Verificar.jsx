import { AnimatePresence, motion } from 'motion/react'
import Step from './Step.jsx'
import Heading from './Heading.jsx'
import Button from '../../components/Button.jsx'
import Icon from '../../components/Icon.jsx'
import TextField from '../../components/TextField.jsx'
import Note from '../../components/Note.jsx'
import { fadeUp } from '../../components/motion.js'
import { METODOS, UNIVERSIDADES, buscar } from '../../data/estudiante.js'
import mailIcon from '../../assets/icons/email.svg'

/** Opción · Acción: fila con ícono, textos y flecha; abre su propio flujo. */
function OpcionAccion({ titulo, desc, icon, onClick }) {
  return (
    <motion.button type="button" className="option option--action" variants={fadeUp} whileTap={{ scale: 0.99 }} onClick={onClick}>
      <Icon name={icon} size={24} className="option__icon option__icon--svg" />
      <span className="option__texts">
        <span className="option__title">{titulo}</span>
        <span className="option__desc">{desc}</span>
      </span>
      <Icon name="nav-arrow-right" size={18} className="option__chevron" />
    </motion.button>
  )
}

/** E02 · Verifica que eres estudiante: dos caminos separados (correo o carné). */
export default function Verificar({ actualizar, ir }) {
  return (
    <Step>
      <Heading title="Verifica que eres estudiante">
        Elige cómo comprobarlo. Con esto tu perfil muestra el sello de verificado.
      </Heading>

      <div className="heading" style={{ gap: 12 }}>
        {METODOS.map((m) => (
          <OpcionAccion
            key={m.id}
            titulo={m.titulo}
            desc={m.desc}
            icon={m.icon}
            onClick={() => {
              actualizar({ metodo: m.id })
              ir(m.id === 'correo' ? 'verificar-correo' : 'verificar-carne')
            }}
          />
        ))}
      </div>

      <Note iconName="hero-lock-closed-solid">
        Solo usamos tu correo o carné para confirmar que estudias. No se muestra en tu perfil.
      </Note>

      <motion.button type="button" className="link est-help" variants={fadeUp}>
        ¿Problemas para verificar? Escríbenos
      </motion.button>
    </Step>
  )
}

/** E02a / E02a2 · Con tu correo universitario. */
export function VerificarCorreo({ datos, actualizar, ir }) {
  const uni = buscar(UNIVERSIDADES, datos.universidad)
  const valido = /^\S+@\S+\.\S+$/.test(datos.correoUni)
  return (
    <Step
      actions={
        <Button onClick={() => ir('codigo')} disabled={!valido}>
          Enviar código
        </Button>
      }
    >
      <Heading title="Con tu correo universitario">Te enviaremos un código para confirmar que estudias.</Heading>
      <motion.div variants={fadeUp}>
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
      <Note iconName="hero-lock-closed-solid">Solo lo usamos para confirmar que estudias. No se muestra en tu perfil.</Note>
    </Step>
  )
}

const CONSEJOS = ['Que se vea tu nombre completo', 'Que se vea la fecha de vigencia', 'Sin reflejos ni partes cortadas']

/** E02b / E02b2 · Con tu carné estudiantil. */
export function VerificarCarne({ datos, actualizar, ir, cuenta }) {
  const uni = buscar(UNIVERSIDADES, datos.universidad)
  const cargado = datos.carne
  const nombre = cuenta?.name?.trim() || 'Sofía Rivas'
  const anio = { 1: '1.º', 2: '2.º', 3: '3.º', 4: '4.º', 5: '5.º' }[datos.anio] || '2.º'
  const subir = () => actualizar({ carne: true })

  return (
    <Step
      actions={
        <Button onClick={() => ir('carne-revision')} disabled={!cargado}>
          Enviar carné
        </Button>
      }
    >
      <Heading title="Con tu carné estudiantil">Sube una foto clara de tu carné vigente. Lo revisamos en 24 horas.</Heading>

      <AnimatePresence mode="wait" initial={false}>
        {!cargado ? (
          <motion.button
            key="subir"
            type="button"
            className="carne-drop"
            onClick={subir}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            whileTap={{ scale: 0.99 }}
          >
            <span className="carne-drop__icon">
              <Icon name="hero-camera-solid" size={28} />
            </span>
            <span className="carne-drop__text">
              <b>Sube una foto de tu carné</b>
              <small>Toca para tomar una foto o elegir una de tu galería</small>
            </span>
            <span className="carne-drop__btn">Elegir foto</span>
          </motion.button>
        ) : (
          <motion.div
            key="cargado"
            className="carne-card"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 160, damping: 20 }}
          >
            <div className="carne">
              <span className="carne__uni">{(uni?.nombre || 'Universidad Centroamericana').replace(/\s*\(.*\)/, '').toUpperCase()}</span>
              <div className="carne__datos">
                {datos.foto ? <img src={datos.foto} alt="" /> : <span className="carne__ph"><Icon name="user-solid" size={28} /></span>}
                <span>
                  <b>{nombre}</b>
                  <small>
                    {datos.carrera || 'Arquitectura'} · {anio} año
                  </small>
                </span>
              </div>
              <span className="carne__vig">Carné 2026 · Vigente hasta dic 2026</span>
            </div>
            <div className="carne-card__estado">
              <span>
                <Icon name="check-circle-fill" size={18} />
                Foto cargada
              </span>
              <button type="button" className="link link--small" onClick={() => actualizar({ carne: false })}>
                Cambiar foto
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="carne-tips" variants={fadeUp}>
        <b>Para que lo aprobemos más rápido</b>
        {CONSEJOS.map((c) => (
          <span key={c}>
            <Icon name="check-circle-fill" size={18} />
            {c}
          </span>
        ))}
      </motion.div>
    </Step>
  )
}

/** E02c · Estamos revisando tu carné. */
export function CarneRevision({ ir }) {
  return (
    <Step actions={<Button onClick={() => ir('foto')}>Continuar</Button>}>
      <div className="est-center">
        <motion.span
          className="est-center__icon est-center__icon--amber"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 140, damping: 18 }}
        >
          <Icon name="clock-fill" size={40} />
        </motion.span>
        <motion.div variants={fadeUp}>
          <h1>Estamos revisando tu carné</h1>
          <p>Te avisaremos en menos de 24 horas. Mientras tanto, puedes seguir completando tu perfil.</p>
        </motion.div>
      </div>
      <Note iconName="hero-envelope-solid">Cuando lo aprobemos, tu perfil mostrará el sello de estudiante verificado.</Note>
    </Step>
  )
}
