import { useEffect, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'motion/react'
import Step from '../estudiante/Step.jsx'
import Heading from '../estudiante/Heading.jsx'
import Button from '../../components/Button.jsx'
import StatusBar from '../../components/StatusBar.jsx'
import Chip from '../../components/Chip.jsx'
import Icon from '../../components/Icon.jsx'
import Note from '../../components/Note.jsx'
import { fadeUp, stagger } from '../../components/motion.js'
import { Campo, FilaSwitch, Mapa } from './ui.jsx'
import {
  BANCOS,
  COMISION,
  DEPOSITOS,
  DISTANCIAS,
  ESTANCIAS,
  TIPOS_ANFITRION,
  TIPOS_CUARTO,
  buscar,
  describirRegla,
  dinero,
  fechaLarga,
  iniciales,
} from '../../data/anfitrion.js'

/** Título de sección con enlace "Editar" opcional. */
function Titulo({ children, onEditar }) {
  return (
    <div className="block-title">
      <h2>{children}</h2>
      {onEditar && (
        <button type="button" className="link link--small" onClick={onEditar}>
          Editar
        </button>
      )}
    </div>
  )
}

/** A17 · ¿Dónde está tu casa? */
export function Ubicacion({ datos, actualizar, siguiente }) {
  const [ajustar, setAjustar] = useState(false)
  return (
    <Step
      actions={
        <>
          <Button onClick={siguiente} disabled={!datos.direccion.trim()}>
            Continuar
          </Button>
          <button type="button" className="link" onClick={() => setAjustar((v) => !v)}>
            {ajustar ? 'Listo, guardar pin' : 'Ajustar pin en el mapa'}
          </button>
        </>
      }
    >
      <Heading title="¿Dónde está tu casa?">Los estudiantes ven una zona aproximada hasta firmar contrato.</Heading>
      <Campo
        label="Dirección"
        icon="map-pin"
        placeholder="Calle, número y colonia"
        value={datos.direccion}
        onChange={(e) => actualizar({ direccion: e.target.value })}
      />
      <motion.div className="block" variants={fadeUp}>
        <Titulo>Dónde está el Quad</Titulo>
        <Mapa ajustable={ajustar} />
        <AnimatePresence>
          {ajustar && (
            <motion.p className="map-hint" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              Arrastra el pin hasta la entrada de tu casa.
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </Step>
  )
}

/** Número que cuenta hasta su nuevo valor (montos del resumen A18). */
function Monto({ valor, prefijo = '' }) {
  const mv = useMotionValue(valor)
  const texto = useTransform(mv, (v) => `${prefijo}${dinero(v)}`)
  useEffect(() => {
    const c = animate(mv, valor, { duration: 0.35, ease: [0.22, 1, 0.36, 1] })
    return () => c.stop()
  }, [mv, valor])
  return <motion.span>{texto}</motion.span>
}

/** A18 · Precio y depósito. */
export function Precio({ datos, actualizar, siguiente }) {
  const comision = Math.round(datos.precio * COMISION * 100) / 100
  return (
    <Step actions={<Button onClick={siguiente} disabled={!datos.precio}>Continuar</Button>}>
      <Heading title="Precio y depósito">Cuartos similares en tu zona cuestan entre $100 y $140 al mes.</Heading>

      <motion.label className="price-card" variants={fadeUp}>
        <span className="price-card__label">Precio mensual</span>
        <span className="price-card__value">
          <span className="price-card__amount">
            $
            <span className="price-input">
              <span className="price-input__mirror" aria-hidden="true">
                {datos.precio || '0'}
              </span>
              <input
                type="text"
                inputMode="numeric"
                aria-label="Precio mensual en dólares"
                value={datos.precio || ''}
                placeholder="0"
                onChange={(e) => actualizar({ precio: Number(e.target.value.replace(/\D/g, '').slice(0, 4)) || 0 })}
              />
            </span>
          </span>
          <span className="price-card__unit">/mes</span>
        </span>
      </motion.label>

      <motion.div className="section" variants={fadeUp}>
        <p className="section-label">Depósito</p>
        <div className="chips" role="radiogroup">
          {DEPOSITOS.map((d) => (
            <Chip key={d.id} label={d.label} selected={datos.deposito === d.id} onToggle={() => actualizar({ deposito: d.id })} />
          ))}
        </div>
      </motion.div>

      <FilaSwitch
        icon="dollar-circle-fill"
        titulo="Servicios incluidos"
        desc="Agua, luz e internet dentro del precio"
        checked={datos.serviciosIncluidos}
        onChange={(v) => actualizar({ serviciosIncluidos: v })}
      />

      <motion.dl className="receipt" variants={fadeUp}>
        <div>
          <dt>Precio mensual</dt>
          <dd>
            <Monto valor={datos.precio} />
          </dd>
        </div>
        <div>
          <dt>Comisión de Quad</dt>
          <dd>
            <Monto valor={comision} prefijo="+ " />
          </dd>
        </div>
        <div>
          <dt>Recibes al mes</dt>
          <dd className="receipt__total">
            <Monto valor={datos.precio + comision} />
          </dd>
        </div>
      </motion.dl>
    </Step>
  )
}

/** A19 · ¿Desde cuándo está libre? */
export function Disponibilidad({ datos, actualizar, siguiente }) {
  return (
    <Step actions={<Button onClick={siguiente}>Continuar</Button>}>
      <Heading title="¿Desde cuándo está libre?">Te mostramos a estudiantes que llegan en esas fechas.</Heading>

      <Campo label="Disponible desde" icon="calendar">
        {(id) => (
          <span className="date-field">
            <span className="field__input">{fechaLarga(datos.desde) || 'Elige una fecha'}</span>
            <input id={id} type="date" value={datos.desde} onChange={(e) => actualizar({ desde: e.target.value })} aria-label="Disponible desde" />
          </span>
        )}
      </Campo>

      <motion.div className="section" variants={fadeUp}>
        <p className="section-label">Estancia mínima</p>
        <div className="chips" role="radiogroup">
          {ESTANCIAS.map((e) => (
            <Chip key={e.id} label={e.label} selected={datos.estancia === e.id} onToggle={() => actualizar({ estancia: e.id })} />
          ))}
        </div>
      </motion.div>

      <FilaSwitch
        icon="calendar-fill"
        titulo="Aceptar estancias cortas"
        desc="Intercambios o cursos de verano"
        checked={datos.cortas}
        onChange={(v) => actualizar({ cortas: v })}
      />
      <FilaSwitch
        icon="clock-fill"
        titulo="Renovación automática"
        desc="Ofrecer renovar al terminar el contrato"
        checked={datos.renovacion}
        onChange={(v) => actualizar({ renovacion: v })}
      />
    </Step>
  )
}

const YA_TIENES = [
  'Fotos del cuarto y áreas comunes',
  'Qué incluye y reglas de la casa',
  'Ubicación y zona aproximada',
  'Precio, depósito y disponibilidad',
]

/** A19b · Tu Quad está casi listo. */
export function CasiListo({ siguiente, ir }) {
  return (
    <Step
      actions={
        <>
          <Button onClick={() => ir('cobro')}>Continuar</Button>
          <button type="button" className="link" onClick={siguiente}>
            Ver cómo se ve mi quad
          </button>
        </>
      }
    >
      <Heading title="Tu Quad está casi listo">
        Ya tienes todo lo necesario. Mira cómo lo verán los estudiantes antes de enviarlo a revisión.
      </Heading>

      <motion.div className="almost" variants={fadeUp}>
        <motion.span
          className="almost__ring"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.span
          className="almost__bubble"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 18, delay: 0.3 }}
        >
          <Icon name="home-solid" size={56} />
        </motion.span>
      </motion.div>

      <motion.div className="checklist-card__inner" variants={fadeUp}>
        {YA_TIENES.map((t, i) => (
          <motion.p
            key={t}
            className="check-item"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 + i * 0.08, duration: 0.3 }}
          >
            <Icon name="check-circle-fill" size={20} />
            {t}
          </motion.p>
        ))}
      </motion.div>
    </Step>
  )
}

/* ---------- A20 · Vista previa ---------- */

const SERVICIOS_PREVIA = {
  cocina: { icon: 'cutlery-fill', titulo: 'Uso de cocina', sub: 'Con horario' },
  lavanderia: { icon: 'washing-fill', titulo: 'Lavandería', sub: '2 veces por semana' },
  wifi: { icon: 'wifi-fill', titulo: 'Wi-Fi', sub: 'Incluido' },
  escritorio: { icon: 'hero-computer-desktop-solid', titulo: 'Escritorio', sub: 'En el cuarto' },
  'agua-luz': { icon: 'check-circle-fill', titulo: 'Agua y luz', sub: 'Incluidas' },
  ventilador: { icon: 'hero-cloud-solid', titulo: 'Ventilador', sub: 'En el cuarto' },
  aire: { icon: 'hero-sparkles-solid', titulo: 'Aire acondicionado', sub: 'En el cuarto' },
  silla: { icon: 'user-solid', titulo: 'Silla', sub: 'En el cuarto' },
  limpieza: { icon: 'hero-sparkles-solid', titulo: 'Limpieza', sub: 'Áreas comunes' },
}

const CUARTO_PREVIA = {
  privado: { titulo: 'Quad privado', titulo2: 'Cuarto privado' },
  compartido: { titulo: 'Quad compartido', titulo2: 'Cuarto compartido' },
  anexo: { titulo: 'Anexo', titulo2: 'Anexo independiente' },
}

const TIPO_PREVIA = { familia: 'Casa de familia', estudiante: 'Casa compartida', propietario: 'Residencia' }

/** Galería deslizable con las fotos del cuarto (o marcadores si aún no hay fotos reales). */
function Galeria({ fotos, onAtras }) {
  const [i, setI] = useState(0)
  const total = Math.max(1, fotos.length)
  return (
    <div className="preview-gallery">
      <motion.div
        className="preview-gallery__track"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.25}
        onDragEnd={(_, info) => {
          if (info.offset.x < -50) setI((v) => Math.min(total - 1, v + 1))
          if (info.offset.x > 50) setI((v) => Math.max(0, v - 1))
        }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={i}
            className="preview-gallery__slide"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {fotos[i]?.url ? <img src={fotos[i].url} alt="" draggable="false" /> : <Icon name="hero-photo-solid" size={48} />}
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <div className="preview-gallery__status">
        <StatusBar />
      </div>
      <div className="preview-gallery__top">
        <motion.button type="button" className="round-btn" whileTap={{ scale: 0.92 }} onClick={onAtras} aria-label="Atrás">
          <Icon name="nav-arrow-left" size={20} />
        </motion.button>
        <span className="pill pill--brand">Vista previa</span>
      </div>
      <span className="pill pill--dark preview-gallery__count">
        {i + 1} / {total}
      </span>
    </div>
  )
}

export function VistaPrevia({ datos, ir }) {
  const atras = () => window.history.back()
  const principal = datos.personas.find((p) => p.principal) || datos.personas[0]
  const cuarto = CUARTO_PREVIA[datos.cuarto]
  const tipoCasa = TIPO_PREVIA[datos.tipo]
  const uni = datos.universidades[0]
  const distancia = uni ? DISTANCIAS[uni].replace(' caminando', '') : null
  const iconoDistancia = !uni ? null : DISTANCIAS[uni].includes('bus') ? 'bus-fill' : DISTANCIAS[uni].includes('carro') ? 'car-fill' : 'walking-fill'
  const [zonaTitulo, ...zonaResto] = (datos.zona || 'Jardines de Guadalupe, Antiguo Cuscatlán').split(',').map((t) => t.trim())
  const servicios = [
    { icon: 'bed-fill', titulo: cuarto.titulo, sub: datos.incluye.includes('closet') ? 'Cama y clóset' : 'Cama' },
    ...datos.incluye.filter((id) => SERVICIOS_PREVIA[id]).map((id) => SERVICIOS_PREVIA[id]),
  ].slice(0, 6)
  const reglas = [
    ...datos.reglasActivas.map((id) => {
      const d = describirRegla(id, datos.reglas)
      const icon = { llegada: 'clock-fill', visitas: 'group-fill', cocina: 'cutlery-fill', convivencia: 'info-circle-fill' }[id]
      return { id, icon, titulo: d.tituloCorto || d.titulo, texto: d.larga }
    }),
    ...datos.reglasExtra.map((r) => ({ id: r.id, icon: 'info-circle-fill', titulo: r.titulo, texto: r.texto })),
  ]

  return (
    <div className="preview">
      <div className="preview__scroll">
        <Galeria fotos={datos.fotos} onAtras={atras} />

        <motion.div className="preview__content" variants={stagger} initial="hidden" animate="show">
          <Note iconName="info-circle-fill">Así verán tu quad los estudiantes. Toca "Editar" en cualquier sección para cambiarla.</Note>

          <motion.div className="preview__head" variants={fadeUp}>
            <div className="badges">
              <span className="badge badge--green">
                <Icon name="home-solid" size={14} />
                {tipoCasa}
              </span>
              <span className="badge badge--amber">
                <Icon name="star" size={14} />
                Nuevo en Quad
              </span>
              {distancia && (
                <span className="badge badge--gray">
                  <Icon name={iconoDistancia} size={14} />
                  {distancia}
                </span>
              )}
            </div>
            <h1 className="preview__title">
              {cuarto.titulo2} en {tipoCasa.toLowerCase()}
            </h1>
            <p className="preview__place">
              <Icon name="map-pin-fill" size={13} />
              {[zonaTitulo, ...zonaResto].join(', ')}
            </p>
          </motion.div>

          <motion.div className="heading" variants={fadeUp} style={{ gap: 10 }}>
            <div className="host-card">
              <span className="host-card__avatar">{principal?.foto ? <img src={principal.foto} alt="" /> : iniciales(principal?.nombre || 'Q')}</span>
              <span className="option__texts">
                <span className="option__title">{principal?.nombre}</span>
                <span className="option__desc">{buscar(TIPOS_ANFITRION, datos.tipo)?.titulo}</span>
              </span>
              <Icon name="nav-arrow-right" size={16} className="rule-row__chevron" />
            </div>
            <button type="button" className="ghost-btn ghost-btn--block">
              Ver el Perfil de la casa
              <Icon name="nav-arrow-right" size={16} />
            </button>
          </motion.div>

          <motion.section className="block" variants={fadeUp}>
            <Titulo onEditar={() => ir('incluye')}>Qué incluye el Quad</Titulo>
            <div className="service-grid">
              {servicios.map((s) => (
                <div key={s.titulo} className="service">
                  <span className="service__icon">
                    <Icon name={s.icon} size={18} />
                  </span>
                  <span className="option__texts">
                    <span className="service__title">{s.titulo}</span>
                    <span className="service__sub">{s.sub}</span>
                  </span>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.hr className="divider-line" variants={fadeUp} />

          <motion.section className="block" variants={fadeUp} style={{ gap: 14 }}>
            <Titulo onEditar={() => ir('reglas')}>Reglas de la casa</Titulo>
            {reglas.map((r) => (
              <div key={r.id} className="rule-line">
                <span className="rule-line__icon">
                  <Icon name={r.icon} size={20} />
                </span>
                <span className="option__texts">
                  <span className="rule-line__title">{r.titulo}</span>
                  <span className="rule-line__text">{r.texto}</span>
                </span>
              </div>
            ))}
          </motion.section>

          <motion.hr className="divider-line" variants={fadeUp} />

          <motion.section className="block" variants={fadeUp} style={{ gap: 14 }}>
            <Titulo onEditar={() => ir('ubicacion')}>Dónde está el Quad</Titulo>
            <Mapa />
            <div className="address">
              <Icon name="map-pin-fill" size={16} />
              <span className="option__texts">
                <span className="rule-line__title">{zonaTitulo}</span>
                <span className="option__desc">{zonaResto.length ? `${zonaResto.join(', ')}, La Libertad` : 'Antiguo Cuscatlán, La Libertad'}</span>
              </span>
              <button type="button" className="ghost-btn">
                Abrir en Maps
              </button>
            </div>
          </motion.section>
        </motion.div>
      </div>

      <motion.footer
        className="preview__bar"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div>
          <p className="preview__price">
            ${datos.precio}
            <span>/mes</span>
          </p>
          <p className="option__desc">Depósito: {buscar(DEPOSITOS, datos.deposito)?.corto}</p>
        </div>
        <Button onClick={() => ir('cobro')}>Continuar</Button>
      </motion.footer>
    </div>
  )
}

/** A21 · ¿Dónde recibes tus pagos? */
export function Cobro({ datos, actualizar, siguiente }) {
  const listo = datos.banco && datos.titular.trim() && datos.cuenta.replace(/\D/g, '').length >= 8
  return (
    <Step actions={<Button onClick={siguiente} disabled={!listo}>Enviar a revisión</Button>}>
      <Heading title="¿Dónde recibes tus pagos?">Los estudiantes pagan en la app y te depositamos cada mes.</Heading>
      <Campo label="Banco">
        {(id) => (
          <>
            <select
              id={id}
              className={`field__input field__select ${datos.banco ? '' : 'field__select--empty'}`}
              value={datos.banco}
              onChange={(e) => actualizar({ banco: e.target.value })}
            >
              <option value="" disabled>
                Selecciona tu banco
              </option>
              {BANCOS.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
            <Icon name="nav-arrow-down" size={20} className="field__icon field__icon--svg field__chevron" />
          </>
        )}
      </Campo>
      <Campo
        label="Nombre del titular"
        icon="user"
        placeholder="Como aparece en la cuenta"
        autoComplete="name"
        value={datos.titular}
        onChange={(e) => actualizar({ titular: e.target.value })}
      />
      <Campo
        label="Número de cuenta"
        icon="lock"
        placeholder="Ingresa tu número de cuenta"
        inputMode="numeric"
        value={datos.cuenta}
        onChange={(e) => actualizar({ cuenta: e.target.value.replace(/[^\d-]/g, '').slice(0, 24) })}
      />
      <Note iconName="dollar-circle-fill">
        Recibes cada pago menos la comisión de Quad, 2 días hábiles después de que el estudiante paga.
      </Note>
    </Step>
  )
}

const ESTADOS = [
  { icon: 'check-circle-fill', texto: 'Identidad verificada' },
  { icon: 'check-circle-fill', texto: 'Perfil de la casa completo' },
  { icon: 'clock-fill', texto: 'Quad en revisión', actual: true },
]

/** A22 · Tu quad está en revisión. */
export function Revision({ ir, onFinish }) {
  return (
    <div className="step">
      <main className="review">
        <motion.div className="review__content" variants={stagger} initial="hidden" animate="show">
          <motion.h1 className="text-h1" variants={fadeUp}>
            Tu quad está en revisión
          </motion.h1>
          <motion.p className="text-p" variants={fadeUp}>
            Revisamos fotos, datos y verificación en un máximo de 48 horas. Te avisaremos por notificación.
          </motion.p>
          <motion.div className="status-card" variants={fadeUp}>
            {ESTADOS.map((e, i) => (
              <motion.p
                key={e.texto}
                className={`status-card__row ${e.actual ? 'status-card__row--current' : ''}`}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.12, duration: 0.3 }}
              >
                {e.actual ? (
                  <motion.span className="status-card__pulse" animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
                    <Icon name={e.icon} size={24} />
                  </motion.span>
                ) : (
                  <Icon name={e.icon} size={24} />
                )}
                {e.texto}
              </motion.p>
            ))}
          </motion.div>
        </motion.div>
      </main>
      <footer className="actionbar">
        <Button onClick={onFinish}>Ir a mi panel</Button>
        <button type="button" className="link" onClick={() => ir('vista-previa')}>
          Ver cómo se ve mi perfil
        </button>
      </footer>
    </div>
  )
}
