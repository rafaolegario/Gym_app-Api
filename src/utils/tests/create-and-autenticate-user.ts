import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function CreateAndAuthenticateUser(app: FastifyInstance) {
  await request(app.server).post('/users').send({
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    password: '123456',
  })

  const singIn = await request(app.server).post('/sessions').send({
    email: 'johndoe@gmail.com',
    password: '123456',
  })

  const { token } = singIn.body

  return { token }
}
