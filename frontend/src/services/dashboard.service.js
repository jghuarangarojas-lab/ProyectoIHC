import { crearClienteApi } from './api.js'

function token() {
  try {
    return JSON.parse(window.localStorage.getItem('sh:sesion'))?.token || ''
  } catch {
    return ''
  }
}

export async function resumen() {
  const api = crearClienteApi(token)
  return api.get('/dashboard/resumen')
}