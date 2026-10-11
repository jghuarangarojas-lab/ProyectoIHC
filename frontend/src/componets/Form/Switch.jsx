export default function Switch({ id, 'aria-label': ariaLabel, ...rest }) {
  return (
    <span className="switch">
      <input id={id} type="checkbox" aria-label={ariaLabel || 'Interruptor'} {...rest} />
      <span className="switch__track" aria-hidden="true" />
      <span className="switch__thumb" aria-hidden="true" />
    </span>
  )
}