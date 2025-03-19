import { FastifyInstance } from 'fastify'
import { RegisterController } from './register-cotroller'
import { AuthenticateController } from './authenticate-controller'
import { VerifyJwt } from '@/http/middlewares/verify-jwt'
import { ProfileController } from './profile-controller'
import { RefreshController } from './refresh-controller'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', RegisterController)
  app.post('/sessions', AuthenticateController)
  app.get('/me', { onRequest: [VerifyJwt] }, ProfileController)
  app.patch('/token/refresh', RefreshController)
}
