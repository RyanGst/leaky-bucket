import Elysia from 'elysia'
import { version } from '../../../package.json'
import { HealthModel } from './model'

export const health = new Elysia({ prefix: '/health' }).get(
	'/',
	() => {
		return {
			status: 'OK',
			version,
			timestamp: new Date().toISOString()
		}
	},
	{
		response: {
			200: HealthModel.health
		},
		detail: {
			description: 'Health check endpoint - returns a JSON object with the status and version of the API',
			tags: ['health']
		}
	}
)
