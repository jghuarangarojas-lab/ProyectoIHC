import { crearClienteApi } from './api.js'

function token() {
  try {
    return JSON.parse(window.localStorage.getItem('sh:sesion'))?.token || ''
  } catch {
    return ''
  }
}

export const preferenciasService = {
  async obtener(usuarioId) {
    const api = crearClienteApi(token)
    const local = JSON.parse(window.localStorage.getItem('sh:prefs') || 'null')
    try {
      const remoto = await api.get(`/usuarios/${usuarioId}/preferencias`)
      return { remoto, local }
    } catch {
      return { remoto: null, local }
    }
  },

  async guardar(usuarioId, preferencias) {
    window.localStorage.setItem('sh:prefs', JSON.stringify(preferencias))
    const api = crearClienteApi(token)
    try {
      await api.put(`/usuarios/${usuarioId}/preferencias`, preferencias)
      return { sincronizado: true }
    } catch {
      return { sincronizado: false }
    }
  },
}