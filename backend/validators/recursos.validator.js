import { HttpError } from '../errors.js'

const RE_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const RE_FECHA = /^\d{4}-\d{2}-\d{2}$/

function fechaValida(valor) {
  if (!RE_FECHA.test(valor)) {
    return false
  }

  const fecha = new Date(`${valor}T00:00:00Z`)
  return !Number.isNaN(fecha.getTime()) && fecha.toISOString().slice(0, 10) === valor
}

export function validarDatos(definicion, datos, { db, recurso, idActual = null } = {}) {
  const limpio = {}
  const errores = []

  for (const [campo, regla] of Object.entries(definicion.campos)) {
    const valor = datos[campo]
    const etiqueta = regla.etiqueta || campo

    if (regla.tipo === 'numero') {
      if (valor === '' || valor == null) {
        if (regla.obligatorio) {
          errores.push(`${etiqueta} es obligatorio.`)
        } else {
          limpio[campo] = null
        }
        continue
      }

      const numero = Number(valor)
      if (!Number.isFinite(numero)) {
        errores.push(`${etiqueta} debe ser numérico.`)
      } else if (regla.min != null && numero < regla.min) {
        errores.push(`${etiqueta} debe ser mayor o igual a ${regla.min}.`)
      } else if (regla.max != null && numero > regla.max) {
        errores.push(`${etiqueta} debe ser menor o igual a ${regla.max}.`)
      } else {
        limpio[campo] = numero
      }
      continue
    }

    const texto = valor == null ? '' : String(valor).trim()

    if (regla.obligatorio && !texto) {
      errores.push(`${etiqueta} es obligatorio.`)
      continue
    }

    if (regla.tipo === 'texto' || regla.tipo === 'correo') {
      if (regla.max && texto.length > regla.max) {
        errores.push(`${etiqueta} no debe superar ${regla.max} caracteres.`)
      } else if (regla.tipo === 'correo' && texto && !RE_CORREO.test(texto)) {
        errores.push(`${etiqueta} no tiene un formato válido.`)
      } else {
        limpio[campo] = texto
      }
      continue
    }

    if (regla.tipo === 'fecha') {
      if (texto && !fechaValida(texto)) {
        errores.push(`${etiqueta} no es una fecha válida.`)
      } else {
        limpio[campo] = texto
      }
      continue
    }

    if (regla.tipo === 'enum') {
      if (texto && !regla.valores.includes(texto)) {
        errores.push(`${etiqueta} no es válido.`)
      } else {
        limpio[campo] = texto
      }
    }
  }

  if (errores.length > 0) {
    throw new HttpError(400, 'VALIDACION', errores.join(' '))
  }

  for (const campo of definicion.unicos || []) {
    const valor = limpio[campo]
    if (valor === '' || valor == null) {
      continue
    }

    const duplicado = (db[recurso] || []).find(
      (registro) =>
        String(registro.id) !== String(idActual) &&
        String(registro[campo] ?? '').trim().toLowerCase() === String(valor).trim().toLowerCase(),
    )

    if (duplicado) {
      const etiqueta = definicion.campos[campo]?.etiqueta || campo
      throw new HttpError(409, 'CONFLICTO', `Ya existe un registro con ${etiqueta.toLowerCase()}.`)
    }
  }

  return limpio
}
