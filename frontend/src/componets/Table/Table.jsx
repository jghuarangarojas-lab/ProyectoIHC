import Icon from '../Icon/Icon.jsx'
import Skeleton from '../State/Skeleton.jsx'
import EmptyState from '../Empty/EmptyState.jsx'
import Dropdown, { DropdownItem } from '../Dropdown/Dropdown.jsx'

function CeldaOrdenamiento({ columna, orden, onOrden }) {
  const activo = orden.campo === columna.key
  const direccion = activo ? orden.direccion : 'asc'

  function cambiar() {
    if (!activo) {
      onOrden(columna.key, 'asc')
    } else {
      onOrden(columna.key, direccion === 'asc' ? 'desc' : 'asc')
    }
  }

  return (
    <button
      type="button"
      className={`th-sortable${activo ? ' th-sortable--activo' : ''}`}
      onClick={cambiar}
    >
      {columna.header}
      <span className="th-sortable__caret" aria-hidden="true">
        {activo ? (
          <Icon name={direccion === 'asc' ? 'chevron-up' : 'chevron-down'} size={12} />
        ) : (
          <Icon name="chevron-up" size={12} style={{ opacity: 0.4 }} />
        )}
      </span>
    </button>
  )
}

export default function Table({ columnas, filas, cargando, error, vacio, orden, onOrden, acciones }) {
  const hayAcciones = acciones && acciones.length > 0

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            {columnas.map((c) => (
              <th key={c.key} className={c.align === 'num' ? 'num' : ''}>
                {c.sortable ? (
                  <CeldaOrdenamiento columna={c} orden={orden} onOrden={onOrden} />
                ) : (
                  c.header
                )}
              </th>
            ))}
            {hayAcciones ? (
              <th className="num" aria-label="Acciones">
                {' '}
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {cargando ? (
            <FilaCarga columnas={columnas} conAcciones={hayAcciones} />
          ) : error ? (
            <tr>
              <td colSpan={columnas.length + (hayAcciones ? 1 : 0)}>
                <div className="table-state">
                  <p>{error}</p>
                </div>
              </td>
            </tr>
          ) : filas.length === 0 ? (
            <tr>
              <td colSpan={columnas.length + (hayAcciones ? 1 : 0)}>
                <EmptyState
                  variant={vacio.variant}
                  title={vacio.title}
                  message={vacio.message}
                  actionLabel={vacio.actionLabel}
                  onAction={vacio.onAction}
                />
              </td>
            </tr>
          ) : (
            filas.map((fila, i) => (
              <tr key={fila.id || i}>
                {columnas.map((c) => (
                  <td key={c.key} className={c.align === 'num' ? 'num' : ''}>
                    {c.render ? c.render(fila) : fila[c.key]}
                  </td>
                ))}
                {hayAcciones ? (
                  <td className="td--actions">
                    <Dropdown trigger={<Icon name="dots" size={18} />} ariaLabel="Acciones de la fila">
                      {acciones.map((a) => (
                        <DropdownItem
                          key={a.id}
                          icon={a.icon}
                          danger={a.danger}
                          onClick={() => a.onClick(fila)}
                        >
                          {a.label}
                        </DropdownItem>
                      ))}
                    </Dropdown>
                  </td>
                ) : null}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

function FilaCarga({ columnas, conAcciones }) {
  return Array.from({ length: 5 }).map((_, i) => (
    <tr key={i}>
      {columnas.map((c) => (
        <td key={c.key}>
          <Skeleton width="70%" height="0.9rem" />
        </td>
      ))}
      {conAcciones ? (
        <td>
          <Skeleton width="1.5rem" height="1.5rem" />
        </td>
      ) : null}
    </tr>
  ))
}