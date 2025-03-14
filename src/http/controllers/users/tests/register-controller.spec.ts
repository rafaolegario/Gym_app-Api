import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { prisma } from '@/http/controllers/users/lib/prisma'
import { app } from '@/app'

describe('Register controller', () => {
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

  it('Should be able to Register', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe2@gmail.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(201)
  })
})
