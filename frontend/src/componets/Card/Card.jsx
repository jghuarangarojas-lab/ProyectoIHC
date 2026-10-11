export function Card({ children, className = '', ...rest }) {
  return (
    <section className={`card${className ? ` ${className}` : ''}`} {...rest}>
      {children}
    </section>
  )
}

export function CardHead({ title, actions, children }) {
  return (
    <div className="card__head">
      <h2 className="card__title">{title}</h2>
      {actions || children}
    </div>
  )
}

export function CardBody({ children, flush = false }) {
  return <div className={flush ? 'card__body card__body--flush' : 'card__body'}>{children}</div>
}

export function CardFoot({ children }) {
  return <div className="card__foot">{children}</div>
}