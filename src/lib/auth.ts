import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { bearer, openAPI } from 'better-auth/plugins'
import { MongoClient } from 'mongodb'

const client = new MongoClient(process.env.MONGO_URL!)
const db = client.db('woovi-challenge')

export const auth = betterAuth({
	plugins: [bearer(), openAPI()],
	database: mongodbAdapter(db),
	emailAndPassword: {
		enabled: true
	}
})
