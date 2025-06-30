import { describe, expect, it } from 'bun:test'
import { app } from '..'
import { createTestUser } from '../utils/createTestUser'

describe('Protected routes', () => {
	it('should return 401 if no token is provided', async () => {
		const apiResponse = await app.handle(new Request('http://localhost/'))
		expect(apiResponse.status).toBe(401)
	})

	it('should return 200 if token is provided', async () => {
		const session = await createTestUser()
		const authToken = session.headers.get('set-auth-token')

		const request = new Request('http://localhost/', {
			headers: {
				Authorization: `Bearer ${authToken}`
			}
		})
		const apiResponse = await app.handle(request)
		expect(apiResponse.status).toBe(200)
	})
})
