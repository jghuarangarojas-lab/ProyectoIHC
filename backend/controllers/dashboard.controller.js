import { obtenerResumen } from '../services/dashboard.service.js'

export async function resumen(req, res) {
  res.json(await obtenerResumen())
}
