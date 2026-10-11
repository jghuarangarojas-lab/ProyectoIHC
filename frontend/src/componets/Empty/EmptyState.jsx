import Icon from '../Icon/Icon.jsx'
import Button from '../Button/Button.jsx'

export default function EmptyState({ variant = 'empty', title, message, actionLabel, onAction }) {
  const icono = variant === 'filtered' ? 'search' : 'inbox'

  return (
    <div className="empty" role="status">
      <span className="empty__icon">
        <Icon name={icono} size={22} />
      </span>
      <h3 className="empty__title">{title}</h3>
      <p>{message}</p>
      {actionLabel ? (
        <Button variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}