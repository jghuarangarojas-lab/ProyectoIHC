export function noEncontrado(req, res) {
  res.status(404).json({
    mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
    codigo: 'NO_ENCONTRADO',
  })
}

export function manejarErrores(error, req, res, next) {
  if (res.headersSent) {
    next(error)
    return
  }

  const status = Number.isInteger(error.status) ? error.status : 500
  const jsonInvalido = error.type === 'entity.parse.failed'

  if (status >= 500) {
    console.error(error)
  }

  res.status(status).json({
    mensaje: jsonInvalido
      ? 'El cuerpo de la solicitud no es un JSON válido.'
      : status >= 500
        ? 'Ocurrió un error inesperado en el servidor.'
        : error.message,
    codigo: jsonInvalido ? 'JSON_INVALIDO' : error.codigo || 'ERROR',
  })
}
