import { redis } from '../redis'

export const consumeToken = async (bucketId: string) => {
	const key = `bucket:${bucketId}`

	// DECR is atomic and returns the new value
	const newTokens = await redis.decr(key)

	if (newTokens >= 0) {
		return true
	} else {
		await redis.incr(key)
		return false
	}
}
