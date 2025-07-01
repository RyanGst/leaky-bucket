import { status } from 'elysia'
import { consumeToken, getOrCreateBucket } from '../../lib/leaky-bucket/index'
import type { PixQueryModel } from './model'

export async function handleRateLimit(userId: string) {
	await getOrCreateBucket(userId, 3)
	const allowed = await consumeToken(userId)
	if (!allowed) throw status(429, 'Too Many Requests' satisfies PixQueryModel.tooManyRequests)
}
