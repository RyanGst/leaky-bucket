import { cors } from '@elysiajs/cors'
import { Elysia } from 'elysia'
import { userMiddleware } from './middleware/user-middleware'
import { health } from './modules/health/health.index'
import { pixQuery } from './modules/pix-query/pix-query.index'

export const app = new Elysia()
	.use(health)
	.use(
		cors({
			origin: process.env.BETTER_AUTH_URL!,
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
			credentials: true,
			allowedHeaders: ['Content-Type', 'Authorization']
		})
	)
	.use(userMiddleware)
	.get('/', ({ user }) => `Hello ${user.name}!`, { auth: true })
	.use(pixQuery)
	.listen(3000)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
