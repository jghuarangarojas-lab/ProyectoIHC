export function asyncHandler(controlador) {
  return function manejador(req, res, next) {
    Promise.resolve(controlador(req, res, next)).catch(next)
  }
}
