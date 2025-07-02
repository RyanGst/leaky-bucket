import { describe, expect, it } from 'bun:test'
import { StatusMap } from 'elysia'
import { app } from '../..'
import { createTestUser } from '../../utils/createTestUser'

describe('pix-query module', () => {
	it('should fail if query param alwaysFail is present and is true', async () => {
		const session = await createTestUser()
		const authToken = session.headers.get('set-auth-token')

		const request = new Request('http://localhost/pix-query?alwaysFail=true', {
			headers: {
				Authorization: `Bearer ${authToken}`
			},
			method: 'POST'
		})
		const response = await app.handle(request)
		expect(response.status).toBe(400)
	})

	it('should return 200 for a successful request', async () => {
		const session = await createTestUser()
		const authToken = session.headers.get('set-auth-token')

		const request = new Request('http://localhost/pix-query?alwaysFail=false', {
			headers: {
				Authorization: `Bearer ${authToken}`
			},
			method: 'POST'
		})

		const response = await app.handle(request)
		console.log('response', response)

		expect(response.status).toBe(200)
		const body = await response.json()
		expect(body).toEqual({ ok: true })
	})

	it('should rate limit user after 3 failing requests', async () => {
		const session = await createTestUser()
		const authToken = session.headers.get('set-auth-token')

		const headers = { Authorization: `Bearer ${authToken}` }

		// Three failing requests to consume tokens
		for (let i = 0; i < 3; i++) {
			const failingRequest = new Request('http://localhost/pix-query?alwaysFail=true', {
				headers,
				method: 'POST'
			})
			const response = await app.handle(failingRequest)
			expect(response.status).toBe(400)
		}

		// Fourth request should be rate-limited
		const rateLimitedRequest = new Request('http://localhost/pix-query', {
			headers,
			method: 'POST'
		})
		const response = await app.handle(rateLimitedRequest)
		expect(response.status).toBe(429)
	})

	it('should not deplete tokens on successful requests', async () => {
		const session = await createTestUser()
		const authToken = session.headers.get('set-auth-token')

		const headers = { Authorization: `Bearer ${authToken}` }

		// Make more than 3 successful requests
		for (let i = 0; i < 5; i++) {
			const request = new Request('http://localhost/pix-query', {
				headers,
				method: 'POST'
			})
			const response = await app.handle(request)
			expect(response.status).toBe(200)
		}

		// A subsequent request should still succeed, proving tokens were restored
		const finalRequest = new Request('http://localhost/pix-query', {
			headers,
			method: 'POST'
		})
		const finalResponse = await app.handle(finalRequest)
		expect(finalResponse.status).toBe(200)
	})

	it.skip('should handle parallel requests', async () => {
		const session = await createTestUser()
		const authToken = session.headers.get('set-auth-token')

		const headers = { Authorization: `Bearer ${authToken}` }

		const depleteRequests = []
		// remove 2 of the 3 tokens
		for (let i = 0; i < 2; i++) {
			const request = new Request('http://localhost/pix-query?alwaysFail=true', {
				headers,
				method: 'POST'
			})
			depleteRequests.push(app.handle(request))
		}

		await Promise.all(depleteRequests)

		const requests = []
		for (let i = 0; i < 5; i++) {
			const request = new Request('http://localhost/pix-query', {
				headers,
				method: 'POST'
			})
			requests.push(app.handle(request))
		}
		const responses = await Promise.all(requests)
		const failedResponses = responses.filter((response) => response.status !== StatusMap.OK)
		expect(failedResponses.length).toBe(2)
	})
})
