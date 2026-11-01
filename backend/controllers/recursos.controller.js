import { HttpError } from '../errors.js'
import { obtenerDefinicion } from '../models/recursos.js'
import * as servicio from '../services/recursos.service.js'

function definicion(recurso) {
  const def = obtenerDefinicion(recurso)

  if (!def) {
    throw new HttpError(404, 'NO_ENCONTRADO', `El módulo "${recurso}" no existe.`)
  }

  return def
}

function verificarRol(def, sesion, accion) {
  if (!def.roles[accion].includes(sesion.rol)) {
    throw new HttpError(403, 'SIN_PERMISO', 'No tienes permisos para realizar esta acción.')
  }
}

export async function listar(req, res) {
  const def = definicion(req.params.recurso)
  verificarRol(def, req.sesion, 'leer')
  res.json(await servicio.listar(req.params.recurso))
}

export async function crear(req, res) {
  const def = definicion(req.params.recurso)
  verificarRol(def, req.sesion, 'escribir')
  const registro = await servicio.crear(req.params.recurso, req.body)
  res.status(201).json(registro)
}

export async function actualizar(req, res) {
  const def = definicion(req.params.recurso)
  verificarRol(def, req.sesion, 'escribir')
  const registro = await servicio.actualizar(req.params.recurso, req.params.id, req.body)
  res.json(registro)
}

export async function eliminar(req, res) {
  const def = definicion(req.params.recurso)
  verificarRol(def, req.sesion, 'escribir')
  const resultado = await servicio.eliminar(req.params.recurso, req.params.id)
  res.json(resultado)
}
