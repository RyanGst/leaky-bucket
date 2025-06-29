// Model define the data structure and validation for the request and response
import { t } from 'elysia'

export namespace PixQueryModel {
	export const pixQuery = t.Partial(t.Object({
		alwaysFail: t.Boolean()
	}))

	export type pixQuery = typeof pixQuery.static

	export const failedRequest = t.Literal('Bad Request')
	export type failedRequest = typeof failedRequest.static

	export const pixQueryResponse = t.Object({
		ok: t.Boolean()
	})

	export type pixQueryResponse = typeof pixQueryResponse.static
}
