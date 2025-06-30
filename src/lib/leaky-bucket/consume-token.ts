import type { BucketState } from './bucket-state'

export const consumeToken = (bucket: BucketState): number => {
	bucket.tokens = Math.max(0, bucket.tokens - 1)
	return bucket.tokens
}
