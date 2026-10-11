const BASE_URL = import.meta.env.VITE_API_URL || '/api'

export class ApiError extends Error {
  constructor(mensaje, codigo, status) {
    super(mensaje)
    this.name = 'ApiError'
    this.codigo = codigo
    this.status = status
  }
}

async function request(path, options = {}, token) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  } catch {
    throw new ApiError('No se pudo conectar con el servidor. Verifica tu conexión e intenta de nuevo.', 'RED')
  }

  if (!response.ok) {
    let mensaje = `Ocurrió un error inesperado (${response.status}).`
    let codigo = 'ERROR'
    try {
      const cuerpo = await response.json()
      mensaje = cuerpo.mensaje || cuerpo.message || mensaje
      codigo = cuerpo.codigo || codigo
    } catch {
      mensaje = `El servidor respondió un estado no esperado (${response.status}).`
    }
    throw new ApiError(mensaje, codigo, response.status)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export function crearClienteApi(tokenProvider) {
  return {
    get: (path) => request(path, {}, tokenProvider()),
    post: (path, cuerpo) => request(path, { method: 'POST', body: JSON.stringify(cuerpo) }, tokenProvider()),
    put: (path, cuerpo) => request(path, { method: 'PUT', body: JSON.stringify(cuerpo) }, tokenProvider()),
    delete: (path) => request(path, { method: 'DELETE' }, tokenProvider()),
  }
}