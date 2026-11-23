import { useEffect, useRef, useState } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import StatusBar from '../components/StatusBar.jsx'
import QuadLogo from '../components/QuadLogo.jsx'
import './Intro.css'

const ease = [0.65, 0, 0.35, 1]

/** Forma del cuadrado del logo (viewBox 88 × 88) usada como recorte. */
const CUADRADO = 'M67.2421 0H20.7579C9.29362 0 0 9.29362 0 20.7579V67.2421C0 78.7064 9.29362 88 20.7579 88H67.2421C78.7064 88 88 78.7064 88 67.2421V20.7579C88 9.29362 78.7064 0 67.2421 0Z'
const HUECO = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 88 88'><path d='${CUADRADO}'/></svg>`)}")`

/** Tiempos (s) sincronizados con App.jsx. */
export const INTRO_ARMADO = 1.25 // el logo se arma
export const INTRO_REVELADO = 1.15 // zoom de la máscara

/**
 * Splash de apertura.
 *   1. El logo se arma sobre el azul de marca.
 *   2. El cuadrado blanco del logo se vuelve una ventana (máscara de recorte):
 *      se encoge un poco, luego crece hasta cubrir la pantalla y deja ver la app
 *      que está detrás, con un desenfoque suave en el borde.
 * onRevelar: monta la app detrás · onFin: quita el splash.
 */
export default function Intro({ onRevelar, onFin }) {
  const logo = useRef(null)
  const capa = useRef(null)
  const [centro, setCentro] = useState(null)

  const tam = useMotionValue(88)
  const blur = useMotionValue(0)
  const opacidad = useMotionValue(1)

  const x = useTransform(tam, (s) => (centro ? `${centro.x - s / 2}px` : '50%'))
  const y = useTransform(tam, (s) => (centro ? `${centro.y - s / 2}px` : '50%'))
  const maskPosition = useTransform([x, y], ([a, b]) => `0 0, ${a} ${b}`)
  const maskSize = useTransform(tam, (s) => `100% 100%, ${s}px ${s}px`)
  const filter = useTransform(blur, (b) => `blur(${b}px)`)
  const escalaMarca = useTransform(tam, (s) => s / 88)
  const opacidadMarca = useTransform(tam, [88, 76, 260], [1, 1, 0])

  useEffect(() => {
    const t = setTimeout(() => {
      const r = logo.current.getBoundingClientRect()
      const c = capa.current.getBoundingClientRect()
      setCentro({
        x: r.left - c.left + r.width / 2,
        y: r.top - c.top + r.height / 2,
      })
      onRevelar()
      const d = INTRO_REVELADO
      animate(tam, [88, 74, Math.hypot(c.width, c.height) * 2.6], {
        duration: d,
        times: [0, 0.22, 1],
        ease: [ease, [0.55, 0, 0.75, 0.2]],
      })
      animate(blur, [0, 0, 6, 14], {
        duration: d,
        times: [0, 0.22, 0.6, 1],
        ease: 'easeIn',
      })
      animate(opacidad, [1, 1, 0], { duration: d, times: [0, 0.7, 1] }).then(onFin)
    }, INTRO_ARMADO * 1000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const revelando = centro !== null

  return (
    <>
      <motion.div
        ref={capa}
        className="screen intro"
        role="img"
        aria-label="Quad"
        style={
          revelando
            ? {
                maskImage: `linear-gradient(#000 0 0), ${HUECO}`,
                WebkitMaskImage: `linear-gradient(#000 0 0), ${HUECO}`,
                maskPosition,
                WebkitMaskPosition: maskPosition,
                maskSize,
                WebkitMaskSize: maskSize,
                filter,
                opacity: opacidad,
              }
            : undefined
        }
      >
        <StatusBar tone="light" />
        <div className="safe-top" />

        <div className="intro__stage">
          <div ref={logo} className="intro__logo" style={{ visibility: revelando ? 'hidden' : 'visible' }}>
            <QuadLogo size={88} tone="white" delay={0.15} />
          </div>
        </div>
      </motion.div>

      {/* La marca azul (fuera de la capa recortada) acompaña al hueco mientras crece y se desvanece */}
      {revelando && (
        <motion.svg
          className="intro__marca"
          width="88"
          height="88"
          viewBox="0 0 88 88"
          style={{
            left: centro.x - 44,
            top: centro.y - 44,
            scale: escalaMarca,
            opacity: opacidadMarca,
          }}
          aria-hidden="true"
        >
          <path d="M60.0922 21.7344V42.5691H49.3635V32.4612H32.4573V49.3597H42.5652V60.0961H21.7305V21.7344H60.0922Z" fill="#2667FF" />
          <path d="M66.2696 49.3596H49.3634V66.2658H66.2696V49.3596Z" fill="#2667FF" />
        </motion.svg>
      )}
    </>
  )
}
