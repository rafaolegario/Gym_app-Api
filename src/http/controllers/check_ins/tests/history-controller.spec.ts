import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import request from 'supertest'
import { CreateAndAuthenticateUser } from '@/utils/tests/create-and-autenticate-user'
import { PrismaClient } from '@prisma/client'

describe('History checkIns controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get checkIn history', async () => {
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
      .get('/check-ins/history')
      .set('Authorization', `Bearer ${token}`)
      .query({ page: 1 })
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.checkIns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          gym_id: gym.id,
          user_id: expect.any(String),
        }),
      ]),
    )
  })
})
