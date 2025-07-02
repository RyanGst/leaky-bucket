import { type Job, Queue, Worker } from 'bullmq'
import { Constants } from '../utils/constants'
import { redis } from './redis'

export const periodicRefillQueue = new Queue('periodic-refill', {
	connection: {
		host: 'redis',
		port: 6379
	}
})

export const periodicRefillWorker = new Worker(
	'periodic-refill',
	async (job: Job) => {
		if (job.name === 'refill-user-tokens') {
			const { userId } = job.data
			const bucketKey = `bucket:${userId}`

			const currentTokens = await redis.get(bucketKey)
			const newTokens = Math.min(Constants.LEAKY_BUCKET_CAPACITY, parseInt(currentTokens || '0') + 1)

			await redis.set(bucketKey, newTokens.toString())
			console.log(`User refill: ${userId} -> ${newTokens} tokens`)
		}
	},
	{
		connection: {
			host: 'redis',
			port: 6379
		}
	}
)

export const schedulePeriodicRefill = (userId: string) => {
	periodicRefillQueue.add(
		'refill-user-tokens',
		{ userId },
		{
			delay: 60 * 60 * 1000, // 1 hour
			removeOnComplete: true,
			removeOnFail: false
		}
	)
}
