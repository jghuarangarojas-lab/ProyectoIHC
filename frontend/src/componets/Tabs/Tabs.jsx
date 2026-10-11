export default function Tabs({ opciones, activo, onChange }) {
  return (
    <div className="tabs" role="tablist">
      {opciones.map((o) => (
        <button
          key={o.id}
          type="button"
          role="tab"
          aria-selected={o.id === activo}
          className={`tab${o.id === activo ? ' tab--active' : ''}`}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}