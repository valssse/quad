import Button from './Button.jsx'
import googleLogo from '../assets/icons/google.svg'

/** Botón "Continuar con Google" (misma forma que el de Microsoft). */
export default function GoogleButton(props) {
  return (
    <Button variant="neutral" {...props}>
      <img src={googleLogo} width="20.875" height="20.875" alt="" />
      Continuar con Google
    </Button>
  )
}
