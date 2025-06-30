import { buckets } from './leaky-bucket'

export const restoreToken = (identifier: string, capacity: number): void => {
	const bucket = buckets.get(identifier)
	if (bucket) {
		bucket.tokens = Math.min(capacity, bucket.tokens + 1)
	}
}
