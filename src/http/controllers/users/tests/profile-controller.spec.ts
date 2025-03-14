import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { prisma } from '@/http/controllers/users/lib/prisma'
import { app } from '@/app'

describe('Profile controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(async () => {
    await prisma.$executeRaw`DELETE FROM "check_ins"`
    await prisma.$executeRaw`DELETE FROM "gyms"`
    await prisma.$executeRaw`DELETE FROM "users"`
  })

  afterAll(async () => {
    await app.close()
  })

  it('Should be able to Authenticate', async () => {
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

    const response = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
      }),
    )
  })
})
