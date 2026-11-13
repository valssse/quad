import checkmark from '../assets/icons/checkmark.svg'

/** Checkbox de 20px con check animado. */
export default function Checkbox({ checked, onChange, children }) {
  return (
    <label className="checkbox">
      <input
        type="checkbox"
        className="checkbox__input"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="checkbox__box">
        <img src={checkmark} width="14" height="14" alt="" />
      </span>
      <span>{children}</span>
    </label>
  )
}
