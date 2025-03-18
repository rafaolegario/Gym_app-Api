import { FastifyReply, FastifyRequest } from 'fastify'
import { MakeGetUserMetricsService } from '@/services/factories/make-get-user-metrics-service'

export async function MetricsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const metricsService = MakeGetUserMetricsService()
  const metricsCheckIns = await metricsService.execute({
    userID: request.user.sub,
  })

  reply.status(200).send(metricsCheckIns)
}
