import { useEffect } from 'react'
import Icon from '../Icon/Icon.jsx'

export default function Modal({ open, title, onClose, children, foot }) {
  useEffect(() => {
    if (!open) return undefined
    const enTecla = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', enTecla)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', enTecla)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
        <div className="modal__head">
          <h2 className="modal__title" id="modal-titulo">
            {title}
          </h2>
          <button className="icon-btn" type="button" aria-label="Cerrar ventana" onClick={onClose}>
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="modal__body">{children}</div>
        {foot ? <div className="modal__foot">{foot}</div> : null}
      </div>
    </div>
  )
}