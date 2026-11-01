import { leerDb, transaccion } from '../database/db.js'
import { HttpError } from '../errors.js'

function validarDatos(datos) {
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
    throw new HttpError(400, 'VALIDACION', 'Las preferencias deben ser un objeto.')
  }

  const salida = {}

  if (datos.tema !== undefined) {
    if (!['light', 'dark', 'claro'].includes(datos.tema)) {
      throw new HttpError(400, 'VALIDACION', 'El tema debe ser "light" o "dark".')
    }
    salida.tema = datos.tema === 'claro' ? 'light' : datos.tema
  }

  if (datos.densidad !== undefined) {
    if (!['comoda', 'compacta'].includes(datos.densidad)) {
      throw new HttpError(400, 'VALIDACION', 'La densidad debe ser "comoda" o "compacta".')
    }
    salida.densidad = datos.densidad
  }

  if (datos.paginaInicio !== undefined) {
    salida.paginaInicio = String(datos.paginaInicio)
  }

  return salida
}

function clave(usuarioId) {
  return String(usuarioId)
}

export async function obtener(usuarioId) {
  if (String(usuarioId) === '0') {
    return {}
  }

  const db = await leerDb()
  return db.preferencias[clave(usuarioId)] || {}
}

export async function guardar(usuarioId, datos) {
  if (String(usuarioId) === '0') {
    return validarDatos(datos)
  }

  const limpio = validarDatos(datos)

  return transaccion((db) => {
    const existente = db.preferencias[clave(usuarioId)] || {}
    db.preferencias[clave(usuarioId)] = {
      ...existente,
      ...limpio,
      actualizadoEn: new Date().toISOString(),
    }
    return db.preferencias[clave(usuarioId)]
  })
}
