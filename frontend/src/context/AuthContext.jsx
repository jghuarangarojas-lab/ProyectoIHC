import { useCallback } from 'react'
import { AuthContext } from './auth.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { ingresar as ingresarService } from '../services/auth.service.js'

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useLocalStorage('sh:sesion', null)

  const ingresar = useCallback(
    async (usuario, contrasena) => {
      const nuevaSesion = await ingresarService(usuario, contrasena)
      setSesion(nuevaSesion)
      return nuevaSesion
    },
    [setSesion],
  )

  const salir = useCallback(() => {
    setSesion(null)
    window.localStorage.removeItem('sh:sesion')
  }, [setSesion])

  const rol = sesion?.usuario?.rol || null

  return (
    <AuthContext.Provider value={{ sesion, rol, ingresar, salir }}>
      {children}
    </AuthContext.Provider>
  )
}