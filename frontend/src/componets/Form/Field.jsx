import Icon from '../Icon/Icon.jsx'

export default function Field({ label, htmlFor, required, hint, error, children }) {
  return (
    <div className={`field${error ? ' field--error' : ''}`}>
      {label ? (
        <label htmlFor={htmlFor}>
          {label}
          {required ? ' *' : ''}
        </label>
      ) : null}
      {children}
      {error ? (
        <span className="field__error" role="alert">
          <Icon name="alert" size={13} />
          {error}
        </span>
      ) : null}
      {!error && hint ? <span className="field__hint">{hint}</span> : null}
    </div>
  )
}