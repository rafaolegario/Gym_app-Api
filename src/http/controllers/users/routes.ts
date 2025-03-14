import { FastifyInstance } from 'fastify'
import { RegisterController } from './register-cotroller'
import { AuthenticateController } from './authenticate-controller'
import { VerifyJwt } from '@/http/middlewares/verify-jwt'
import { ProfileController } from './profile-controller'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', RegisterController)
  app.post('/sessions', AuthenticateController)
  app.get('/me', { onRequest: [VerifyJwt] }, ProfileController)
}
