import { schedulePeriodicRefill } from '../../lib/bull';
import { restoreToken } from '../../lib/leaky-bucket/index'
import { Constants } from '../../utils/constants';

export async function restoreTokenAfterResponse({ status, userId }: { status: number; userId: string }) {
	if (status === 200) return await restoreToken(userId, Constants.LEAKY_BUCKET_CAPACITY)

	console.log('schedulePeriodicRefill', userId)
	schedulePeriodicRefill(userId)
}
