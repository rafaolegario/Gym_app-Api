import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import request from 'supertest'
import { CreateAndAuthenticateUser } from '@/utils/tests/create-and-autenticate-user'
import { PrismaClient } from '@prisma/client'

describe('Create checkIns controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a checkIn', async () => {
    const { token } = await CreateAndAuthenticateUser(app)

    const prisma = new PrismaClient()

    const gym = await prisma.gym.create({
      data: {
        title: 'Fitness Gym',
        latitude: -22.0141078,
        longitude: -47.8524877,
      },
    })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        userLatitude: -22.0141078,
        userLongitude: -47.8524877,
      })

    expect(response.statusCode).toEqual(201)
  })
})
