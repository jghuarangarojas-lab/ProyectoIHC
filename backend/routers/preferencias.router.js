import { Router } from 'express'
import * as controlador from '../controllers/preferencias.controller.js'
import { asyncHandler } from '../middlewares/async.middleware.js'
import { autenticar } from '../middlewares/auth.middleware.js'

const router = Router()

router.use(autenticar)
router.get('/usuarios/:id/preferencias', asyncHandler(controlador.obtener))
router.put('/usuarios/:id/preferencias', asyncHandler(controlador.guardar))

export default router
