import { redis } from '../redis'
import type { BucketState } from './bucket-state'

export const getOrCreateBucket = async (identifier: string, capacity: number): Promise<BucketState> => {
	const key = `bucket:${identifier}`

	// Set only if key doesn't exist (NX flag)
	await redis.set(key, capacity.toString(), 'NX')

	const tokens = await redis.get(key)

	return {
		tokens: parseInt(tokens!),
		capacity
	}
}
