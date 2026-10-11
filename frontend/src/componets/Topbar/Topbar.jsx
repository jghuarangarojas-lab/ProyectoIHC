import { useMemo, useState } from 'react'
import { GRUPOS_NAV } from '../../config/nav.js'
import { useRoute } from '../../hooks/useRoute.js'
import { useTheme } from '../../hooks/useTheme.js'
import { useAuth } from '../../hooks/useAuth.js'
import Icon from '../Icon/Icon.jsx'
import Dropdown, { DropdownItem, DropdownLabel } from '../Dropdown/Dropdown.jsx'
import Input from '../Form/Input.jsx'

const ROL_ETIQUETA = { admin: 'Administrador', empleado: 'Empleado', cliente: 'Cliente' }

export default function Topbar({ pagina, onMenu, avisoCount = 0 }) {
  const { tema, alternarTema } = useTheme()
  const { rol, salir } = useAuth()
  const { navegar } = useRoute()
  const [termino, setTermino] = useState('')

  const resultados = useMemo(() => {
    const t = termino.trim().toLowerCase()
    if (!t) return []
    return GRUPOS_NAV.flatMap((g) => g.items).filter(
      (item) => item.roles.includes(rol) && item.etiqueta.toLowerCase().includes(t),
    )
  }, [termino, rol])

  function irResultado(ruta) {
    setTermino('')
    navegar(ruta)
  }

  const buscando = termino.trim() !== ''

  return (
    <header className="topbar">
      <button
        className="icon-btn topbar__menu"
        type="button"
        aria-label="Abrir menú"
        onClick={onMenu}
      >
        <Icon name="menu" size={20} />
      </button>

      <h1 className="topbar__title">{pagina}</h1>

      <span className="topbar__spacer" />

      <div className="search topbar__search">
        <Icon className="search__icon" name="search" size={18} />
        <Input
          value={termino}
          onChange={(e) => setTermino(e.target.value)}
          placeholder="Buscar módulos…"
          aria-label="Búsqueda global"
        />
        {buscando ? (
          <div className="search-results">
            {resultados.length === 0 ? (
              <div className="search-results__empty">Sin coincidencias</div>
            ) : (
              resultados.slice(0, 6).map((r) => (
                <button
                  key={r.id}
                  className="search-results__item"
                  type="button"
                  onClick={() => irResultado(r.ruta)}
                >
                  <Icon name={r.icono} size={16} />
                  {r.etiqueta}
                </button>
              ))
            )}
          </div>
        ) : null}
      </div>

      <div className="topbar__actions">
        <button
          className="icon-btn"
          type="button"
          aria-label={tema === 'claro' ? 'Activar tema oscuro' : 'Activar tema claro'}
          onClick={alternarTema}
        >
          <Icon name={tema === 'claro' ? 'moon' : 'sun'} size={20} />
        </button>

        <span className="bell-wrap">
          <button className="icon-btn" type="button" aria-label="Notificaciones">
            <Icon name="bell" size={20} />
          </button>
          {avisoCount > 0 ? <span className="badge badge--danger">{avisoCount}</span> : null}
        </span>

        <Dropdown trigger={<Icon name="dots" size={20} />} ariaLabel="Opciones de usuario">
          <DropdownLabel>{ROL_ETIQUETA[rol] || rol}</DropdownLabel>
          <DropdownItem icon="logout" onClick={salir}>
            Cerrar sesión
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  )
}