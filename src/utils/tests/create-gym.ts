import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function CreateGymUtils(app: FastifyInstance, token: string) {
  const gym = await request(app.server)
    .post('/gyms')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Fitness Gym',
      description: 'The best gym in the world',
      phone: '123456789',
      latitude: -22.0141078,
      longitude: -47.8524877,
    })

  return { gym }
}
