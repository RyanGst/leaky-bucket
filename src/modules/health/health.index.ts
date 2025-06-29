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
		}
	}
)
