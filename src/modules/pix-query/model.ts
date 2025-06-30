// Model define the data structure and validation for the request and response
import { t } from 'elysia'

export namespace PixQueryModel {
	export const pixQuery = t.Partial(
		t.Object({
			alwaysFail: t.Boolean()
		})
	)

	export type pixQuery = typeof pixQuery.static

	export const failedRequest = t.Literal('Bad Request')
	export type failedRequest = typeof failedRequest.static

	export const tooManyRequests = t.Literal('Too Many Requests')
	export type tooManyRequests = typeof tooManyRequests.static

	export const pixQueryResponse = t.Object({
		ok: t.Boolean()
	})

	export type pixQueryResponse = typeof pixQueryResponse.static

	export const statusCodeResponses = {
		400: PixQueryModel.failedRequest,
		200: PixQueryModel.pixQueryResponse,
		429: PixQueryModel.tooManyRequests
	}
}
