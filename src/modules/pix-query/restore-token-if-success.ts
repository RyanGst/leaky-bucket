import { restoreToken } from '../../lib/leaky-bucket/index'

export function restoreTokenIfSuccess({ status, userId }: { status: number; userId: string }) {
	if (status === 200) restoreToken(userId, 3)
}
