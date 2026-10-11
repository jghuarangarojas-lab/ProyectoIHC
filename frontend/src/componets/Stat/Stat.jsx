import Icon from '../Icon/Icon.jsx'

const TONOS = {
  matcha: 'stat__icon stat__icon--matcha',
  azure: 'stat__icon stat__icon--azure',
  primary: 'stat__icon',
}

export default function Stat({ value, label, delta, direccion = 'up', icono, tono = 'primary' }) {
  return (
    <div className="card" role="group">
      <div className="card__body">
        {icono ? (
          <span className={`stat__icon ${TONOS[tono]}`}>
            <Icon name={icono} size={20} />
          </span>
        ) : null}
        <span className="stat__value">{value}</span>
        <span className="stat__label">{label}</span>
        {delta ? (
          <span className={`stat__delta stat__delta--${direccion}`}>
            {delta}
          </span>
        ) : null}
      </div>
    </div>
  )
}