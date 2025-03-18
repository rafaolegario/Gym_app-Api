import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'

import { MakeCheckInService } from '@/services/factories/make-check-In-service'

export async function CreateCheckInController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const CreateBodySchema = z.object({
    userLatitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    userLongitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const CreateParamsSchema = z.object({
    gymId: z.string().uuid(),
  })

  const { gymId } = CreateParamsSchema.parse(request.params)
  const { userLatitude, userLongitude } = CreateBodySchema.parse(request.body)
  const checkInService = MakeCheckInService()
  await checkInService.execute({
    gymID: gymId,
    userID: request.user.sub,
    userLatitude,
    userLongitude,
  })

  reply.status(201).send()
}
