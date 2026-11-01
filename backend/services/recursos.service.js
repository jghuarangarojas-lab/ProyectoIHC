import { leerDb, transaccion } from '../database/db.js'
import { HttpError } from '../errors.js'
import { obtenerDefinicion } from '../models/recursos.js'
import { validarDatos } from '../validators/recursos.validator.js'
import { hashContrasena } from './password.service.js'

const RE_USUARIO = /^[a-zA-Z0-9._-]{3,40}$/

function definicion(recurso) {
  const def = obtenerDefinicion(recurso)

  if (!def) {
    throw new HttpError(404, 'NO_ENCONTRADO', `El módulo "${recurso}" no existe.`)
  }

  return def
}

function extraer(def, datos, incluirAutenticacion = false) {
  const salida = {}

  for (const campo of Object.keys(def.campos)) {
    if (datos?.[campo] !== undefined) {
      salida[campo] = datos[campo]
    }
  }

  if (incluirAutenticacion && def.autenticacion) {
    for (const campo of ['usuario', 'contrasena']) {
      if (datos?.[campo] !== undefined) {
        salida[campo] = datos[campo]
      }
    }
  }

  return salida
}

function siguienteId(coleccion) {
  return coleccion.reduce((mayor, registro) => Math.max(mayor, Number(registro.id) || 0), 0) + 1
}

function sanitizar(recurso, registro) {
  if (recurso !== 'usuarios') {
    return registro
  }

  const publico = { ...registro }
  delete publico.contrasenaHash
  delete publico.contrasenaSalt
  return publico
}

function generarUsuario(correo, db, idActual) {
  let base = String(correo || '')
    .split('@')[0]
    .replace(/[^a-zA-Z0-9._-]/g, '')
    .toLowerCase()

  if (!base) {
    base = 'usuario'
  }

  if (base.length < 3) {
    base = `user_${base}`
  }

  let candidato = base
  let numero = 2

  while (
    db.usuarios.some(
      (usuario) =>
        String(usuario.id) !== String(idActual) &&
        String(usuario.usuario || '').toLowerCase() === candidato,
    )
  ) {
    candidato = `${base}${numero}`
    numero += 1
  }

  return candidato
}

function credencialesUsuario({ datos, contrasena, existente, db, idActual }) {
  const solicitado = String(datos.usuario ?? '').trim()
  const usuario = solicitado || existente?.usuario || generarUsuario(datos.correo, db, idActual)

  if (!RE_USUARIO.test(usuario)) {
    throw new HttpError(
      400,
      'VALIDACION',
      'El usuario debe tener entre 3 y 40 caracteres y solo puede incluir letras, números, puntos, guiones o guiones bajos.',
    )
  }

  const duplicado = db.usuarios.find(
    (registro) =>
      String(registro.id) !== String(idActual) &&
      String(registro.usuario || '').toLowerCase() === usuario.toLowerCase(),
  )

  if (duplicado) {
    throw new HttpError(409, 'CONFLICTO', 'El nombre de usuario ya está registrado.')
  }

  const salida = { usuario }
  const clave = contrasena == null ? '' : String(contrasena)

  if (clave) {
    if (clave.length < 6) {
      throw new HttpError(400, 'VALIDACION', 'La contraseña debe tener al menos 6 caracteres.')
    }

    const { hash, salt } = hashContrasena(clave)
    salida.contrasenaHash = hash
    salida.contrasenaSalt = salt
  } else if (!existente) {
    const { hash, salt } = hashContrasena(process.env.DEFAULT_PASSWORD || 'demo1234')
    salida.contrasenaHash = hash
    salida.contrasenaSalt = salt
  }

  return salida
}

export async function listar(recurso) {
  definicion(recurso)
  const db = await leerDb()
  return (db[recurso] || []).map((registro) => sanitizar(recurso, registro))
}

export async function crear(recurso, datos) {
  const def = definicion(recurso)

  return transaccion((db) => {
    const combinado = extraer(def, datos, true)
    const { contrasena, ...sinContrasena } = combinado
    const limpio = validarDatos(def, sinContrasena, { db, recurso, idActual: null })
    const ahora = new Date().toISOString()
    const registro = {
      id: siguienteId(db[recurso]),
      ...limpio,
      creadoEn: ahora,
      actualizadoEn: ahora,
    }

    if (def.autenticacion) {
      Object.assign(
        registro,
        credencialesUsuario({
          datos: sinContrasena,
          contrasena,
          existente: null,
          db,
          idActual: null,
        }),
      )
    }

    db[recurso].push(registro)
    return sanitizar(recurso, registro)
  })
}

export async function actualizar(recurso, id, datos) {
  const def = definicion(recurso)

  return transaccion((db) => {
    const coleccion = db[recurso]
    const indice = coleccion.findIndex((registro) => String(registro.id) === String(id))

    if (indice === -1) {
      throw new HttpError(404, 'NO_ENCONTRADO', `No se encontró el registro ${id}.`)
    }

    const existente = coleccion[indice]
    const combinado = {
      ...extraer(def, existente, true),
      ...extraer(def, datos, true),
    }
    const { contrasena, ...sinContrasena } = combinado
    const limpio = validarDatos(def, sinContrasena, {
      db,
      recurso,
      idActual: existente.id,
    })
    const registro = {
      ...existente,
      ...limpio,
      actualizadoEn: new Date().toISOString(),
    }

    if (def.autenticacion) {
      Object.assign(
        registro,
        credencialesUsuario({
          datos: sinContrasena,
          contrasena,
          existente,
          db,
          idActual: existente.id,
        }),
      )
    }

    delete registro.contrasena
    coleccion[indice] = registro
    return sanitizar(recurso, registro)
  })
}

export async function eliminar(recurso, id) {
  definicion(recurso)

  return transaccion((db) => {
    const coleccion = db[recurso]
    const indice = coleccion.findIndex((registro) => String(registro.id) === String(id))

    if (indice === -1) {
      throw new HttpError(404, 'NO_ENCONTRADO', `No se encontró el registro ${id}.`)
    }

    const [eliminado] = coleccion.splice(indice, 1)
    return { id: eliminado.id }
  })
}
