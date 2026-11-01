import { Router } from 'express'
import * as controlador from '../controllers/auth.controller.js'
import { asyncHandler } from '../middlewares/async.middleware.js'
import { autenticar } from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/login', asyncHandler(controlador.login))
router.get('/perfil', autenticar, asyncHandler(controlador.perfil))

export default router
