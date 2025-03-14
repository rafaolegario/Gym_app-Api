import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'

import { MakeGymService } from '@/services/factories/make-create-gym-service'

export async function CreateGymController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const CreateBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { title, description, phone, latitude, longitude } =
    CreateBodySchema.parse(request.body)
  const gymService = MakeGymService()
  await gymService.execute({ title, description, phone, latitude, longitude })

  reply.status(201).send()
}
