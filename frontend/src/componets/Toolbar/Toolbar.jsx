import Icon from '../Icon/Icon.jsx'
import Input from '../Form/Input.jsx'
import Select from '../Form/Select.jsx'

export default function Toolbar({ busqueda, onBusqueda, placeholder = 'Buscar…', filtros, actions }) {
  return (
    <div className="toolbar">
      {onBusqueda ? (
        <div className="search">
          <Icon className="search__icon" name="search" size={18} />
          <Input value={busqueda} onChange={(e) => onBusqueda(e.target.value)} placeholder={placeholder} />
        </div>
      ) : null}

      {filtros && filtros.length > 0 ? (
        <div className="filter-group">
          {filtros.map((f) => (
            <Select
              key={f.nombre}
              aria-label={f.etiqueta}
              value={f.valor}
              onChange={(e) => f.onCambio(e.target.value)}
            >
              <option value="">{f.etiqueta}</option>
              {f.opciones.map((o) => (
                <option key={o.valor} value={o.valor}>
                  {o.etiqueta}
                </option>
              ))}
            </Select>
          ))}
        </div>
      ) : null}

      <span className="toolbar__grow" />

      {actions}
    </div>
  )
}