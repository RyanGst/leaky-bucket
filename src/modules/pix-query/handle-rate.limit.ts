import { status } from 'elysia'
import { consumeToken, getCurrentTokens, getOrCreateBucket } from '../../lib/leaky-bucket/index'
import type { PixQueryModel } from './model'

export function handleRateLimit(userId: string) {
	const bucket = getOrCreateBucket(userId, 3)
	const tokens = getCurrentTokens(bucket)
	if (tokens <= 0) throw status(429, 'Too Many Requests' satisfies PixQueryModel.tooManyRequests)
	else consumeToken(bucket)
}
