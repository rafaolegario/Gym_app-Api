import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import request from 'supertest'

import { CreateAndAuthenticateUser } from '@/utils/tests/create-and-autenticate-user'

describe('Search gyms controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search for gyms', async () => {
    const { token } = await CreateAndAuthenticateUser(app, true)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'NodeJs Gym',
        description: 'The best gym in the world',
        phone: '123456789',
        latitude: -22.0141078,
        longitude: -47.8524877,
      })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        query: 'NodeJs Gym',
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'NodeJs Gym',
        }),
      ]),
    )
    expect(response.body.gyms).toHaveLength(1)
  })
})
