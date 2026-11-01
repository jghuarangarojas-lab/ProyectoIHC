import { Router } from 'express'
import * as controlador from '../controllers/dashboard.controller.js'
import { asyncHandler } from '../middlewares/async.middleware.js'
import { autenticar } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/resumen', autenticar, asyncHandler(controlador.resumen))

export default router
