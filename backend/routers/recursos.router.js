import { Router } from 'express'
import * as controlador from '../controllers/recursos.controller.js'
import { asyncHandler } from '../middlewares/async.middleware.js'
import { autenticar } from '../middlewares/auth.middleware.js'

const router = Router()

router.use(autenticar)
router.get('/:recurso', asyncHandler(controlador.listar))
router.post('/:recurso', asyncHandler(controlador.crear))
router.put('/:recurso/:id', asyncHandler(controlador.actualizar))
router.delete('/:recurso/:id', asyncHandler(controlador.eliminar))

export default router
