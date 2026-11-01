import { HttpError } from '../errors.js'
import * as servicio from '../services/preferencias.service.js'

function verificarAcceso(req) {
  const esPropia = String(req.params.id) === String(req.sesion.id)
  const esAdmin = req.sesion.rol === 'admin'

  if (!esPropia && !esAdmin) {
    throw new HttpError(403, 'SIN_PERMISO', 'No puedes acceder a las preferencias de otro usuario.')
  }
}

export async function obtener(req, res) {
  verificarAcceso(req)
  res.json(await servicio.obtener(req.params.id))
}

export async function guardar(req, res) {
  verificarAcceso(req)
  res.json(await servicio.guardar(req.params.id, req.body))
}
