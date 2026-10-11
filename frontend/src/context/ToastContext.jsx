import { useCallback, useMemo, useState } from 'react'
import { ToastContext } from './toast.js'

let siguienteId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const mostrar = useCallback((tipo, titulo, mensaje) => {
    const id = ++siguienteId
    setToasts((previos) => [...previos, { id, tipo, titulo, mensaje }])
    window.setTimeout(() => {
      setToasts((previos) => previos.filter((t) => t.id !== id))
    }, 4500)
  }, [])

  const quitar = useCallback((id) => {
    setToasts((previos) => previos.filter((t) => t.id !== id))
  }, [])

  const valor = useMemo(() => ({ mostrar, quitar, toasts }), [mostrar, quitar, toasts])

  return (
    <ToastContext.Provider value={valor}>
      {children}
      <ToastStack toasts={toasts} onQuitar={quitar} />
    </ToastContext.Provider>
  )
}

function ToastStack({ toasts, onQuitar }) {
  if (toasts.length === 0) {
    return null
  }

  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.tipo}`}>
          <div className="toast__body">
            <span className="toast__title">{t.titulo}</span>
            {t.mensaje ? <span className="toast__msg">{t.mensaje}</span> : null}
          </div>
          <button
            className="icon-btn toast__close"
            type="button"
            aria-label="Cerrar notificación"
            onClick={() => onQuitar(t.id)}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
      ))}
    </div>
  )
}