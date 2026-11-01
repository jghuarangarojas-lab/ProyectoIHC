import { iniciarSesion, obtenerPerfil } from '../services/auth.service.js'

export async function login(req, res) {
  const sesion = await iniciarSesion(req.body)
  res.json(sesion)
}

export async function perfil(req, res) {
  const usuario = await obtenerPerfil(req.sesion)
  res.json(usuario)
}
