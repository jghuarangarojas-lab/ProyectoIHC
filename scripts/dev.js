import { spawn } from 'node:child_process'

const hijos = []
let cerrando = false

function cerrar(codigo = 0) {
  if (cerrando) {
    return
  }

  cerrando = true

  for (const hijo of hijos) {
    if (hijo.exitCode === null) {
      hijo.kill()
    }
  }

  process.exit(codigo)
}

function ejecutar(argumentos, nombre) {
  const hijo = spawn(process.execPath, argumentos, {
    stdio: 'inherit',
    env: process.env,
  })

  hijos.push(hijo)

  hijo.on('error', (error) => {
    console.error(`[dev] No se pudo iniciar ${nombre}: ${error.message}`)
    cerrar(1)
  })

  hijo.on('exit', (codigo, senal) => {
    if (senal !== null) {
      return
    }

    if (codigo !== 0) {
      console.error(`[dev] ${nombre} terminó con código ${codigo}.`)
    }

    cerrar(codigo ?? 0)
  })

  return hijo
}

process.on('SIGINT', () => cerrar(0))
process.on('SIGTERM', () => cerrar(0))

ejecutar(['--watch', 'backend/server.js'], 'API')
ejecutar(['node_modules/vite/bin/vite.js'], 'Vite')
