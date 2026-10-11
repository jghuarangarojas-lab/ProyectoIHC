export default function Checkbox({ label, id, ...rest }) {
  return (
    <label className="check" htmlFor={id}>
      <input id={id} type="checkbox" {...rest} />
      <span>{label}</span>
    </label>
  )
}