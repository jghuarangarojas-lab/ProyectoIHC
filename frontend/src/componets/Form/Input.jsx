export default function Input({ invalid, className = '', ...rest }) {
  return <input className={`input${invalid ? ' input--invalid' : ''}${className ? ` ${className}` : ''}`} {...rest} />
}