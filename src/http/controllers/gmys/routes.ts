import { VerifyJwt } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { SearchController } from './search-controller'
import { FetchNearbyController } from './nearby-controller'
import { CreateGymController } from './create-controller'
import { VerifyUserRole } from '@/http/middlewares/verify-user-role'
export async function gymRoutes(app: FastifyInstance) {
  app.addHook('onRequest', VerifyJwt)
  app.get('/gyms/search', SearchController)
  app.get('/gyms/nearby', FetchNearbyController)
  app.post(
    '/gyms',
    { onRequest: [VerifyUserRole('ADMIN')] },
    CreateGymController,
  )
}
