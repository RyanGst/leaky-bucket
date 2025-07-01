import { restoreToken } from '../../lib/leaky-bucket/index'

export async function restoreTokenIfSuccess({ status, userId }: { status: number; userId: string }) {
	if (status === 200) await restoreToken(userId, 3)
}
