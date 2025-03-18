import { VerifyJwt } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { CreateCheckInController } from './create-controller'
import { ValidateController } from './validate-controller'
import { HistoryController } from './history-controller'
import { MetricsController } from './metrics-controller'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', VerifyJwt)
  app.post('/gyms/:gymId/check-ins', CreateCheckInController)
  app.patch('/check-ins/:checkInId/validate', ValidateController)
  app.get('/check-ins/history', HistoryController)
  app.get('/check-ins/metrics', MetricsController)
}
