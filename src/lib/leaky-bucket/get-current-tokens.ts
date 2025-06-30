import type { BucketState } from './bucket-state'

export const getCurrentTokens = (bucket: BucketState): number => {
	return bucket.tokens
}
