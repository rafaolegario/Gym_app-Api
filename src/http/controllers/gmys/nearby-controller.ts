import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { MakeFetchNearbyGymsService } from '@/services/factories/make-fetch-nearby-gyms-service'

export async function FetchNearbyController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const FetchNearbyQuerySchema = z.object({
    userLatitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    userLongitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { userLatitude, userLongitude } = FetchNearbyQuerySchema.parse(
    request.query,
  )
  const nearbyService = MakeFetchNearbyGymsService()
  const gyms = await nearbyService.execute({
    userLatitude,
    userLongitude,
  })

  reply.status(200).send(gyms)
}
