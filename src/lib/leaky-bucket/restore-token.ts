import { redis } from '../redis'

export const restoreToken = async (bucketId: string, capacity: number): Promise<void> => {
	const key = `bucket:${bucketId}`
	
	const current = await redis.get(key)
	if (current && parseInt(current) < capacity) {
	  await redis.incr(key)
	}
  }
