import Elysia, { status } from "elysia";
import { userMiddleware } from "../../middleware/user-middleware";
import { PixQueryModel } from "./model";

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
	console.log("token consumed for user - remaining:", bucket.tokens)
	return bucket.tokens;
};

const restoreToken = (identifier: string, capacity: number): void => {
	const bucket = buckets.get(identifier);
	if (bucket) {
		bucket.tokens = Math.min(capacity, bucket.tokens + 1);
	}
};

export const pixQuery = new Elysia({ prefix: '/pix-query' })
	.use(userMiddleware)
	.guard({ auth: true })
	.onBeforeHandle(async (ctx) => {
		const userId = ctx.user?.id
		const bucket = getOrCreateBucket(userId, 3)
		const tokens = getCurrentTokens(bucket)
		if (tokens <= 0) return status(429)
		consumeToken(bucket)
	})
	.onError(() => {
		console.log("token was not refilled")
	})
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
		afterResponse: (ctx) => {
			const userId = ctx.user?.id
			restoreToken(userId, 3)
		}
	}
	)
