import { describe, expect, it } from 'bun:test'
import { app } from '../..'
import { createTestUser } from '../../utils/createTestUser';

describe('pix-query module', () => {
	it('should fail if query param alwaysFail is present and is true', async () => {
		const session = await createTestUser();
        const authToken = session.headers.get("set-auth-token")
                
        const request = new Request('http://localhost/pix-query?alwaysFail=true', {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        })
		const response = await app.handle(request)
		expect(response.status).toBe(400)	
	})
})
