import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { MakeSearchGymService } from '@/services/factories/make-search-gyms-service'

export async function SearchController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const SearchQuerySchema = z.object({
    query: z.string(),
    page: z.number().min(1).default(1),
  })

  const { query, page } = SearchQuerySchema.parse(request.query)
  const searchService = MakeSearchGymService()
  const gyms = await searchService.execute({ query, page })

  reply.status(200).send(gyms)
}
