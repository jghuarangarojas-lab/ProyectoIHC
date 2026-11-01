import { createHmac, timingSafeEqual } from 'node:crypto'

const SECRETO = process.env.AUTH_SECRET || 'smart-homes-dev-secret'
const DURACION_MS = 7 * 24 * 60 * 60 * 1000

function firmar(cuerpo) {
  return createHmac('sha256', SECRETO).update(cuerpo).digest('base64url')
}

export function crearToken(usuario) {
  const payload = {
    sub: String(usuario.id),
    nombre: usuario.nombre,
    rol: usuario.rol,
    exp: Date.now() + DURACION_MS,
  }
  const cuerpo = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${cuerpo}.${firmar(cuerpo)}`
}

export function verificarToken(token) {
  if (!token || typeof token !== 'string') {
    return null
  }

  const [cuerpo, firma] = token.split('.')

  if (!cuerpo || !firma) {
    return null
  }

  const esperada = Buffer.from(firmar(cuerpo))
  const recibida = Buffer.from(firma)

  if (esperada.length !== recibida.length || !timingSafeEqual(esperada, recibida)) {
    return null
  }

  try {
    const payload = JSON.parse(Buffer.from(cuerpo, 'base64url').toString('utf8'))
    if (!payload?.exp || payload.exp < Date.now()) {
      return null
    }
    return payload
  } catch {
    return null
  }
}
