import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Step from '../estudiante/Step.jsx'
import Heading from '../estudiante/Heading.jsx'
import Avatar from '../estudiante/Avatar.jsx'
import ChipGroups from '../estudiante/ChipGroups.jsx'
import Button from '../../components/Button.jsx'
import Chip from '../../components/Chip.jsx'
import Icon from '../../components/Icon.jsx'
import Note from '../../components/Note.jsx'
import OtpInput from '../../components/OtpInput.jsx'
import SelectCard from '../../components/SelectCard.jsx'
import { fadeUp } from '../../components/motion.js'
import { Campo, FilaFoto, FilaSwitch } from './ui.jsx'
import {
  DISTANCIAS,
  DOCUMENTOS,
  PRIVACIDAD,
  TEN_A_LA_MANO,
  TIPOS_ANFITRION,
  UNIVERSIDADES,
  VIDA_EN_CASA,
} from '../../data/anfitrion.js'

/* ================= Parte 1 · Perfil del anfitrión (n/12) ================= */

/** A01 · ¿Cómo ofreces tu espacio? */
export function Tipo({ datos, actualizar, siguiente }) {
  return (
    <Step actions={<Button onClick={siguiente}>Continuar</Button>}>
      <Heading title="¿Cómo ofreces tu espacio?">Esto define cómo te presentamos ante los estudiantes.</Heading>
      <div className="heading" role="radiogroup" aria-label="Tipo de anfitrión" style={{ gap: 10 }}>
        {TIPOS_ANFITRION.map((t) => (
          <SelectCard
            key={t.id}
            title={t.titulo}
            description={t.desc}
            icon={t.icon}
            iconSelected={t.iconSel}
            selected={datos.tipo === t.id}
            onSelect={() => actualizar({ tipo: t.id })}
          />
        ))}
      </div>
      <Note iconName="info-circle-fill">Recibes estudiantes de cualquier universidad cercana.</Note>
    </Step>
  )
}

/** A02 · Verifica tu identidad — tipo de documento + frente y reverso. */
export function Identidad({ datos, actualizar, siguiente }) {
  const listo = datos.docFrente && datos.docReverso
  return (
    <Step actions={<Button onClick={siguiente} disabled={!listo}>Continuar</Button>}>
      <Heading title="Verifica tu identidad">Protege a los estudiantes y a ti. Solo toma un par de minutos.</Heading>

      <motion.div className="section" variants={fadeUp}>
        <p className="section-label">Tipo de documento</p>
        <div className="chips" role="radiogroup">
          {DOCUMENTOS.map((d) => (
            <Chip key={d.id} label={d.label} selected={datos.documento === d.id} onToggle={() => actualizar({ documento: d.id })} />
          ))}
        </div>
      </motion.div>

      <div className="heading" style={{ gap: 12 }}>
        <FilaFoto
          titulo="Frente del documento"
          desc="Toca para tomar o subir una foto"
          valor={datos.docFrente}
          onChange={(url) => actualizar({ docFrente: url })}
          captura="environment"
        />
        <FilaFoto
          titulo="Reverso del documento"
          desc="Toca para tomar o subir una foto"
          valor={datos.docReverso}
          onChange={(url) => actualizar({ docReverso: url })}
          captura="environment"
        />
      </div>

      <Note iconName="hero-lock-closed-solid">Tus datos se guardan cifrados y nunca se muestran en tu perfil.</Note>
    </Step>
  )
}

const CONSEJOS = ['Rostro centrado y con buena luz', 'Sin lentes oscuros ni gorra', 'Solo tú en la foto']

/** A03a · Tómate una selfie — abre la hoja A03b. */
export function Selfie({ abrir }) {
  return (
    <Step className="step--gap28" actions={<Button onClick={() => abrir('selfie')}>Tomar selfie</Button>}>
      <Heading title="Tómate una selfie">
        La comparamos con tu documento para confirmar que eres tú. Solo la ve el equipo de Quad: no se muestra en tu
        perfil.
      </Heading>
      <motion.button type="button" variants={fadeUp} onClick={() => abrir('selfie')} aria-label="Tomar selfie">
        <Avatar variant="add" />
      </motion.button>
      <motion.ul className="tips" variants={fadeUp}>
        {CONSEJOS.map((c) => (
          <li key={c}>
            <Icon name="check-circle-fill" size={18} />
            {c}
          </li>
        ))}
      </motion.ul>
    </Step>
  )
}

/** A03c · Revisa tu selfie. */
export function RevisarSelfie({ datos, siguiente, abrir }) {
  return (
    <Step
      className="step--gap28"
      actions={
        <>
          <Button onClick={siguiente}>Usar esta selfie</Button>
          <Button variant="outline" onClick={() => abrir('selfie')}>
            Repetir selfie
          </Button>
        </>
      }
    >
      <Heading title="Revisa tu selfie">Confirma que se vea tu rostro completo y con buena luz.</Heading>
      <motion.div variants={fadeUp}>
        <Avatar variant="ready" photo={datos.selfie} />
      </motion.div>
      <Note iconName="hero-lock-closed-solid">
        La comparamos con tu documento. No se muestra en tu perfil ni se comparte con estudiantes.
      </Note>
    </Step>
  )
}

/** Deja solo dígitos y da formato "7123 4567". */
const formatoTelefono = (valor) => {
  const d = valor.replace(/\D/g, '').slice(0, 8)
  return d.length > 4 ? `${d.slice(0, 4)} ${d.slice(4)}` : d
}

/** A04 · ¿Cuál es tu número? */
export function Telefono({ datos, actualizar, siguiente }) {
  const valido = datos.telefono.replace(/\D/g, '').length === 8
  return (
    <Step actions={<Button onClick={siguiente} disabled={!valido}>Enviar código</Button>}>
      <Heading title="¿Cuál es tu número?">
        Lo usamos para avisarte de solicitudes y visitas. No se comparte sin tu permiso.
      </Heading>
      <Campo label="Número de teléfono" icon="chat-bubble">
        {(id) => (
          <>
            <span className="field__prefix">+503</span>
            <input
              id={id}
              className="field__input"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="7000 0000"
              value={datos.telefono}
              onChange={(e) => actualizar({ telefono: formatoTelefono(e.target.value) })}
            />
          </>
        )}
      </Campo>
      <Note iconName="info-circle-fill">Te enviaremos un código por SMS para confirmarlo.</Note>
    </Step>
  )
}

/** A05 · Ingresa el código (SMS) con cuenta regresiva para reenviar. */
export function CodigoSms({ datos, siguiente, ir }) {
  const [digitos, setDigitos] = useState(Array(6).fill(''))
  const [segundos, setSegundos] = useState(30)
  const completo = digitos.every(Boolean)

  useEffect(() => {
    if (segundos <= 0) return
    const t = setTimeout(() => setSegundos((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [segundos])

  return (
    <Step
      actions={
        <>
          <Button onClick={siguiente} disabled={!completo}>
            Verificar
          </Button>
          <button type="button" className="link" onClick={() => ir('telefono')}>
            Cambiar número
          </button>
        </>
      }
    >
      <Heading title="Ingresa el código">Lo enviamos por SMS al +503 {datos.telefono || '7123 4567'}.</Heading>
      <OtpInput digits={digitos} onChange={setDigitos} />
      <motion.p className="resend" variants={fadeUp}>
        ¿No te llegó?
        {segundos > 0 ? (
          <span className="resend__timer">Reenviar en 0:{String(segundos).padStart(2, '0')}</span>
        ) : (
          <button type="button" className="link" onClick={() => setSegundos(30)}>
            Reenviar código
          </button>
        )}
      </motion.p>
    </Step>
  )
}

/** A06 · Presenta tu casa. */
export function Casa({ datos, actualizar, siguiente }) {
  return (
    <Step className="step--long" actions={<Button onClick={siguiente}>Continuar</Button>}>
      <Heading title="Presenta tu casa">Un nombre y una descripción ayudan a que los estudiantes te recuerden.</Heading>
      <Campo
        label="Nombre de la casa"
        icon="home"
        placeholder="Ej. Casa Martínez"
        value={datos.nombreCasa}
        onChange={(e) => actualizar({ nombreCasa: e.target.value })}
      />
      <Campo
        label="Colonia o zona"
        icon="map-pin"
        placeholder="Ej. Jardines de Guadalupe, Antiguo Cuscatlán"
        value={datos.zona}
        onChange={(e) => actualizar({ zona: e.target.value })}
      />
      <motion.div className="section" variants={fadeUp} style={{ gap: 8 }}>
        <label className="section-label" htmlFor="descripcion-casa">
          Descripción
        </label>
        <textarea
          id="descripcion-casa"
          className="textarea textarea--104"
          placeholder="Ej. Somos una familia tranquila. Rentamos el cuarto de nuestro hijo que se fue a estudiar fuera."
          value={datos.descripcion}
          onChange={(e) => actualizar({ descripcion: e.target.value })}
        />
      </motion.div>
      <Note iconName="hero-lock-closed-solid">La dirección exacta solo se comparte cuando se firma el contrato.</Note>
    </Step>
  )
}

/** A08 · ¿Cómo es vivir en tu casa? — chips grises de selección múltiple. */
export function Ambiente({ datos, alternar, actualizar, siguiente }) {
  const [nueva, setNueva] = useState(null)
  const grupos = VIDA_EN_CASA.map((g, i) =>
    i === 1 ? { ...g, items: [...g.items, ...datos.vidaExtra.map((t) => ({ id: `extra:${t}`, label: t, icon: 'sparks', iconSel: 'hero-sparkles-solid' }))] } : g,
  )
  const agregar = () => {
    const t = (nueva || '').trim()
    if (t && !datos.vidaExtra.includes(t)) actualizar({ vidaExtra: [...datos.vidaExtra, t], vida: [...datos.vida, `extra:${t}`] })
    setNueva(null)
  }
  return (
    <Step className="step--long" actions={<Button onClick={siguiente}>Continuar</Button>}>
      <Heading title="¿Cómo es vivir en tu casa?">Elige lo que mejor describe el día a día. Aparecerá en tu perfil.</Heading>
      <ChipGroups grupos={grupos} seleccion={datos.vida} onToggle={(id) => alternar('vida', id)} />
      <AnimatePresence initial={false} mode="wait">
        {nueva === null ? (
          <motion.button key="link" type="button" className="link link--start" variants={fadeUp} onClick={() => setNueva('')}>
            + Agregar otra
          </motion.button>
        ) : (
          <motion.form
            key="form"
            className="inline-add"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onSubmit={(e) => {
              e.preventDefault()
              agregar()
            }}
          >
            <div className="field__control">
              <input
                autoFocus
                className="field__input"
                placeholder="Ej. Desayunamos temprano"
                value={nueva}
                onChange={(e) => setNueva(e.target.value)}
                onBlur={agregar}
              />
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </Step>
  )
}

const MAX_PRESENTACION = 400

/** A09 · Preséntate a los estudiantes. */
export function Presentacion({ datos, actualizar, siguiente }) {
  const input = useRef(null)
  const elegir = (e) => {
    const file = e.target.files?.[0]
    if (file) actualizar({ fotoAnfitrion: URL.createObjectURL(file) })
    e.target.value = ''
  }
  return (
    <Step className="step--long" actions={<Button onClick={siguiente}>Continuar</Button>}>
      <Heading title="Preséntate a los estudiantes">
        Habla en primera persona: quién eres, a qué te dedicas y qué esperas de quien llegue.
      </Heading>

      <motion.button type="button" className="host-photo" variants={fadeUp} whileTap={{ scale: 0.98 }} onClick={() => input.current.click()}>
        <span className="host-photo__bubble">
          <AnimatePresence initial={false} mode="popLayout">
            {datos.fotoAnfitrion ? (
              <motion.img key="img" src={datos.fotoAnfitrion} alt="" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} />
            ) : (
              <Icon key="icon" name="user" size={36} />
            )}
          </AnimatePresence>
        </span>
        <span className="option__texts">
          <span className="host-photo__title">{datos.fotoAnfitrion ? 'Cambiar tu foto' : 'Agregar tu foto'}</span>
          <span className="option__desc">Aparece junto a tu presentación</span>
        </span>
        <input ref={input} type="file" accept="image/*" hidden onChange={elegir} />
      </motion.button>

      <motion.div className="section" variants={fadeUp} style={{ gap: 8 }}>
        <label className="section-label" htmlFor="presentacion">
          Tu presentación
        </label>
        <textarea
          id="presentacion"
          className="textarea textarea--128"
          maxLength={MAX_PRESENTACION}
          placeholder="Ej. Hola, soy Rosa. Trabajo desde casa y me gusta que haya un ambiente tranquilo. Buscamos a alguien responsable y respetuoso."
          value={datos.presentacion}
          onChange={(e) => actualizar({ presentacion: e.target.value })}
        />
        <p className="counter">
          {datos.presentacion.length}/{MAX_PRESENTACION}
        </p>
      </motion.div>
    </Step>
  )
}

/** A10 · Tú decides qué se muestra. */
export function Privacidad({ datos, actualizar, siguiente }) {
  return (
    <Step actions={<Button onClick={siguiente}>Continuar</Button>}>
      <Heading title="Tú decides qué se muestra">Puedes cambiar esto cuando quieras desde tu perfil.</Heading>
      <div className="heading" style={{ gap: 12 }}>
        {PRIVACIDAD.map((p) => (
          <FilaSwitch
            key={p.id}
            icon={p.icon}
            titulo={p.titulo}
            desc={p.desc}
            checked={datos.privacidad[p.id]}
            onChange={(v) => actualizar({ privacidad: { ...datos.privacidad, [p.id]: v } })}
          />
        ))}
      </div>
    </Step>
  )
}

const normalizar = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

/** A11 · ¿Qué universidades te quedan cerca? — selección múltiple. */
export function Universidades({ datos, alternar, siguiente }) {
  const [busqueda, setBusqueda] = useState('')
  const lista = UNIVERSIDADES.filter((u) => normalizar(u.nombre).includes(normalizar(busqueda)))
  return (
    <Step actions={<Button onClick={siguiente} disabled={!datos.universidades.length}>Continuar</Button>}>
      <Heading title="¿Qué universidades te quedan cerca?">Aparecerás en las búsquedas de estudiantes de esos campus.</Heading>
      <Campo label="Agregar universidad" icon="search" type="search" placeholder="Busca por nombre" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
      <div className="heading" style={{ gap: 10 }}>
        <AnimatePresence initial={false}>
          {lista.map((u) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
            >
              <SelectCard
                multiple
                title={u.corto}
                description={DISTANCIAS[u.id]}
                selected={datos.universidades.includes(u.id)}
                onSelect={() => alternar('universidades', u.id)}
                leading={
                  <span className="uni-logo">
                    <img src={u.logo} width={u.w} height={u.h} alt="" />
                  </span>
                }
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Step>
  )
}

/** A12 · ¡Tu perfil está listo! — publicar ahora o después. */
export function PerfilListo({ datos, actualizar, siguiente, onFinish }) {
  const ahora = datos.publicar === 'ahora'
  return (
    <Step actions={<Button onClick={ahora ? siguiente : onFinish}>Continuar</Button>}>
      <Heading title="¡Tu perfil está listo!">
        Ahora publica el cuarto que ofreces. Mientras no lo hagas, los estudiantes no podrán encontrarte.
      </Heading>
      <div className="heading" role="radiogroup" style={{ gap: 10 }}>
        <SelectCard
          title="Publicar ahora"
          description="Te toma unos 10 minutos"
          icon="hero-globe-americas"
          iconSelected="hero-globe-americas-solid"
          selected={ahora}
          onSelect={() => actualizar({ publicar: 'ahora' })}
        />
        <SelectCard
          title="Hacerlo después"
          description="Vas a tu panel y lo publicas cuando quieras"
          icon="clock"
          iconSelected="clock-fill"
          selected={!ahora}
          onSelect={() => actualizar({ publicar: 'despues' })}
        />
      </div>
      <AnimatePresence initial={false}>
        {ahora && (
          <motion.div
            className="checklist-card"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28 }}
          >
            <div className="checklist-card__inner">
              <p className="checklist-card__title">Ten a la mano</p>
              {TEN_A_LA_MANO.map((t) => (
                <p key={t} className="check-item">
                  <Icon name="check-circle-fill" size={20} />
                  {t}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Step>
  )
}
