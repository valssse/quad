import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Navegación mínima basada en el hash de la URL (#/ruta).
 * Funciona en GitHub Pages sin configuración extra y respeta
 * el botón "atrás" del navegador.
 *
 * `order` define el orden del flujo: sirve para saber si la
 * transición va hacia adelante (1) o hacia atrás (-1).
 */
export default function useHashRoute(order, fallback) {
  const read = () => {
    const path = window.location.hash.replace(/^#\/?/, '')
    return order.includes(path.split('/')[0]) ? path : fallback
  }

  const [path, setPath] = useState(read)
  const [direction, setDirection] = useState(1)
  const prev = useRef(path)

  useEffect(() => {
    const onHash = () => {
      const next = read()
      const a = order.indexOf(prev.current.split('/')[0])
      const b = order.indexOf(next.split('/')[0])
      setDirection(b >= a ? 1 : -1)
      prev.current = next
      setPath(next)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const navigate = useCallback((to, { replace = false } = {}) => {
    const url = `#/${to}`
    if (replace) {
      window.history.replaceState(null, '', url)
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    } else {
      window.location.hash = `/${to}`
    }
  }, [])

  const [route, param] = path.split('/')
  return { route, param, direction, navigate }
}
