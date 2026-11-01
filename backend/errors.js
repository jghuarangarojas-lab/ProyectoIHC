export class HttpError extends Error {
  constructor(status, codigo, mensaje) {
    super(mensaje)
    this.name = 'HttpError'
    this.status = status
    this.codigo = codigo
  }
}
