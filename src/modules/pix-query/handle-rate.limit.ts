import { status } from 'elysia'
import { consumeToken, getOrCreateBucket } from '../../lib/leaky-bucket/index'
import { Constants } from '../../utils/constants'
import type { PixQueryModel } from './model'

export async function handleRateLimit(userId: string) {
	await getOrCreateBucket(userId, Constants.LEAKY_BUCKET_CAPACITY)
	const allowed = await consumeToken(userId)
	if (!allowed) throw status(429, 'Too Many Requests' satisfies PixQueryModel.tooManyRequests)
}
