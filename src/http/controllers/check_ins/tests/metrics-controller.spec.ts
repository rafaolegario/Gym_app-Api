import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import request from 'supertest'
import { CreateAndAuthenticateUser } from '@/utils/tests/create-and-autenticate-user'
import { PrismaClient } from '@prisma/client'

describe('Metrics checkIns controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get checkIn metrics', async () => {
    const { token } = await CreateAndAuthenticateUser(app)

    const prisma = new PrismaClient()

    const gym = await prisma.gym.create({
      data: {
        title: 'Fitness Gym',
        latitude: -22.0141078,
        longitude: -47.8524877,
      },
    })

    await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        userLatitude: -22.0141078,
        userLongitude: -47.8524877,
      })

    const response = await request(app.server)
      .get('/check-ins/metrics')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      checkInsCount: 1,
    })
  })
})
