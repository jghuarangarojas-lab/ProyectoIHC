import { useCallback, useEffect, useState } from 'react'

function rutaActual() {
  const hash = window.location.hash.replace(/^#/, '')
  return hash || '/dashboard'
}

export function useRoute() {
  const [ruta, setRuta] = useState(rutaActual)

  useEffect(() => {
    const onChange = () => {
      setRuta(rutaActual())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const navegar = useCallback((destino) => {
    window.location.hash = destino
  }, [])

  return { ruta, navegar }
}