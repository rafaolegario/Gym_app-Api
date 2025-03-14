import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { MakeValidateCheckInService } from '@/services/factories/make-validate-check-in-service'

export async function ValidateController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const CheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  })

  const { checkInId } = CheckInParamsSchema.parse(request.params)
  const checkInService = MakeValidateCheckInService()
  await checkInService.execute({
    checkIn_id: checkInId,
  })

  reply.status(204).send()
}
