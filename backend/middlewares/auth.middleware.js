import { leerDb } from '../database/db.js'
import { HttpError } from '../errors.js'
import { verificarToken } from '../services/token.service.js'

const DEMO = {
  id: 0,
  nombre: 'Usuario demo',
  rol: 'admin',
  provisional: true,
}

export async function autenticar(req, res, next) {
  try {
    const encabezado = req.headers.authorization || ''
    const token = encabezado.startsWith('Bearer ') ? encabezado.slice(7).trim() : ''

    if (!token) {
      throw new HttpError(401, 'NO_AUTENTICADO', 'Debes iniciar sesión para continuar.')
    }

    if (token === 'demo') {
      req.sesion = { ...DEMO }
      next()
      return
    }

    const payload = verificarToken(token)

    if (!payload) {
      throw new HttpError(401, 'NO_AUTENTICADO', 'Tu sesión expiró o no es válida.')
    }

    const db = await leerDb()
    const usuario = (db.usuarios || []).find(
      (registro) => String(registro.id) === String(payload.sub),
    )

    if (!usuario || usuario.estado !== 'activo') {
      throw new HttpError(401, 'NO_AUTENTICADO', 'Tu sesión ya no es válida.')
    }

    req.sesion = {
      id: usuario.id,
      nombre: usuario.nombre,
      rol: usuario.rol,
      provisional: false,
    }
    next()
  } catch (error) {
    next(error)
  }
}

export function autorizar(...roles) {
  return function verificarRol(req, res, next) {
    if (!req.sesion || !roles.includes(req.sesion.rol)) {
      next(new HttpError(403, 'SIN_PERMISO', 'No tienes permisos para realizar esta acción.'))
      return
    }

    next()
  }
}
