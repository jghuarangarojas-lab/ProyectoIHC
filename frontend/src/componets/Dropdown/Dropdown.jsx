import { useEffect, useRef, useState } from 'react'
import Icon from '../Icon/Icon.jsx'

export default function Dropdown({ trigger, children, ariaLabel = 'Abrir menú' }) {
  const [abierto, setAbierto] = useState(false)
  const raiz = useRef(null)

  useEffect(() => {
    if (!abierto) return undefined
    function enClick(e) {
      if (raiz.current && !raiz.current.contains(e.target)) {
        setAbierto(false)
      }
    }
    function enTecla(e) {
      if (e.key === 'Escape') {
        setAbierto(false)
      }
    }
    document.addEventListener('mousedown', enClick)
    document.addEventListener('keydown', enTecla)
    return () => {
      document.removeEventListener('mousedown', enClick)
      document.removeEventListener('keydown', enTecla)
    }
  }, [abierto])

  return (
    <span className="dropdown" ref={raiz}>
      <button
        className="dropdown__trigger"
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={abierto}
        onClick={() => setAbierto((v) => !v)}
      >
        {trigger}
      </button>
      {abierto ? (
        <span className="dropdown__panel" role="menu">
          {children}
        </span>
      ) : null}
    </span>
  )
}

export function DropdownItem({ icon, children, onClick, danger = false }) {
  return (
    <button
      type="button"
      className={`dropdown__item${danger ? ' dropdown__item--danger' : ''}`}
      role="menuitem"
      onClick={onClick}
    >
      {icon ? <Icon name={icon} size={16} /> : null}
      <span>{children}</span>
    </button>
  )
}

export function DropdownLabel({ children }) {
  return <div className="dropdown__label">{children}</div>
}