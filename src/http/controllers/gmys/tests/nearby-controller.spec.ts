import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import request from 'supertest'
import { CreateAndAuthenticateUser } from '@/utils/tests/create-and-autenticate-user'

describe('Search nearby controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search nearby for gyms', async () => {
    const { token } = await CreateAndAuthenticateUser(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'nearby Gym',
        description: 'The best gym in the world',
        phone: '123456789',
        latitude: -22.0141078,
        longitude: -47.8524877,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        userLatitude: -22.0141078,
        userLongitude: -47.8524877,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    console.log(response.body)
    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'nearby Gym',
        }),
      ]),
    )
    expect(response.body.gyms).toHaveLength(1)
  })
})
