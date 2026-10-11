export default function Textarea({ invalid, className = '', ...rest }) {
  return (
    <textarea
      className={`textarea${invalid ? ' textarea--invalid' : ''}${className ? ` ${className}` : ''}`}
      {...rest}
    />
  )
}