export default function Skeleton({ width = '100%', height = '1rem', className = '', radius }) {
  return (
    <span
      className={`skeleton${className ? ` ${className}` : ''}`}
      style={{ width, height, borderRadius: radius, display: 'block' }}
      aria-hidden="true"
    />
  )
}