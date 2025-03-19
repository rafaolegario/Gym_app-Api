import { prisma } from '@/http/controllers/users/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function CreateAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false,
) {
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'johndoe3@gmail.com',
      password_hash: await hash('123456', 6),
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  })

  const singIn = await request(app.server).post('/sessions').send({
    email: 'johndoe3@gmail.com',
    password: '123456',
  })

  const { token } = singIn.body

  return { token, user: singIn.body.user }
}
