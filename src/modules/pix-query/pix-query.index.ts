import Elysia, { status } from "elysia"
import { userMiddleware } from "../../middleware/user-middleware"
import { PixQueryModel } from "./model"

export type BucketState = {
	tokens: number;
}
export const buckets = new Map<string, BucketState>();


const getOrCreateBucket = (
	identifier: string,
	capacity: number,
): BucketState => {
	let bucket = buckets.get(identifier);

	if (!bucket) {
		bucket = {
			tokens: capacity,
		};
		buckets.set(identifier, bucket);
	} else {
		getCurrentTokens(bucket);
	}

	return bucket;
};

export const getCurrentTokens = (
	bucket: BucketState,
): number => {
	return bucket.tokens;
};

export const consumeToken = (bucket: BucketState): number => {
	bucket.tokens = Math.max(0, bucket.tokens - 1);
	return bucket.tokens;
};


export const pixQuery = new Elysia({ prefix: '/pix-query' })
	.use(userMiddleware)
	.get(
		'/',
		({ query }) => {
			if (query.alwaysFail) throw status(400, 'Bad Request' satisfies PixQueryModel.failedRequest)
			return status(200, { ok: true } satisfies PixQueryModel.pixQueryResponse)
		}, {
		response: {
			400: PixQueryModel.failedRequest,
			200: PixQueryModel.pixQueryResponse
		},
		auth: true,
		query: PixQueryModel.pixQuery,
	}
	)
