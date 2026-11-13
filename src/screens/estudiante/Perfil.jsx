import { motion } from 'motion/react'
import Step from './Step.jsx'
import Heading from './Heading.jsx'
import PerfilMini from './PerfilMini.jsx'
import Button from '../../components/Button.jsx'
import Icon from '../../components/Icon.jsx'
import { fadeUp } from '../../components/motion.js'
import { resumir } from './resumen.js'

/** Sección del perfil con título y enlace "Editar". */
function Seccion({ titulo, onEditar, children }) {
  return (
    <motion.section className="profile-section" variants={fadeUp}>
      <div className="profile-section__head">
        <h2 className="profile-section__title">{titulo}</h2>
        <button type="button" className="link" onClick={onEditar}>
          Editar
        </button>
      </div>
      {children}
    </motion.section>
  )
}

/** Etiquetas de solo lectura (Tag · Perfil). */
function Tags({ items }) {
  if (!items.length) return <p className="profile-section__empty">Aún no agregas nada aquí.</p>
  return (
    <div className="chips">
      {items.map((i) => (
        <span key={i.id} className="tag">
          <Icon name={i.iconSel} size={14} />
          {i.label}
        </span>
      ))}
    </div>
  )
}

/** E12b · Así verán tu perfil — vista previa con accesos para editar cada parte. */
export default function Perfil({ datos, cuenta, ir, siguiente }) {
  const r = resumir(datos)
  const hechos = [
    { icon: 'dollar-circle-fill', label: 'Presupuesto', valor: `${r.presupuesto} al mes` },
    { icon: 'home-solid', label: 'Tipo de quad', valor: r.tipoLargo },
    { icon: 'calendar-fill', label: 'Mudanza', valor: r.mudanzaLarga },
    { icon: 'map-pin-fill', label: 'Punto de referencia', valor: r.referencia },
  ]

  return (
    <Step className="step--long step--gap28" actions={<Button onClick={siguiente}>Se ve bien, continuar</Button>}>
      <Heading title="Así verán tu perfil">
        Esto es lo que verá una familia al abrir tu solicitud. Toca "Editar" en cualquier sección para cambiarla.
      </Heading>

      <PerfilMini datos={datos} cuenta={cuenta} />

      <Seccion titulo="Sobre mí" onEditar={() => ir('sobre-ti')}>
        {datos.sobreMi ? (
          <p className="profile-section__text">{datos.sobreMi}</p>
        ) : (
          <p className="profile-section__empty">Aún no escribes tu presentación.</p>
        )}
      </Seccion>

      <Seccion titulo="Intereses" onEditar={() => ir('sobre-ti')}>
        <Tags items={r.intereses} />
      </Seccion>

      <Seccion titulo="Cómo me gusta convivir" onEditar={() => ir('convivencia')}>
        <Tags items={r.convivenciaTags} />
      </Seccion>

      <Seccion titulo="Qué no puede faltar" onEditar={() => ir('servicios')}>
        <Tags items={r.serviciosTags} />
      </Seccion>

      <Seccion titulo="Lo que busco" onEditar={() => ir('presupuesto')}>
        <div className="facts">
          {hechos.map((h) => (
            <div key={h.label} className="fact">
              <Icon name={h.icon} size={22} />
              <span>
                <span className="fact__label">{h.label}</span>
                <span className="fact__value">{h.valor}</span>
              </span>
            </div>
          ))}
        </div>
      </Seccion>
    </Step>
  )
}
