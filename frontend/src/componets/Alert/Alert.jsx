import Icon from '../Icon/Icon.jsx'

const ICONO = { ok: 'check', info: 'info', warn: 'alert', danger: 'info' }

export default function Alert({ tone = 'info', title, children }) {
  return (
    <div className={`alert alert--${tone}`} role="alert">
      <span className="alert__icon">
        <Icon name={ICONO[tone]} size={16} />
      </span>
      <div>
        {title ? <span className="alert__title">{title}</span> : null}
        {children}
      </div>
    </div>
  )
}