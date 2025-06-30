import type { BucketState } from './bucket-state'
import { getCurrentTokens } from './get-current-tokens'
import { buckets } from './leaky-bucket'

export const getOrCreateBucket = (identifier: string, capacity: number): BucketState => {
	let bucket = buckets.get(identifier)

	if (!bucket) {
		bucket = {
			tokens: capacity
		}
		buckets.set(identifier, bucket)
	} else {
		getCurrentTokens(bucket)
	}

	return bucket
}
