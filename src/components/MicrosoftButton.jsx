import Button from './Button.jsx'
import microsoftLogo from '../assets/icons/microsoft.svg'

/** Botón "Continuar con Microsoft" (la UCA usa cuentas Microsoft). */
export default function MicrosoftButton(props) {
  return (
    <Button variant="neutral" {...props}>
      <img src={microsoftLogo} width="20.875" height="20.875" alt="" />
      Continuar con Microsoft
    </Button>
  )
}
