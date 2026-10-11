export default function Progress({ value, tone = 'primary', max = 100, label }) {
  const porcentaje = Math.round((value / max) * 100)
  const safe = Math.min(100, Math.max(0, porcentaje))

  return (
    <div>
      {label ? (
        <div className="progress__meta">
          <span>{label}</span>
          <span>{safe}%</span>
        </div>
      ) : null}
      <div
        className={`progress${tone !== 'primary' ? ` progress--${tone}` : ''}`}
        role="progressbar"
        aria-valuenow={safe}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <span className="progress__bar" style={{ width: `${safe}%` }} />
      </div>
    </div>
  )
}