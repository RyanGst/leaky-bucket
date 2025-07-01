import { redis } from '../redis'

export const getCurrentTokens = async (bucketId: string): Promise<number> => {
	const key = `bucket:${bucketId}`
	const tokens = await redis.get(key)
	return tokens ? parseInt(tokens) : 0
  }
