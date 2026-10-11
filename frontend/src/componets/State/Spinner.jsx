export default function Spinner({ size = 20, className = '' }) {
  return <span className={`spinner${className ? ` ${className}` : ''}`} style={{ width: size, height: size }} aria-hidden="true" />
}