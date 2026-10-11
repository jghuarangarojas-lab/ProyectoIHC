export default function Select({ invalid, className = '', children, ...rest }) {
  return (
    <select
      className={`select${invalid ? ' select--invalid' : ''}${className ? ` ${className}` : ''}`}
      {...rest}
    >
      {children}
    </select>
  )
}