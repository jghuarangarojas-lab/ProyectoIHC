import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

export function hashContrasena(contrasena) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(String(contrasena), salt, 64).toString('hex')
  return { hash, salt }
}

export function verificarContrasena(contrasena, hash, salt) {
  if (!hash || !salt) {
    return false
  }

  const calculado = scryptSync(String(contrasena), salt, 64)
  const esperado = Buffer.from(hash, 'hex')

  if (calculado.length !== esperado.length) {
    return false
  }

  return timingSafeEqual(calculado, esperado)
}
