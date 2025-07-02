import { RedisClient } from 'bun'

const redisUrl = process.env.REDIS_URL!

export const redis = new RedisClient(redisUrl, {
	connectionTimeout: 1000,
	maxRetries: 1
})
