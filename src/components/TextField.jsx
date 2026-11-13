import { useId, useState } from 'react'
import eyeIcon from '../assets/icons/eye.svg'

/**
 * Campo de texto con etiqueta, ícono a la izquierda y, si es contraseña,
 * botón para mostrar/ocultar.
 */
export default function TextField({ label, icon, type = 'text', hint, ...inputProps }) {
  const id = useId()
  const [visible, setVisible] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <div className="field__control">
        {icon && <img className="field__icon" src={icon} width="20" height="20" alt="" />}
        <input id={id} className="field__input" type={isPassword && visible ? 'text' : type} {...inputProps} />
        {isPassword && (
          <button
            type="button"
            className="field__toggle"
            aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            aria-pressed={visible}
            onClick={() => setVisible((v) => !v)}
          >
            <img src={eyeIcon} width="20" height="20" alt="" />
          </button>
        )}
      </div>
      {hint}
    </div>
  )
}
