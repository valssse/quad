import { useId, useLayoutEffect, useRef, useState } from 'react'

/**
 * Efecto "Liquid Glass" del Figma (efecto GLASS: refracción 0.8, profundidad 20,
 * dispersión 0.5, luz a -45°, desenfoque 4).
 *
 * Se arma con un filtro SVG (mapa de desplazamiento generado en un canvas según
 * la forma de píldora del elemento) aplicado con `backdrop-filter: url(#…)`.
 * Solo los navegadores Chromium aplican filtros SVG al fondo; en Safari/Firefox
 * queda el vidrio esmerilado normal del CSS.
 */
const soportado = typeof navigator !== 'undefined' && !!navigator.userAgentData

/** Mapa de desplazamiento: R = x, G = y (128 = sin mover). Borde en forma de lente convexa. */
function mapa(w, h, profundidad) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')
  const img = ctx.createImageData(w, h)
  const r = h / 2
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // Punto más cercano del eje central de la píldora
      const cx = Math.min(Math.max(x + 0.5, r), w - r)
      const vx = x + 0.5 - cx
      const vy = y + 0.5 - r
      const dist = Math.hypot(vx, vy) || 1
      const d = r - dist // distancia al borde (adentro > 0)
      const t = Math.min(Math.max(d / profundidad, 0), 1)
      const fuerza = d < 0 ? 0 : Math.pow(1 - t, 2.2) // más fuerte en el borde
      const dx = (-vx / dist) * fuerza
      const dy = (-vy / dist) * fuerza
      const i = (y * w + x) * 4
      img.data[i] = 128 + dx * 127
      img.data[i + 1] = 128 + dy * 127
      img.data[i + 2] = 128
      img.data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  return c.toDataURL()
}

/** Devuelve [ref, estilo, filtroSvg]: pon el ref y el estilo en el elemento y renderiza el filtro. */
export function useLiquidGlass({ refraccion = 0.8, profundidad = 20, dispersion = 0.5, desenfoque = 2 } = {}) {
  const ref = useRef(null)
  const id = `lg${useId().replace(/[^a-z0-9]/gi, '')}`
  const [medida, setMedida] = useState(null)

  useLayoutEffect(() => {
    if (!soportado || !ref.current) return
    const el = ref.current
    const medir = () => {
      const w = Math.round(el.offsetWidth)
      const h = Math.round(el.offsetHeight)
      if (w && h) setMedida((m) => (m && m.w === w && m.h === h ? m : { w, h, url: mapa(w, h, profundidad) }))
    }
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(el)
    return () => ro.disconnect()
  }, [profundidad])

  if (!soportado || !medida) return [ref, undefined, null]

  const escala = profundidad * refraccion * 2.2
  const sep = escala * dispersion * 0.12
  const canal = (n, s) => (
    <>
      <feDisplacementMap in="vidrio" in2="mapa" scale={s} xChannelSelector="R" yChannelSelector="G" result={`d${n}`} />
      <feColorMatrix
        in={`d${n}`}
        type="matrix"
        values={
          n === 'r'
            ? '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0'
            : n === 'g'
              ? '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0'
              : '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0'
        }
        result={`c${n}`}
      />
    </>
  )

  const filtro = (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <filter id={id} x="0" y="0" width={medida.w} height={medida.h} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feGaussianBlur in="SourceGraphic" stdDeviation={desenfoque} result="vidrio" />
        <feImage href={medida.url} x="0" y="0" width={medida.w} height={medida.h} preserveAspectRatio="none" result="mapa" />
        {canal('r', escala + sep)}
        {canal('g', escala)}
        {canal('b', escala - sep)}
        <feBlend in="cr" in2="cg" mode="screen" result="rg" />
        <feBlend in="rg" in2="cb" mode="screen" />
      </filter>
    </svg>
  )

  const filtroCss = `url(#${id}) saturate(1.6) brightness(1.04)`
  return [ref, { backdropFilter: filtroCss, WebkitBackdropFilter: filtroCss }, filtro]
}
