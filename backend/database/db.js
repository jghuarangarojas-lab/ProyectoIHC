import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { RECURSOS } from '../models/recursos.js'
import { crearDatosIniciales } from './seed.js'

const AQUI = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = process.env.DB_PATH || path.join(AQUI, 'db.json')
let cola = Promise.resolve()

function normalizar(db) {
  const salida = db && typeof db === 'object' ? db : {}

  for (const recurso of Object.keys(RECURSOS)) {
    if (!Array.isArray(salida[recurso])) {
      salida[recurso] = []
    }
  }

  if (!salida.preferencias || typeof salida.preferencias !== 'object') {
    salida.preferencias = {}
  }

  salida.version ??= 1
  return salida
}

async function escribirArchivo(db) {
  await mkdir(path.dirname(DB_PATH), { recursive: true })
  const temporal = `${DB_PATH}.tmp`
  await writeFile(temporal, `${JSON.stringify(db, null, 2)}\n`, 'utf8')
  await rename(temporal, DB_PATH)
}

async function leerArchivo() {
  try {
    const contenido = await readFile(DB_PATH, 'utf8')
    return normalizar(JSON.parse(contenido))
  } catch (error) {
    if (error.code === 'ENOENT') {
      const datos = crearDatosIniciales()
      await escribirArchivo(datos)
      return datos
    }
    throw error
  }
}

export async function leerDb() {
  return leerArchivo()
}

export function transaccion(tarea) {
  const ejecucion = cola.then(async () => {
    const db = await leerArchivo()
    const resultado = await tarea(db)
    await escribirArchivo(db)
    return resultado
  })

  cola = ejecucion.then(
    () => undefined,
    () => undefined,
  )

  return ejecucion
}
