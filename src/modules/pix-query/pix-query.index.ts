import Elysia, { status } from 'elysia'
import { userMiddleware } from '../../middleware/user-middleware'
import { handleRateLimit } from './handle-rate.limit'
import { PixQueryModel } from './model'
import { restoreTokenAfterResponse } from './restore-token-after-response'

export const pixQuery = new Elysia({ prefix: '/pix-query' })
	.use(userMiddleware)
	.guard({ auth: true })
	.post(
		'/',
		({ query }) => {
			if (query.alwaysFail) throw status(400, 'Bad Request' satisfies PixQueryModel.failedRequest)
			return status(200, { ok: true } satisfies PixQueryModel.pixQueryResponse)
		},
		{
			response: PixQueryModel.statusCodeResponses,
			auth: true,
			query: PixQueryModel.pixQuery,
			beforeHandle: (ctx) => handleRateLimit(ctx.user.id),
			afterResponse: (ctx) =>
				restoreTokenAfterResponse({
					status: <number>ctx.set.status,
					userId: ctx.user.id
				}),
			detail: {
				description: 'Pix query endpoint - returns a JSON object with the status of the query',
				tags: ['pix-query']
			}
		}
	)
