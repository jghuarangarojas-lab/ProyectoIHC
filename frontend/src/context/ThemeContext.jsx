import { useEffect, useRef } from 'react'
import { ThemeContext } from './theme.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { useMediaQuery } from '../hooks/useMediaQuery.js'
import { preferenciasService } from '../services/preferencias.service.js'

export function ThemeProvider({ children, usuarioId }) {
  const sistemaOscuro = useMediaQuery('(prefers-color-scheme: dark)')
  const [manual, setManual] = useLocalStorage('sh:tema', null)
  const usuarioAjustado = useRef(null)

  const tema = manual || (sistemaOscuro ? 'dark' : 'light')

  useEffect(() => {
    document.documentElement.dataset.theme = tema
  }, [tema])

  useEffect(() => {
    if (!usuarioId || manual || usuarioAjustado.current === usuarioId) {
      return undefined
    }
    let activo = true
    usuarioAjustado.current = usuarioId
    preferenciasService.obtener(usuarioId).then(({ remoto }) => {
      if (activo && remoto?.tema) {
        setManual(remoto.tema)
      }
    })
    return () => {
      activo = false
    }
  }, [usuarioId, manual, setManual])

  useEffect(() => {
    if (usuarioId && manual) {
      preferenciasService.guardar(usuarioId, { tema: manual })
    }
  }, [usuarioId, manual])

  function alternar() {
    setManual(tema === 'dark' ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ tema, alternar }}>
      {children}
    </ThemeContext.Provider>
  )
}