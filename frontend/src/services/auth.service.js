import { ApiError, crearClienteApi } from './api.js'

const API_DEMO = import.meta.env.VITE_AUTH_DEMO === 'true'

export async function ingresar(usuario, contrasena) {
  const api = crearClienteApi(() => null)

  if (API_DEMO) {
    if (!usuario || !contrasena) {
      throw new ApiError('Ingresa usuario y contraseña.', 'VALIDACION')
    }
    return {
      token: 'demo',
      provisional: true,
      usuario: { nombre: usuario, rol: 'admin' },
    }
  }

  const sesion = await api.post('/auth/login', { usuario, contrasena })
  return sesion
}

export async function consultarPerfil() {
  const api = crearClienteApi(() => {
    try {
      return JSON.parse(window.localStorage.getItem('sh:sesion'))?.token || ''
    } catch {
      return ''
    }
  })
  return api.get('/auth/perfil')
}