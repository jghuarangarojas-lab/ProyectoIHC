import { crearClienteApi } from './api.js'

export function obtenerToken() {
  try {
    const sesion = JSON.parse(window.localStorage.getItem('sh:sesion'))
    return sesion?.token || ''
  } catch {
    return ''
  }
}

export function crearRecursoService(recurso) {
  const api = crearClienteApi(obtenerToken)
  return {
    listar: () => api.get(`/${recurso}`),
    crear: (datos) => api.post(`/${recurso}`, datos),
    actualizar: (id, datos) => api.put(`/${recurso}/${id}`, datos),
    eliminar: (id) => api.delete(`/${recurso}/${id}`),
  }
}