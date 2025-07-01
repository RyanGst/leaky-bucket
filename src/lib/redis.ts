import { RedisClient } from 'bun'

export const redis = new RedisClient('redis://redis:6379', {
	connectionTimeout: 1000,
	maxRetries: 1
})

