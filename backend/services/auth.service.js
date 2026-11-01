import { leerDb } from '../database/db.js'
import { HttpError } from '../errors.js'
import { verificarContrasena } from './password.service.js'
import { crearToken } from './token.service.js'

const USUARIO_DEMO = {
  id: 0,
  nombre: 'Usuario demo',
  correo: 'demo@smarthomes.pe',
  usuario: 'demo',
  rol: 'admin',
  estado: 'activo',
}

function publico(usuario) {
  return {
    id: usuario.id,
    nombre: usuario.nombre,
    correo: usuario.correo,
    usuario: usuario.usuario,
    rol: usuario.rol,
    estado: usuario.estado,
  }
}

export async function iniciarSesion({ usuario, contrasena } = {}) {
  const identificador = String(usuario ?? '').trim()
  const clave = String(contrasena ?? '')

  if (!identificador || !clave) {
    throw new HttpError(400, 'VALIDACION', 'Ingresa tu usuario y contraseña.')
  }

  if (identificador.toLowerCase() === 'demo' && (clave === 'demo' || clave === 'demo1234')) {
    return {
      token: 'demo',
      provisional: true,
      usuario: publico(USUARIO_DEMO),
    }
  }

  const db = await leerDb()
  const encontrado = (db.usuarios || []).find(
    (registro) =>
      String(registro.usuario || '').toLowerCase() === identificador.toLowerCase() ||
      String(registro.correo || '').toLowerCase() === identificador.toLowerCase(),
  )

  if (
    !encontrado ||
    !verificarContrasena(clave, encontrado.contrasenaHash, encontrado.contrasenaSalt)
  ) {
    throw new HttpError(401, 'CREDENCIALES', 'Usuario o contraseña incorrectos.')
  }

  if (encontrado.estado !== 'activo') {
    throw new HttpError(403, 'SIN_PERMISO', 'Tu cuenta está inactiva. Contacta al administrador.')
  }

  return {
    token: crearToken(encontrado),
    provisional: false,
    usuario: publico(encontrado),
  }
}

export async function obtenerPerfil(sesion) {
  if (sesion?.provisional) {
    return publico(USUARIO_DEMO)
  }

  const db = await leerDb()
  const encontrado = (db.usuarios || []).find(
    (registro) => String(registro.id) === String(sesion?.id),
  )

  if (!encontrado) {
    throw new HttpError(401, 'NO_AUTENTICADO', 'La sesión ya no es válida.')
  }

  return publico(encontrado)
}
