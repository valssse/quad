import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { fadeUp } from './motion.js'

/**
 * Código de verificación de N dígitos.
 * Avanza solo al escribir, retrocede con Backspace y acepta pegar el código completo.
 * `digits` es un arreglo de strings controlado desde la pantalla.
 */
export default function OtpInput({ digits, onChange, autoFocus = true }) {
  const inputs = useRef([])
  const length = digits.length

  useEffect(() => {
    if (autoFocus) inputs.current[0]?.focus({ preventScroll: true })
  }, [autoFocus])

  const focusAt = (i) => inputs.current[Math.max(0, Math.min(length - 1, i))]?.focus()

  const setFrom = (start, chars) => {
    const next = [...digits]
    chars.forEach((c, k) => {
      if (start + k < length) next[start + k] = c
    })
    onChange(next)
    focusAt(start + chars.length)
  }

  const handleChange = (i) => (e) => {
    const chars = e.target.value.replace(/\D/g, '').split('')
    if (chars.length === 0) onChange(digits.map((d, k) => (k === i ? '' : d)))
    else setFrom(i, chars)
  }

  const handleKeyDown = (i) => (e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      e.preventDefault()
      onChange(digits.map((d, k) => (k === i - 1 ? '' : d)))
      focusAt(i - 1)
    }
    if (e.key === 'ArrowLeft') focusAt(i - 1)
    if (e.key === 'ArrowRight') focusAt(i + 1)
  }

  const handlePaste = (e) => {
    const chars = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length).split('')
    if (chars.length) {
      e.preventDefault()
      setFrom(0, chars)
    }
  }

  return (
    <motion.div className="otp" variants={fadeUp} role="group" aria-label="Código de verificación">
      {digits.map((d, i) => (
        <motion.input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          className="otp__digit"
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={length}
          aria-label={`Dígito ${i + 1}`}
          value={d}
          onChange={handleChange(i)}
          onKeyDown={handleKeyDown(i)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          animate={d ? { scale: [0.94, 1] } : { scale: 1 }}
          transition={{ duration: 0.2 }}
        />
      ))}
    </motion.div>
  )
}
