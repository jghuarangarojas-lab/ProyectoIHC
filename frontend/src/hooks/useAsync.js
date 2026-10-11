import { useEffect, useReducer } from 'react'

function reducer(estado, accion) {
  switch (accion.tipo) {
    case 'cargando':
      return { datos: null, error: null, cargando: true }
    case 'ok':
      return { datos: accion.datos, error: null, cargando: false }
    case 'error':
      return { datos: null, error: accion.error, cargando: false }
    default:
      return estado
  }
}

const ESTADO_INICIAL = { datos: null, error: null, cargando: true }

export function useAsync(tarea, deps = []) {
  const [estado, dispatch] = useReducer(reducer, ESTADO_INICIAL)

  useEffect(() => {
    let activo = true
    dispatch({ tipo: 'cargando' })
    Promise.resolve()
      .then(tarea)
      .then((datos) => {
        if (activo) dispatch({ tipo: 'ok', datos })
      })
      .catch((error) => {
        if (activo) dispatch({ tipo: 'error', error })
      })
    return () => {
      activo = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return estado
}