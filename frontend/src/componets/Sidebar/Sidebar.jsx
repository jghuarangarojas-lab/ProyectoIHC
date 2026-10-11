import { useMemo } from 'react'
import { menuDisponible } from '../../config/nav.js'
import { useRoute } from '../../hooks/useRoute.js'
import Icon from '../Icon/Icon.jsx'
import Logo from '../Logo/Logo.jsx'

function iniciales(nombre) {
  const partes = (nombre || '').trim().split(/\s+/)
  const primeras = partes.slice(0, 2).map((p) => p[0] || '')
  return primeras.join('').toUpperCase() || '?'
}

export default function Sidebar({ rol, usuario, colapsado, onColapsar, abiertoMovil, onNavegar }) {
  const { ruta, navegar } = useRoute()
  const grupos = useMemo(() => menuDisponible(rol), [rol])

  function ir(rutaDestino) {
    navegar(rutaDestino)
    onNavegar?.()
  }

  return (
    <aside
      className={`sidebar${abiertoMovil ? ' sidebar--open' : ''}`}
      aria-label="Menú principal"
    >
      <div className="sidebar__brand">
        <span className="brand">
          <Logo className="brand__logo" />
          <span className="brand__meta">
            <span className="brand__name">SMART HOMES</span>
            <span className="brand__role">Constructores Generales</span>
          </span>
        </span>
        <button
          className="icon-btn sidebar__collapse"
          type="button"
          aria-label={colapsado ? 'Expandir menú' : 'Contraer menú'}
          onClick={onColapsar}
        >
          <Icon name={colapsado ? 'chevron-right' : 'chevron-left'} size={16} />
        </button>
      </div>

      <nav className="sidebar__nav">
        {grupos.map((grupo) => (
          <div key={grupo.id}>
            <div className="nav__group">{grupo.etiqueta}</div>
            {grupo.items.map((item) => (
              <button
                key={item.id}
                className={`nav__item${ruta === item.ruta ? ' nav__item--active' : ''}`}
                type="button"
                onClick={() => ir(item.ruta)}
                aria-current={ruta === item.ruta ? 'page' : undefined}
              >
                <Icon className="nav__icon" name={item.icono} />
                <span className="nav__label">{item.etiqueta}</span>
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar__foot">
        <div className="user">
          <span className="user__avatar">{iniciales(usuario?.nombre)}</span>
          <span className="user__meta">
            <span className="user__name">{usuario?.nombre || 'Usuario'}</span>
            <span className="user__role">{rol || ''}</span>
          </span>
        </div>
      </div>
    </aside>
  )
}