import express from 'express'
import { pathToFileURL } from 'node:url'
import { cors } from './middlewares/cors.middleware.js'
import { manejarErrores, noEncontrado } from './middlewares/error.middleware.js'
import authRouter from './routers/auth.router.js'
import dashboardRouter from './routers/dashboard.router.js'
import preferenciasRouter from './routers/preferencias.router.js'
import recursosRouter from './routers/recursos.router.js'

export function crearApp() {
  const app = express()

  app.disable('x-powered-by')
  app.use(cors)
  app.use(express.json({ limit: '1mb' }))

  app.get('/api/health', (req, res) => {
    res.json({ estado: 'ok', servicio: 'smart-homes-api', fecha: new Date().toISOString() })
  })

  app.use('/api/auth', authRouter)
  app.use('/api/dashboard', dashboardRouter)
  app.use('/api', preferenciasRouter)
  app.use('/api', recursosRouter)

  app.use(noEncontrado)
  app.use(manejarErrores)

  return app
}

export function iniciarServidor(puerto = Number(process.env.PORT) || 3001) {
  const app = crearApp()
  const servidor = app.listen(puerto, () => {
    console.log(`API Smart Homes escuchando en http://localhost:${puerto}`)
  })
  return servidor
}

const esPrincipal = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href

if (esPrincipal) {
  iniciarServidor()
}
