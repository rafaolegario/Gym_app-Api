import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'

import { MakeFetchUserCheckInsHistoryService } from '@/services/factories/make-fetch-user-check-ins-history-service'

export async function HistoryController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const HistoryQuerySchema = z.object({
    page: z.number().min(1).default(1),
  })

  const { page } = HistoryQuerySchema.parse(request.query)
  const historyService = MakeFetchUserCheckInsHistoryService()
  const historyCheckIns = await historyService.execute({
    userID: request.user.sub,
    page,
  })

  reply.status(200).send({ historyCheckIns })
}
