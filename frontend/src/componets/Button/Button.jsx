import Icon from '../Icon/Icon.jsx'

export default function Button({
  children,
  variant = 'primary',
  size,
  icon,
  loading = false,
  className = '',
  type = 'button',
  ...rest
}) {
  const clases = [
    'btn',
    variant !== 'primary' ? `btn--${variant}` : '',
    size ? `btn--${size}` : '',
    loading ? 'btn--loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={clases} type={type} disabled={loading || rest.disabled} {...rest}>
      {loading ? <span className="spinner" aria-hidden="true" /> : null}
      {!loading && icon ? <Icon name={icon} size={16} /> : null}
      {children}
    </button>
  )
}